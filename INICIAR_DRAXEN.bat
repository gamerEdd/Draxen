@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0scripts\instalar-autoinicio.ps1" >nul 2>&1
exit /b
