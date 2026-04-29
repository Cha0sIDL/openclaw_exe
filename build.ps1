#Requires -Version 5.1
param(
    [switch]$Local
)
<#
.SYNOPSIS
    OpenClaw Windows Offline Installer Build Script
.DESCRIPTION
    Builds OpenClaw-Setup.exe by:
      A) Syncing the latest release tag and building the OpenClaw project
      B) Downloading portable Node.js 22 (Windows x64)
      C) Downloading and installing Inno Setup 6
      D) Compiling the installer with Inno Setup
.PARAMETER Local
    Skip git fetch/checkout and use the current src/ directory as-is.
    Useful when you have local modifications you want to build directly.
.NOTES
    Run from this directory with: .\build.ps1
    Use -Local to skip remote sync: .\build.ps1 -Local
    Requires: Git, Node.js 22+, pnpm, internet access (first run only)
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Ensure D:\nodejs and npm global bin are on PATH for this session
foreach ($p in @('D:\nodejs', 'C:\Users\Administrator\AppData\Roaming\npm', 'E:\Git\bin', 'E:\Git\cmd')) {
    if ((Test-Path $p) -and ($env:PATH -notlike "*$p*")) {
        $env:PATH = "$p;$env:PATH"
    }
}

# ── Constants ────────────────────────────────────────────────────────────────
$SCRIPT_DIR   = if ($PSScriptRoot) {
    $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
    (Get-Location).Path
}
$ROOT          = (Resolve-Path -LiteralPath $SCRIPT_DIR).Path
$SRC_DIR       = "$ROOT\src"
$STAGING_DIR   = "$ROOT\staging"
$RUNTIME_DIR   = "$ROOT\runtime\node"
$TOOLS_DIR     = "$ROOT\tools"
$INSTALLER_DIR = "$ROOT\installer"
$OUTPUT_DIR    = "$ROOT\Output"

$NODE_VERSION  = '24.14.0'
$NODE_ZIP      = "node-v$NODE_VERSION-win-x64.zip"
$NODE_URL      = "https://nodejs.org/dist/v$NODE_VERSION/$NODE_ZIP"
$NODE_INNER    = "node-v$NODE_VERSION-win-x64"   # folder name inside zip

$INNO_URL      = 'https://github.com/jrsoftware/issrc/releases/download/is-6_7_1/innosetup-6.7.1.exe'
$INNO_INST     = "$TOOLS_DIR\innosetup-installer.exe"
$INNO_DIR      = "$TOOLS_DIR\innosetup"
$ISCC          = "$INNO_DIR\ISCC.exe"

$REPO_URL      = 'https://github.com/openclaw/openclaw.git'
$SETUP_ISS     = "$INSTALLER_DIR\setup.iss"

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "=== Phase $n : $msg ===" -ForegroundColor Cyan
}

function Write-Info($msg) {
    Write-Host "  > $msg" -ForegroundColor Gray
}

function Write-OK($msg) {
    Write-Host "  OK: $msg" -ForegroundColor Green
}

function Write-Warn($msg) {
    Write-Host "  WARN: $msg" -ForegroundColor Yellow
}

function Get-LatestReleaseTag {
    $tags = git tag -l 'v*' --sort=-version:refname

    if (-not $tags) {
        throw "No release tags found in $SRC_DIR"
    }

    # 预发布关键字（按你的实际情况增删）
    $prePattern = '^(?i)v\d+(\.\d+)*-(alpha|beta|rc|preview)([.\-]\d+)?$'

    # 1) 优先选“非预发布”的最新 tag（包含 v2026.3.13-1 这种）
    $stable = $tags | Where-Object { $_ -notmatch $prePattern } | Select-Object -First 1
    if ($stable) { return $stable }

    # 2) 没有稳定版时才选预发布里最新的
    $pre = $tags | Where-Object { $_ -match $prePattern } | Select-Object -First 1
    if ($pre) { return $pre }

    throw "No release tags found in $SRC_DIR"
}

function Require-Command($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $cmd. Please install it and re-run."
    }
}

