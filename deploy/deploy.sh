#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Deploy inicial del Drop #1 en el VPS (sin activar todavía en el dominio)
# Uso: bash /var/www/cuscus-drop/deploy/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e
APP_DIR="/var/www/cuscus-drop"

echo "=== Instalando dependencias del backend ==="
cd "$APP_DIR/backend"
npm install --omit=dev

echo "=== Instalando dependencias del frontend ==="
cd "$APP_DIR/frontend"
npm install --omit=dev

echo "=== Build del frontend ==="
npm run build

echo "=== Arrancando apps con PM2 (puertos 3003 y 4002) ==="
cd "$APP_DIR"
pm2 start deploy/ecosystem.config.cjs || pm2 reload deploy/ecosystem.config.cjs
pm2 save

echo ""
echo "✓ Deploy completado — apps corriendo en puertos 3003 y 4002"
echo "  El dominio aún apunta a la fase pre-drop."
echo "  Cuando llegue la hora del drop: bash deploy/switch.sh"
pm2 status
