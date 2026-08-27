-- Etapa 10 — Parte de Novedades C-4 · Deuda técnica en BD
-- Auditoría 2026-08-10: tablas con 0 filas, 0 referencias en código
-- (excluyendo lib/admin/sistema-constants.ts, que solo lista nombres) y 0 FKs
-- entrantes. Reconfirmado count(*)=0 y grep en 0 inmediatamente antes del DROP.
--
-- novedades_captura ya se retiró en 0051 (intento previo del Parte de Novedades).
DROP TABLE IF EXISTS ofi_fichas_inteligencia;
--> statement-breakpoint
DROP TABLE IF EXISTS solicitudes_detenido;
