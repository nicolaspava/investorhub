# Landing · dirección «Cartel nocturno»

Rediseño de la portada de la landing (`index.html`, pantalla `#pg-home`) hecho con el *taste skill* el 7 oct 2026. Vive en la rama `diseno/taste-skill`. La versión que copia el sistema de la webapp, sin rediseño, está en la rama `diseno/sistema-webapp`.

| Archivo | Qué es |
|---|---|
| `estilo/landing.css` | Toda la dirección: paleta, tipografías, botones, barra y las ocho secciones. También redefine los valores de `ds/tokens.css`, para que las pantallas internas hereden lo mismo sin tocar su HTML. |
| `estilo/demo.css`, `estilo/demo.js` | La demo del hero (8 oct): Pro en el computador y la GuÍA con un perfil en el teléfono, conectados. |
| `img/demo/` | Fotos de artistas y flyers de eventos reales de lacuraduria.net que usa la demo. |
| `estilo/landing.js` | Revelado al entrar en pantalla, logo de la barra y pestañas de «Para quién». No escucha el scroll. |
| `fuentes/` | Bricolage Grotesque, Geist y Geist Mono (variables, subconjunto latino), alojadas aquí y no en Google Fonts. |
| `iconos/` | Íconos de Phosphor (regular). Van incrustados en el HTML. |
| `img/producto/` | Capturas reales de lacuraduria.net (7 oct 2026): inicio y perfil en el teléfono, cartelera, artista destacado y perfil en escritorio. |

## Reglas

- **Un tema:** oscuro en toda la página, con fondo casi negro (`#0C0C0B`), no negro puro. La marca abre en oscuro; no hay secciones invertidas.
- **Acento:** el coral `#FF736C` en botones y acciones. Los demás colores de marca solo para codificar tipos (ver abajo). Los colores decorativos viejos (`--cyan`, `--purple`…) pasan a neutros.
- **Vidrio (8 oct):** paneles de vidrio esmerilado (desenfoque, filo de luz de 1px, brillo interior y sombra) sobre una capa fija de auras coral con grano. Lo llevan la barra (cápsula flotante), el mosaico, las pestañas y su panel, el chat, los planes, el marco de la captura de artistas, el bisel de los teléfonos y los botones secundarios. El botón principal sigue en coral lleno. Quien tiene activada la opción de reducir transparencias ve paneles sólidos.
- **Formas:** paneles de vidrio con esquinas de 20px, imágenes dentro a 14px, lo que se pulsa (botones, pestañas, campos) en píldora y los teléfonos con bisel. Las pantallas internas también se suavizan.
- **Caché:** la hoja y el script llevan `?v=AAAAMMDD` en `index.html`. Al cambiarlos hay que subir ese número, o el navegador sigue mostrando la versión vieja.
- **Tipografía:** Bricolage 800 en titulares, Geist en texto, Geist Mono solo en etiquetas.
- **Texto:** sin rayas largas (—). Se dejaron a propósito las del texto de confidencialidad del Investor Hub y las de los valores del formulario de inversión: lo primero es texto legal y lo segundo son datos que el formulario envía.

## La portada (versión del 8 oct)

1. **Hero:** arriba, el logo como titular y al lado «Una infraestructura de gestión y descubrimiento cultural.», la descripción y dos botones («Regístrate gratis» y «Ver la cartelera»). Debajo, la demo interactiva:
   - **Computador, La Curaduría Pro:** cuatro funciones. Cada una abre una ventana que la explica, dice si ya funciona y propone algo para probar.
     - **Ya disponibles:** el perfil como press kit, que va primero, y los eventos. El press kit reúne fotos, bio y editorial, rider y prensa para promotores, bookers y periodistas.
     - **Próximamente:** convocatorias y mensajes. Convocatorias tiene dos modos: «Me postulo», con convocatorias abiertas para postularse con el perfil y el press kit, y «Organizo», con las postulaciones para seleccionar.
     - Producción y comunicación se quitaron el 8 oct porque todavía no existen. Se dibuja en un lienzo fijo de 1000 × 640 que `demo.js` escala.
   - **Teléfono:** la GuÍA responde a tres sugerencias o a lo que se escriba, y abre el perfil de los artistas.
   - **Las dos pantallas están conectadas:** publicar el borrador en Pro lo anuncia la GuÍA; la frase del perfil que se edita en Pro cambia en el teléfono, donde el perfil muestra su press kit; pedir booking desde el perfil llega a Mensajes.
   - En teléfonos, primero va la GuÍA; Pro se ve en pequeño, con las funciones y su explicación fuera del lienzo.
   - Todo es local: la demo no envía nada.