function Download-File($url, $dest) {
    if (Test-Path $dest) {
        Write-Info "Already downloaded: $(Split-Path $dest -Leaf)"
        return
    }
    Write-Info "Downloading $(Split-Path $dest -Leaf) from $url ..."
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

    try {
        # Use WebClient for large files (shows progress, handles redirects)
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($url, $dest)
        Write-OK "Downloaded $(Split-Path $dest -Leaf)"
    } catch {
        Write-Warn "WebClient failed: $_"
        Write-Info "Falling back to Invoke-WebRequest..."
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
        Write-OK "Downloaded $(Split-Path $dest -Leaf)"
    }
}

# ── Ensure directories exist ──────────────────────────────────────────────────
foreach ($d in @($SRC_DIR, $STAGING_DIR, $RUNTIME_DIR, $TOOLS_DIR, $INSTALLER_DIR, $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}

# ── Prerequisites check ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
Require-Command 'git'
Require-Command 'node'
Require-Command 'pnpm'
Write-OK "All prerequisites found"

# ════════════════════════════════════════════════════════════════════════════
# Phase A: Sync latest tag and build OpenClaw
# ════════════════════════════════════════════════════════════════════════════
Write-Step 'A' 'Sync latest tag and build OpenClaw'

if ($Local) {
    Write-Info "Local mode: skipping remote sync, using current src/ as-is"
} else {
    if (Test-Path "$SRC_DIR\.git") {
        Write-Info "Repository already cloned, fetching latest tags..."
        Push-Location $SRC_DIR
        git fetch --tags --force --prune origin
        Pop-Location
    } else {
        Write-Info "Cloning $REPO_URL ..."
        if (Test-Path $SRC_DIR) { Remove-Item $SRC_DIR -Recurse -Force }
        git clone $REPO_URL $SRC_DIR
        Push-Location $SRC_DIR
        git fetch --tags --force --prune origin
        Pop-Location
    }

    Push-Location $SRC_DIR
    $latestTag = Get-LatestReleaseTag
    Write-Info "Checking out latest tag: $latestTag"
    git checkout --force $latestTag
    Pop-Location
    Write-OK "Repository ready"
}

Push-Location $SRC_DIR

Write-Info "Installing dependencies (pnpm install)..."
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Frozen lockfile install failed, retrying without --frozen-lockfile..."
    pnpm install
    if ($LASTEXITCODE -ne 0) { throw "pnpm install failed" }
}
Write-OK "Dependencies installed"

Write-Info "Building project (pnpm build)..."
pnpm build
if ($LASTEXITCODE -ne 0) { throw "pnpm build failed" }
Write-OK "Build complete"

Write-Info "Building Control UI (pnpm ui:build)..."
pnpm ui:build
if ($LASTEXITCODE -ne 0) { throw "pnpm ui:build failed" }
Write-OK "Control UI built"

Write-Info "Deploying to staging directory (pnpm deploy)..."
if (Test-Path $STAGING_DIR) { Remove-Item $STAGING_DIR -Recurse -Force }
New-Item -ItemType Directory -Force -Path $STAGING_DIR | Out-Null

pnpm deploy --filter=. --legacy --config.allow-unused-patches=true $STAGING_DIR
if ($LASTEXITCODE -ne 0) { throw "pnpm deploy failed" }
Write-OK "Deployed to $STAGING_DIR"

if (Test-Path "$SRC_DIR\patches") {
    Copy-Item "$SRC_DIR\patches" $STAGING_DIR -Recurse -Force
}

Pop-Location

# pnpm deploy --legacy creates a symlink-based virtual store (.pnpm/).
# Inno Setup copies files but does NOT follow Windows symlinks, so transitive
# deps like strtok3 end up missing at runtime.
# Fix: delete node_modules, force a flat/hoisted pnpm install with no symlinks.
Write-Info "Rebuilding staging node_modules with shamefully-hoist (flat, no symlinks)..."
Remove-Item "$STAGING_DIR\node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Write .npmrc that forces flat node_modules
Set-Content "$STAGING_DIR\.npmrc" "shamefully-hoist=true`nnode-linker=hoisted`nallow-unused-patches=true" -Encoding UTF8

