<div align="center">

# Backend — Cuscus Hats

**Servidor, base de datos y comunicaciones de la plataforma**

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

</div>

---

## ¿Qué es esto?

La carpeta `backend` contiene el servidor que maneja todo lo que ocurre detrás de la página: guardar registros, manejar el estado del drop, enviar mensajes por WhatsApp y comunicar cambios en tiempo real a todos los usuarios conectados.

Corre en el **puerto 4000** y se conecta a una base de datos MongoDB.

---

## ¿Qué hace el servidor?

### Registros de usuarios
Guarda los números de WhatsApp de quienes se pre-registran. Verifica que no haya duplicados y avisa al panel de admin en tiempo real cada vez que llega uno nuevo.

### Estado del drop
Maneja si la plataforma está en modo *pre-drop*, *live* o *sold-out*. Cuando el admin cambia el estado, el servidor lo comunica instantáneamente a todos los navegadores conectados — la landing cambia sola.

### Contador regresivo
Guarda la fecha objetivo del drop. El admin puede cambiarla desde el panel sin tocar el código.

### WhatsApp
El servidor se puede conectar directamente a WhatsApp (escaneando un código QR, sin necesidad de APIs de pago). Una vez conectado, permite enviar mensajes masivos a todos los registrados desde el panel de admin.

### Tiempo real
Usa Socket.IO para mantener una conexión abierta entre el servidor y todos los navegadores. Así, cualquier cambio (nuevo registro, sold out, estado de WhatsApp) se refleja inmediatamente sin necesidad de recargar la página.

---

## Endpoints de la API

| Método | Ruta | Qué hace |
|---|---|---|
| `POST` | `/api/registrations` | Registra un número nuevo |
| `GET` | `/api/registrations` | Lista todos los registros (solo admin) |
| `DELETE` | `/api/registrations` | Elimina todos los registros (solo admin) |
| `DELETE` | `/api/registrations/:id` | Elimina un registro específico (solo admin) |
| `GET` | `/api/countdown` | Obtiene la fecha del próximo drop |
| `PUT` | `/api/countdown` | Actualiza la fecha del drop (solo admin) |
| `GET` | `/api/drop/state` | Obtiene el estado actual del drop |
| `POST` | `/api/whatsapp/connect` | Inicia la conexión a WhatsApp |
| `POST` | `/api/whatsapp/disconnect` | Desconecta WhatsApp |
| `POST` | `/api/campaigns/send` | Envía mensaje masivo a todos (solo admin) |
| `GET` | `/api/health` | Verifica que el servidor esté corriendo |

---

## Eventos en tiempo real (Socket.IO)

El servidor emite estos eventos a los navegadores conectados:

| Evento | Cuándo ocurre |
|---|---|
| `registration:new` | Alguien se registra → admin ve la notificación al instante |
| `drop:state` | El admin cambia el estado → la landing se actualiza sola |
| `wa:status` | El estado de WhatsApp cambia (conectado, desconectado, etc.) |
| `wa:qr` | Se genera un nuevo código QR para conectar WhatsApp |
| `campaign:progress` | Progreso del envío masivo de mensajes |

---

## Variables de entorno

Copia el archivo `.env.example` y renómbralo `.env`:

```env
# Puerto donde corre el servidor
PORT=4000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:3000

# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/cuscus-hats

# Contraseña del panel de administración
ADMIN_SECRET=tu_contraseña_aqui

# URL pública de la tienda (para mensajes de WhatsApp)
BRAND_URL=https://cuscushats.com

# Twilio (opcional, alternativa de WhatsApp por API)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
```

---

## Estructura de carpetas

```
backend/
├── src/
│   ├── index.js          → Punto de entrada, configura Express y Socket.IO
│   ├── db/
│   │   └── connection.js → Conexión a MongoDB
│   ├── middleware/
│   │   └── auth.js       → Verificación de contraseña admin
│   ├── models/
│   │   ├── Registration.js → Modelo de registro (número + fecha)
│   │   └── Config.js       → Modelo genérico para configuraciones
│   ├── routes/
│   │   ├── registrations.js → Rutas de pre-registros
│   │   ├── countdown.js     → Rutas del contador
│   │   ├── drop.js          → Rutas del estado del drop
│   │   ├── whatsapp.js      → Rutas de conexión WhatsApp
│   │   └── campaigns.js     → Rutas de envío masivo
│   ├── services/
│   │   └── whatsappBaileys.js → Conexión directa a WhatsApp vía QR
│   ├── socket/
│   │   └── index.js       → Configuración de Socket.IO y eventos
│   └── state/
│       └── dropState.js   → Lógica del estado del drop
└── .env.example
```

---

## Cómo correr el backend

```bash
# Instalar dependencias
npm install

# Modo desarrollo con auto-recarga (puerto 4000)
npm run dev

# Modo producción
npm run start
```

> Asegúrate de tener MongoDB corriendo antes de arrancar el servidor.

---

## Base de datos

El servidor usa **MongoDB** con dos colecciones:

- **registrations** — Guarda cada número registrado con su fecha de creación. Tiene un índice único en el número para evitar duplicados.
- **config** — Almacena configuraciones clave-valor como la fecha del countdown y el estado del drop.
