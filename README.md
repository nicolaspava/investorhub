# La Curaduría · Integración Mercado Pago + Supabase

## Flujo completo

```
Usuario llena form → crear-preferencia.js → Supabase (pendiente)
                                          → MP crea preferencia
                                          → usuario paga en MP
                                          → webhook-mp.js → Supabase (pagado)
```

---

## Paso 1 · Supabase

1. Abre tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Pega y ejecuta el contenido de `supabase-schema.sql`
4. Copia tu **service_role key**: Settings → API → `service_role` (secret)
5. Copia tu **Project URL**: Settings → API → Project URL

---

## Paso 2 · Vercel — Variables de entorno

En tu proyecto de Vercel: **Settings → Environment Variables**

| Variable | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | Tu access token de MP (TEST o producción) |
| `SUPABASE_URL` | `https://TUPROYECTO.supabase.co` |
| `SUPABASE_SERVICE_KEY` | La service_role key de Supabase |

---

## Paso 3 · Subir las funciones a Vercel

Copia los dos archivos a tu proyecto de la landing:

```
tu-proyecto/
  api/
    crear-preferencia.js   ← aquí
    webhook-mp.js          ← aquí
  index.html
```

Vercel detecta la carpeta `/api` automáticamente y despliega las funciones.

Si tu landing es solo HTML estático (sin package.json), crea uno mínimo:

```json
{
  "name": "lacuraduria-landing",
  "version": "1.0.0"
}
```

---

## Paso 4 · Conectar el modal de la landing

En el modal de registro, el botón de pago debe llamar a tu función:

```javascript
async function pagarProfesional(nombre, email) {
  const res = await fetch('/api/crear-preferencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, plan: 'profesional' }),
  });
  const data = await res.json();

  if (data.tipo === 'pago') {
    window.open(data.checkout_url, '_blank');
    // O: window.location.href = data.checkout_url;
  }
}
```

---

## Paso 5 · Webhook de Mercado Pago

En MP Dashboard → Tu negocio → Webhooks:

- **URL**: `https://lacuraduria.net/api/webhook-mp`
- **Eventos**: `payment`

Esto hace que cada vez que alguien pague, MP notifique a tu función y actualice Supabase automáticamente.

---

## Paso 6 · Pasar a producción

1. En MP Dashboard, activa las **credenciales de producción**
2. Cambia `MP_ACCESS_TOKEN` en Vercel por el token real (sin `TEST-`)
3. En `crear-preferencia.js`, cambia `sandbox_init_point` por `init_point`
4. Actualiza la URL del webhook en MP Dashboard

---

## Ver registros en Supabase

```sql
-- Todos los registros
SELECT * FROM preventa_registros ORDER BY fecha_registro DESC;

-- Resumen de cupos
SELECT * FROM preventa_resumen;

-- Solo pagados
SELECT nombre, email, fecha_pago, monto_pagado
FROM preventa_registros
WHERE estado = 'pagado'
ORDER BY fecha_pago DESC;

-- Cupos profesional disponibles
SELECT 200 - COUNT(*) as cupos_disponibles
FROM preventa_registros
WHERE plan = 'profesional' AND estado IN ('pagado', 'pendiente_pago');
```
