<div align="center">

# Frontend — Cuscus Hats

**Todo lo que el usuario ve en la plataforma**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ¿Qué es esto?

Esta carpeta contiene la interfaz web completa de Cuscus Hats: la landing del drop, el formulario de registro, el contador regresivo, la pantalla de Sold Out y el panel de administración. Es lo que el usuario ve y con lo que interactúa directamente.

---

## Páginas

### `/` — Landing principal
La cara pública de la plataforma. Dependiendo del estado del drop, muestra una experiencia diferente:

- **Pre-drop** — El visitante ve el contador regresivo y puede dejar su número de WhatsApp para recibir la alerta del lanzamiento.
- **Sold Out** — En cuanto el admin activa este estado, la pantalla cambia sola para todos los visitantes conectados, mostrando que el drop ya terminó.
- **Live** — Cuando el drop está disponible, aparece el botón para comprar.

### `/admin` — Panel de administración
Solo accesible con contraseña. Desde aquí el equipo de Cuscus gestiona todo el drop: ve los registros en tiempo real, cambia la fecha del contador, conecta WhatsApp y activa el Sold Out.

---

## Componentes principales

| Componente | Qué hace |
|---|---|
| `LandingDrop` | Decide qué pantalla mostrar según el estado actual del drop |
| `SignupForm` | Formulario de registro con selector de país y validación del número |
| `Countdown` | Contador de días, horas, minutos y segundos hasta el drop |
| `Starfield` | Campo de 160 estrellas animadas con parpadeo aleatorio |
| `ShootingStars` | Estrellas fugaces que cruzan la pantalla periódicamente |
| `Footer` | Pie de página con los links a redes sociales |

---

## Tipografías

| Fuente | Dónde se usa |
|---|---|
| **Pirata One** | Títulos, nombre de la marca y elementos principales |
| **Cormorant Garamond** | Números del contador regresivo |
| **JetBrains Mono** | Textos secundarios, etiquetas y campos del formulario |

---

## Imágenes y recursos

| Archivo | Para qué sirve |
|---|---|
| `LOGO_FINAL.png` | Monograma del logo (aparece entre LIMITED y DROP) |
| `NOMBRE_FINAL.png` | Wordmark "CUSCUS" en tipografía gótica |
| `fondo.png` | Imagen de fondo del paisaje oscuro |

---

## Notas de diseño

- El efecto de grano de película y la viñeta oscura se aplican globalmente y le dan la estética cinematográfica característica.
- En móvil, los campos de texto tienen un tamaño especial para evitar que iOS Safari haga zoom automático al tocarlos.
- La fila **LIMITED · LOGO · DROP** usa un grid de tres columnas para garantizar que el logo quede siempre perfectamente centrado, sin importar el tamaño de pantalla.
- Todos los cambios de estado (nuevo registro, sold out, WhatsApp) se reflejan en pantalla al instante gracias a la conexión en tiempo real con el servidor.
