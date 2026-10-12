// api/comprar-camiseta.js
// Cobra la camiseta LC26 ($90.000, Colombia) con Mercado Pago. Europa (30 euros) se cuadra por WhatsApp.
// No escribe en Supabase: el pedido viaja en los metadatos del pago y el aviso de pago aprobado
// (api/webhook-mp.js) lo manda por correo al equipo y, si hay hoja configurada, a la pestaña «Ventas».
// El stock se descuenta a mano en CAMISETA_STOCK (index.html).
import { normalizarCorreo, correoValido } from './_lib/preventa.js';

export const PRECIO_CAMISETA = 90000;
const COLORES = ['negra', 'blanca'], TALLAS = ['M', 'L', 'XL'], ENTREGAS = ['virrey', 'servientrega'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const b = req.body || {};
  const nombre = String(b.nombre || '').trim().slice(0, 120);
  const email = normalizarCorreo(b.email);
  const celular = String(b.celular || '').replace(/[^\d+ ]/g, '').slice(0, 20);
  const color = COLORES.includes(b.color) ? b.color : null;
  const talla = TALLAS.includes(b.talla) ? b.talla : null;
  const entrega = ENTREGAS.includes(b.entrega) ? b.entrega : null;
  const direccion = String(b.direccion || '').trim().slice(0, 200);
  if (!nombre || !correoValido(email) || celular.replace(/\D/g, '').length < 7) return res.status(400).json({ error: 'Escribe tu nombre, un correo válido y tu celular.' });
  if (!color || !talla || !entrega) return res.status(400).json({ error: 'Elige color, talla y entrega.' });
  if (entrega === 'servientrega' && !direccion) return res.status(400).json({ error: 'Escribe la dirección y la ciudad para el envío.' });

  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const nuestro = /^(lacuraduria\.com|www\.lacuraduria\.com|[a-z0-9-]+-la-curaduria\.vercel\.app|localhost(:\d+)?)$/i.test(host);
  const base = nuestro ? (host.startsWith('localhost') ? 'http://' : 'https://') + host : 'https://lacuraduria.com';

  const preferencia = {
    items: [{ title: `Camiseta LC26 · ${color} · talla ${talla}`, quantity: 1, unit_price: PRECIO_CAMISETA, currency_id: 'COP' }],
    payer: { name: nombre, email },
    external_reference: `camiseta-${Date.now()}`,
    back_urls: {
      success: `${base}/?pago=ok&producto=camiseta`,
      failure: `${base}/?pago=error&producto=camiseta`,
      pending: `${base}/?pago=pendiente&producto=camiseta`,
    },
    auto_return: 'approved',
    notification_url: 'https://lacuraduria.com/api/webhook-mp',
    statement_descriptor: 'LA CURADURIA',
    metadata: { producto: 'camiseta', nombre, email, celular, color, talla, entrega, direccion, utm: String(b.utm || '').slice(0, 300) },
  };
  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    body: JSON.stringify(preferencia),
  });
  const d = await r.json();
  if (!r.ok) { console.error('Mercado Pago camiseta:', d); return res.status(502).json({ error: 'No pudimos abrir Mercado Pago. Intenta de nuevo o compra por WhatsApp.' }); }
  return res.status(200).json({ checkout_url: d.init_point });
}
