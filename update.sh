#!/bin/bash
set -e
echo "=========================================="
echo "   VRSideForge - Linux Updater"
echo "=========================================="
echo
echo "[1] Verify Update (Default)"
echo "[2] Force Reinstall (Hard Update)"
echo
read -p "Select an option: " choice
if [ ! -f "package.json" ]; then
    echo "[ERROR] package.json not found."
    exit 1
fi
LOCAL_VERSION=$(grep '"version"' package.json | head -n 1 | awk -F '"' '{print $4}')
if [ "$choice" == "2" ]; then
    REMOTE_VERSION="HARD-UPDATE"
else
    echo "[INFO] Local Version: $LOCAL_VERSION"
    echo "[INFO] Checking GitHub..."
    REMOTE_VERSION=$(curl -s -L "https://raw.githubusercontent.com/yGuilhermy/VRSideForge/main/package.json?t=$RANDOM" > remote_pkg.json && grep '"version"' remote_pkg.json | head -n 1 | awk -F '"' '{print $4}')
    echo "[INFO] GitHub Version: $REMOTE_VERSION"
    if [ "$LOCAL_VERSION" == "$REMOTE_VERSION" ]; then
        echo "[INFO] The application is already up to date."
        exit 0
    fi
    if [ "$(printf '%s\n' "$LOCAL_VERSION" "$REMOTE_VERSION" | sort -V | head -n1)" == "$REMOTE_VERSION" ]; then
        echo "[INFO] Local version is equal to or higher than GitHub version."
        exit 0
    fi
fi
echo "[INFO] Starting update process..."
pkill -f "node " || true
pkill -f "next-server" || true
sleep 1
BACKUP_DIR="old_${LOCAL_VERSION}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
for item in * .*; do
    if [ "$item" != "." ] && [ "$item" != ".." ] && [ "$item" != "node_modules" ] && [ "$item" != ".git" ] && [[ "$item" != old_* ]] && [ "$item" != "$BACKUP_DIR" ] && [ "$item" != "update.sh" ] && [ "$item" != "update.bat" ]; then
        mv "$item" "$BACKUP_DIR/" 2>/dev/null || true
    fi
done
[ -d "$BACKUP_DIR/backend/node_modules" ] && mkdir -p backend && mv "$BACKUP_DIR/backend/node_modules" backend/
[ -d "$BACKUP_DIR/frontend/node_modules" ] && mkdir -p frontend && mv "$BACKUP_DIR/frontend/node_modules" frontend/
echo "[INFO] Downloading recent files..."
curl -L "https://github.com/yGuilhermy/VRSideForge/archive/refs/heads/main.zip" -o update.zip
echo "[INFO] Extracting files..."
unzip -q update.zip
rm update.zip
echo "[INFO] Applying new files..."
cp -af VRSideForge-main/* . || cp -af VRSideForge-master/* .
rm -rf VRSideForge-main VRSideForge-master
chmod +x setup.sh start.sh update.sh
./setup.sh
echo "[OK] Process completed! $REMOTE_VERSION"
