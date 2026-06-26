# Uso del portafolio

Este proyecto es un sitio estatico en HTML, CSS y JavaScript. Necesita levantarse con un servidor local porque `js/main.js` carga `data/data.json` usando `fetch()`.

## Levantar con doble clic

1. Abre la carpeta del proyecto.
2. Haz doble clic en `levantar.bat`.
3. El navegador se abrira automaticamente en una URL como:

```text
http://127.0.0.1:5500/
```

Si el puerto `5500` esta ocupado, el script intenta usar el siguiente puerto libre hasta `5510`.

Para detener el servidor, vuelve a la ventana que se abrio y presiona `Ctrl+C`.

## Levantar desde PowerShell

Desde esta carpeta ejecuta:

```powershell
.\levantar.ps1
```

Si PowerShell bloquea la ejecucion por politica de seguridad, usa el archivo `levantar.bat`, que ya ejecuta el script con `ExecutionPolicy Bypass` solo para esta corrida.

## Requisitos

- Windows con PowerShell.
- Python 3 instalado y disponible como `python` o `py`.

Puedes verificarlo con:

```powershell
python --version
```

## Editar contenido

La mayor parte del contenido visible esta en:

```text
data/data.json
```

Edita ese archivo para cambiar perfil, proyectos, skills, experiencia, links y datos de contacto.

## Archivos principales

- `index.html`: estructura del sitio.
- `css/styles.css`: estilos visuales y responsive.
- `js/main.js`: carga de datos, tema, filtros, menu movil y animaciones.
- `data/data.json`: contenido editable del portafolio.
- `levantar.bat`: arranque con doble clic.
- `levantar.ps1`: servidor local con Python.

## Problemas comunes

- Si abres `index.html` directamente y no se carga el contenido, levanta el sitio con `levantar.bat`.
- Si el navegador no abre solo, copia la URL que muestra la consola y pegala manualmente.
- Si aparece un error de Python, instala Python 3 desde `https://www.python.org/downloads/` y marca la opcion para agregarlo al `PATH`.
