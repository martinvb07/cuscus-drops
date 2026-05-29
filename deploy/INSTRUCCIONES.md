# Deploy Cuscus Hats → VPS

## Arquitectura
```
Internet
  ↓ HTTPS (443)
Nginx  ──→  cuscus.co     →  Next.js  :3001
       ──→  api.cuscus.co →  Node.js  :4001
                               ↓
                          MongoDB Atlas
```

---

## PASO 1 — DNS (en tu registrador de dominio)

Añade estos dos registros A apuntando a la IP de tu VPS:

| Tipo | Nombre | Valor       |
|------|--------|-------------|
| A    | @      | IP_DEL_VPS  |
| A    | api    | IP_DEL_VPS  |

Espera 5-30 minutos a que propague.

---

## PASO 2 — Primera vez en el VPS

```bash
# Conectarte al VPS
ssh root@IP_DEL_VPS

# Crear directorio
mkdir -p /var/www/cuscus
```

---

## PASO 3 — Subir el código desde tu PC

Ejecuta esto en tu PC (PowerShell o terminal):

```bash
# Subir todo el proyecto al VPS
scp -r backend frontend deploy root@IP_DEL_VPS:/var/www/cuscus/
```

---

## PASO 4 — Variables de entorno en el VPS

**Backend** — crea `/var/www/cuscus/backend/.env`:
```env
MONGODB_URI=mongodb+srv://cuscus:TU_PASSWORD@cluster0.xxxxx.mongodb.net/cuscus-hats
ADMIN_PASSWORD=TU_PASSWORD_ADMIN_SEGURO
SHOPIFY_STORE_DOMAIN=TU-TIENDA.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SHOPIFY_WEBHOOK_SECRET=TU_WEBHOOK_SECRET
PORT=4001
STOCK_TOTAL=100
FRONTEND_URL=https://cuscushats.com
BACKEND_URL=https://api.cuscushats.com
```

> El `BACKEND_URL` activa el **registro automático de webhooks** al arrancar el backend.
> Al hacer `pm2 start`, el backend se conecta a Shopify y registra todos los webhooks solo.

**Frontend** — crea `/var/www/cuscus/frontend/.env.local`:
```env
SHOPIFY_STORE_DOMAIN=TU-TIENDA.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SHOPIFY_VARIANT_ID=gid://shopify/ProductVariant/XXXXXXXXXXXXXX
SHOPIFY_STOREFRONT_TOKEN=TU_STOREFRONT_TOKEN
SHOPIFY_CHECKOUT_DOMAIN=cuscus.co
NEXT_PUBLIC_SITE_URL=https://cuscus.co
PRODUCT_PRICE=210.000
PRODUCT_CURRENCY=COP
STOCK_TOTAL=100
NEXT_PUBLIC_API_URL=https://api.cuscus.co
BACKEND_URL=https://api.cuscus.co
NEXT_PUBLIC_ADMIN_PASSWORD=TU_PASSWORD_ADMIN_SEGURO
ADMIN_PASSWORD=TU_PASSWORD_ADMIN_SEGURO
```

> ⚠️ IMPORTANTE: `ADMIN_PASSWORD` en el backend y `NEXT_PUBLIC_ADMIN_PASSWORD` en el frontend
> deben ser **exactamente el mismo valor**.

---

## PASO 5 — Instalar dependencias base (solo la primera vez)

```bash
ssh root@IP_DEL_VPS
cd /var/www/cuscus
bash deploy/setup-vps.sh
```

---

## PASO 6 — SSL con Let's Encrypt (solo la primera vez)

El DNS del paso 1 ya debe estar propagado. Verifica con:
```bash
ping cuscus.co        # debe responder desde tu IP del VPS
ping api.cuscus.co    # igual
```

Luego obtén los certificados SSL:
```bash
# Certificado para el dominio principal
certbot --nginx -d cuscus.co -d www.cuscus.co

# Certificado para el subdominio API
certbot --nginx -d api.cuscus.co
```

Certbot modifica Nginx automáticamente y configura renovación automática.

---

## PASO 7 — Deploy

```bash
cd /var/www/cuscus
bash deploy/deploy.sh
```

Esto:
1. Instala dependencias
2. Hace build del frontend
3. Copia y activa configs de Nginx
4. Arranca las apps con PM2

---

## Actualizaciones futuras

Cuando cambies código:
```bash
# Desde tu PC: subir cambios
scp -r backend frontend root@IP_DEL_VPS:/var/www/cuscus/

# En el VPS: redesplegar
cd /var/www/cuscus && bash deploy/deploy.sh
```

---

## Comandos útiles en el VPS

```bash
pm2 status                    # ver estado de las apps
pm2 logs cuscus-backend       # logs del backend
pm2 logs cuscus-frontend      # logs del frontend
pm2 restart cuscus-backend    # reiniciar backend
nginx -t                      # validar config nginx
systemctl status nginx        # estado de nginx
```

---

## Solución de problemas

| Síntoma | Causa | Solución |
|---------|-------|----------|
| "No seguro" en browser | Sin SSL | Ejecutar certbot (Paso 6) |
| Contraseña no funciona | Passwords no coinciden | Verificar que backend y frontend tengan el mismo ADMIN_PASSWORD |
| Error 502 Bad Gateway | App no está corriendo | `pm2 restart all` |
| Error 404 en API | Nginx mal configurado | `nginx -t` → `systemctl reload nginx` |
| MongoDB connection error | URI incorrecta o IP no permitida | Revisar Atlas Network Access: añadir IP del VPS |
