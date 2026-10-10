// api/contacto.js
// Formulario de contacto: valida, frena bots y avisa al equipo por correo (Gmail por el Google Script,
// Brevo o Resend: lo que esté configurado; ver api/_lib/preventa.js). Si el Google Script tiene una
// hoja configurada, también guarda el mensaje como una fila (google/aviso-correo.gs).
import { enviar, esc, normalizarCorreo, correoValido, CORREO_CONTACTO } from './_lib/preventa.js';

const TIPOS = ['Alianza o colaboración', 'Prensa y medios', 'Plan Fundadores', 'Subir un perfil o evento', 'Soporte técnico', 'Otro'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const b = req.body || {};

  // Bots: el campo «web» está oculto para personas; y nadie llena el formulario en menos de 3 segundos.
  if (b.web || (Number(b.ms) > 0 && Number(b.ms) < 3000)) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim().slice(0, 120);
  const email = normalizarCorreo(b.email);
  const tipo = TIPOS.includes(b.tipo) ? b.tipo : 'Otro';
  const mensaje = String(b.mensaje || '').trim().slice(0, 4000);
  const origen = String(b.origen || '').slice(0, 300);
  if (!nombre || !mensaje) return res.status(400).json({ error: 'Completa tu nombre y tu mensaje.' });
  if (!correoValido(email)) return res.status(400).json({ error: 'Escribe un correo válido.' });
  if (b.consentimiento !== true) return res.status(400).json({ error: 'Necesitamos tu autorización para tratar tus datos.' });

  const fecha = new Date().toISOString();
  const lineas = [`Nombre: ${nombre}`, `Correo: ${email}`, `Tipo: ${tipo}`, `Origen: ${origen || 'directo'}`, `Autorizó el tratamiento de datos: sí (${fecha})`, '', mensaje];
  const ok = await enviar({
    para: String(process.env.CORREO_AVISOS || CORREO_CONTACTO).split(',').map((c) => c.trim()).filter(Boolean),
    asunto: `Contacto: ${tipo} · ${nombre}`,
    texto: lineas.join('\n'),
    html: lineas.map((l) => `<p>${esc(l)}</p>`).join(''),
    responderA: email,
    fila: { hoja: 'Contactos', valores: [fecha, nombre, email, tipo, mensaje, origen, 'sí'] },
  });
  if (!ok) return res.status(502).json({ error: `No pudimos enviar tu mensaje. Escríbenos a ${CORREO_CONTACTO}.` });
  return res.status(200).json({ ok: true });
}
