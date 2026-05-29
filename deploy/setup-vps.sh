#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Script de deploy inicial para VPS Ubuntu/Debian
# Ejecutar como root o con sudo
# Uso: bash setup-vps.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "=== 1. Actualizar sistema ==="
apt update && apt upgrade -y

echo "=== 2. Instalar Node.js 20 LTS ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "=== 3. Instalar Nginx y Certbot ==="
apt install -y nginx certbot python3-certbot-nginx

echo "=== 4. Instalar PM2 globalmente ==="
npm install -g pm2

echo "=== 5. Crear directorio del proyecto ==="
mkdir -p /var/www/cuscus

echo "=== 6. Copiar archivos del proyecto ==="
# Subir los archivos con scp primero, luego ejecutar este script
# scp -r ./backend ./frontend ./deploy root@IP_VPS:/var/www/cuscus/

echo ""
echo "SIGUIENTE PASO: sube el código y ejecuta deploy.sh"
echo "Ver instrucciones en deploy/INSTRUCCIONES.md"
