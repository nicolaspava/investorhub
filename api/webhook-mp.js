// api/webhook-mp.js
// Recibe notificaciones de Mercado Pago y actualiza Supabase

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_URL    = process.env.SUPABASE_URL;
  const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_KEY;

  const { type, data } = req.body;

  // Solo procesar notificaciones de pago
  if (type !== 'payment') {
    return res.status(200).json({ ok: true, ignorado: type });
  }

  const paymentId = data?.id;
  if (!paymentId) return res.status(400).json({ error: 'Sin payment id' });

  // Consultar el pago en Mercado Pago
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
    external_reference,
    payer,
    transaction_amount,
    date_approved,
  } = pago;

  const registroId = external_reference;

  if (!registroId) {
    console.error('Sin registroId en external_reference:', external_reference);
    return res.status(200).json({ ok: true });
  }

  const estadoMap = {
    approved:   'aprobado',
    pending:    'pendiente',
    in_process: 'pendiente',
    rejected:   'rechazado',
    cancelled:  'cancelado',
  };

  const nuevoEstado = estadoMap[status] || 'desconocido';

  // Actualizar en Supabase
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/preventa_compradores?id=eq.${registroId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      estado: nuevoEstado,
      mp_payment_id: String(paymentId),
      mp_status: status,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!supaRes.ok) {
    const err = await supaRes.json();
    console.error('Error actualizando Supabase:', err);
    return res.status(500).json({ error: 'Error actualizando registro' });
  }

  console.log(`Pago ${paymentId} → ${nuevoEstado} · registro ${registroId}`);
  return res.status(200).json({ ok: true, estado: nuevoEstado });
}
