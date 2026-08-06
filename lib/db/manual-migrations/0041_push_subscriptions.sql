-- Suscripciones Web Push (VAPID) por dispositivo. Un usuario puede tener
-- varias filas (celular, laptop, tablet). endpoint es único por navegador +
-- dispositivo + origen, lo asigna el push service del navegador (FCM, Mozilla
-- Push, Apple Push). Ver 00-contexto.md del plan plan-pwa-push/.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  ultimo_uso timestamptz
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions (user_id);