Push-Location $STAGING_DIR
pnpm install --prod --ignore-scripts --config.allow-unused-patches=true
if ($LASTEXITCODE -ne 0) { throw "pnpm install --prod in staging failed" }

# We intentionally skip lifecycle scripts above, so run the bundled plugin
# postinstall explicitly to materialize runtime deps needed by root dist chunks.
Write-Info "Installing bundled plugin runtime dependencies in staging..."
$previousEagerBundledPluginDeps = $env:OPENCLAW_EAGER_BUNDLED_PLUGIN_DEPS
$env:OPENCLAW_EAGER_BUNDLED_PLUGIN_DEPS = '1'
try {
    node scripts/postinstall-bundled-plugins.mjs
    if ($LASTEXITCODE -ne 0) { throw "bundled plugin postinstall failed in staging" }
} finally {
    if ($null -eq $previousEagerBundledPluginDeps) {
        Remove-Item Env:\OPENCLAW_EAGER_BUNDLED_PLUGIN_DEPS -ErrorAction SilentlyContinue
    } else {
        $env:OPENCLAW_EAGER_BUNDLED_PLUGIN_DEPS = $previousEagerBundledPluginDeps
    }
}

Write-Info "Verifying bundled plugin runtime dependencies in staging root node_modules..."
$verifyBundledDepsScript = @'
import { discoverBundledPluginRuntimeDeps } from './scripts/postinstall-bundled-plugins.mjs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const missing = discoverBundledPluginRuntimeDeps().filter(
  (dep) => !existsSync(join(process.cwd(), dep.sentinelPath)),
);

if (missing.length > 0) {
  const specs = missing.map((dep) => dep.name + '@' + dep.version).join(', ');
  console.error('Missing bundled plugin runtime deps at root node_modules: ' + specs);
  process.exit(1);
}

console.log('[postinstall] bundled plugin runtime deps present at root node_modules');
'@
node --input-type=module -e $verifyBundledDepsScript
if ($LASTEXITCODE -ne 0) { throw "bundled plugin runtime dependency verification failed in staging" }

Pop-Location
Write-OK "Staging node_modules rebuilt (flat, symlink-free, bundled deps verified)"

# Verify staging output
foreach ($p in @("$STAGING_DIR\dist", "$STAGING_DIR\openclaw.mjs")) {
    if (-not (Test-Path $p)) {
        throw "Expected staging artifact not found: $p"
    }
}
Write-OK "Staging directory validated"

# Read version from package.json
$appVersion = '1.0.0'
$pkgJsonPath = "$STAGING_DIR\package.json"
if (Test-Path $pkgJsonPath) {
    try {
        $pkgJson = Get-Content $pkgJsonPath -Raw | ConvertFrom-Json
        if ($pkgJson.version) {
            $appVersion = $pkgJson.version
            Write-Info "Detected app version: $appVersion"
        }
    } catch {
        Write-Warn "Could not parse package.json version, using $appVersion"
    }
}

# Try to find an icon in the project
$icoFound = $false
foreach ($src in @(
    "$SRC_DIR\assets\openclaw.ico",
    "$SRC_DIR\assets\icon.ico",
    "$STAGING_DIR\assets\openclaw.ico",
    "$STAGING_DIR\assets\icon.ico"
)) {
    if (Test-Path $src) {
        Copy-Item $src "$INSTALLER_DIR\openclaw.ico" -Force
        Write-OK "Icon copied from $src"
        $icoFound = $true
        break
    }
}
if (-not $icoFound) {
    Write-Warn "No icon found in project assets; installer will use default Inno Setup icon"
}

# ════════════════════════════════════════════════════════════════════════════
# Phase B: Download portable Node.js 22 (Windows x64)
# ════════════════════════════════════════════════════════════════════════════
Write-Step 'B' "Download portable Node.js $NODE_VERSION (Windows x64)"

