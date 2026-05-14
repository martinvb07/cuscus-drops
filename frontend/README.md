<div align="center">

# Frontend — Cuscus Hats

**Interfaz web de la plataforma de drops**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ¿Qué es esto?

La carpeta `frontend` contiene todo lo que el usuario ve: la landing del drop, el formulario de registro, el contador regresivo, la pantalla de Sold Out y el panel de administración. Está construida con Next.js y React, con un diseño oscuro, tipografía gótica y animaciones inmersivas.

---

## Páginas

### `/` — Landing principal
Lo que ve cualquier persona que entre a la página. Tiene tres estados posibles:

- **Pre-drop** — Se muestra el contador regresivo y el formulario para dejar el número de WhatsApp.
- **Sold Out** — Cuando el admin activa este estado, la pantalla cambia automáticamente para todos sin necesidad de recargar.
- **Live** — Estado cuando el drop está activo, muestra un botón de compra.

### `/admin` — Panel de administración
Acceso protegido con contraseña. Desde aquí el equipo de Cuscus puede:
- Ver en tiempo real quién se está registrando (con notificación instantánea)
- Buscar registros por número
- Exportar la lista a CSV
- Eliminar registros individuales o todos
- Cambiar la fecha del contador
- Conectar WhatsApp y enviar mensajes masivos
- Activar el modo Sold Out con un clic

---

## Componentes principales

| Componente | Qué hace |
|---|---|
| `LandingDrop` | Controla qué pantalla mostrar según el estado del drop |
| `SignupForm` | Formulario de registro con selector de país y validación |
| `Countdown` | Contador regresivo que se actualiza cada segundo |
| `Starfield` | Campo de 160 estrellas animadas con parpadeo |
| `ShootingStars` | Estrellas fugaces que cruzan la pantalla |
| `Footer` | Pie de página con redes sociales |

---

## Variables de entorno

Crea un archivo `.env.local` en esta carpeta con:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

En producción, cambia esa URL por la dirección real del servidor backend.

---

## Tipografías usadas

| Fuente | Uso |
|---|---|
| **Pirata One** | Títulos y nombres (`CUSCUS`, `SOLD OUT`, botones principales) |
| **Cormorant Garamond** | Números del contador (elegancia clásica) |
| **JetBrains Mono** | Textos secundarios, labels y campos de formulario |

---

## Cómo correr el frontend

```bash
# Instalar dependencias
npm install

# Modo desarrollo (puerto 3000)
npm run dev

# Build de producción
npm run build
npm run start
```

---

## Notas de diseño

- El fondo (`fondo.png`) es la imagen principal del paisaje oscuro.
- `LOGO_FINAL.png` es el monograma del logo que aparece en la landing.
- `NOMBRE_FINAL.png` es el wordmark "CUSCUS" en tipografía gótica.
- El efecto grain y la viñeta se aplican globalmente desde `globals.css`.
- En móvil, los inputs tienen `font-size: 16px` para evitar el zoom automático de iOS Safari.
