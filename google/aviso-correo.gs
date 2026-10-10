// Google Apps Script: envía los correos de la preventa desde lacuraduria23@gmail.com.
// Cómo instalarlo (una sola vez):
//   1. Entra a script.google.com con lacuraduria23@gmail.com → Nuevo proyecto → pega este archivo.
//   2. Cambia CLAVE por una frase larga inventada (la misma va en Vercel como GOOGLE_SCRIPT_CLAVE).
//   3. Implementar → Nueva implementación → Tipo: Aplicación web.
//      Ejecutar como: Yo.  Quién tiene acceso: Cualquier persona.  → Implementar y autorizar.
//   4. Copia la URL que termina en /exec y ponla en Vercel como GOOGLE_SCRIPT_URL.
// Gmail gratis permite unos 100 correos al día: alcanza de sobra para la preventa.

var CLAVE = 'CAMBIA-ESTA-FRASE';

function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return responder({ ok: false, error: 'json' }); }
  if (d.clave !== CLAVE) return responder({ ok: false, error: 'clave' });
  var para = [].concat(d.para || []).join(',');
  if (!para || !d.asunto) return responder({ ok: false, error: 'faltan datos' });
  MailApp.sendEmail({
    to: para,
    subject: d.asunto,
    body: d.texto || '',
    htmlBody: d.html || undefined,
    name: d.nombre || 'La Curaduría',
    replyTo: d.responderA || undefined
  });
  return responder({ ok: true });
}

function responder(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
