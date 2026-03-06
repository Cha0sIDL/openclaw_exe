@echo off
title OpenClaw Gateway - DO NOT CLOSE THIS WINDOW
set INSTALL_DIR=%~dp0..

:: Read the gateway token saved during installation
set GATEWAY_TOKEN=
if exist "%INSTALL_DIR%\gateway-token.txt" (
    for /f "usebackq delims=" %%T in ("%INSTALL_DIR%\gateway-token.txt") do set GATEWAY_TOKEN=%%T
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
echo   Browser will open automatically in a few seconds.
echo.
echo   *** DO NOT CLOSE THIS WINDOW ***
echo   *** Closing it will stop OpenClaw. ***
echo.
echo   Press Ctrl+C to stop the gateway.
echo  =========================================
echo.

:: Open browser after 3-second delay (runs in background, invisible)
if not "%GATEWAY_TOKEN%"=="" (
    start "" /min powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 3; Start-Process 'http://127.0.0.1:18789/#token=%GATEWAY_TOKEN%'"
) else (
    start "" /min powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 3; Start-Process 'http://127.0.0.1:18789/'"
)

:: cd into app dir so openclaw can locate dist/control-ui relative to cwd
cd /d "%INSTALL_DIR%\app"
if not "%GATEWAY_TOKEN%"=="" (
    call "%INSTALL_DIR%\node\node.exe" "openclaw.mjs" gateway run --allow-unconfigured --token=%GATEWAY_TOKEN%
) else (
    call "%INSTALL_DIR%\node\node.exe" "openclaw.mjs" gateway run --allow-unconfigured
)
pause
