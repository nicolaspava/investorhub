// api/crear-preferencia.js
// Vercel Serverless Function — Mercado Pago + Supabase

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const MP_ACCESS_TOKEN  = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_URL     = process.env.SUPABASE_URL;
  const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY;

  const { nombre, email } = req.body;
  // Primera mitad de la suscripción fundadora ($200.000). La camiseta se vende aparte, por WhatsApp.
  const monto = 100000;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y correo son requeridos' });
  }

  // 1. Guardar en Supabase con estado pendiente
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/preventa_compradores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      nombre,
      email,
      plan: 'profesional',   // la columna puede tener una lista cerrada de planes: se deja el valor que ya acepta
      monto,
      estado: 'pendiente',
    }),
  });

  const supaData = await supaRes.json();

  if (!supaRes.ok) {
    console.error('Supabase error:', supaData);
    return res.status(500).json({ error: 'Error guardando registro' });
  }

  const registroId = supaData[0]?.id;

  // A dónde vuelve la persona después de pagar: el mismo sitio desde donde pagó, si es uno nuestro.
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const nuestro = /^(lacuraduria\.com|www\.lacuraduria\.com|[a-z0-9-]+-la-curaduria\.vercel\.app|investor-hub-rust\.vercel\.app|localhost(:\d+)?)$/i.test(host);
  const base = nuestro ? (host.startsWith('localhost') ? 'http://' : 'https://') + host : 'https://lacuraduria.com';

  // 2. Crear preferencia en Mercado Pago
  const preferencia = {
    items: [
      { title: 'La Curaduría · Suscripción fundadora · Primera mitad', quantity: 1, unit_price: 100000, currency_id: 'COP' },
    ],
    payer: {
      name: nombre,
      email: email,
    },
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
    metadata: {
      registro_id: registroId,
      email: email,
    },
  };

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferencia),
  });

  const mpData = await mpRes.json();

  if (!mpRes.ok) {
    console.error('MP error:', mpData);
    return res.status(500).json({ error: 'Error creando preferencia de pago' });
  }

  // Guardar preference_id en Supabase
  await fetch(`${SUPABASE_URL}/rest/v1/preventa_compradores?id=eq.${registroId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ mp_preference_id: mpData.id }),
  });

  return res.status(200).json({
    checkout_url: mpData.init_point,
    preference_id: mpData.id,
    registro_id: registroId,
  });
}
