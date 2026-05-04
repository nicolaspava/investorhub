// api/scrape-evento.js
// Vercel Serverless Function — Scraping de eventos con Claude
// Recibe: { url } o { imageBase64, imageType }
// Devuelve: JSON con los campos del evento

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { url, imageBase64, imageType } = req.body || {};
  if (!url && !imageBase64) {
    return res.status(400).json({ error: 'Se requiere url o imageBase64' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'API key no configurada' });

  // Build message content
  let content = [];

  if (imageBase64) {
    // Image mode (flyer)
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: imageType || 'image/jpeg',
        data: imageBase64
      }
    });
    content.push({
      type: 'text',
      text: `Extrae toda la información del flyer de este evento cultural y devuélvela ÚNICAMENTE como un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones.

El JSON debe tener exactamente estas claves (usa null si no encuentras el dato):
{
  "nombre": "nombre completo del evento",
  "fecha": "fecha en formato YYYY-MM-DD si es posible, o texto como aparece",
  "hora_ini": "hora de inicio en formato HH:MM (24h)",
  "hora_fin": "hora de cierre en formato HH:MM (24h)",
  "lugar": "nombre del venue o lugar",
  "ciudad": "ciudad donde se realiza",
  "direccion": "dirección si aparece",
  "categoria": "tipo de evento (concierto, fiesta, DJ set, festival, exposición, teatro, etc.)",
  "descripcion": "descripción breve si aparece algún texto descriptivo",
  "generos": ["array", "de", "géneros", "musicales", "o", "disciplinas"],
  "artistas": ["array", "de", "nombres", "de", "artistas"],
  "precio": "precio o rango de precios si aparece",
  "tipo_entrada": "libre o pago",
  "boleteria": "link de boletería si aparece",
  "ig_evento": "cuenta de instagram si aparece (@cuenta)"
}`
    });
  } else {
    // URL mode
    content.push({
      type: 'text',
      text: `Analiza este link de evento cultural: ${url}

No puedes acceder a URLs directamente, pero basándote en la URL y cualquier información que puedas inferir, devuelve ÚNICAMENTE un objeto JSON válido con esta estructura (usa null para los campos que no puedas determinar):
{
  "nombre": null,
  "fecha": null,
  "hora_ini": null,
  "hora_fin": null,
  "lugar": null,
  "ciudad": null,
  "direccion": null,
  "categoria": null,
  "descripcion": null,
  "generos": [],
  "artistas": [],
  "precio": null,
  "tipo_entrada": null,
  "boleteria": "${url}",
  "ig_evento": null,
  "_nota": "Link recibido. Por favor completa los campos manualmente o sube el flyer para extracción automática."
}

IMPORTANTE: Si la URL es de Instagram (instagram.com/p/...) intenta extraer el handle como ig_evento. Si es de RA (ra.co/events/...) es probable que sea un evento de música electrónica. Devuelve SOLO el JSON, nada más.`
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Error en Claude API: ' + err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';

    // Parse JSON from response
    let parsed;
    try {
      // Remove any markdown fences if present
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      return res.status(200).json({ error: 'No se pudo parsear la respuesta', raw: text });
    }

    return res.status(200).json({ ok: true, data: parsed });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
