# Traspaso de sesión · landing de La Curaduría (10 oct 2026)

Este documento es para seguir el trabajo en una sesión nueva (por ejemplo, Claude Code en la nube), que no tiene la memoria ni la conversación anteriores. **Léelo antes de tocar nada.** El detalle del diseño está en `estilo/LEEME.md`.

## Reglas de trabajo con Nicolás

- Todo en español: textos, comentarios y commits. Explicar en palabras simples, sin jerga.
- Commits como `nicolaspava <lacuraduria23@gmail.com>`; si no, Vercel no despliega.
- **Subir a la rama de trabajo (`diseno/taste-skill`) sin preguntar está bien** (decidido el 10 oct). Publicar sí exige su visto bueno explícito: publicar es pasar a `main`, y eso cambia lacuraduria.com.
- El aviso automático de «Unverified» (commits que no van a nombre de Claude) se ignora: los commits van a nombre de Nicolás para que Vercel despliegue.
- No tocar el repo `webapp`, porque hay otros desarrolladores trabajando ahí.
- Nunca poner claves o tokens en el repo (es **público**) ni en el chat.
- El único contacto público es el correo nicolas.pava@lacuraduria.net. El WhatsApp aparece solo en el botón de compra de la camiseta.
- No escribir en las bases de datos de producción sin que lo pida; leer sí se puede.
- Revisar en escritorio y en teléfono (390 px) antes de dar algo por terminado.

## Dónde está todo

- **Rama:** `diseno/taste-skill`. Producción (`main`, lacuraduria.com) **todavía tiene la versión vieja**, que cobra $230.000.
- **Vista previa de Vercel** (pide iniciar sesión en Vercel): https://investor-hub-git-diseno-taste-skill-la-curaduria.vercel.app
- **Para verla en local:** `python3 -m http.server 8400` en la raíz del repo, y abrir http://localhost:8400

## Qué hay hoy (tres páginas en `index.html`)

1. **Principal** (`#pg-home`, el pitch): hero con la escena de las dos pantallas → problema → solución → La Guía → La Terminal → reconocimientos 2025-2026 → tienda (camiseta) → «Regístrate gratis».
2. **La Guía** (`#la-guia`, para usuarios): demo del teléfono, «Esta semana en Bogotá», categorías (eventos, páginas, contenidos) y funciones en filas, al estilo de Shotgun.
3. **La Terminal** (`#terminal`, para gestores; la pantalla se llama `pg-preventa`): la demo completa, funciones en cuatro pilares, aliados, beneficios, calculadora de retorno, cómo entrar, precio con camiseta, preguntas, política de reembolso y cierre.

**Barra principal:** La Guía · La Terminal · Categorías · Preventa · Nosotros · Explorar la guía · Ingresar.

## La oferta (decidida por Nicolás)

- **Precio y cupos:** 50 cupos fundadores; $200.000 COP en dos mitades de $100.000. La primera es la reserva y la segunda se paga antes de marzo de 2027.
- **Cuándo rige:** el año de suscripción empieza con el lanzamiento, en marzo de 2027. Las betas salen en febrero de 2027: gestor de contenidos, entrenamiento SEO, ENLACE academia y CRM.
- **Camiseta LC23:**
  - Precio: $80.000 con la suscripción, $90.000 sola en Bogotá y 35 € en Europa.
  - Tallas M, L y XL; stock en `CAMISETA_STOCK` (20 unidades).
  - Se compra por WhatsApp, fuera de Mercado Pago.
- **Lo que no se promete:** «seguir perfiles» ni el contacto directo de bookers, porque no existen todavía.

## Cobro con Mercado Pago

- **Aplicación:** «Preventa Q Pro» (ID 7000243864178072). El webhook está registrado en `https://lacuraduria.com/api/webhook-mp` (evento: pagos).
- **Variables en Vercel (proyecto investor-hub):** `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `SUPABASE_URL` y `SUPABASE_SERVICE_KEY`.
- **El código:**
  - `api/crear-preferencia.js`: cobra la primera o la segunda mitad; la segunda solo con el correo de la primera.
  - `api/webhook-mp.js`: valida la firma, marca el pago y manda el correo de confirmación una sola vez.
  - `api/_lib/preventa.js`: lo que comparten los dos.
- **La tabla real** es `preventa_compradores`. El archivo `supabase-schema.sql` describe otra, vieja, que no existe.

## Pendientes

1. **Correo de confirmación:** que Nicolás cree una cuenta en Resend, verifique el dominio lacuraduria.com y cargue en Vercel `RESEND_API_KEY` y `CORREO_REMITENTE` (`La Curaduría <preventa@lacuraduria.com>`).
2. **Política de reembolso:** es una propuesta; revisarla, idealmente con abogado. La condición de «60 días sin beneficios» la propuso Claude y está por confirmar.
3. **Compra de prueba:** ya existen las cuentas de prueba (vendedor 3754973974, comprador 3755179732). Falta:
   1. sacar el token del vendedor de prueba;
   2. ponerlo en `MP_ACCESS_TOKEN` solo para Preview;
   3. pagar en la vista previa.

   La otra opción es una compra real después de publicar, y reembolsarla.
4. **Publicar:** pasar `diseno/taste-skill` a `main`, con el visto bueno explícito de Nicolás.
5. **Supuestos a confirmar:** los de la calculadora de retorno (por ejemplo, el +20 % de bookings) y algunos textos de ejemplo de las demos: cursos de ENLACE, lecciones de SEO y contactos del CRM.
6. **Contador de cupos:** hoy es manual (`CUPOS_DISPONIBLES = 50`).
7. **Archivo para el taller de estampado:** el PNG de la espalda de la camiseta trae un «RO» suelto que conviene borrar antes de mandarlo.

## Referencias de diseño

Tablero con capturas: https://claude.ai/artifact/SicKy2hmS6hujqehduy7yA (Shotgun, Resident Advisor, Bandsintown, Spotify for Artists, Patchline, NTS y otros).
