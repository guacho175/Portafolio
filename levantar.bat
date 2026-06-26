@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0levantar.ps1"

if errorlevel 1 (
  echo.
  pause
)

endlocal
