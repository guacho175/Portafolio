@echo off
setlocal

title Portafolio local
cd /d "%~dp0"

echo.
echo Iniciando servidor local del portafolio...
echo Se abrira el navegador automaticamente.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0levantar.ps1"

if errorlevel 1 (
  echo.
  echo No se pudo iniciar el portafolio.
  echo Revisa que Python 3 este instalado y disponible.
  echo.
  pause
)

endlocal
