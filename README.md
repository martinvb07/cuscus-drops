<div align="center">

# Cuscus Hats — Drop #1

**Plataforma de lanzamiento de edición limitada para Cuscus Hats · 100 gorras, una sola vez**

*Experiencia de compra premium con integración completa a Shopify, panel de administración en tiempo real y sincronización automática de órdenes*

---

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Shopify](https://img.shields.io/badge/Shopify_API-2025--01-96BF48?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ¿Qué es Cuscus Drops?

**Cuscus Drops** es un sitio web de lanzamiento de producto diseñado para crear una experiencia de compra de edición limitada. La plataforma gestiona un drop completo — desde el momento en que el usuario llega al sitio hasta que el administrador marca el pedido como despachado — con sincronización automática bidireccional entre la base de datos interna y Shopify.

La lógica central es simple pero efectiva: el drop puede estar **abierto** (landing con botón de compra) o **cerrado** (pantalla Sold Out), y todo se controla desde un panel de administración sin necesidad de tocar código ni Shopify directamente.

---

## ¿Qué puede hacer la plataforma?

### 🛒 Experiencia de compra
El sitio muestra una landing editorial con visor 360° del producto, información del drop y botón de compra. Al hacer clic, el sistema verifica el stock disponible en tiempo real y redirige al checkout de Shopify. Si no hay stock, muestra la pantalla **SOLD OUT** automáticamente.

### 🎩 Control del drop desde el admin
Desde `/admin`, el operador puede abrir o cerrar el drop con un solo botón — esto cambia el estado del producto en Shopify (ACTIVE ↔ DRAFT) e inmediatamente afecta lo que ve el usuario en la web.

### 📦 Gestión de pedidos
El panel recibe todas las órdenes de Shopify en tiempo real mediante webhooks y las almacena en MongoDB. El operador puede buscar, filtrar, ver el detalle de cada pedido y actualizar el estado de despacho con número de guía y transportadora.

### 🔄 Sincronización con Shopify
Cuando el administrador marca un pedido como "Despachado" y agrega la guía, el sistema automáticamente crea el fulfillment en Shopify, lo que dispara la notificación al cliente con su información de envío.

### 📊 Analíticas y métricas
Dashboard con métricas en tiempo real: pedidos totales, pagados, despachados, entregados, ingresos acumulados y stock disponible. Los datos se actualizan automáticamente cada 60 segundos.

### 👥 Gestión de clientes
Vista consolidada de todos los compradores con historial de órdenes, gasto total y datos de contacto exportables a CSV.

---

## Stack tecnológico

### 🖥️ Frontend

| Tecnología | Para qué se usa |
|------------|-----------------|
| **Next.js 15** | Framework React con App Router y Route Handlers |
| **TypeScript** | Tipado estático en toda la capa frontend |
| **Tailwind CSS** | Sistema de estilos utilitarios |
| **Framer Motion** | Animaciones de la landing y transiciones |
| **GSAP** | Animaciones premium en el visor y secciones editoriales |

### ⚙️ Backend

| Tecnología | Para qué se usa |
|------------|-----------------|
| **Node.js + Express** | Servidor de API REST |
| **MongoDB + Mongoose** | Base de datos de órdenes y analíticas |
| **express-rate-limit** | Protección de endpoints públicos |

### 🛍️ E-commerce

| Integración | Para qué se usa |
|-------------|-----------------|
| **Shopify Admin API (GraphQL)** | Inventario, órdenes, fulfillments, estado del drop |
| **Shopify Admin API (REST)** | Consulta rápida de stock del variante |
| **Shopify Webhooks** | Recepción de eventos en tiempo real (órdenes, pagos, despachos) |

---

<div align="center">

**Cuscus Hats · Colombia · Edición Limitada 001—100**

[Reportar un problema](https://github.com/Martinvb07/Cuscus-drops/issues)

</div>
