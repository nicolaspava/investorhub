// api/scrape-perfil.js
// Vercel Serverless Function — Scraping de perfiles con Claude
// Recibe: { url } o { imageBase64, imageType } o { docBase64, docType }
// Devuelve: JSON con los campos del perfil

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { url, imageBase64, imageType, docBase64, docType } = req.body || {};
  if (!url && !imageBase64 && !docBase64) {
    return res.status(400).json({ error: 'Se requiere url, imageBase64 o docBase64' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'API key no configurada' });

  const prompt = `Extrae toda la información de perfil artístico/cultural de este contenido y devuélvela ÚNICAMENTE como un objeto JSON válido, sin texto adicional, sin markdown.

El JSON debe tener exactamente estas claves (usa null si no encuentras el dato):
{
  "tipo": "tipo de perfil (DJ, Banda, Cantautor/a, Productor/a, Colectivo, Venue/Club, Festival, Sello, Artista visual, Gestor cultural, Otro)",
  "nombre": "nombre artístico o del proyecto",
  "ciudad": "ciudad base",
  "pais": "país",
  "bio": "biografía o descripción del artista/proyecto",
  "generos": ["array", "de", "géneros", "o", "disciplinas"],
  "formato": "formato de presentación (Live set, DJ set, Concierto, etc.)",
  "ig": "cuenta de instagram (@cuenta)",
  "spotify": "URL de Spotify",
  "soundcloud": "URL de SoundCloud",
  "youtube": "URL de YouTube",
  "ra": "URL de Resident Advisor",
  "trayectoria": [
    { "year": "2024", "evento": "nombre del evento o logro", "lugar": "lugar o descripción" }
  ]
}`;

  let content = [];

  if (imageBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: imageType || 'image/jpeg', data: imageBase64 } });
    content.push({ type: 'text', text: prompt });
  } else if (docBase64) {
    content.push({ type: 'document', source: { type: 'base64', media_type: docType || 'application/pdf', data: docBase64 } });
    content.push({ type: 'text', text: prompt });
  } else {
    // URL — extract what we can from the URL structure
    content.push({
      type: 'text',
      text: `Analiza este link de perfil artístico: ${url}

Basándote en la estructura de la URL (puede ser Instagram, Spotify, SoundCloud, RA, Bandcamp, etc.) y en lo que puedas inferir, devuelve ÚNICAMENTE el siguiente JSON con los campos que puedas determinar (null para el resto):
{
  "tipo": null,
  "nombre": null,
  "ciudad": null,
  "pais": null,
  "bio": null,
  "generos": [],
  "formato": null,
  "ig": ${url.includes('instagram.com') ? `"${url.split('/').filter(Boolean).pop()}"` : 'null'},
  "spotify": ${url.includes('spotify.com') ? `"${url}"` : 'null'},
  "soundcloud": ${url.includes('soundcloud.com') ? `"${url}"` : 'null'},
  "youtube": ${url.includes('youtube.com') || url.includes('youtu.be') ? `"${url}"` : 'null'},
  "ra": ${url.includes('ra.co') ? `"${url}"` : 'null'},
  "trayectoria": [],
  "_nota": "Link recibido. Completa los campos manualmente o sube tu EPK para extracción automática."
}

SOLO devuelve el JSON, nada más.`
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Error en Claude API: ' + err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    let parsed;
    try {
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
