@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo    VR Rookie Downloader - Auto Starter
echo ==========================================
echo.

:: Check for Next.js binary before starting
set "NEXT_BIN=frontend\node_modules\.bin\next.cmd"

if not exist "!NEXT_BIN!" (
    echo [ALERTA] Binarios do Next.js nao encontrados. 
    echo Tentando correcao automatica...
    call setup.bat
)

echo.
echo [1/1] Iniciando Backend e Frontend...
echo.

:: Try to run dev
call npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] O processo fechou com erro de codigo !ERRORLEVEL!. 
    echo Talvez seja necessario rodar o 'setup.bat' manualmente.
)

pause
