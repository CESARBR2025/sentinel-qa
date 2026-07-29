-- Migration: notificaciones dirigidas por rol con estado de lectura por persona
--
-- La tabla `notificaciones` original es propiedad de `postgres`; el usuario de
-- la app (`uriel`) no tiene privilegios de superusuario ni es dueño de esa
-- tabla, así que no puede correr ALTER TABLE sobre ella (y no debe necesitar
-- serlo sólo para esto). Por eso el modelo nuevo vive en tablas PROPIAS,
-- creadas por el propio usuario de la app — sin tocar la tabla vieja para nada.
--
-- `notificaciones` queda intacta como archivo histórico de sólo lectura (102
-- filas de los 3 tipos antiguos). El código deja de escribir ahí.
--
-- Modelo: el EVENTO se separa de QUIÉN LO LEYÓ.
--   notificaciones_eventos   → una fila por (evento × destinatario); el
--                              destinatario es un rol o un usuario concreto.
--   notificaciones_lecturas  → quién leyó qué. Sin fila = no leída.

BEGIN;

CREATE TABLE IF NOT EXISTS notificaciones_eventos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Destinatario: rol o usuario concreto. Nunca ambos nulos (CHECK abajo).
  rol_id       integer     REFERENCES roles(id) ON DELETE CASCADE,
  user_id      text        REFERENCES users(id) ON DELETE CASCADE,
  evento       text        NOT NULL,
  titulo       text        NOT NULL,
  mensaje      text        NOT NULL,
  href         text,
  severidad    text        NOT NULL DEFAULT 'info',
  entidad_tipo text,
  entidad_id   text,
  emitida_por  text        REFERENCES users(id) ON DELETE SET NULL,
  -- Agrupa las filas emitidas en una misma llamada a emitir(): permite que la
  -- auditoría muestre "1 evento → 3 roles" en vez de 3 registros sueltos.
  grupo_id     uuid,
  -- Idempotencia: con la misma clave, sólo se inserta una vez aunque la acción
  -- que la origina se reintente.
  clave_dedup  text,
  creado_en    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notificaciones_eventos_destinatario_chk
    CHECK (user_id IS NOT NULL OR rol_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS notificaciones_eventos_clave_dedup_uq
  ON notificaciones_eventos (clave_dedup) WHERE clave_dedup IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_rol_creado_idx
  ON notificaciones_eventos (rol_id, creado_en DESC) WHERE rol_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_user_creado_idx
  ON notificaciones_eventos (user_id, creado_en DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS notificaciones_eventos_evento_idx
  ON notificaciones_eventos (evento, creado_en DESC);

-- Estado de lectura por persona.
CREATE TABLE IF NOT EXISTS notificaciones_lecturas (
  notificacion_id uuid        NOT NULL REFERENCES notificaciones_eventos(id) ON DELETE CASCADE,
  user_id         text        NOT NULL REFERENCES users(id)                 ON DELETE CASCADE,
  leida_en        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notificacion_id, user_id)
);
CREATE INDEX IF NOT EXISTS notificaciones_lecturas_user_idx ON notificaciones_lecturas (user_id);

-- Matriz configurable evento × rol (la que edita el administrador). Los
-- defaults viven en el catálogo en código; aquí sólo se guardan los overrides.
CREATE TABLE IF NOT EXISTS notificaciones_suscripciones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento         text        NOT NULL,
  rol_id         integer     NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  activo         boolean     NOT NULL DEFAULT true,
  actualizado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (evento, rol_id)
);

-- Configuración (retención).
CREATE TABLE IF NOT EXISTS notificaciones_config (
  clave text PRIMARY KEY,
  valor text NOT NULL
);
INSERT INTO notificaciones_config (clave, valor) VALUES ('retencion_dias', '90')
ON CONFLICT (clave) DO NOTHING;

-- Backfill: se importan las 102 filas históricas para que el historial no
-- empiece vacío. Los 3 tipos viejos (incidente_svv, busqueda_plazo,
-- despacho_asignado) ya eran uno-por-usuario, así que se preservan tal cual
-- como destinatarios directos (user_id), no como eventos de rol.
INSERT INTO notificaciones_eventos
  (user_id, evento, titulo, mensaje, href, entidad_tipo, entidad_id, creado_en)
SELECT user_id, tipo, titulo, mensaje, href,
       CASE WHEN ficha_id IS NOT NULL THEN 'ficha_busqueda' END,
       ficha_id::text,
       creado_en
  FROM notificaciones
ON CONFLICT DO NOTHING;

INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
SELECT ne.id, ne.user_id
  FROM notificaciones_eventos ne
  JOIN notificaciones n ON n.user_id = ne.user_id AND n.tipo = ne.evento
                        AND n.titulo = ne.titulo AND n.creado_en = ne.creado_en
 WHERE n.leida = true
ON CONFLICT DO NOTHING;

COMMIT;
