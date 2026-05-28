# Cuscus Drops

Sitio de drop limitado para **Cuscus Hats** — 100 gorras, una sola vez.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 · Tailwind CSS · Framer Motion |
| Backend | Node.js · Express · MongoDB |
| E-commerce | Shopify Admin API (GraphQL) |
| Deploy | Vercel (frontend) · Railway / Render (backend) |

## Estructura

```
├── frontend/          # Next.js app
│   ├── app/
│   │   ├── (site)/    # Sitio público — layout con Nav/Loader
│   │   ├── admin/     # Panel de administración
│   │   └── api/       # Routes: checkout, stock, admin/shopify
│   ├── components/    # UI: HeroSection, DropSection, SoldOut, Footer…
│   └── lib/           # shopify.ts, shopify-admin.ts, drop-cache.ts
└── backend/           # Express API — órdenes, analíticas, webhooks Shopify
    └── src/
        ├── routes/
        ├── models/
        └── services/
```

## Variables de entorno

Copia `frontend/.env.local.example` → `frontend/.env.local` y completa:

```env
# Shopify
SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=...
SHOPIFY_ADMIN_TOKEN=...
SHOPIFY_VARIANT_ID=...
SHOPIFY_WEBHOOK_SECRET=...

# Producto
PRODUCT_PRICE=210000
PRODUCT_CURRENCY=COP

# Admin
ADMIN_PASSWORD=...

# Backend
BACKEND_URL=https://tu-backend.com
BACKEND_SECRET=...
```

## Desarrollo local

```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:3000

# Backend
cd backend
npm install
npm run dev        # http://localhost:4000
```

## Lógica del drop

- **DRAFT** en Shopify o **inventory = 0** → muestra pantalla Sold Out
- **ACTIVE** + stock > 0 → muestra el sitio completo con botón de compra
- El panel `/admin` permite abrir/cerrar el drop y ver métricas en tiempo real

## Panel de administración

Acceso en `/admin`. Permite:
- Ver stock en tiempo real
- Abrir / cerrar el drop (con confirmación)
- Ver órdenes recientes y analíticas

---

**Cuscus Hats · Colombia · Edición Limitada 001—100**
