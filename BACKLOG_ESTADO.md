# Estado del backlog · landings de La Curaduría (10 oct 2026)

Rama `diseno/taste-skill`, en la vista previa de Vercel. **Nada está en producción hasta pasar a `main`.**
Leyenda: ✅ hecho en la rama · 🟡 parcial · ⛔ espera una decisión o un acceso de Nicolás.

| Historia | Estado | Qué hay / qué falta |
|---|---|---|
| US-01 Entender y elegir camino | ✅ | Hero «Cambia el algoritmo por la curaduría», Explorar la guía / Conocer La Terminal, bloque «Hoy y lo que viene» (`#estados`). |
| US-02 Cómo funciona | ✅ | Publicar · CONECTAR (centro) · Descubrir; en el teléfono, vertical. |
| US-03 Preventa, camiseta y registro | ✅ | En ese orden en la portada; cierre con «Quiero descubrir» / «Quiero publicar». |
| US-04 Landing de la guía | 🟡 | Teléfono con capturas reales, «Esta semana», categorías, funciones y bloque Disponible/Próximamente con enlaces reales (cartelera, directorio, contenidos, radio, publicar). El mapa ya no se presenta como disponible. Falta: verificar con una cuenta de prueba seguir/guardar/reseñas. |
| US-05 La Terminal | 🟡 | Hero con «Crear cuenta gratis» y «Ser Fundador», beneficios por estado, UTM guardadas. Falta: captura real del panel de administración. |
| US-06 / US-07 Planes | 🟡 | Gratis frente a Fundador en portada y en `/terminal/precios`, con precio, plazo, condiciones, preguntas y reembolso. Política de reembolso simplificada por Nicolás (10 oct); falta revisión de abogado. |
| US-08 Comprar la preventa | 🟡 | Mercado Pago, registro en Supabase, una sola confirmación por pago, aviso al equipo, origen (UTM) en el pago. ⛔ Correo: instalar el Google Script (`google/aviso-correo.gs`) o Brevo. ⛔ Compra de prueba. |
| US-09 Camiseta | 🟡 | Ficha con frente/espalda, tallas, stock y precio; pedido por WhatsApp (decisión del 8 oct). ⛔ Fotos reales, envío y cambios. El backlog pide pago en línea: decidir si se pasa a Mercado Pago. |
| US-10 Contacto | ✅ | Antes el formulario **no enviaba nada**; ahora va a `/api/contacto`: valida, frena bots, pide consentimiento, avisa por correo y (si se configura la hoja) guarda una fila. Se quitó el teléfono público. ⛔ Necesita el correo configurado (igual que US-08). |
| US-11 Nosotros | 🟡 | Texto de Nicolás (10 oct): qué es, botones de registro y Fundador, medios (Shock, VICE) e historia 2017–2027 en línea de tiempo. Falta: fotos del equipo y confirmar nombres de la radio («El Enegmigo»). |
| US-12 Navegación | ✅ | Barra como la de lacuraduria.net; rutas limpias `/terminal`, `/terminal/precios`, `/guia`, `/tienda`, `/contacto`, `/nosotros`, `/privacidad`; todos los botones con destino real (revisado con un script). |
| US-13 Medición | 🟡 | `estilo/medicion.js`: UTM y gclid guardados hasta el pago o el contacto; eventos landing_view, cta_click, sign_up_click, cta_fundadores, checkout_start, purchase_founders, lead_submit, shirt_order_click; `?prueba=1` excluye tus visitas. ⛔ IDs de Google Analytics 4 y Google Ads (las etiquetas `lc-ga4` y `lc-ads` en `index.html`). El registro gratuito ocurre en lacuraduria.net: medirlo allá. |
| US-14 Experiencia confiable | 🟡 | Título, descripción, Open Graph (`img/compartir.jpg`), robots. Revisado en 390 px y escritorio. Falta: QA completo del pago real. |

## Para activar Google Ads (Release Gate), en orden
1. Instalar el Google Script y cargar `GOOGLE_SCRIPT_URL`, `GOOGLE_SCRIPT_CLAVE` y `CORREO_AVISOS` en Vercel.
2. Pegar los IDs de Analytics y Ads en `index.html` (`lc-ga4`, `lc-ads`).
3. Aprobar la política de reembolso.
4. Publicar la rama en `main` y hacer una compra real de $100.000 que se reembolsa.
5. Anuncios a `https://lacuraduria.com/terminal` (o `/terminal/precios`) con UTM.