2. **Funciones** (`#cambia-algo`): mosaico de tres celdas: catálogo de eventos, directorio de artistas, y recomendaciones y contenidos.
3. **Tu ruta cultural** (`#como-funciona`): línea de metro con los colores de la marca (Explora, Descubre, Guarda, Comparte) que se dibuja al entrar en pantalla.
4. **Para quién** (`#dolor-solucion`): «El ruido de las redes sociales…» y pestañas por público.
5. **GuÍA** (`#guia`): oculta con `hidden` hasta que exista; el HTML sigue ahí.
6. **Crea tu perfil** (`#artistas`): usuarios, artistas y gestores.
6b. **Aliados editoriales** (`#aliados`): socios de contenido, no patrocinadores. Muestra los dos modos (publican directamente o nos autorizan a curar), qué reciben y el botón «Quiero ser aliado editorial», que abre un correo. La lista de logos `.t-aliados-logos` está oculta: solo lleva aliados confirmados que hayan autorizado publicar su logo.
7. **Planes** (`#membresias`): ocultos con `hidden` mientras no funcionen.
8. **Cierre:** «¡Cambia el algoritmo por la curaduría!» y «Regístrate gratis».

En el pie: logo, «Media Tech Cultural» y la frase «Tecnología para la circulación de la cultura».

**Color:** el coral es el acento de las acciones. Los demás colores de la marca solo marcan tipos, como en lacuraduria.net: eventos coral, artistas y espacios cian, publicaciones verde y comunidad amarillo. Se usan en la ruta y en los marcadores de las tarjetas.

## Para actualizar las capturas

Se tomaron con Chrome sin ventana (puppeteer-core) a 390×844 y 1440×900, con pantalla de doble resolución. Si cambia el sitio, se repiten y se optimizan a JPEG con `sips`.

## Suscripción (pantalla `#pg-preventa`, 8 oct 2026)

Es la preventa fundadora que se cerró en el chat del pitch:
- **Oferta:** 30 cupos y $200.000 COP en dos mitades: $100.000 hoy y $100.000 antes de marzo de 2027.
- **Desde hoy:** perfil y press kit en la guía, difusión en redes, reseña e insignia de fundador.
- **Desde el lanzamiento (marzo de 2027):** un año con todo lo que se habilite durante ese año, más las betas desde febrero para quien pagó la segunda mitad.
- **Calendario:** de octubre de 2026 a después del lanzamiento.

El botón cobra la primera mitad: `api/crear-preferencia.js` crea la preferencia de Mercado Pago por $100.000. **Camiseta LC23** (8 oct): es una ficha de producto (`#camiseta`), aparte de Mercado Pago.
- Se elige el precio: $80.000 con la suscripción, $90.000 sola en Bogotá o 35 € en Europa.
- Se elige el color (blanca o negra) y la talla (M, L o XL).
- «Comprar por WhatsApp» abre un mensaje con el pedido.
- El stock está en `CAMISETA_STOCK`, en un `<script>` de `index.html`: 20 unidades del primer pedido. Cuando se vende, se resta ahí; con 0, la talla sale agotada.
- La vista muestra la prenda con su estampado, de frente (logo vertical al pecho) y de espalda (diseño editorial).
- Los estampados salen de las plantillas «Mesa de trabajo 1» (espalda) y «2» (pecho) que pasó Nicolás el 8 oct. Están recortados y aligerados en `img/camiseta/`, con una versión `-blanca` (tintas originales) y otra `-negra` (el gris pasa a crema y el coral se mantiene).
- El número va en `CAMISETA_WHATSAPP`. Mientras esté vacío, el pedido sale por correo.

La política de reembolso todavía no está.
