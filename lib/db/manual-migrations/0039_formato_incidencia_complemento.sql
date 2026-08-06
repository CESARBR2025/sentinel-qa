-- Datos de "FORMATO INCIDENCIA.xlsx" (hojas INCIDENCIA y PUESTAS A DISPOSICION)
-- que no tienen ninguna columna equivalente en incidentes/ofi_reportes_campo/
-- ofi_reporte_denuncia/ofi_detalles_asegurados. Se capturan a mano desde
-- /formatos-udai/reportes-incidencias cuando el registro se marca como
-- "completo" y queda listo para exportar. La llave es incidente_id (no
-- iph_detenidos: ese módulo quedó fuera de la cadena de este reporte, ver
-- 00-contexto.md — el ancla real es 911 -> reporte de campo -> denuncia).

DROP TABLE IF EXISTS formato_incidencia_complemento;

CREATE TABLE IF NOT EXISTS formato_incidencia_complemento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidente_id uuid NOT NULL UNIQUE REFERENCES incidentes(id),

  rt character varying,
  turno character varying,
  articulos_objetos text,
  ap_nuc character varying,
  calle_afec character varying,
  numero_afec character varying,
  colonia_afec character varying,
  fuero_override character varying,

  agrupamiento character varying,
  folio_rnd character varying,
  originario character varying,
  nuc_cu character varying,
  edad integer,
  fecha_nacimiento date,
  sexo character varying,
  calle_det character varying,
  numero_det character varying,
  colonia_det character varying,
  marca character varying,
  submarca character varying,
  tipo_vehiculo character varying,
  color character varying,
  placas character varying,
  estado_vehiculo character varying,
  niv character varying,
  motor character varying,
  modelo character varying,
  fecha_ingreso timestamptz,
  fecha_salida timestamptz,
  otro_delito text,
  masc text,
  umecas text,

  completado_en timestamptz,
  completado_por text REFERENCES users(id),
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  actualizado_en timestamptz
);

CREATE INDEX IF NOT EXISTS idx_formato_incidencia_complemento_incidente ON formato_incidencia_complemento (incidente_id);
