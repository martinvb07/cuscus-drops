<div align="center">

# Cuscus Hats — Frontend

**La experiencia visual del drop · todo lo que el usuario y el administrador ven e interactúan**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## ¿Qué es esta parte?

El Frontend es todo lo que se ve y se usa en pantalla. Tiene dos zonas bien diferenciadas: el **sitio público** donde los compradores viven la experiencia del drop, y el **panel de administración** donde el equipo de Cuscus gestiona pedidos, stock y el estado del drop en tiempo real.

---

## El sitio público

### Lo que ve el comprador

Cuando alguien entra al sitio, lo primero que aparece es una pantalla de carga animada con el logo de Cuscus. Luego accede a la landing del drop, que está diseñada como una experiencia editorial de marca: tipografía grande, fotografía del producto con visor interactivo 360°, información del drop y un botón de compra.

Antes de mostrar el botón, el sistema verifica automáticamente si hay stock disponible en Shopify. Si hay unidades, el botón aparece activo. Si no hay stock o el drop fue cerrado desde el panel admin, la página muestra directamente la pantalla **SOLD OUT** — sin necesidad de que nadie lo cambie manualmente.

### Después de comprar

Una vez que el cliente completa el pago en Shopify, es redirigido a una pantalla de confirmación que le da la bienvenida al drop.

---

## El panel de administración

Accesible desde `/admin` con contraseña. Desde aquí el equipo puede gestionar todo el drop sin necesidad de entrar a Shopify ni tocar código.

### Dashboard
Vista general con todas las métricas del drop: cuántos pedidos llegaron, cuántos están pagados, cuántos fueron despachados, cuántos entregados y cuánto dinero se ha generado. Los números se actualizan automáticamente cada 60 segundos.

### Drop #1
Control del estado del drop en tiempo real. Desde aquí se puede abrir o cerrar el drop con un solo clic — lo que el usuario ve en la web cambia al instante. También permite actualizar el precio del producto directamente en Shopify sin necesidad de entrar al panel de Shopify.

### Pedidos
Tabla completa con todos los pedidos recibidos. Se puede buscar por nombre, email o número de guía, filtrar por estado de pago o despacho, y hacer clic en cualquier pedido para ver todos sus detalles y actualizar la información de envío: número de guía, transportadora y estado del despacho.

### Inventario
Vista visual del stock con una barra de progreso que muestra cuántas unidades quedan disponibles y cuántas ya fueron vendidas.

### Clientes
Lista de todos los compradores con su información de contacto, historial de compras y gasto total.

### Shopify
Pantalla de estado de la conexión con Shopify. Muestra si la integración está activa y la URL que hay que configurar en Shopify para recibir los eventos de órdenes automáticamente.

### Config
Estado del servidor y accesos rápidos a los recursos del proyecto: la landing, el panel de Shopify y la API.

---

## Tecnologías utilizadas

| Tecnología | Para qué se usa |
|------------|-----------------|
| **Next.js 15** | Framework principal — maneja tanto la web pública como el panel admin |
| **TypeScript** | Garantiza que los datos de Shopify y las órdenes siempre tengan el formato correcto |
| **Tailwind CSS** | Sistema de diseño visual — tipografía, colores, espaciado |
| **Framer Motion** | Animaciones del loader, transiciones entre secciones y efectos de entrada |
| **GSAP** | Animaciones más complejas: el ticker de texto animado y el visor 360° del producto |

---

<div align="center">

**Cuscus Hats · Colombia · Edición Limitada 001—100**

</div>
