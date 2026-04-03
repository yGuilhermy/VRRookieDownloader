#!/bin/bash
set -e
echo "=========================================="
echo "   VR Rookie Downloader - Updater"
echo "=========================================="
echo
echo "[1] Verificar Atualizacao (Padrao)"
echo "[2] Forcar Reinstalacao (Hard Update)"
echo
read -p "Selecione uma opcao: " choice
if [ ! -f "package.json" ]; then
    echo "[ERRO] package.json nao encontrado."
    exit 1
fi
LOCAL_VERSION=$(grep '"version"' package.json | head -n 1 | awk -F '"' '{print $4}')
if [ "$choice" == "2" ]; then
    REMOTE_VERSION="HARD-UPDATE"
else
    echo "[INFO] Versao Local: $LOCAL_VERSION"
    echo "[INFO] Checando GitHub..."
    REMOTE_VERSION=$(curl -s "https://raw.githubusercontent.com/yGuilhermy/VRRookieDownloader/main/package.json?t=$(date +%s)" | grep '"version"' | head -n 1 | awk -F '"' '{print $4}')
    echo "[INFO] Versao GitHub: $REMOTE_VERSION"
    if [ "$LOCAL_VERSION" == "$REMOTE_VERSION" ]; then
        echo "[INFO] O aplicativo ja esta atualizado."
        exit 0
    fi
    if [ "$(printf '%s\n' "$LOCAL_VERSION" "$REMOTE_VERSION" | sort -V | head -n1)" == "$REMOTE_VERSION" ]; then
        echo "[INFO] Versao local e atual ou superior a do GitHub."
        exit 0
    fi
fi
echo "[INFO] Iniciando processo..."
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
echo "[INFO] Baixando arquivos..."
curl -L "https://github.com/yGuilhermy/VRRookieDownloader/archive/refs/heads/main.zip" -o update.zip
echo "[INFO] Extraindo..."
unzip -q update.zip
rm update.zip
echo "[INFO] Aplicando..."
cp -af VRRookieDownloader-main/* . || cp -af VRRookieDownloader-master/* .
rm -rf VRRookieDownloader-main VRRookieDownloader-master
chmod +x setup.sh start.sh update.sh
./setup.sh
echo "[OK] Processo concluido! $REMOTE_VERSION"
