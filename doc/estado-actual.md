# Estado actual del sitio

**Ultima actualizacion:** 2026-07-04
**Branch activo:** `frontend-redesign`
**Deploy:** Vercel — `portafolio-53ivpmxll-galindez.vercel.app`

---

## Resumen de la sesion actual

Esta sesion realizo un rediseno visual completo del portafolio desde el branch `main` clonado. Los cambios afectaron `index.html`, `css/styles.css`, `js/main.js` y `data/data.json`.

---

## Cambios aplicados (en orden cronologico)

### 1. Sistema de estilos (css/styles.css)
- Reescritura completa con efectos visuales modernos: hover lift en cards, borde glow cian, transiciones `cubic-bezier`.
- Mouse-tracking glow en `.project`, `.skill-block` y `.stat` via `<div class="card-glow">` inyectado por JS.
- Fondo del body con tres radial-gradients ambientales (cian, purpura, azul).
- Punto de estado pulsante (`@keyframes pulse-dot`) en hero y contacto.

### 2. Skills / Stack (data.json + js/main.js + css/styles.css)
- Las 10 categorias originales se agruparon en **4 bloques principales**.
- Nuevo layout: grilla de 2 columnas con bordes internos, numero de orden acento, chips de tecnologia.
- Selector `.capability-card` reemplazado por `.skill-block` en todo el codebase.

### 3. Footer (index.html + css/styles.css)
- Rediseno de franja plana a dos zonas: zona superior con brand/logo + columnas nav, barra inferior con copyright.
- Email movido al footer (columna Contacto), junto a LinkedIn y GitHub.

### 4. Seccion contacto (index.html + css/styles.css)
- Eliminado el `<aside>` completo (panel lateral con correo, canales y botones).
- Formulario centrado con `max-width: 640px`.
- Cabecera de seccion y encabezado del formulario alineados al centro.
- Badge "Web3Forms" eliminado.

### 5. Widget workbench / Hero (index.html + css/styles.css + data.json)
- Reemplazado el widget tecnico (JSON, endpoint REST, chat, pipeline) por tres pasos visuales con iconos SVG.
- `h1` reducido de `clamp(40px, 6.5vw, 78px)` a `clamp(30px, 3.8vw, 52px)`.
- Grid del hero cambiado a `1fr / 1fr` para que el workbench sea visible sin scroll.
- Padding del hero reducido de `80px 0 40px` a `48px 0 44px`.
- Headline simplificado: "Backend, automatizacion y productos web."
- "Backend developer" en nav traducido a "Desarrollador backend".

### 6. Proyectos (data.json + js/main.js)
- Texto "Demo" cambiado a "Ver" en todos los botones de proyectos.
- URL de DOS27 corregida: `https://dos27studiopublicitario.cl/`.
- `visual_labels` de NotiWilson traducidos al espanol.
- Live-badge "online" traducido a "activo".

### 7. Validacion del formulario (js/main.js)
- Regex de email fortalecido: requiere TLD de minimo 2 caracteres (`[a-zA-Z]{2,}`).
- Validacion en evento `blur` del campo email — el error aparece al salir del campo sin esperar el submit.

### 8. JS — funciones nuevas (js/main.js)
- `animateStatNumber()` — cuenta animada con ease-out cubico via `requestAnimationFrame`.
- `setupMouseGlow()` — inyecta `.card-glow` y escucha `mousemove` / `mouseleave`.
- `setupActiveNav()` — resalta link de nav segun seccion visible.
- `data-copy-email` — lee el email en tiempo de clic (no en registro) con fallback a `#contact-email`.

---

## Estado actual por archivo

| Archivo              | Estado         | Notas                                              |
|----------------------|----------------|----------------------------------------------------|
| `index.html`         | Modificado     | Estructura final limpia, sin aside de contacto     |
| `css/styles.css`     | Modificado     | ~1900 lineas, sin referencias a clases eliminadas  |
| `js/main.js`         | Modificado     | Funciones nuevas, validacion reforzada             |
| `data/data.json`     | Modificado     | 4 bloques de skills, URLs corregidas               |
| `doc/arquitectura.md`| Nuevo          | Documentacion de estructura y diseno               |
| `doc/estado-actual.md`| Nuevo         | Este archivo                                       |

---

## Pendiente / Posibles mejoras futuras

- Agregar transiciones de entrada mas elaboradas (por ejemplo, stagger por columna en los skill-blocks).
- Considerar shimmer/skeleton loader mientras `data.json` carga.
- Agregar micro-animacion al boton de submit del formulario (spinner mientras envia).
- Revisar accesibilidad de color en modo light (ratio de contraste del muted).
- Agregar `prefers-reduced-motion` check global para desactivar todas las animaciones en una sola regla.
