# Instrucciones para agentes

## Alcance y fuentes

- La aplicación productiva está en la raíz: `index.html`, `css/`, `js/`, `data/` y `assets/`.
- Lee primero `README.md`. Usa `docs/README.md` para localizar únicamente la documentación relacionada con la tarea.
- `docs/PROJECT_STATE.md` es la única fuente documental del estado actual.
- `docs/architecture.md` describe la arquitectura. El código vigente prevalece si aparece una contradicción; corrige la documentación en el mismo cambio.
- No recorras normalmente `.git/`, medios, logs, dependencias, builds, cachés ni planes de tareas ajenas.

## Comandos oficiales

- Desarrollo local en Windows: `.\levantar.ps1` o `.\levantar.bat`.
- Validación del repositorio: `python scripts/check_repository.py`.
- No hay comandos de test, lint o build para la aplicación estática.

## Implementación

- Mantén los cambios dentro del alcance solicitado y evita dependencias nuevas.
- Revisa `git status` y el diff antes de editar. Conserva cambios ajenos y no reviertas archivos que no controla tu tarea.
- Edita `data/data.json` para contenido. Mantén sincronizados los IDs de `index.html` consumidos por `js/main.js`.
- No leas, imprimas ni versiones secretos, archivos `.env`, logs o datos personales.

## Impacto documental obligatorio

En toda tarea de implementación:

1. Identifica el código afectado y si cambia comportamiento, contratos, comandos, configuración, arquitectura, datos, dependencias, despliegue, seguridad o flujo operativo.
2. Localiza solamente la documentación relacionada mediante `docs/README.md`.
3. Actualízala en el mismo cambio cuando exista impacto comprobable.
4. Ejecuta `python scripts/check_repository.py` y las validaciones específicas de la tarea.
5. Revisa el diff final.

No modifiques documentación por cambios internos sin impacto verificable.

## Tareas concurrentes

- No uses un `PLAN.md` compartido.
- Crea `docs/tasks/AAAA-MM-DD-HHMM-descripcion.md` solo para tareas largas o que continúen entre sesiones.
- Usa ramas o worktrees independientes cuando varios agentes implementen en paralelo.
- Un plan de tarea no reemplaza `PROJECT_STATE.md` ni funciona como historial permanente.

## Definición de terminado

- El cambio solicitado funciona y está acotado.
- Las validaciones relacionadas pasan.
- Código y fuentes canónicas no se contradicen.
- El reporte final enumera archivos cambiados, validaciones ejecutadas y documentación actualizada, o declara “sin impacto documental” con justificación.
