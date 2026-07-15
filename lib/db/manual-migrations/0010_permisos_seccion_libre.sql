-- "permisos" va a crecer para cubrir todas las secciones del sistema, no solo
-- monitorista. El CHECK fijo a 4 valores no deja agregar secciones nuevas sin
-- otra migración — se quita. La validación de qué valores son válidos por módulo
-- se hace en código (ver lib/monitorista/permisos.ts -> SECCIONES), no en la DB.
ALTER TABLE "permisos" DROP CONSTRAINT IF EXISTS "permisos_seccion_ck";
