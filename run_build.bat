@echo off
SET PATH=E:\nodejs;C:\Users\Administrator\AppData\Roaming\npm;%PATH%
powershell.exe -ExecutionPolicy Bypass -NonInteractive -File D:\openclaw_exe\build.ps1 > D:\openclaw_exe\build_output.txt 2>&1
echo Exit code: %ERRORLEVEL% >> D:\openclaw_exe\build_output.txt
