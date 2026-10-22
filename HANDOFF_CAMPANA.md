# Handoff · Campaña de mailing y alianzas para llenar de contenido Catálogo Q

Pega este archivo (o su enlace) al comenzar el chat nuevo. Antes de hacer nada, lee también `SESION.md` y `estilo/LEEME.md`.

## Quién y qué

- **Proyecto:** La Curaduría, una plataforma cultural de Bogotá. Tiene dos productos:
  - **Catálogo Q** (lacuraduria.net): el catálogo cultural, con Eventos, Páginas (artistas, espacios, colectivos y medios) y Publicaciones (reseñas, crónicas, sets y entrevistas). Lo acompaña **Sonar**, el copiloto cultural.
  - **Studio Q**: el software de gestión para proyectos culturales. Ya está disponible **Administrar**, con Páginas, Eventos, Publicaciones y Tienda. La preventa es el Plan Founder: 50 cupos, $200.000 COP pagados en dos mitades de $100.000, y el año arranca con el lanzamiento en marzo de 2027.
- **Landing:** lacuraduria.com, en producción (rama `main`; se trabaja en `diseno/taste-skill`). Las rutas útiles para la campaña son `/`, `/catalogo`, `/studio`, `/studio/precios`, `/contacto`, `/nosotros` y `/camiseta`.
- **Responsable:** Nicolás (lacuraduria23@gmail.com).

## Objetivo de esta campaña

Llenar Catálogo Q de contenido real: eventos, páginas y publicaciones. Para eso hay dos frentes:
1. **Mailing:** invitar a gestores culturales, espacios, colectivos, artistas y medios a crear su página gratis y publicar.
2. **Alianzas:** conseguir aliados editoriales con dos modelos, que ya aparecen en la landing (Studio Q → «Aliados editoriales»):
   - **Publican directamente:** el aliado crea su cuenta y sube sus artículos, eventos, entrevistas y lanzamientos.
   - **Nos autorizan a curar:** La Curaduría selecciona y publica su contenido con atribución, enlace a la fuente y un permiso por escrito.
   - Los logos de los aliados solo se muestran cuando autorizan su uso. En la landing hay un bloque oculto listo para ellos.

Objetivo secundario: convertir a una parte de esos aliados en fundadores (Plan Founder).

## Lo que hay para trabajar

- **Brevo:** Nicolás tiene una cuenta, útil para listas, envíos masivos y plantillas.
- **Avisos y hoja de contactos:** `api/_lib/preventa.js` (`enviar()`) y `google/aviso-correo.gs`. El script de Google todavía **no está instalado**: faltan `GOOGLE_SCRIPT_URL`, `GOOGLE_SCRIPT_CLAVE` y `CORREO_AVISOS` en Vercel.
- **Formulario de contacto:** `/contacto` → `api/contacto.js`. Pide consentimiento y tiene tipos de contacto.
- **Medición:** `estilo/medicion.js` lee los UTM (primer y último toque) y registra eventos (`lead_submit`, `sign_up_click`, `checkout_start`…). Los IDs de GA4 y Google Ads siguen vacíos. Cada enlace de la campaña debe llevar `utm_source`, `utm_medium=email` y `utm_campaign`.
- **Piezas existentes:** `campana/pieza-1-fundadores` y `campana/pieza-2-guia` (1080×1350). Los copys de la landing están en el documento «Copys de la landing».
- **Marca:** títulos en Space Grotesk bold, textos en Geist y etiquetas en Geist Mono. Colores: coral #FF736C, cian #75E6F9, fondo oscuro y crema #FFFFF6.

## Lo que se espera del chat nuevo

1. **Segmentos y lista:** quiénes son (espacios, colectivos, festivales, medios, sellos, artistas, gestores), dónde encontrarlos y una plantilla de hoja (nombre, tipo, contacto, fuente del dato, estado, consentimiento).
2. **Secuencia de correos:** 3 correos por segmento (invitación, recordatorio con valor, último llamado), con asunto, preheader y llamado claro: «Crea tu página gratis» o «Sé aliado editorial».
3. **Propuesta de alianza:** un one-pager con los dos modelos, lo que gana el aliado (visibilidad, tráfico, atribución, acceso a Studio Q) y un **permiso de curaduría** simple para firmar.
4. **Plantillas en Brevo:** HTML de correo con la marca, que funcione en Gmail y en el teléfono.
5. **Seguimiento:** tablero o hoja con enviados, abiertos, respuestas, páginas creadas y contenidos publicados.
6. **Opcional en la landing:** un formulario «Quiero ser aliado» (o un tipo nuevo en `/contacto`) y mostrar los logos de los aliados confirmados.

## Reglas que no cambian

- Todo en español y explicado en palabras simples, sin jerga.
- Commits como `nicolaspava <lacuraduria23@gmail.com>`. Se puede hacer push a la rama sin preguntar; publicar en `main` necesita el OK de Nicolás.
- El repo es **público**: nunca poner claves ni tokens en él ni en el chat.
- No escribir en las bases de datos de producción sin que Nicolás lo pida (leer sí se puede). No tocar el repo `webapp`.
- **Datos personales (Ley 1581 de Colombia):** solo escribir a contactos públicos o de trabajo, decir de dónde salió el dato, incluir siempre la opción de darse de baja y no comprar listas.
- No prometer lo que no existe todavía: «seguir perfiles» ni el contacto directo con bookers.
- Revisar todo en escritorio y en teléfono (390 px) antes de darlo por terminado.

## Decisiones abiertas para Nicolás

- ¿Qué segmento va primero? (Sugerencia: espacios y colectivos con agenda semanal, porque son los que más eventos traen.)
- ¿Quién firma los correos y desde qué correo salen? (¿lacuraduria23@gmail.com o un dominio propio verificado en Brevo?)
- ¿El aliado editorial recibe algo a cambio, como meses de Studio Q o descuento en el Plan Founder?
- La meta: ¿cuántos aliados y cuántos contenidos, y para qué fecha?
