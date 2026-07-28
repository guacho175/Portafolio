# Arquitectura

**Estado:** CANÓNICO  
**Última verificación:** 2026-07-28

## Visión general

El portafolio es un sitio estático sin framework ni bundler. Vercel sirve directamente los archivos de la raíz.

```text
index.html
├── css/styles.css
├── js/main.js
├── data/data.json
└── assets/
```

## Flujo de datos

Al cargar `DOMContentLoaded`, `js/main.js` solicita `data/data.json` y renderiza perfil, estadísticas, Orbynex, proyectos, capacidades y contacto en elementos existentes de `index.html`.

```text
data/data.json → fetch() en js/main.js → mutación del DOM en index.html
```

Los IDs y clases consultados por JavaScript forman un contrato interno. Un cambio estructural en HTML debe revisar los selectores correspondientes en JavaScript y CSS.

## Responsabilidades

- `index.html`: semántica, secciones, formulario, metadatos y referencias a recursos.
- `css/styles.css`: tokens visuales, temas, responsive y animaciones.
- `js/main.js`: carga, renderizado, navegación, filtros, tema, animaciones y envío del formulario.
- `data/data.json`: contenido editable y enlaces de proyectos.
- `assets/`: favicon y vista previa social.

## Integraciones externas

- **Web3Forms:** recibe el formulario desde el navegador. Su clave de acceso es un identificador público de cliente.
- **Microsoft Clarity:** analítica cargada en `index.html`.
- **Google Fonts:** tipografías externas con fallbacks del sistema.

No existe backend propio, persistencia, API interna, migraciones ni autenticación.

## Desarrollo y despliegue

`levantar.ps1` localiza Python, selecciona un puerto entre `5500` y `5510`, abre el navegador y ejecuta `python -m http.server`.

La URL pública canónica es `https://portafolio.orbynexdigital.cl/` y el despliegue se realiza en Vercel.
