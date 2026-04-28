// api/webhook-mp.js
// Recibe notificaciones de Mercado Pago y actualiza Supabase

const MP_ACCESS_TOKEN  = process.env.MP_ACCESS_TOKEN;
const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, data } = req.body;

  // MP manda diferentes tipos — solo nos interesan los pagos
  if (type !== 'payment') {
    return res.status(200).json({ ok: true, ignorado: type });
  }

  const paymentId = data?.id;
  if (!paymentId) return res.status(400).json({ error: 'Sin payment id' });

  // Consultar el pago en MP para obtener los detalles reales
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
  });

  const pago = await mpRes.json();

  if (!mpRes.ok) {
    console.error('Error consultando pago:', pago);
    return res.status(500).json({ error: 'Error consultando pago en MP' });
  }

  const {
    status,
    external_reference, // "registroId__email"
    payer,
    transaction_amount,
    date_approved,
  } = pago;

  // Extraer registroId del external_reference
  const registroId = external_reference?.split('__')[0];

  if (!registroId) {
    console.error('Sin registroId en external_reference:', external_reference);
    return res.status(200).json({ ok: true }); // devolver 200 para que MP no reintente
  }

  // Mapear estado de MP a nuestro estado
  const estadoMap = {
    approved:   'pagado',
    pending:    'pendiente_pago',
    in_process: 'pendiente_pago',
    rejected:   'rechazado',
    cancelled:  'cancelado',
  };

  const nuevoEstado = estadoMap[status] || 'desconocido';

  // Actualizar en Supabase
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/preventa_registros?id=eq.${registroId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      estado: nuevoEstado,
      mp_payment_id: paymentId,
      mp_payer_email: payer?.email,
      fecha_pago: date_approved || null,
      monto_pagado: transaction_amount,
    }),
  });

  if (!supaRes.ok) {
    const err = await supaRes.json();
    console.error('Error actualizando Supabase:', err);
    return res.status(500).json({ error: 'Error actualizando registro' });
  }

  console.log(`Pago ${paymentId} → ${nuevoEstado} para registro ${registroId}`);
  return res.status(200).json({ ok: true, estado: nuevoEstado });
}
