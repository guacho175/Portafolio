# Arquitectura del Portafolio

## Descripcion general

Sitio estatico vanilla — sin frameworks de JavaScript ni bundler. Se sirve directamente desde el sistema de archivos o cualquier hosting estatico (GitHub Pages, Vercel, cPanel).

---

## Estructura de archivos

```
/
├── index.html              # Unico HTML. Toda la estructura del sitio.
├── css/
│   └── styles.css          # Estilos globales, variables, temas, responsivo.
├── js/
│   └── main.js             # Logica de UI, carga de datos, renderizado y formulario.
├── data/
│   └── data.json           # Fuente de verdad de contenido (perfil, proyectos, skills, contacto).
├── assets/
│   ├── img/                # Imagenes (og-preview.svg, proyectos).
│   └── icons/              # favicon.svg y otros iconos.
├── doc/
│   ├── arquitectura.md     # Este archivo.
│   └── estado-actual.md    # Ultimo estado registrado del sitio.
├── docs/                   # Carpeta existente de documentacion anterior.
└── CV_christian-andres-galindez-lastra (1).pdf
```

---

## Flujo de datos

```
data/data.json
      │
      ▼
js/main.js  (fetch() al cargar DOMContentLoaded)
      │
      ├── renderHero(data.perfil)
      ├── renderStats(data.stats)
      ├── renderVenture(data.orbynex)
      ├── renderProjects(data.proyectos)
      ├── renderSkills(data.skills)
      └── renderContact(data.contacto)
            │
            ▼
      Mutacion del DOM → index.html
```

El HTML tiene elementos con `id` especificos que el JS popula dinamicamente. No hay SSR ni hidratacion.

---

## Sistema de temas

El tema dark/light se controla con el atributo `data-theme` en `<body>`. El boton `#themeBtn` lo alterna y persiste en `localStorage`. Las variables CSS cambian segun el valor del atributo.

```css
:root { /* dark por defecto */ }
[data-theme="light"] { /* overrides */ }
```

---

## Secciones del sitio (en orden)

| ID          | Descripcion                                    |
|-------------|------------------------------------------------|
| `#top`      | Hero con headline, descripcion, botones y widget workbench |
| `#orbynex`  | Seccion de marca propia Orbynex Digital         |
| `#projects` | Grid de proyectos con filtro por tecnologia     |
| `#skills`   | 4 bloques de capacidades con chips de tecnologia|
| `#contacto` | Formulario Web3Forms centrado (max 640px)       |
| `footer`    | Brand, columnas de nav, email, redes, copyright |

---

## Formulario de contacto

- Proveedor: **Web3Forms** (`access_key` en el HTML, campo hidden).
- Validacion: cliente, en `validateContactPayload()` dentro de `main.js`.
- El campo `email` valida formato con regex en submit y en evento `blur`.
- Campo honeypot `botcheck` para evitar spam automatizado.
- Estado del formulario comunicado mediante `#form-status` con `aria-live="polite"`.

---

## Animaciones y efectos

| Efecto                  | Implementacion                                          |
|-------------------------|---------------------------------------------------------|
| Reveal on scroll        | `IntersectionObserver` + clase `.reveal` / `.show`      |
| Mouse tracking glow     | `mousemove` inyecta `<div class="card-glow">` por JS    |
| Contador de stats       | `animateStatNumber()` con `requestAnimationFrame`       |
| Nav activo por seccion  | `IntersectionObserver` en `setupActiveNav()`            |
| Marquee de tecnologias  | CSS `@keyframes marquee` en `.tech-marquee`             |
| Tema claro/oscuro       | Toggle `data-theme` + `localStorage`                    |

---

## Tokens de diseno (CSS variables)

| Variable          | Valor dark             | Descripcion              |
|-------------------|------------------------|--------------------------|
| `--bg`            | `#060f24`              | Fondo base               |
| `--surface`       | `#0c1b3a`              | Fondo de cards           |
| `--accent`        | `#00d4ff`              | Cian principal           |
| `--accent-2`      | `#1463ff`              | Azul secundario          |
| `--text`          | `#f0f4ff`              | Texto principal          |
| `--muted`         | `rgba(200,215,255,.68)`| Texto secundario         |
| `--line`          | `rgba(100,150,255,.12)`| Bordes y separadores     |
| `--radius`        | `10px`                 | Radio de bordes pequenos |
| `--radius-lg`     | `16px`                 | Radio de bordes grandes  |
| `--max`           | `1160px`               | Ancho maximo del container|

---

## Breakpoints responsivos

| Breakpoint | Descripcion                              |
|------------|------------------------------------------|
| `< 1100px` | Grid de proyectos pasa a 2 columnas      |
| `< 980px`  | Hero, venture y contact colapsan a 1 col |
| `< 720px`  | Estilos mobile generales, nav hamburguesa|
| `< 480px`  | Ajustes de tipografia y padding minimos  |

---

## Dependencias externas

- **Inter** — fuente via `font-family` (system fallback si no disponible).
- **Web3Forms** — API de formulario (`https://api.web3forms.com/submit`).
- Sin npm, sin bundler, sin framework.
