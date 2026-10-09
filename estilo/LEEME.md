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

1. **Hero (v4, 8 oct):** primero las pantallas; debajo, la leyenda de estados y luego el logo, la frase y los botones «Adquiere la suscripción» (lleva a Suscripción) y «Regístrate gratis».
   - **Computador, La Terminal:** diez módulos agrupados por estado.
     - **Ya disponible:** perfil y press kit, eventos.
     - **Beta, febrero de 2027:** gestor de contenidos, entrenamiento SEO, ENLACE academia, CRM.
     - **Próximamente:** convocatorias, perfil PRO, cobro, analítica.
     - Cada módulo abre una ventana con su estado, qué hace y algo para probar.
   - **Teléfono, La Guía:** pestañas de inicio, eventos, perfiles y contenidos (ya disponibles), más la entrada a la GuÍA (próximamente) y el perfil del artista con su press kit.
   - **Conexiones entre las pantallas:** publicar un evento o un contenido cambia La Guía; la frase del perfil se ve en el teléfono; pedir booking llega al CRM.
   - **Colores de estado:** cian para lo disponible (el segundo color de la marca), amarillo para las betas y gris para lo que viene.
   - **Datos reales** de lacuraduria.net en `img/demo/`, incluidos cuatro contenidos (`co-*.jpg`). En Analítica los datos son de ejemplo y la vista lo dice.
Desde el 8 oct la portada sigue la arquitectura «una plataforma, dos experiencias»: La Curaduría es la guía donde se descubre la cultura y La Terminal es el software con que la alimentan quienes la hacen.

2. **Qué es** (`#que-es`): «La cultura se descubre. La cultura se gestiona.» Dos tarjetas:
   - **La Guía** (cian): para quienes viven la cultura.
   - **La Terminal** (coral): para quienes hacen la cultura.
3. **La Guía** (`#la-guia`): «Encuentra algo que valga la pena vivir.» Mosaico con capturas: catálogo, directorio y contenidos.
4. **La Terminal** (`#la-terminal`): «Tu proyecto cultural, en un solo lugar.» Módulos por estado y «Adquiere la suscripción».
5. **Cómo funciona** (`#como-funciona`): publica, descubre, conecta, en una línea de metro de tres paradas.
6. **Visión** (`#vision`): «Menos ruido. Más cultura.»
6b. **Reconocimientos** (`#reconocimientos`): línea de tiempo.
   - **2025:** incubación con la Cámara de Comercio de Bogotá y selección para presentarse en el GoFest con uno de los pitch ganadores (sin cifras).
   - **2026:** aceleración BIME, Chapinero en Red y la beca de circulación internacional (segundo lugar nacional, 98 puntos; Bilbao, con el catálogo de artistas colombianos para agentes de España).
   - El respaldo salió de la visión. En La Terminal, la franja de respaldo resume esto y enlaza aquí.
7. **Aliados editoriales** (`#aliados`).
8. **Tienda** (`#tienda`): solo la camiseta. Es la misma ficha que en Suscripción; `CAMISETA_STOCK` vale para las dos.
9. **Cierre:** «¡Cambia el algoritmo por la curaduría!» y dos caminos: ¿Buscas cultura? / ¿Haces cultura?

Ocultas con `hidden`: la GuÍA como sección propia y los planes viejos. «Para quién» (pestañas) y «Crea tu perfil» salieron; sus textos quedaron en las tarjetas de «Qué es».

**Barra principal:** Explorar (lacuraduria.net), La Terminal (Suscripción), Tienda, Nosotros, Contacto e Ingresar.

En el pie: logo, «Media Tech Cultural» y la frase «Tecnología para la circulación de la cultura».

**Color:** el coral es el acento de las acciones. Los demás colores de la marca solo marcan tipos, como en lacuraduria.net: eventos coral, artistas y espacios cian, publicaciones verde y comunidad amarillo. Se usan en la ruta y en los marcadores de las tarjetas.

## Para actualizar las capturas

