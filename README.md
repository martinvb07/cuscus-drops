<div align="center">

<img src="frontend/public/LOGO_FINAL.png" alt="Cuscus Hats Logo" width="120"/>

# CUSCUS HATS — Drop Platform

**La plataforma de lanzamientos de ediciones limitadas de Cuscus Hats**

*Sé el primero en enterarte. Sé el primero en tenerla.*

---

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Sobre el proyecto

Este proyecto fue desarrollado a medida para **Cuscus Hats**, una marca de gorras de edición limitada. Es una plataforma completa de lanzamiento (*drop*) con landing inmersiva, registro de usuarios, panel de administración y notificaciones vía WhatsApp — todo en tiempo real.

La plataforma está pensada para generar expectativa antes del drop, recolectar los números de los interesados y notificarles el momento exacto del lanzamiento por WhatsApp.

---

## ¿Qué incluye la plataforma?

### Landing del Drop
Página principal con fondo inmersivo, grain de película, viñeta y tipografía blackletter. Diseñada para comunicar exclusividad desde el primer segundo. Incluye un campo de estrellas animadas y estrellas fugaces.

### Contador Regresivo
Cuenta regresiva en tiempo real hacia la fecha del próximo drop. La fecha se puede actualizar desde el panel de admin sin necesidad de tocar el código ni reiniciar nada.

### Formulario de Pre-registro
Los interesados dejan su número de WhatsApp para recibir alertas del lanzamiento. El formulario valida el formato del número según el país seleccionado (más de 20 países de Latinoamérica), detecta duplicados y muestra modales de confirmación o error.

### Estado Sold Out
Cuando el drop se agota, el admin activa el modo *Sold Out* con un solo clic. La landing cambia de pantalla al instante para todos los usuarios conectados — sin necesidad de recargar la página.

### Panel de Administración
Acceso protegido con contraseña. Desde ahí se puede:
- Ver todos los pre-registros en tiempo real
- Buscar, exportar a CSV o eliminar registros
- Cambiar la fecha del contador
- Conectar WhatsApp vía código QR
- Enviar mensajes masivos a todos los registrados
- Activar o desactivar el modo Sold Out

### Notificaciones en Tiempo Real
Cada vez que alguien se registra, el panel de admin muestra una notificación inmediata con el número y la bandera del país — sin necesidad de recargar la página.

### WhatsApp Integrado
El sistema se conecta directamente a WhatsApp (sin APIs de pago) escaneando un código QR desde el panel de admin. Permite enviar mensajes masivos a todos los registrados con un solo clic.

---

## Estructura del proyecto

```
Cuscus-Hats/
├── frontend/     → Interfaz web (Next.js + React)
├── backend/      → Servidor y lógica (Node.js + Express)
└── README.md
```

Cada carpeta tiene su propio README con más detalle:
- [Frontend →](./frontend/README.md)
- [Backend →](./backend/README.md)

---

## Cómo correr el proyecto

**1. Instalar dependencias**
```bash
npm run install:all
```

**2. Configurar variables de entorno**

Copia `backend/.env.example` a `backend/.env` y completa los valores.

**3. Levantar todo**
```bash
# Backend (puerto 4000)
npm run dev:backend

# Frontend (puerto 3000)
npm run dev:frontend
```

---

## Roadmap

- [x] Landing page inmersiva con fondo, grain y viñeta
- [x] Estrellas y estrellas fugaces animadas
- [x] Contador regresivo en tiempo real
- [x] Formulario de pre-registro con validación por país
- [x] Detección de duplicados con modal de aviso
- [x] Modal de registro exitoso
- [x] Diseño completamente responsivo (móvil y escritorio)
- [x] Panel de administración protegido con contraseña
- [x] Exportar registros a CSV
- [x] Conexión a WhatsApp vía QR sin APIs de pago
- [x] Envío de mensajes masivos por WhatsApp
- [x] Modo Sold Out con cambio en tiempo real
- [x] Notificaciones en vivo al admin por cada nuevo registro
- [x] Base de datos MongoDB para persistencia
- [ ] Página de producto con galería del drop
- [ ] Historial de campañas enviadas

---

## Licencia

Todos los derechos reservados © 2026 — Cuscus Hats. Proyecto de uso privado para la marca.

---

<div align="center">

*World Is Yours*

</div>
