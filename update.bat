@echo off
setlocal enabledelayedexpansion
echo.
echo ==========================================
echo    VR Rookie Downloader - Updater
echo ==========================================
echo.
echo [1] Verify Update (Default)
echo [2] Force Reinstall (Hard Update)
echo.
set /p choice="Select an option: "
if not exist "package.json" (
    echo [ERROR] package.json not found.
    pause
    exit /b 1
)
set "LOCAL_VERSION="
for /f "tokens=2 delims=:," %%a in ('findstr /i "\"version\"" package.json') do (
    set "v=%%~a"
    set "v=!v:"=!"
    set "v=!v: =!"
    set "v=!v:	=!"
    set "LOCAL_VERSION=!v!"
    goto :l1
)
:l1
if "%choice%"=="2" (
    set "REMOTE_VERSION=HARD-UPDATE"
    goto :proceed_update
)
echo [INFO] Local Version: !LOCAL_VERSION!
echo [INFO] Checking GitHub...
curl -s -L "https://raw.githubusercontent.com/yGuilhermy/VRRookieDownloader/main/package.json?t=%random%" > remote_pkg.json
set "REMOTE_VERSION="
for /f "tokens=2 delims=:," %%a in ('findstr /i "\"version\"" remote_pkg.json') do (
    set "v=%%~a"
    set "v=!v:"=!"
    set "v=!v: =!"
    set "v=!v:	=!"
    set "REMOTE_VERSION=!v!"
    goto :r1
)
:r1
del remote_pkg.json
echo [INFO] GitHub Version: !REMOTE_VERSION!
if "!LOCAL_VERSION!"=="!REMOTE_VERSION!" (
    echo [INFO] The application is already up to date.
    pause
    exit /b 0
)
powershell -Command "$v1 = [version]'!LOCAL_VERSION!'; $v2 = [version]'!REMOTE_VERSION!'; if ($v2 -gt $v1) { exit 1 } else { exit 0 }"
if %errorlevel% neq 1 (
    echo [INFO] Local version is equal to or higher than GitHub version.
    pause
    exit /b 0
)
:proceed_update
echo [INFO] Starting update process...
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM next.exe >nul 2>nul
timeout /t 2 /nobreak >nul
for /f "delims=" %%a in ('wmic OS Get localdatetime ^| find "."') do set dt=%%a
set "date_str=!dt:~0,14!"
set "BACKUP_DIR=old_!LOCAL_VERSION!_!date_str!"
mkdir "!BACKUP_DIR!"
echo [INFO] Creating backup in !BACKUP_DIR!...
for /d %%d in (*) do (
    set "name=%%d"
    if /i not "!name!"=="node_modules" if /i not "!name!"==".git" if /i not "!name!"=="!BACKUP_DIR!" if "!name:~0,4!" neq "old_" (
        move "%%d" "!BACKUP_DIR!\" >nul
    )
)
for %%f in (*) do (
    if /i not "%%f"=="update.bat" if /i not "%%f"=="update.sh" if /i not "%%f"=="!BACKUP_DIR!" (
        move "%%f" "!BACKUP_DIR!\" >nul
    )
)
if exist "!BACKUP_DIR!\backend\node_modules" (
    if not exist backend mkdir backend
    move "!BACKUP_DIR!\backend\node_modules" "backend\" >nul
)
if exist "!BACKUP_DIR!\frontend\node_modules" (
    if not exist frontend mkdir frontend
    move "!BACKUP_DIR!\frontend\node_modules" "frontend\" >nul
)
echo [INFO] Downloading recent files...
curl -L "https://github.com/yGuilhermy/VRRookieDownloader/archive/refs/heads/main.zip" -o update.zip
if errorlevel 1 (
    echo [ERROR] Download failed.
    pause
    exit /b 1
)
echo [INFO] Extracting files...
powershell -Command "Expand-Archive -Path 'update.zip' -DestinationPath 'temp_extract' -Force"
del update.zip
echo [INFO] Applying new files...
for /d %%d in (temp_extract\*) do (
    xcopy "%%d\*" . /E /Y /H /Q >nul
)
rmdir /s /q temp_extract
echo [INFO] Finishing...
call setup.bat
echo [OK] Process completed! !REMOTE_VERSION!
pause
