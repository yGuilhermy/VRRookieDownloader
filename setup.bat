@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo    VR Rookie Downloader - Installer
echo ==========================================
echo.

echo [0/4] Verificando Requisitos do Sistema...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js v18 ou superior antes de continuar.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where adb >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [!] ADB (Android Debug Bridge) nao encontrado no PATH.
    echo Iniciando download do ADB oficial (Platform Tools)...
    
    if not exist "bin" mkdir "bin"
    
    echo [1/3] Baixando...
    curl -L "https://dl.google.com/android/repository/platform-tools-latest-windows.zip" -o "bin\platform-tools.zip"
    
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao baixar o ADB. Verifique sua conexao com a internet.
    ) else (
        echo [2/3] Extraindo arquivos...
        powershell -Command "Expand-Archive -Path 'bin\platform-tools.zip' -DestinationPath 'bin' -Force"
        
        echo [3/3] Organizando arquivos...
        move /y "bin\platform-tools\*" "bin\" >nul
        rmdir /s /q "bin\platform-tools"
        del /f /q "bin\platform-tools.zip"
        
        echo [INFO] Adicionando 'bin' ao PATH temporario da sessao...
        set "PATH=%PATH%;%CD%\bin"
        
        echo [INFO] Adicionando permanentemente ao PATH do usuario (via setx)...
        setx PATH "%PATH%;%CD%\bin" >nul
        
        echo.
        echo [✓] ADB instalado e configurado com sucesso!
        echo (IMPORTANTE: Se as funcionalidades de Sideload nao funcionarem imediatamente, reinicie o terminal.)
    )
    echo.
) else (
    echo OK! ADB detectado.
)

echo [1/4] Verificando dependencias da Raiz...
if not exist node_modules (
    echo Instalando...
    call npm install
) else (
    echo OK!
)

echo [2/4] Verificando dependencias do Backend...
if not exist backend\node_modules (
    echo Instalando...
    pushd backend
    call npm install
    popd
) else (
    echo OK!
)

echo [3/4] Verificando dependencias do Frontend...
set "NEXT_BIN=frontend\node_modules\.bin\next"

if not exist "!NEXT_BIN!" (
    echo Binarios do Next.js nao encontrados ou corrompidos. Reinstalando...
    pushd frontend
    if exist node_modules (
        rmdir /s /q node_modules
    )
    call npm install
    popd
) else (
    if not exist frontend\node_modules (
        echo Instalando...
        pushd frontend
        call npm install
        popd
    ) else (
        echo OK!
    )
)

echo.
echo ==========================================
echo    Instalacao Concluida com Sucesso!
echo    Use o start.bat para rodar o projeto.
echo ==========================================
echo.
pause
