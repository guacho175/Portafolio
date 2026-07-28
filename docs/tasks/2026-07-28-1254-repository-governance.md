# Gobernanza del repositorio

**Estado:** COMPLETADO  
**Creado:** 2026-07-28 12:54  
**Alcance:** gobernanza para agentes, documentación canónica y validación reproducible.

## Decisiones aprobadas

- Mantener una única implementación estática en la raíz.
- Retirar el prototipo `ideaparaportafolio/` y el CV.
- Mantener la clave pública de Web3Forms.
- Usar Git como historial, sin bitácoras Markdown compartidas.
- Crear `AGENTS.md`, documentación canónica, exclusiones, un validador sin dependencias y CI.
- No crear Skill, hooks, ADR ni changelog.

## Criterios de aceptación

- Las fuentes canónicas están indexadas y no contradicen la implementación.
- La aplicación raíz es inequívoca.
- Los artefactos obsoletos dejan de formar parte del árbol activo.
- `python scripts/check_repository.py` finaliza correctamente.
- El diff conserva los cambios autorizados y no incluye modificaciones fuera del alcance.

## Resultado

- Fuentes canónicas e instrucciones creadas.
- Prototipo, CV, logs y documentos redundantes retirados.
- Validador local y workflow de CI incorporados.
- Validación estructural, sintaxis Python, JSON y servidor local comprobados.
