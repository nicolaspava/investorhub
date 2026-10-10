// api/webhook-mp.js
// Recibe notificaciones de Mercado Pago y actualiza Supabase
import crypto from 'node:crypto';
import { PRECIO_MITAD, leerRegistro, actualizarRegistro, pagosAprobados, correosDeConfirmacion } from './_lib/preventa.js';

// Firma de Mercado Pago: x-signature = "ts=...,v1=..." y v1 es el HMAC-SHA256 de
// "id:{data.id};request-id:{x-request-id};ts:{ts};" con la clave secreta del webhook
// (panel de Mercado Pago → Webhooks → Clave secreta), guardada en la variable MP_WEBHOOK_SECRET.
function firmaValida(req, clave) {
  const firma = req.headers['x-signature'] || '';
  const requestId = req.headers['x-request-id'] || '';
  const partes = Object.fromEntries(
    String(firma).split(',').map((p) => p.split('=').map((x) => x.trim()))
  );
  // data.id viene en la dirección del aviso; si no, en el cuerpo. Los ids alfanuméricos van en minúscula.
  let dataId = (req.query && (req.query['data.id'] || req.query.id)) || req.body?.data?.id;
  if (!partes.ts || !partes.v1 || !dataId || !requestId) return false;
  dataId = String(dataId);
  if (/[a-z]/i.test(dataId)) dataId = dataId.toLowerCase();
  const canonica = `id:${dataId};request-id:${requestId};ts:${partes.ts};`;
  const esperada = crypto.createHmac('sha256', clave).update(canonica).digest('hex');
  return esperada.length === partes.v1.length &&
    crypto.timingSafeEqual(Buffer.from(esperada), Buffer.from(partes.v1));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

  // Sin firma válida no se toca nada. Si la clave aún no está configurada se sigue, porque el
  // estado del pago siempre se consulta a Mercado Pago con nuestro token y no se cree lo que dice el aviso.
  const claveFirma = process.env.MP_WEBHOOK_SECRET;
  if (claveFirma) {
    if (!firmaValida(req, claveFirma)) return res.status(401).json({ error: 'Firma inválida' });
  } else {
    console.warn('Falta la clave de firma del webhook: el aviso no se verificó');
  }

  const { type, data } = req.body || {};

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
    approved:     'aprobado',
    pending:      'pendiente',
    in_process:   'pendiente',
    rejected:     'rechazado',
    cancelled:    'cancelado',
    refunded:     'cancelado',   // devuelto: el detalle queda en mp_status
    charged_back: 'cancelado',
  };

  const nuevoEstado = estadoMap[status] || 'desconocido';

  // El mismo aviso puede llegar varias veces: el correo sale solo la primera vez que el pago queda aprobado.
  let antes;
  try { antes = await leerRegistro(registroId); }
  catch (e) { console.error(e); return res.status(500).json({ error: 'Error leyendo registro' }); }
  if (!antes) return res.status(200).json({ ok: true, ignorado: 'registro inexistente' });
  const recienAprobado = nuevoEstado === 'aprobado' && !antes.confirmado_at;

  // Actualizar en Supabase
  try {
    await actualizarRegistro(registroId, {
      estado: nuevoEstado,
      mp_payment_id: String(paymentId),
      mp_status: status,
      ...(recienAprobado ? { confirmado_at: date_approved || new Date().toISOString() } : {}),
    });
  } catch (e) {
    console.error('Error actualizando Supabase:', e);
    return res.status(500).json({ error: 'Error actualizando registro' });
  }

  if (recienAprobado) {
    // Primera o segunda mitad según cuántos pagos aprobados tenga ya este correo.
    try {
      const aprobados = await pagosAprobados(antes.email);
      const mitad = Math.max(1, aprobados.findIndex((r) => r.id === registroId) + 1 || aprobados.length);
      await correosDeConfirmacion({ nombre: antes.nombre, email: antes.email, mitad: Math.min(mitad, 2), monto: transaction_amount || PRECIO_MITAD });
    } catch (e) { console.error('Correo de confirmación:', e); }   // el pago ya quedó registrado; el correo no lo bloquea
  }

  console.log(`Pago ${paymentId} → ${nuevoEstado} · registro ${registroId}`);
  return res.status(200).json({ ok: true, estado: nuevoEstado });
}
