# OpenClaw Windows Installer — Build & Troubleshooting Guide

## 概览

本文档记录了 `OpenClaw-Setup.exe` 的完整构建流程、目录结构、常见问题及解决方案。

---

## 目录结构

```
D:/openclaw_exe/
├── build.ps1                    ← 主构建脚本（全量构建时运行此文件）
├── src/                         ← 克隆的 openclaw 源码仓库
├── staging/                     ← pnpm deploy 输出目录（应用文件）
├── runtime/node/                ← 便携式 Node.js 22.14.0
├── tools/innosetup/             ← Inno Setup 6.4.3
├── installer/
│   ├── setup.iss                ← Inno Setup 打包脚本
│   ├── openclaw.cmd             ← CLI 包装脚本
│   ├── start-gateway.bat        ← 桌面快捷方式目标（启动 gateway）
│   └── openclaw.ico             ← 应用图标
├── docs/
│   └── BUILD.md                 ← 本文档
└── Output/
    └── OpenClaw-Setup.exe       ← 最终安装包
```

---

## 关键版本

| 组件 | 版本 |
|------|------|
| Node.js | 22.14.0 (从 nodejs.org 下载) |
| Inno Setup | 6.4.3 |
| pnpm | v10+ |
| 应用端口 | 18789 (HTTP + WebSocket) |

---

## 全量构建（从零开始）

```powershell
cd D:\openclaw_exe
.\build.ps1
```

`build.ps1` 会自动完成：
1. 下载便携式 Node.js 22.14.0
2. 下载 Inno Setup 6.4.3
3. 克隆 openclaw 源码到 `src/`
4. `pnpm install` + `pnpm build` + `pnpm ui:build`
5. `pnpm deploy --filter=. --legacy staging/` 生成 staging 目录
6. 用 `shamefully-hoist=true` 重建 staging 的 `node_modules`（避免符号链接）
7. 调用 `ISCC.exe` 编译 `setup.iss` → 生成 `Output/OpenClaw-Setup.exe`

---

## 快速重编译（仅修改了 installer/ 文件）

当只修改了 `installer/setup.iss`、`installer/start-gateway.bat` 等文件，无需重跑整个 `build.ps1`，直接运行：

```powershell
& 'D:\openclaw_exe\tools\innosetup\ISCC.exe' 'D:\openclaw_exe\installer\setup.iss'
```

---

## 已安装目录结构（{app} = 用户选择的安装目录）

```
{app}/
├── app/                         ← staging/ 的内容（openclaw 应用文件）
│   ├── openclaw.mjs             ← 应用入口（ESM）
│   ├── dist/
│   │   ├── entry.js             ← 编译后的主入口
│   │   └── control-ui/          ← Web 控制界面静态资源
│   │       └── index.html
│   └── node_modules/            ← 生产依赖（flat/hoisted，无符号链接）
├── node/
│   └── node.exe                 ← 便携式 Node.js（不依赖系统安装）
├── bin/
│   ├── openclaw.cmd             ← CLI 包装脚本
│   └── start-gateway.bat        ← 桌面快捷方式目标
└── gateway-token.txt            ← 安装时生成的随机 32 字符 token
```

---

## start-gateway.bat 设计说明

桌面双击 OpenClaw 快捷方式时，实际运行的是 `{app}\bin\start-gateway.bat`。

### 关键逻辑

```bat
@echo off
title OpenClaw Gateway - DO NOT CLOSE THIS WINDOW
set INSTALL_DIR=%~dp0..          :: bat在bin\，故..指向{app}

:: 读取安装时生成的 token
set GATEWAY_TOKEN=
if exist "%INSTALL_DIR%\gateway-token.txt" (
    for /f "usebackq delims=" %%T in ("%INSTALL_DIR%\gateway-token.txt") do set GATEWAY_TOKEN=%%T
)

:: 后台延迟3秒打开浏览器（隐藏窗口，不阻塞主流程）
start "" /min powershell -NoProfile -WindowStyle Hidden -Command ^
    "Start-Sleep 3; Start-Process 'http://127.0.0.1:18789/#token=%GATEWAY_TOKEN%'"

:: 切换 cwd 到 app/ 目录，让 resolveControlUiRootSync 能找到 dist/control-ui
cd /d "%INSTALL_DIR%\app"

:: 用绝对路径调用 node.exe，传入相对路径的 openclaw.mjs
call "%INSTALL_DIR%\node\node.exe" "openclaw.mjs" gateway run --allow-unconfigured --token=%GATEWAY_TOKEN%
pause
```

### 为什么要 `cd /d "%INSTALL_DIR%\app"`

