// api/crear-preferencia.js
// Vercel Serverless Function
// Crea una preferencia de pago en Mercado Pago y guarda el registro en Supabase

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY; // service role key (no la anon)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombre, email, plan } = req.body;

  if (!nombre || !email || !plan) {
    return res.status(400).json({ error: 'Faltan campos: nombre, email, plan' });
  }

  const precio = plan === 'profesional' ? 230000 : 0;

  // 1. Guardar registro en Supabase (estado: pendiente)
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/preventa_registros`, {
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
      plan,
      precio,
      estado: 'pendiente',
      fecha_registro: new Date().toISOString(),
    }),
  });

  const supaData = await supaRes.json();
  if (!supaRes.ok) {
    console.error('Supabase error:', supaData);
    return res.status(500).json({ error: 'Error guardando registro' });
  }

  const registroId = supaData[0]?.id;

  // Si es gratis, no necesita pago
  if (plan === 'basico') {
    // Actualizar estado a completado
    await fetch(`${SUPABASE_URL}/rest/v1/preventa_registros?id=eq.${registroId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ estado: 'completado' }),
    });
    return res.status(200).json({ tipo: 'gratis', registroId });
  }

  // 2. Crear preferencia en Mercado Pago
  const preferencia = {
    items: [{
      title: 'La Curaduría · Plan Profesional · Preventa 2026',
      quantity: 1,
      unit_price: precio,
      currency_id: 'COP',
    }],
    payer: {
      name: nombre,
      email: email,
    },
    external_reference: `${registroId}__${email}`,
    back_urls: {
      success: 'https://lacuraduria.net/#preventa?pago=ok',
      failure: 'https://lacuraduria.net/#preventa?pago=error',
      pending: 'https://lacuraduria.net/#preventa?pago=pendiente',
    },
    auto_return: 'approved',
    notification_url: 'https://lacuraduria.net/api/webhook-mp',
    statement_descriptor: 'LA CURADURIA',
    metadata: {
      registro_id: registroId,
      plan: plan,
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

  return res.status(200).json({
    tipo: 'pago',
    checkout_url: mpData.sandbox_init_point, // en producción: init_point
    preference_id: mpData.id,
    registroId,
  });
}
