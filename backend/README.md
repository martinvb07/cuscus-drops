<div align="center">

# Cuscus Hats — Backend

**El motor que recibe las órdenes, sincroniza con Shopify y alimenta el panel de administración**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Shopify](https://img.shields.io/badge/Shopify_Webhooks-2025--01-96BF48?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev/)

</div>

---

## ¿Qué es esta parte?

El Backend es el servidor que trabaja en segundo plano. El usuario nunca lo ve directamente, pero es el responsable de que todo funcione después de que alguien hace una compra: recibe la notificación de Shopify, guarda el pedido, lo expone al panel de administración y, cuando el equipo despacha, le avisa de vuelta a Shopify para que notifique al cliente.

---

## ¿Qué hace exactamente?

### Recibe los pedidos de Shopify en tiempo real
Cuando alguien paga en Shopify, Shopify le envía automáticamente al backend toda la información del pedido: datos del cliente, dirección de envío, productos comprados y monto total. El backend verifica que el mensaje viene realmente de Shopify y lo guarda en la base de datos.

### Guarda toda la información en una base de datos propia
Cada pedido queda almacenado en MongoDB con todos sus detalles. Esto le da independencia al sistema — si Shopify tuviera algún problema, los datos de los clientes siguen seguros en la base de datos propia.

### Alimenta el panel de administración
El panel de administración del Frontend consulta al backend para mostrar la lista de pedidos, las estadísticas del dashboard y los datos de los clientes. El backend organiza, filtra y entrega esa información en tiempo real.

### Sincroniza los despachos con Shopify
Cuando el equipo marca un pedido como "Despachado" desde el panel y agrega el número de guía, el backend automáticamente le informa a Shopify. Shopify entonces le envía al comprador un correo con el número de seguimiento de su paquete — sin que nadie tenga que hacer nada manualmente en Shopify.

### Registra analíticas del funnel
Lleva un conteo de cuántas personas visitaron el sitio, cuántas hicieron clic en el botón de compra y cuántas completaron el pago. Esto genera el embudo de conversión visible en el panel admin.

---

## Seguridad

Todos los mensajes que llegan de Shopify son verificados con una firma digital antes de procesarse, para garantizar que nadie puede enviar pedidos falsos. El panel de administración requiere autenticación en cada consulta. Los endpoints públicos tienen límite de peticiones para evitar abusos.

---

## Tecnologías utilizadas

| Tecnología | Para qué se usa |
|------------|-----------------|
| **Node.js + Express** | Motor del servidor y gestión de las peticiones entrantes |
| **MongoDB** | Base de datos donde se guardan los pedidos, clientes y eventos de analítica |
| **Shopify Webhooks** | Canal por el que Shopify notifica al backend cuando ocurre algo en la tienda |
| **express-rate-limit** | Protección contra uso excesivo de los endpoints públicos |

---

<div align="center">

**Cuscus Hats · Colombia · Edición Limitada 001—100**

</div>
