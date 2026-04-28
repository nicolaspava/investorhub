-- ══════════════════════════════════════════
-- SUPABASE · La Curaduría · Preventa
-- Corre esto en el SQL Editor de tu proyecto
-- ══════════════════════════════════════════

CREATE TABLE preventa_registros (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre            text NOT NULL,
  email             text NOT NULL,
  plan              text NOT NULL CHECK (plan IN ('basico', 'profesional')),
  precio            integer NOT NULL DEFAULT 0,
  estado            text NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','pendiente_pago','pagado','rechazado','cancelado','completado')),

  -- Mercado Pago
  mp_payment_id     text,
  mp_payer_email    text,
  monto_pagado      numeric(12,2),
  fecha_pago        timestamptz,

  -- Timestamps
  fecha_registro    timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Índices útiles
CREATE INDEX idx_preventa_email  ON preventa_registros(email);
CREATE INDEX idx_preventa_estado ON preventa_registros(estado);
CREATE INDEX idx_preventa_plan   ON preventa_registros(plan);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON preventa_registros
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Vista rápida de resumen (útil para ver cupos)
CREATE VIEW preventa_resumen AS
SELECT
  plan,
  estado,
  COUNT(*) as total,
  SUM(monto_pagado) as ingresos
FROM preventa_registros
GROUP BY plan, estado
ORDER BY plan, estado;

-- Row Level Security (solo el service role puede leer/escribir)
ALTER TABLE preventa_registros ENABLE ROW LEVEL SECURITY;

-- Política: solo service role (las funciones de Vercel)
-- La anon key NO puede acceder
CREATE POLICY "solo_service_role" ON preventa_registros
  USING (false); -- bloquea todo acceso público
