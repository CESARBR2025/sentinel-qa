-- Romper la FK circular IPH ↔ Fichas de Inteligencia.
-- Se conserva fk_ficha_iph (ofi_fichas_inteligencia.iph_id → iph_detenidos.id).
-- Se elimina solo el lado inverso: iph_detenidos.ficha_inteligencia_id → ofi_fichas_inteligencia.id.
-- La columna ficha_inteligencia_id se conserva (no se dropea): sin lectores en el código,
-- solo deja de estar validada a nivel BD. Documentado en el ADR del plan.

ALTER TABLE iph_detenidos DROP CONSTRAINT IF EXISTS fk_iph_vinculo_inteligencia;
