@echo off
title OpenClaw Gateway
cd /d "%~dp0.."

:: Read the gateway token saved during installation
set GATEWAY_TOKEN=
if exist "gateway-token.txt" (
    for /f "usebackq delims=" %%T in ("gateway-token.txt") do set GATEWAY_TOKEN=%%T
)

echo.
echo  =========================================
echo   OpenClaw Gateway
echo  =========================================
echo.
if not "%GATEWAY_TOKEN%"=="" (
    echo   Open in browser:
    echo   http://127.0.0.1:18789/#token=%GATEWAY_TOKEN%
) else (
    echo   Open in browser:
    echo   http://127.0.0.1:18789/
)
echo.
echo   Press Ctrl+C to stop the gateway.
echo  =========================================
echo.

if not "%GATEWAY_TOKEN%"=="" (
    bin\openclaw.cmd gateway run --allow-unconfigured --token=%GATEWAY_TOKEN%
) else (
    bin\openclaw.cmd gateway run --allow-unconfigured
)
pause
