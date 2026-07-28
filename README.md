# Portafolio de Christian Galindez

Sitio estático personal construido con HTML, CSS y JavaScript, desplegado en Vercel:

<https://portafolio.orbynexdigital.cl/>

## Estructura principal

- `index.html`: estructura y metadatos.
- `css/styles.css`: estilos, temas y diseño responsive.
- `js/main.js`: carga de datos, renderizado e interacciones.
- `data/data.json`: fuente editable del contenido.
- `assets/`: recursos visuales.
- `docs/`: estado y arquitectura vigentes.

## Desarrollo local

El sitio debe servirse por HTTP porque `js/main.js` carga `data/data.json` mediante `fetch()`.

En Windows:

```powershell
.\levantar.ps1
```

También se puede usar `levantar.bat` o `ABRIR_PORTAFOLIO.bat`. El script busca un puerto libre entre `5500` y `5510` y requiere Python 3 disponible como `python` o `py`.

## Cambiar contenido

Edita `data/data.json` para actualizar perfil, proyectos, capacidades, enlaces y datos de contacto. Los cambios estructurales pueden requerir ajustes coordinados en `index.html`, `js/main.js` y `css/styles.css`.

## Validación

```powershell
python scripts/check_repository.py
```

Después de cambios visuales o interactivos, levanta el sitio y revisa el flujo afectado en el navegador.

## Documentación

Consulta [docs/README.md](docs/README.md) para localizar las fuentes canónicas. La documentación histórica se conserva mediante Git y no se mantiene dentro del conjunto activo.
