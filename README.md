<div align="center">

<img src="frontend/public/LOGO_FINAL.png" alt="Cuscus Hats Logo" width="120"/>

# CUSCUS HATS — Drop Platform

**La plataforma de lanzamientos de ediciones limitadas de Cuscus Hats**

*Sé el primero en enterarte. Sé el primero en tenerla.*

---

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Sobre el proyecto

Este proyecto fue desarrollado a medida para **Cuscus Hats**, una marca de gorras de edición limitada. Es una plataforma completa de lanzamiento (*drop*) pensada para generar expectativa, recolectar los números de los interesados y avisarles por WhatsApp en el momento exacto del lanzamiento.

La experiencia está diseñada desde el primer segundo para transmitir exclusividad: fondo oscuro cinematográfico, tipografía gótica, estrellas animadas y una cuenta regresiva que mantiene al usuario en suspenso.

---

## ¿Qué incluye?

### Landing del Drop
La página principal que ve cualquier visitante. Tiene tres estados posibles que el admin puede cambiar en cualquier momento sin tocar el código:

- **Pre-drop** — Muestra el contador regresivo y el formulario para registrarse.
- **Sold Out** — Cuando el drop se agota, la pantalla cambia automáticamente para todos sin necesidad de recargar.
- **Live** — Cuando el drop está activo, aparece el botón de compra.

### Contador Regresivo
Cuenta los días, horas, minutos y segundos que faltan para el drop. El admin puede cambiar la fecha desde el panel sin necesidad de modificar nada en el código.

### Formulario de Pre-registro
Los interesados dejan su número de WhatsApp para recibir la alerta del lanzamiento. El formulario valida automáticamente que el número sea correcto según el país seleccionado, detecta si alguien ya está registrado y muestra confirmaciones claras en cada caso.

### Modo Sold Out
Con un solo clic desde el panel de admin, la landing cambia de estado para todos los usuarios conectados al instante — sin recargar la página.

### Panel de Administración
Acceso protegido con contraseña. Desde aquí el equipo de Cuscus puede ver y gestionar todo:
- Registros en tiempo real con notificación por cada nuevo inscrito
- Búsqueda, exportación a CSV y eliminación de registros
- Control del contador y del estado del drop
- Conexión a WhatsApp y envío de mensajes masivos al momento del lanzamiento

### Notificaciones en Tiempo Real
Cada vez que alguien se registra, el panel de admin muestra una notificación instantánea con el número y la bandera del país del usuario — sin necesidad de recargar nada.

### WhatsApp Integrado
El sistema se conecta directamente a WhatsApp escaneando un código QR desde el panel de admin, sin necesidad de APIs de pago. Cuando llega el momento del drop, se puede enviar el mensaje a todos los registrados con un solo clic.

---

## Estructura del proyecto

El proyecto está dividido en dos partes que trabajan juntas:

- **`frontend/`** — Todo lo que ve el usuario: la landing, el formulario, el contador y el panel de admin. [Ver más →](./frontend/README.md)
- **`backend/`** — El servidor que guarda los datos, maneja el estado del drop y envía los mensajes de WhatsApp. [Ver más →](./backend/README.md)

---

## Roadmap

- [x] Landing page inmersiva con fondo, grain y viñeta
- [x] Estrellas y estrellas fugaces animadas
- [x] Contador regresivo en tiempo real
- [x] Formulario de pre-registro con validación por país
- [x] Detección de duplicados y modales de confirmación
- [x] Diseño completamente responsivo (móvil y escritorio)
- [x] Panel de administración protegido con contraseña
- [x] Exportar registros a CSV
- [x] Conexión a WhatsApp vía QR sin APIs de pago
- [x] Envío de mensajes masivos por WhatsApp
- [x] Modo Sold Out con cambio en tiempo real para todos
- [x] Notificaciones en vivo al admin por cada nuevo registro
- [x] Base de datos MongoDB para persistencia de datos
- [ ] Página de producto con galería del drop
- [ ] Historial de campañas enviadas

---

## Licencia

Todos los derechos reservados © 2026 — Cuscus Hats. Proyecto de uso privado para la marca.

---

<div align="center">

*World Is Yours*

</div>
