// api/scrape-contenido.js
// Vercel Serverless Function — Scraping de contenidos con Claude
// Recibe: { url } o { docBase64, docType }
// Devuelve: JSON con los campos del contenido

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { url, docBase64, docType } = req.body || {};
  if (!url && !docBase64) {
    return res.status(400).json({ error: 'Se requiere url o docBase64' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'API key no configurada' });

  const prompt = `Extrae la información editorial de este contenido y devuélvela ÚNICAMENTE como un objeto JSON válido, sin texto adicional, sin markdown.

El JSON debe tener exactamente estas claves (usa null si no encuentras el dato):
{
  "tipo": "tipo de contenido (Reseña, Crónica, Entrevista, Galería, Playlist, Video, Podcast, Nota, Perfil editorial, Archivo, Guía, Recomendación, Otro)",
  "titulo": "título del contenido",
  "autor": "nombre del autor o autores",
  "medio": "nombre del medio o publicación",
  "fecha_pub": "fecha de publicación en formato YYYY-MM-DD si es posible",
  "ciudad": "ciudad o territorio del contenido",
  "idioma": "es (español) o en (inglés) u otro",
  "descripcion": "resumen o bajada en 2-3 líneas",
  "cuerpo": "texto principal si está disponible (máximo 500 palabras)",
  "generos": ["array", "de", "géneros", "o", "disciplinas"],
  "etiquetas": ["array", "de", "etiquetas", "o", "palabras", "clave"],
  "link_original": "URL del contenido original",
  "ig_autor": "instagram del autor (@cuenta)",
  "permisos": "propio / licencia / Creative Commons / por confirmar"
}`;

  let content = [];

  if (docBase64) {
    content.push({ type: 'document', source: { type: 'base64', media_type: docType || 'application/pdf', data: docBase64 } });
    content.push({ type: 'text', text: prompt });
  } else {
    // URL mode — infer from URL structure
    let tipoInferido = null;
    let medioInferido = null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) { tipoInferido = 'Video'; medioInferido = 'YouTube'; }
    else if (url.includes('spotify.com')) { tipoInferido = 'Podcast'; medioInferido = 'Spotify'; }
    else if (url.includes('soundcloud.com') || url.includes('mixcloud.com')) { tipoInferido = 'Audio'; medioInferido = url.includes('soundcloud') ? 'SoundCloud' : 'Mixcloud'; }
    else if (url.includes('substack.com')) { tipoInferido = 'Artículo'; medioInferido = url.split('.substack')[0].split('//')[1]; }
    else if (url.includes('medium.com')) { tipoInferido = 'Artículo'; medioInferido = 'Medium'; }
    else if (url.includes('vimeo.com')) { tipoInferido = 'Video'; medioInferido = 'Vimeo'; }

    content.push({
      type: 'text',
      text: `Analiza este link de contenido cultural: ${url}

Basándote en la estructura de la URL, devuelve ÚNICAMENTE el siguiente JSON:
{
  "tipo": ${tipoInferido ? `"${tipoInferido}"` : 'null'},
  "titulo": null,
  "autor": null,
  "medio": ${medioInferido ? `"${medioInferido}"` : 'null'},
  "fecha_pub": null,
  "ciudad": null,
  "idioma": "es",
  "descripcion": null,
  "cuerpo": null,
  "generos": [],
  "etiquetas": [],
  "link_original": "${url}",
  "ig_autor": null,
  "permisos": "por confirmar",
  "_nota": "Link recibido. Completa el título, autor y descripción manualmente."
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
        max_tokens: 2000,
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
