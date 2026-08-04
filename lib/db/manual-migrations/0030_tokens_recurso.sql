-- Migration: tokens opacos persistentes para URLs de recursos sensibles (IDOR hardening).
--
-- Tabla de mapeo token <-> id interno para recursos expuestos en URLs
-- (expedientes, detenidos, denuncias). Un mismo recurso siempre tiene el mismo
-- token (UNIQUE tipo+recurso_id) para que el link se pueda guardar/reabrir,
-- a diferencia del mecanismo de un solo uso de consumeViewToken.
--
-- No cambia PKs internas ni FKs: el token vive solo en la capa de URL/routing.
CREATE TABLE "tokens_recurso" (
	"token"       uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo"        text NOT NULL,          -- 'expediente' | 'detenido' | 'denuncia' | ...
	"recurso_id"  text NOT NULL,          -- id interno real (puede ser numérico o uuid ya existente)
	"creado_en"   timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_recurso_tipo_recurso_uq" UNIQUE (tipo, recurso_id)
);
CREATE INDEX "idx_tokens_recurso_tipo_id" ON "tokens_recurso" ("tipo", "recurso_id");
