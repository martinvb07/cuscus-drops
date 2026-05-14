<div align="center">

# Backend — Cuscus Hats

**El servidor que mueve todo por detrás**

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

</div>

---

## ¿Qué es esto?

Esta carpeta contiene el servidor de la plataforma: recibe los registros, guarda los datos, controla el estado del drop y mantiene todo sincronizado en tiempo real entre el admin y los visitantes. También es quien gestiona la conexión con WhatsApp para el envío de mensajes masivos.

---

## ¿Qué hace?

### Guarda los registros
Cada vez que alguien deja su número en la landing, el servidor lo guarda en la base de datos. Verifica automáticamente que el número no esté ya registrado y, si es nuevo, avisa al panel de admin al instante.

### Controla el estado del drop
Mantiene el estado actual de la plataforma: si está en pre-drop, live o sold-out. Cuando el admin cambia el estado desde el panel, el servidor se lo comunica a todos los navegadores conectados en ese momento — la landing cambia sola, sin que nadie tenga que recargar la página.

### Maneja el contador regresivo
Guarda la fecha objetivo del drop. El admin puede cambiarla desde el panel en cualquier momento y el contador se actualiza para todos los visitantes.

### Conecta con WhatsApp
El servidor puede vincularse directamente a una cuenta de WhatsApp escaneando un código QR — sin necesidad de contratar ninguna API de pago. Una vez conectado, puede enviar un mensaje a todos los registrados con un solo clic desde el panel de admin.

### Comunica todo en tiempo real
Usa una conexión permanente entre el servidor y los navegadores para que cualquier cambio se refleje al instante: un nuevo registro aparece en el admin sin recargar, el sold-out cambia la landing de todos los visitantes, y el estado de WhatsApp se actualiza en vivo.

---

## Base de datos

Usa **MongoDB** con dos colecciones:

- **Registros** — Guarda cada número de WhatsApp con la fecha y hora exacta en que se registró. Garantiza que no haya duplicados.
- **Configuración** — Almacena la fecha del countdown y el estado actual del drop para que persistan aunque el servidor se reinicie.

---

## Comunicación en tiempo real

El servidor mantiene una conexión abierta con todos los navegadores. Así funciona:

| Qué pasa | Qué se comunica |
|---|---|
| Alguien se registra | El admin recibe una notificación con el número y el país |
| El admin activa Sold Out | La landing de todos los visitantes cambia al instante |
| WhatsApp se conecta o desconecta | El panel de admin muestra el nuevo estado |
| Se envía un mensaje masivo | El admin ve el progreso en tiempo real |

---

## WhatsApp

La integración de WhatsApp funciona sin APIs externas de pago. El servidor usa una librería que simula la conexión de WhatsApp Web: genera un código QR que el admin escanea con su teléfono, y a partir de ahí el servidor queda vinculado a esa cuenta para enviar mensajes.

La sesión se guarda localmente, así que no hace falta volver a escanear el QR cada vez que se reinicia el servidor.

---

## Licencia

Todos los derechos reservados © 2026 — Cuscus Hats. Proyecto de uso privado para la marca.
