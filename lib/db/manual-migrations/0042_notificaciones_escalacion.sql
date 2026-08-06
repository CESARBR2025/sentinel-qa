-- Marca cuándo se reenvió el push de una notificación crítica que nadie había
-- leído (un solo reintento, no reenvío infinito). NULL = no escalada todavía.
-- Ver 00-contexto.md del plan plan-notificaciones-forzadas/.

ALTER TABLE notificaciones_eventos ADD COLUMN IF NOT EXISTS push_reescalado_en timestamptz;
