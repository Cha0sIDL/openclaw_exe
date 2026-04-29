# OpenClaw Windows Installer

将 [OpenClaw](https://github.com/openclaw/openclaw)（多通道 AI 网关助手）打包为 Windows 一键安装程序 `OpenClaw-Setup.exe`。

---

## 功能特性

- 便携式 Node.js 运行时，无需用户预先安装
- 自动从 GitHub 拉取最新 Release Tag 构建
- Inno Setup 编译，支持 lzma2/ultra64 solid 压缩
- 安装时自动生成随机 Gateway Token，保障本地安全
- 安装向导任务页可选备份当前用户 `.openclaw` 配置到 `C:\Users\<用户>\.openclaw-backups\`
- 配置备份仅保留最新 2 份，避免备份目录持续膨胀
- 支持桌面快捷方式、开始菜单、PATH 环境变量配置

---

## 环境要求

| 依赖 | 说明 |
|------|------|
| Windows 10+ (x64) | 目标运行环境 |
| Git | 用于克隆源码 |
| Node.js 22+ | 构建时需要 |
| pnpm v10+ | 包管理器 |
| PowerShell 5.1+ | 构建脚本运行环境 |
| 网络访问 | 首次构建需下载依赖 |
| 管理员权限 | **必须以管理员身份运行 PowerShell 执行构建脚本** |

---

## 关键版本

| 组件 | 版本 |
|------|------|
| 便携式 Node.js | 24.14.0 (从 nodejs.org 下载) |
| Inno Setup | 6.7.1 |
| pnpm | v10+ |
| 应用端口 |  (HTTP + WebSocket) |
| 目标系统 | Windows 10+ (x64) |

---

## 目录结构

```
openclaw-exe/
├── build.ps1                    # 主构建脚本（全量构建）
├── src/                         # 克隆的 OpenClaw 源码仓库
├── staging/                     # pnpm deploy 输出（应用文件）
├── runtime/node/                # 便携式 Node.js 24.14.0
├── tools/innosetup/             # Inno Setup 6.7.1
├── installer/
│   ├── setup.iss                # Inno Setup 打包脚本
│   ├── openclaw.cmd             # CLI 包装脚本
│   ├── start-gateway.bat        # 桌面快捷方式目标（启动 gateway）
│   └── openclaw.ico             # 应用图标
├── docs/
│   └── BUILD.md                 # 详细构建与排障指南
└── Output/
    └── OpenClaw-Setup.exe       # 最终安装包
```

---

## 快速开始

### 全量构建（从零开始）

```powershell
cd d:\code\openclaw-exe
.\build.ps1
```

### 本地构建（使用本地源码，不拉取远端）

当你在 `src/` 中有未提交的修改，想直接用本地代码打包时：

```powershell
.\build.ps1 -Local
```

跳过 `git fetch` 和 `git checkout`，直接使用 `src/` 当前状态进行构建。

`build.ps1` 自动完成以下步骤：

1. 克隆/更新 OpenClaw 源码，检出最新 Release Tag
2. `pnpm install` + `pnpm build` + `pnpm ui:build`
3. `pnpm deploy --filter=. --legacy` 生成 staging 目录
4. 用 `shamefully-hoist=true` 重建 `node_modules`（避免符号链接）
5. 下载便携式 Node.js 24.14.0
6. 下载并安装 Inno Setup 6.7.1
7. 自动更新 `setup.iss` 中的版本号并编译安装包
8. 输出 `Output/OpenClaw-Setup.exe`

### 快速重编译（仅修改了 installer/ 文件）

当只修改了 `installer/setup.iss`、`installer/start-gateway.bat` 等文件，无需重跑整个 `build.ps1`：

```powershell
& '.\tools\innosetup\ISCC.exe' '.\installer\setup.iss'
```

---

## 已安装目录结构

`{app}` = 用户选择的安装目录

```
{app}/
├── app/                         # staging/ 的内容（应用文件）
│   ├── openclaw.mjs             # 应用入口 (ESM)
│   ├── dist/
│   │   ├── entry.js             # 编译后的主入口
│   │   └── control-ui/          # Web 控制界面静态资源
│   └── node_modules/            # 生产依赖（flat/hoisted，无符号链接）
├── node/
│   └── node.exe                 # 便携式 Node.js（不依赖系统安装）
├── bin/
│   ├── openclaw.cmd             # CLI 包装脚本
│   └── start-gateway.bat        # 桌面快捷方式目标
└── gateway-token.txt            # 安装时生成的随机 32 字符 Token
```

---

## Gateway Token 安全机制

- 安装时（`setup.iss` 的 `[Code]` 节）生成随机 32 字符 Token，写入 `{app}\gateway-token.txt`
- `start-gateway.bat` 读取该文件并通过 `--token=TOKEN` 传给 Gateway
- 浏览器访问：`http://127.0.0.1:18789/#token=TOKEN`（hash fragment，非 query string）
- Token 用于本地身份验证，防止其他本地程序访问 Gateway

---

## 安装前配置备份

- 安装向导的 `Select Additional Tasks` 页面新增了 `Back up existing OpenClaw configuration before install`
- 用户勾选后，安装器会在正式安装前备份当前用户的 `C:\Users\<用户>\.openclaw`
- 备份目录位于 `C:\Users\<用户>\.openclaw-backups\install-backup-YYYYMMDD-HHMMSS`
- 安装器仅保留最新 2 份 `install-backup-*` 备份目录，旧备份会自动清理
- 如果 `.openclaw` 不存在、用户目录无法解析、或备份中途失败，安装会继续，不会被阻塞

---

## start-gateway.bat 设计说明

桌面双击 OpenClaw 快捷方式时，实际运行的是 `{app}\bin\start-gateway.bat`。

### 关键逻辑

```bat
@echo off
title OpenClaw Gateway - DO NOT CLOSE THIS WINDOW
set INSTALL_DIR=%~dp0..          :: bat 在 bin\，故 .. 指向 {app}

:: 读取安装时生成的 Token
set GATEWAY_TOKEN=
if exist "%INSTALL_DIR%\gateway-token.txt" (
    for /f "usebackq delims=" %%T in ("%INSTALL_DIR%\gateway-token.txt") do set GATEWAY_TOKEN=%%T
)

:: 后台延迟 3 秒打开浏览器（隐藏窗口，不阻塞主流程）
start "" /min powershell -NoProfile -WindowStyle Hidden -Command ^
    "Start-Sleep 3; Start-Process 'http://127.0.0.1:18789/#token=%GATEWAY_TOKEN%'"

:: 切换 cwd 到 app/ 目录，让 resolveControlUiRootSync 能找到 dist/control-ui
cd /d "%INSTALL_DIR%\app"

:: 用绝对路径调用 node.exe，传入相对路径的 openclaw.mjs
call "%INSTALL_DIR%\node\node.exe" "openclaw.mjs" gateway run --allow-unconfigured --token=%GATEWAY_TOKEN%
pause
```

### 为什么要 `cd /d "%INSTALL_DIR%\app"`

OpenClaw 的 `resolveControlUiRootSync` 会检查多个候选路径来定位 `dist/control-ui/`，其中一个候选是 `process.cwd() + "/dist/control-ui"`。

- 若 cwd = `{app}`（旧做法）：检查 `{app}\dist\control-ui` → **不存在**（文件在 `{app}\app\dist\control-ui`）
- 若 cwd = `{app}\app`（新做法）：检查 `{app}\app\dist\control-ui` → **存在**

### 为什么 `call` 不能省略

在 Windows 批处理中，在 `if` 块内调用另一个 `.cmd` 脚本时必须加 `call`：

```bat
:: 错误：执行完 openclaw.cmd 后父脚本永久结束，pause 不会执行，窗口自动关闭
bin\openclaw.cmd gateway run ...

:: 正确：call 使控制权返回父脚本，pause 正常执行，窗口保持打开
call bin\openclaw.cmd gateway run ...
```

---

## 安装包内容清单

| 源路径 | 目标路径 |
|--------|----------|
| `staging\*` | `{app}\app\`（递归） |
| `runtime\node\*` | `{app}\node\`（递归） |
| `installer\openclaw.cmd` | `{app}\bin\` |
| `installer\start-gateway.bat` | `{app}\bin\` |
| `installer\openclaw.ico` | `{app}\` |

---

## 已知问题与解决方案

详细的构建排障指南请参考 [docs/BUILD.md](docs/BUILD.md)。

### 1. bat 文件非 ASCII 字符导致 CMD 乱码

**原因**：bat 文件以 UTF-8 保存，但中文 Windows 的 CMD 默认使用 GBK 编码。

**解决**：bat 文件只使用纯 ASCII / 英文字符。

### 2. `missing dist/entry.(m)js (build output)`

**原因**：`staging/node_modules/` 为空，`pnpm deploy` 失败或中断后依赖未安装。

**解决**：在 staging 目录内重建 node_modules：

```powershell
cd .\staging
Set-Content ".npmrc" "shamefully-hoist=true`nnode-linker=hoisted`nregistry=https://registry.npmjs.org/" -Encoding UTF8
$env:PATH = ".\runtime\node;$env:PATH"
pnpm install --prod --ignore-scripts
```

### 3. `Control UI assets not found`

**原因**：`resolveControlUiRootSync` 因 cwd 设置错误找不到 `dist/control-ui/`。

**解决**：`start-gateway.bat` 在调用 `node.exe` 前先 `cd /d "%INSTALL_DIR%\app"`。

### 4. npmmirror.com ECONNRESET

**原因**：国内镜像源不稳定，下载 `@aws-sdk/*` 等包时频繁中断。

**解决**：在 staging 的 `.npmrc` 中指定官方源：`registry=https://registry.npmjs.org/`

### 5. pnpm deploy 需要 `--legacy` 标志

**原因**：pnpm v10 的 `deploy` 对 workspace 包有更严格的要求。

**解决**：使用 `pnpm deploy --filter=. --legacy`。

### 6. Inno Setup 警告：PrivilegesRequired=admin + HKCU

**影响**：无害警告，不影响安装包功能。HKCU PATH 写入在管理员模式下正常工作。

---

## 构建技术要点

### 符号链接兼容

pnpm 默认使用符号链接管理 `node_modules`，但 Inno Setup 不会跟随符号链接复制文件，导致运行时依赖缺失。

**解决方案**：删除 pnpm deploy 产出的 `node_modules`，使用 `shamefully-hoist=true` + `node-linker=hoisted` 重新安装，生成扁平化、无符号链接的 `node_modules`。

### 版本号自动同步

`build.ps1` 构建时自动从 `staging/package.json` 读取版本号并更新 `setup.iss` 中的 `#define MyAppVersion`，无需手动维护。
