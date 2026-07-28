# Estado actual del proyecto

**Estado:** CANÓNICO  
**Última verificación:** 2026-07-28

## Producción

- Despliegue: Vercel.
- URL canónica: `https://portafolio.orbynexdigital.cl/`.
- Implementación productiva: sitio estático ubicado en la raíz del repositorio.

## Stack

- HTML, CSS y JavaScript vanilla.
- Contenido estructurado en `data/data.json`.
- Python 3 únicamente para el servidor local de desarrollo.
- Web3Forms como servicio externo para el formulario de contacto.
- Fuentes de Google y Microsoft Clarity cargadas desde el cliente.

## Operación

- Desarrollo local: `.\levantar.ps1` o `.\levantar.bat`.
- Validación: `python scripts/check_repository.py`.
- No existe una API propia, base de datos, migraciones, build de producción ni suite automatizada de pruebas.
- Vercel despliega los archivos estáticos de la raíz.

## Límites vigentes

- La disponibilidad de fuentes, analítica y formulario depende de servicios externos.
- La validación automatizada cubre estructura y consistencia determinista; los cambios visuales requieren revisión en navegador.
