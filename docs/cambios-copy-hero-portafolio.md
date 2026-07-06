# Cambios de copy en hero del portafolio

## 1. Resumen de cambios realizados

Se actualizo el copy principal de la primera pantalla para comunicar un perfil de desarrollador backend con capacidad full-stack practica, enfocado en productos web funcionales, APIs, integraciones y automatizaciones.

Tambien se reemplazo el contenido del panel derecho del hero por tres capacidades concretas: backend/APIs, productos web completos y automatizacion/integraciones. Se mantuvo la estructura visual general, la paleta, los botones y los anchors existentes.

## 2. Textos anteriores reemplazados

- Badge superior: `Abierto a roles backend, proyectos freelance y clientes Orbynex`
- Titulo principal: `Backend, automatizacion y productos web.`
- Descripcion: `Construyo APIs, sitios web, integraciones y flujos automatizados para que tu negocio opere mejor.`
- Label del panel derecho: `Que puedo hacer por ti`
- Titulo del panel derecho: `De la idea al producto funcionando.`
- Cards anteriores:
  - `Entiendo el problema`
  - `Construyo la solucion`
  - `Lo dejo funcionando`

## 3. Textos nuevos aplicados

- Badge superior: `Disponible para oportunidades TI, proyectos web y automatización`
- Titulo principal: `Desarrollador backend orientado a productos web completos.`
- Descripcion: `Creo sitios, paneles, APIs e integraciones funcionales para proyectos reales, negocios y procesos digitales.`
- Label del panel derecho: `QUÉ PUEDO CONSTRUIR`
- Titulo del panel derecho: `Soluciones web funcionales desde la lógica del negocio hasta el despliegue.`

Cards nuevas:

- `Backend y APIs`: `Desarrollo APIs, autenticación, roles, bases de datos y lógica de negocio para sistemas web.`
  Tags: `APIs`, `Auth`, `Base de datos`
- `Productos web completos`: `Construyo sitios, formularios, paneles administrativos y vistas responsive conectadas a datos reales.`
  Tags: `Web`, `Paneles`, `Responsive`
- `Automatización e integraciones`: `Integro formularios, correos, pagos, analítica, dashboards y flujos que reducen trabajo manual.`
  Tags: `Integraciones`, `Automatización`, `Deploy`

## 4. Archivos modificados

- `data/data.json`
- `index.html`
- `css/styles.css`

## 5. Notas de validacion responsive

Se valido el sitio localmente en `http://127.0.0.1:5500/` con viewports de 1280 px, 768 px y 375 px.

- El contenido nuevo carga correctamente desde `data/data.json`.
- No se detectaron errores de consola durante la carga.
- Los botones `Ver proyectos` y `Contactar` mantienen sus anchors correctos hacia `#projects` y `#contacto`.
- El documento no presenta overflow horizontal en los anchos revisados.
- En desktop y tablet, las tres cards mantienen altura alineada.
- En movil, el badge puede ocupar dos lineas sin romper el diseno.
- Se ajusto ligeramente el `line-height` del titulo del hero para dar mas aire al nuevo texto.
- Se ajusto el ancho de los tags en cards moviles para mejorar su alineacion y evitar compresion innecesaria.

## 6. Recomendaciones futuras

- Mantener el hero centrado en el perfil profesional personal y dejar Orbynex como respaldo o marca secundaria, no como mensaje principal.
- Evitar prometer seniority frontend; usar lenguaje como `productos web completos`, `vistas responsive`, `paneles` o `formularios conectados a datos`.
- Reforzar la coherencia entre portafolio laboral y servicios freelance usando el mismo eje: backend, APIs, integraciones, automatizacion y despliegue.
- Si se agregan nuevos proyectos, describirlos por problema resuelto, rol tecnico y resultado funcional, no solo por stack.
