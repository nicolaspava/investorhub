# Sistema de diseño (copia de la webapp)

La landing (`index.html`) usa el mismo sistema de diseño que lacuraduria.net. El sistema **no se mantiene aquí**: se mantiene en el repo `nicolaspava/webapp` y esta carpeta guarda una copia.

| Archivo | Qué es | ¿Se edita aquí? |
|---|---|---|
| `tokens.css` | Copia exacta de `design/tokens.css` de la webapp: colores, tipografías, espaciado, radios, vidrio y tema oscuro. | No |
| `componentes.css` | Las piezas de `src/app/globals.css` de la webapp que sirven fuera de Next: vidrio (`.lc-control`, `.lc-campo-form`, `.lc-tarjeta-vidrio`), auras, chips, degradé de marca, barra flotante, enlaces y barra de desplazamiento. | No |

En la rama `diseno/taste-skill` la landing no usa `ds/landing.css`: su capa propia es `estilo/landing.css` (ver `estilo/LEEME.md`).

Copiado del commit `1fe2c51` de `main` de la webapp (6 oct 2026).

## Cómo actualizarlo cuando cambie el sistema en la webapp

1. Copiar otra vez `design/tokens.css` de la webapp a `ds/tokens.css`, sin la cabecera de este repo.
2. Si cambiaron los componentes, repetir la extracción de `globals.css` (los bloques que lista la cabecera de `componentes.css`).
3. Actualizar el commit de origen en las cabeceras y en este archivo.
4. Abrir la landing y revisarla en escritorio y en móvil.

La webapp no se toca desde aquí.

## Reglas (las mismas de la webapp)

- Ningún color escrito a mano en el CSS: todo sale de una variable `--lc-*`. Queda una excepción a propósito: los tres puntos de colores de la ventana de Mac de una ilustración.
- Tema oscuro: `<html data-tema="oscuro">`. Fondo negro puro, texto crema `#FFFFF6`, coral y cian como acentos.
- Tres familias: Bricolage Grotesque (títulos), Inter (cuerpo y botones) y DM Mono (etiquetas, en mayúscula).
- Esquinas casi rectas (2px) en cajas y etiquetas. Píldoras para los botones de vidrio y 18px para los campos.

## Decisiones propias de la landing (en `landing.css`)

- Los nombres viejos de la landing (`--coral`, `--bg`, `--t1`… y `--f-display`, `--f-body`, `--f-mono`) siguen funcionando: apuntan a la capa semántica del sistema.
- `--t4` va al gris terciario y no al «deshabilitado» del sistema, porque en la landing pinta texto que se tiene que leer.
- `--purple` va al rosa (`--lc-extra`) y no al cian, para que los cinco públicos de «La solución» sigan teniendo un color distinto cada uno.
- Los botones pasaron de coral y cian llenos al vidrio del sitio. El principal es el vidrio claro (`.lc-control-primario`).
