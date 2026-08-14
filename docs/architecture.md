# Arquitectura

**Estado:** CANÓNICO  
**Última verificación:** 2026-07-28

## Visión general

El portafolio es un sitio estático sin framework ni bundler. Vercel sirve directamente los archivos de la raíz.

```text
index.html
├── css/styles.css
├── js/main.js
├── data/i18n/
│   ├── es.json
│   ├── en.json
│   └── pt.json
└── assets/
```

## Flujo de datos

Al cargar `DOMContentLoaded`, `js/main.js` determina el idioma desde `localStorage`, solicita `data/i18n/{lang}.json` y renderiza perfil, estadísticas, Orbynex, proyectos, capacidades y contacto en elementos existentes de `index.html`. 
La internacionalización incluye los atributos `data-i18n`, `data-i18n-placeholder` y `data-i18n-aria-label` en el HTML para mapear dinámicamente las claves de traducción, manteniendo el sistema 100% estático.

```text
data/i18n/{lang}.json → fetch() en js/main.js → mutación del DOM en index.html
```

Los IDs y clases consultados por JavaScript forman un contrato interno. Un cambio estructural en HTML debe revisar los selectores correspondientes en JavaScript y CSS.

## Responsabilidades

- `index.html`: estructura visual y nodos con atributos `data-i18n` para internacionalización.
- `css/styles.css`: tokens visuales, temas, responsive y animaciones.
- `js/main.js`: carga, renderizado de i18n y datos dinámicos, navegación, filtros, tema, animaciones y envío del formulario.
- `data/i18n/*.json`: contenido editable, traducciones, enlaces de proyectos y textos UI.
- `assets/`: favicon y vista previa social.

## Integraciones externas

- **Web3Forms:** recibe el formulario desde el navegador. Su clave de acceso es un identificador público de cliente.
- **Microsoft Clarity:** analítica cargada en `index.html`.
- **Google Fonts:** tipografías externas con fallbacks del sistema.

No existe backend propio, persistencia, API interna, migraciones ni autenticación.

## Desarrollo y despliegue

`levantar.ps1` localiza Python, selecciona un puerto entre `5500` y `5510`, abre el navegador y ejecuta `python -m http.server`.

La URL pública canónica es `https://portafolio.orbynexdigital.cl/` y el despliegue se realiza en Vercel.
