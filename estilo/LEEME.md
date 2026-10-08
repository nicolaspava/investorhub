# Landing · dirección «Cartel nocturno»

Rediseño de la portada de la landing (`index.html`, pantalla `#pg-home`) hecho con el *taste skill* el 7 oct 2026. Vive en la rama `diseno/taste-skill`. La versión que copia el sistema de la webapp, sin rediseño, está en la rama `diseno/sistema-webapp`.

| Archivo | Qué es |
|---|---|
| `estilo/landing.css` | Toda la dirección: paleta, tipografías, botones, barra y las ocho secciones. También redefine los valores de `ds/tokens.css`, para que las pantallas internas hereden lo mismo sin tocar su HTML. |
| `estilo/landing.js` | Revelado al entrar en pantalla, logo de la barra y pestañas de «Para quién». No escucha el scroll. |
| `fuentes/` | Bricolage Grotesque, Geist y Geist Mono (variables, subconjunto latino), alojadas aquí y no en Google Fonts. |
| `iconos/` | Íconos de Phosphor (regular). Van incrustados en el HTML. |
| `img/producto/` | Capturas reales de lacuraduria.net (7 oct 2026): inicio y perfil en el teléfono, cartelera, artista destacado y perfil en escritorio. |

## Reglas

- **Un tema:** oscuro en toda la página, con fondo casi negro (`#0C0C0B`), no negro puro. La marca abre en oscuro; no hay secciones invertidas.
- **Un acento:** el coral `#FF736C`. El cian solo vive dentro del logo. Los colores decorativos viejos (`--cyan`, `--purple`…) pasan a neutros.
- **Formas:** superficies e imágenes rectas; lo que se pulsa (botones, pestañas, campos) en píldora; los teléfonos con su curva de teléfono.
- **Tipografía:** Bricolage 800 en titulares, Geist en texto, Geist Mono solo en etiquetas.
- **Texto:** sin rayas largas (—). Se dejaron a propósito las del texto de confidencialidad del Investor Hub y las de los valores del formulario de inversión: lo primero es texto legal y lo segundo son datos que el formulario envía.

## Las ocho secciones de la portada

Hero partido con dos teléfonos · manifiesto con mosaico de tres celdas · índice de verbos · pestañas por público · chat que se escribe solo · banda de pantalla completa para artistas · planes asimétricos · cierre con el tagline. Los `id` de sección se conservan.

## Para actualizar las capturas

Se tomaron con Chrome sin ventana (puppeteer-core) a 390×844 y 1440×900, con pantalla de doble resolución. Si cambia el sitio, se repiten y se optimizan a JPEG con `sips`.
