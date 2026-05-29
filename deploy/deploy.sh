#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Script de deploy/actualización (ejecutar en el VPS cada vez que haya cambios)
# Uso: bash deploy/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e
APP_DIR="/var/www/cuscus"

echo "=== Instalando dependencias del backend ==="
cd "$APP_DIR/backend"
npm install --omit=dev

echo "=== Instalando dependencias del frontend ==="
cd "$APP_DIR/frontend"
npm install --omit=dev

echo "=== Build del frontend ==="
npm run build

echo "=== Copiando configs de Nginx ==="
cp "$APP_DIR/deploy/nginx/cuscus.co.conf"     /etc/nginx/sites-available/cuscus.co
cp "$APP_DIR/deploy/nginx/api.cuscus.co.conf" /etc/nginx/sites-available/api.cuscus.co

# Habilitar sitios si no están habilitados
ln -sf /etc/nginx/sites-available/cuscus.co     /etc/nginx/sites-enabled/cuscus.co
ln -sf /etc/nginx/sites-available/api.cuscus.co /etc/nginx/sites-enabled/api.cuscus.co

echo "=== Validando config de Nginx ==="
nginx -t

echo "=== Recargando Nginx ==="
systemctl reload nginx

echo "=== Arrancando/Reiniciando apps con PM2 ==="
cd "$APP_DIR"
pm2 start deploy/ecosystem.config.cjs || pm2 restart deploy/ecosystem.config.cjs
pm2 save

echo ""
echo "✓ Deploy completado"
pm2 status
