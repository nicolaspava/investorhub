// api/crear-preferencia.js
// Vercel Serverless Function — Mercado Pago + Supabase
// Cobra una mitad de la suscripción fundadora ($100.000 cada una, $200.000 en total).
//   mitad 1 (reserva): nombre + correo.
//   mitad 2: solo el correo con que se pagó la primera; se comprueba que esté aprobada.
// La camiseta se vende aparte, por WhatsApp.
import { PRECIO_MITAD, normalizarCorreo, correoValido, pagosAprobados, crearRegistro, actualizarRegistro } from './_lib/preventa.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const mitad = Number(req.body?.mitad) === 2 ? 2 : 1;
  const email = normalizarCorreo(req.body?.email);
  let nombre = String(req.body?.nombre || '').trim().slice(0, 120);

  if (!correoValido(email)) return res.status(400).json({ error: 'Escribe un correo válido.' });

  // ¿Cuántas mitades lleva pagadas este correo?
  let pagadas;
  try { pagadas = await pagosAprobados(email); }
  catch (e) { console.error(e); return res.status(500).json({ error: 'No pudimos revisar tus pagos. Intenta de nuevo.' }); }

  if (mitad === 1) {
    if (!nombre) return res.status(400).json({ error: 'Escribe tu nombre.' });
    if (pagadas.length >= 1) return res.status(409).json({ error: 'Ese correo ya tiene su cupo reservado. Si quieres pagar la segunda mitad, usa «Pagar la segunda mitad».' });
  } else {
    if (pagadas.length === 0) return res.status(409).json({ error: 'No encontramos una reserva pagada con ese correo. Usa el mismo correo con que pagaste la primera mitad.' });
    if (pagadas.length >= 2) return res.status(409).json({ error: 'Ya pagaste las dos mitades. Tu suscripción está completa.' });
    nombre = pagadas[0].nombre || nombre || email;
  }

  // 1. Guardar en Supabase con estado pendiente
  let registro;
  try {
    registro = await crearRegistro({
      nombre,
      email,
      plan: 'profesional',   // la columna puede tener una lista cerrada de planes: se deja el valor que ya acepta
      monto: PRECIO_MITAD,
      estado: 'pendiente',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'No pudimos guardar tu registro. Intenta de nuevo.' });
  }
  const registroId = registro.id;

  // A dónde vuelve la persona después de pagar: el mismo sitio desde donde pagó, si es uno nuestro.
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const nuestro = /^(lacuraduria\.com|www\.lacuraduria\.com|[a-z0-9-]+-la-curaduria\.vercel\.app|investor-hub-rust\.vercel\.app|localhost(:\d+)?)$/i.test(host);
  const base = nuestro ? (host.startsWith('localhost') ? 'http://' : 'https://') + host : 'https://lacuraduria.com';

  // 2. Crear preferencia en Mercado Pago
  const preferencia = {
    items: [{
      title: `La Curaduría · Suscripción fundadora · ${mitad === 1 ? 'Primera' : 'Segunda'} mitad`,
      quantity: 1,
      unit_price: PRECIO_MITAD,
      currency_id: 'COP',
    }],
    payer: { name: nombre, email },
    external_reference: `${registroId}`,
    back_urls: {
      // El parámetro va en la búsqueda (?pago=), no en el #: la página lo lee de location.search
      // y Mercado Pago agrega sus propios parámetros detrás.
      success: `${base}/?pago=ok`,
      failure: `${base}/?pago=error`,
      pending: `${base}/?pago=pendiente`,
    },
    auto_return: 'approved',
    // Los avisos van siempre al sitio publicado: las vistas previas de Vercel piden inicio de sesión y Mercado Pago no entra.
    notification_url: 'https://lacuraduria.com/api/webhook-mp',
    statement_descriptor: 'LA CURADURIA',
    metadata: { registro_id: registroId, email, mitad },
  };

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    body: JSON.stringify(preferencia),
  });
  const mpData = await mpRes.json();
  if (!mpRes.ok) {
    console.error('MP error:', mpData);
    return res.status(500).json({ error: 'No pudimos conectar con Mercado Pago. Intenta de nuevo.' });
  }

  // Guardar preference_id en Supabase
  try { await actualizarRegistro(registroId, { mp_preference_id: mpData.id }); }
  catch (e) { console.error(e); }

  return res.status(200).json({ checkout_url: mpData.init_point, preference_id: mpData.id, registro_id: registroId });
}