OpenClaw 的 `resolveControlUiRootSync` 函数会检查多个候选路径来定位 `dist/control-ui/`，其中一个候选是 `process.cwd() + "/dist/control-ui"`。

- 若 cwd = `{app}`（旧做法）：检查 `{app}\dist\control-ui` → **不存在**（文件在 `{app}\app\dist\control-ui`）
- 若 cwd = `{app}\app`（新做法）：检查 `{app}\app\dist\control-ui` → **存在** ✓

### 为什么 `call` 不能省略

在 Windows 批处理中，在 `if` 块内调用另一个 `.cmd` 脚本时必须加 `call`：

```bat
:: 错误：执行完 openclaw.cmd 后父脚本永久结束，pause 不会执行，窗口自动关闭
bin\openclaw.cmd gateway run ...

:: 正确：call 使控制权返回父脚本，pause 正常执行，窗口保持打开
call bin\openclaw.cmd gateway run ...
```

---

## 已知问题与解决方案

### 1. bat 文件中的非 ASCII 字符导致 CMD 乱码

**原因**：bat 文件以 UTF-8 保存，但中文 Windows 的 CMD 默认使用 GBK 编码读取。

**解决**：bat 文件只使用纯 ASCII / 英文字符，不包含中文或特殊符号（如 `—` em dash）。

---

### 2. `missing dist/entry.(m)js (build output)`

**原因**：`staging/node_modules/` 为空。`pnpm deploy` 失败或中断后，staging 目录被清空但 `node_modules` 未成功安装，导致 `dist/entry.js` 的导入失败。`openclaw.mjs` 捕获 `ERR_MODULE_NOT_FOUND` 后误报为 "missing entry.js"。

**解决**：在 staging 目录内重建 node_modules：

```powershell
cd D:\openclaw_exe\staging

# 使用官方 npm 源（npmmirror.com 可能 ECONNRESET）
Set-Content ".npmrc" "shamefully-hoist=true`nnode-linker=hoisted`nregistry=https://registry.npmjs.org/" -Encoding UTF8

# 仅安装生产依赖，跳过 postinstall 脚本
$env:PATH = "D:\openclaw_exe\runtime\node;$env:PATH"
node "D:\openclaw_exe\runtime\node\node_modules\pnpm\bin\pnpm.cjs" install --prod --ignore-scripts
```

然后重新编译安装包：
```powershell
& 'D:\openclaw_exe\tools\innosetup\ISCC.exe' 'D:\openclaw_exe\installer\setup.iss'
```

---

### 3. `Control UI assets not found`

**原因**：`resolveControlUiRootSync` 遍历候选路径时，因 cwd 设置错误而找不到 `dist/control-ui/`。

**解决**：`start-gateway.bat` 在调用 `node.exe` 前先 `cd /d "%INSTALL_DIR%\app"`，使 `process.cwd()` 指向 `{app}\app`。

---

### 4. npmmirror.com ECONNRESET

**原因**：中国镜像源 npmmirror.com 不稳定，下载 `@aws-sdk/*` 等包时频繁中断。

**解决**：在 staging 的 `.npmrc` 中明确指定官方源：
```
registry=https://registry.npmjs.org/
```

---

### 5. pnpm deploy 需要 `--legacy` 标志

**原因**：pnpm v10 的 `deploy` 命令对 workspace 包有更严格的要求。

**解决**：`build.ps1` 中使用：
```powershell
pnpm deploy --filter=. --legacy $STAGING_DIR
```

---

### 6. Inno Setup 警告：PrivilegesRequired=admin + HKCU

**原因**：setup.iss 同时设置了管理员权限和 HKCU 注册表写入（用于 PATH 环境变量）。

**影响**：无害警告，不影响安装包功能。HKCU PATH 写入在管理员安装模式下仍然正常工作。

---

## Gateway Token 机制

- 安装时（`setup.iss` 的 `[Code]` 节）生成随机 32 字符 token，写入 `{app}\gateway-token.txt`
- `start-gateway.bat` 读取该文件并传给 gateway：`--token=TOKEN`
- 浏览器访问：`http://127.0.0.1:18789/#token=TOKEN`（hash fragment，不是 query string）
- Token 用于本地身份验证，防止其他本地程序访问 gateway

---

## 安装包内容清单（setup.iss）

| 源路径 | 目标路径 |
|--------|----------|
| `staging\*` | `{app}\app\`（递归） |
| `runtime\node\*` | `{app}\node\`（递归） |
| `installer\openclaw.cmd` | `{app}\bin\` |
| `installer\start-gateway.bat` | `{app}\bin\` |
| `installer\openclaw.ico` | `{app}\` |
