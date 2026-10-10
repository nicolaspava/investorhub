// api/_lib/preventa.js
// Lo que comparten el cobro (crear-preferencia) y el aviso de pago (webhook-mp):
// la tabla preventa_compradores en Supabase y el correo de confirmación.
// Los archivos con «_» delante no son rutas públicas en Vercel.

export const PRECIO_MITAD = 100000;     // cada mitad de la suscripción fundadora ($200.000 en total)
export const CORREO_CONTACTO = 'nicolas.pava@lacuraduria.net';

function cabeceras() {
  const key = process.env.SUPABASE_SERVICE_KEY;
  return { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` };
}
const tabla = () => `${process.env.SUPABASE_URL}/rest/v1/preventa_compradores`;

export function normalizarCorreo(email) {
  return String(email || '').trim().toLowerCase();
}
export function correoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Pagos aprobados de una persona (cada fila aprobada es una mitad pagada).
export async function pagosAprobados(email) {
  const r = await fetch(`${tabla()}?email=eq.${encodeURIComponent(email)}&estado=eq.aprobado&select=id,nombre,created_at&order=created_at.asc`, { headers: cabeceras() });
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  return r.json();
}

export async function crearRegistro(datos) {
  const r = await fetch(tabla(), {
    method: 'POST',
    headers: { ...cabeceras(), Prefer: 'return=representation' },
    body: JSON.stringify(datos),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${JSON.stringify(d)}`);
  return d[0];
}

export async function leerRegistro(id) {
  const r = await fetch(`${tabla()}?id=eq.${encodeURIComponent(id)}&select=id,nombre,email,estado,confirmado_at`, { headers: cabeceras() });
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  return (await r.json())[0] || null;
}

export async function actualizarRegistro(id, cambios) {
  const r = await fetch(`${tabla()}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: cabeceras(),
    body: JSON.stringify({ ...cambios, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
}

// ── Correo ───────────────────────────────────────────────────────────────────
// Se envía con Resend (resend.com) si está configurada RESEND_API_KEY. Sin ella no se envía nada
// y el pago sigue su curso: Mercado Pago ya le manda su propio comprobante a quien paga.
// CORREO_REMITENTE debe ser de un dominio verificado en Resend, p. ej. «La Curaduría <preventa@lacuraduria.com>».
async function enviar({ para, asunto, html, texto, responderA }) {
  const clave = process.env.RESEND_API_KEY;
  if (!clave) { console.warn('Correo sin enviar: falta RESEND_API_KEY'); return false; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clave}` },
    body: JSON.stringify({
      from: process.env.CORREO_REMITENTE || 'La Curaduría <preventa@lacuraduria.com>',
      to: [para],
      reply_to: responderA || CORREO_CONTACTO,
      subject: asunto,
      html,
      text: texto,
    }),
  });
  if (!r.ok) { console.error('Resend', r.status, await r.text()); return false; }
  return true;
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pesos = (n) => '$' + Number(n).toLocaleString('es-CO');

// Confirmación al comprador (primera o segunda mitad) y aviso al equipo.
export async function correosDeConfirmacion({ nombre, email, mitad, monto }) {
  const primera = mitad === 1;
  const asunto = primera ? 'Tu cupo de fundador en La Terminal está reservado' : 'Pagaste la segunda mitad: tu suscripción fundadora está completa';
  const cuerpo = primera
    ? [`Hola ${nombre}:`,
       `Recibimos tu pago de ${pesos(monto)}. Tu cupo de perfil fundador en La Terminal quedó reservado.`,
       'Desde hoy: tu perfil compartido en nuestras redes, una reseña de tu proyecto en la plataforma, tu perfil y tu press kit en La Guía y la insignia de fundador.',
       `Te falta la segunda mitad (${pesos(PRECIO_MITAD)}). Puedes pagarla cuando quieras antes de marzo de 2027 en lacuraduria.com/#terminal, con este mismo correo. Si la pagas antes de febrero, pruebas las betas desde su primera salida.`,
       'Tienes 5 días hábiles desde hoy para arrepentirte y pedir la devolución completa.']
    : [`Hola ${nombre}:`,
       `Recibimos tu pago de ${pesos(monto)}. Con esto tu suscripción fundadora está completa: un año de La Terminal desde el lanzamiento, en marzo de 2027, con todo lo que se habilite durante tu año.`,
       'Te avisaremos por este correo cuando salga cada beta.'];
  const cierre = `Si tienes cualquier pregunta, responde este correo o escríbenos a ${CORREO_CONTACTO}.`;
  const html = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#141413;max-width:560px">
    ${cuerpo.map((p) => `<p>${esc(p)}</p>`).join('')}
    <p>${esc(cierre)}</p>
    <p style="color:#77746C;font-size:14px">La Curaduría · Tecnología para la circulación de la cultura.</p></div>`;
  const texto = [...cuerpo, cierre, '', 'La Curaduría · Tecnología para la circulación de la cultura.'].join('\n\n');

  const alComprador = await enviar({ para: email, asunto, html, texto });
  await enviar({
    para: process.env.CORREO_AVISOS || CORREO_CONTACTO,
    asunto: `Preventa: ${nombre} pagó la ${primera ? 'primera' : 'segunda'} mitad`,
    texto: `${nombre} (${email}) pagó ${pesos(monto)}: ${primera ? 'primera' : 'segunda'} mitad de la suscripción fundadora.`,
    html: `<p>${esc(nombre)} (${esc(email)}) pagó ${pesos(monto)}: ${primera ? 'primera' : 'segunda'} mitad de la suscripción fundadora.</p>`,
    responderA: email,
  });
  return alComprador;
}