Se tomaron con Chrome sin ventana (puppeteer-core) a 390×844 y 1440×900, con pantalla de doble resolución. Si cambia el sitio, se repiten y se optimizan a JPEG con `sips`.

## La Terminal (`#terminal`; la pantalla sigue siendo `#pg-preventa`)

Desde el 8 oct es la página comercial del software. `#preventa` sigue funcionando por los enlaces de vuelta de Mercado Pago.

Sus bloques: hero → respaldo → beneficios (lo que recibes desde hoy) → módulos → cómo entrar → precio y registro → preguntas → cierre.
- **Módulos:** lo ya disponible, las betas de febrero que se abren al tocarlas, lo que viene y el enlace a la demo de la portada.
- **Cómo entrar:** del perfil gratis al año completo.
- **Precio y registro:** incluye la camiseta y «Empieza gratis».

### Antes: «Perfil fundador de La Terminal»

Desde el 8 oct es la página de venta de la preventa, en 9 bloques con una idea cada uno:
1. **Barra de la página:** fija bajo la barra principal. Es un `div`, porque los `<nav>` heredan la barra vieja.
2. **Hero:** con contador de cupos.
3. **El problema.**
4. **La Terminal:** 4 betas de febrero de 2027 que se abren al tocarlas, y «Después» sin fechas.
5. **Lo que recibes desde hoy:** más la insignia.
6. **Cómo funciona:** 4 pasos.
7. **Precio:** con la ficha de la camiseta.
8. **Preguntas:** 6.
9. **Cierre:** con «Tecnología para la circulación de la cultura».

La acción principal, «Reservar cupo», se repite en la barra, el hero, el precio y el cierre.

**Editables:**
- `CUPOS_DISPONIBLES`, en un `<script>` debajo de la página.
- El texto de reembolso: `data-editable="reembolso"` en las preguntas.
- El cobro: `api/crear-preferencia.js`, que cobra la primera mitad de $100.000 por Mercado Pago.

**Campaña BIME (8 oct):**
- **Gancho del hero:** «¿Sabías que existe un LinkedIn para artistas colombianos?».
- **Bloque «Respaldo»:** estímulo, Cámara de Comercio y BIME de Bilbao. Los logos van en `.t-fun-logos`, hoy oculto: solo los autorizados.
- **Paso 0 gratis:** «Sube tu perfil», con `data-subir-perfil` → lacuraduria.net/login.
- **Cuarto beneficio:** tu perfil en el catálogo que se presenta en el BIME, como objetivo y no como garantía.
- **Dos preguntas nuevas.**

La oferta: $200.000 COP en dos pagos de $100.000. Con la camiseta se paga $180.000 hoy y $100.000 después. No se mencionan «seguir» ni el contacto de bookers, porque todavía no existen.

**Camiseta LC23** (8 oct): es una ficha de producto (`#camiseta`), aparte de Mercado Pago.
- Se elige el precio: $80.000 con la suscripción, $90.000 sola en Bogotá o 35 € en Europa.
- Se elige el color (blanca o negra) y la talla (M, L o XL).
- «Comprar por WhatsApp» abre un mensaje con el pedido.
- El stock está en `CAMISETA_STOCK`, en un `<script>` de `index.html`: 20 unidades del primer pedido. Cuando se vende, se resta ahí; con 0, la talla sale agotada.
- La vista muestra la prenda con su estampado, de frente (logo vertical al pecho) y de espalda (diseño editorial).
- Los estampados son los PNG que pasó Nicolás el 8 oct: «Espalda-png-camiseta» y «Frente-png-camiseta-central-10cm-de-ancho». Están recortados en `img/camiseta/`, con una versión `-blanca` (tintas originales) y otra `-negra` (el gris pasa a crema y el coral se mantiene). El frente va centrado y a 10 cm de ancho.
- El número va en `CAMISETA_WHATSAPP` (573044138497). Si se deja vacío, el pedido sale por correo.

La política de reembolso todavía no está.