$nodeZipPath   = "$TOOLS_DIR\$NODE_ZIP"
$nodeExtracted = "$TOOLS_DIR\$NODE_INNER"

if (Test-Path "$RUNTIME_DIR\node.exe") {
    Write-Info "Portable Node.js already extracted"
} else {
    Download-File $NODE_URL $nodeZipPath

    Write-Info "Extracting Node.js ZIP (this may take a minute)..."
    if (Test-Path $nodeExtracted) { Remove-Item $nodeExtracted -Recurse -Force }

    # Use .NET ZipFile for reliable extraction of large ZIPs
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($nodeZipPath, $TOOLS_DIR)

    if (-not (Test-Path $nodeExtracted)) {
        throw "Node.js extraction failed: $nodeExtracted not found"
    }

    Write-Info "Moving Node.js to $RUNTIME_DIR ..."
    if (Test-Path $RUNTIME_DIR) { Remove-Item $RUNTIME_DIR -Recurse -Force }
    Move-Item $nodeExtracted $RUNTIME_DIR
    Write-OK "Node.js ready at $RUNTIME_DIR"
}

if (-not (Test-Path "$RUNTIME_DIR\node.exe")) {
    throw "node.exe not found at $RUNTIME_DIR\node.exe"
}
$nodeVer = & "$RUNTIME_DIR\node.exe" --version
Write-OK "Bundled Node.js version: $nodeVer"

# ════════════════════════════════════════════════════════════════════════════
# Phase C: Download and install Inno Setup 6
# ════════════════════════════════════════════════════════════════════════════
Write-Step 'C' 'Download and install Inno Setup 6'

if (Test-Path $ISCC) {
    Write-Info "Inno Setup already installed at $ISCC"
} else {
    Download-File $INNO_URL $INNO_INST

    Write-Info "Installing Inno Setup silently to $INNO_DIR ..."
    $proc = Start-Process -Wait -PassThru -FilePath $INNO_INST `
        -ArgumentList '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', "/DIR=$INNO_DIR"
    if ($proc.ExitCode -ne 0) {
        throw "Inno Setup installation failed with exit code $($proc.ExitCode)"
    }
    Write-OK "Inno Setup installed"
}

if (-not (Test-Path $ISCC)) {
    throw "ISCC.exe not found at $ISCC"
}
Write-OK "ISCC.exe ready"

# ════════════════════════════════════════════════════════════════════════════
# Phase D: Update setup.iss and compile installer
# ════════════════════════════════════════════════════════════════════════════
Write-Step 'D' 'Compile installer with Inno Setup'

Write-Info "Updating version to $appVersion in setup.iss ..."
$issContent = Get-Content $SETUP_ISS -Raw
$issContent = $issContent -replace '#define MyAppVersion ".*"', ('#define MyAppVersion "' + $appVersion + '"')

if ($icoFound) {
    $issContent = $issContent -replace '; SetupIconFile is set by build\.ps1 if openclaw\.ico is found',
        'SetupIconFile=openclaw.ico'
}

Set-Content $SETUP_ISS $issContent -Encoding UTF8
Write-OK "setup.iss updated"

Write-Info "Running ISCC.exe ..."
& $ISCC $SETUP_ISS
if ($LASTEXITCODE -ne 0) {
    throw "Inno Setup compilation failed with exit code $LASTEXITCODE"
}

# ════════════════════════════════════════════════════════════════════════════
# Done
# ════════════════════════════════════════════════════════════════════════════
$exePath = "$OUTPUT_DIR\OpenClaw-Setup.exe"
if (Test-Path $exePath) {
    $size = [math]::Round((Get-Item $exePath).Length / 1MB, 1)
    Write-Host ""
    Write-Host "BUILD COMPLETE" -ForegroundColor Green
    Write-Host "  Output : $exePath" -ForegroundColor Green
    Write-Host "  Size   : $size MB" -ForegroundColor Green
} else {
    throw "Build completed but $exePath not found!"
}
