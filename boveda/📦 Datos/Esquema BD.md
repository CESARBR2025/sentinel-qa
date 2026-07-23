# Esquema de Base de Datos — Sentinel SSPM

> Documentación generada desde `information_schema` el 2026-07-23.
> Fuente de verdad del schema real en PostgreSQL.

---

## Convenciones

- Los nombres están en **snake_case** (convención de PostgreSQL)
- `public` = tablas de aplicación
- `via` = tablas del módulo VIA (infracciones vehiculares)

---

## Nota sobre better-auth

Las 5 tablas `users`, `sessions`, `accounts`, `verifications`, `two_factors` son gestionadas exclusivamente por **better-auth** a través del adaptador Drizzle.
La aplicación **no debe modificarlas directamente**. Las columnas `rol_id` y `dependencia_id` en `users` se modifican vía server actions con raw SQL.

---

## Schema \`public\`

### \`accounts\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `account_id` | `text` | NO | — |
| 3 | `provider_id` | `text` | NO | — |
| 4 | `user_id` | `text` | NO | — |
| 5 | `access_token` | `text` | SÍ | — |
| 6 | `refresh_token` | `text` | SÍ | — |
| 7 | `id_token` | `text` | SÍ | — |
| 8 | `access_token_expires_at` | `timestamp` | SÍ | — |
| 9 | `refresh_token_expires_at` | `timestamp` | SÍ | — |
| 10 | `scope` | `text` | SÍ | — |
| 11 | `password` | `text` | SÍ | — |
| 12 | `created_at` | `timestamp` | NO | `now()` |
| 13 | `updated_at` | `timestamp` | NO | `now()` |

### \`audit_log\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `user_id` | `text` | NO | — |
| 3 | `accion` | `text` | NO | — |
| 4 | `entidad` | `text` | NO | — |
| 5 | `entidad_id` | `text` | NO | — |
| 6 | `payload` | `text` | SÍ | — |
| 7 | `ip` | `text` | SÍ | — |
| 8 | `user_agent` | `text` | SÍ | — |
| 9 | `creado_en` | `timestamp` | NO | `now()` |

### \`auxiliar_checklist\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `reporte_campo_id` | `uuid` | NO | — |
| 3 | `reporte_d1_id` | `uuid` | NO | — |
| 4 | `denuncia_cu_d1` | `boolean` | SÍ | `false` |
| 5 | `denuncia_cu_d1_duracion` | `text` | SÍ | — |
| 6 | `detenido_fge` | `boolean` | SÍ | `false` |
| 7 | `detenido_fgr` | `boolean` | SÍ | `false` |
| 8 | `detenido_jc` | `boolean` | SÍ | `false` |
| 9 | `convenios` | `boolean` | SÍ | `false` |
| 10 | `trabajos_comunidad` | `boolean` | SÍ | `false` |
| 11 | `coincide_gps` | `boolean` | SÍ | `false` |
| 12 | `visualizo_camara` | `boolean` | SÍ | `false` |
| 13 | `ti_pi` | `boolean` | SÍ | `false` |
| 14 | `observaciones` | `text` | SÍ | — |
| 15 | `capturado_por` | `text` | NO | — |
| 16 | `created_at` | `timestamp` | SÍ | `now()` |
| 17 | `updated_at` | `timestamp` | SÍ | `now()` |

### \`cat_body_cams\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_body_cams_id_seq'::regclass)` |
| 2 | `codigo` | `text` | NO | — |
| 3 | `estado` | `text` | NO | `'operativo'::character varying` |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_dependencias\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_dependencias_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `tipo` | `text` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_estado_fuerza_conceptos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_estado_fuerza_conceptos_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `codigo` | `text` | NO | — |
| 4 | `grupo` | `text` | SÍ | — |
| 5 | `orden` | `integer` | NO | `0` |
| 6 | `activo` | `boolean` | NO | `true` |
| 7 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_grupos_adscripcion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_grupos_adscripcion_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `autoridad` | `text` | NO | — |
| 5 | `activo` | `boolean` | SÍ | `true` |
| 6 | `orden` | `integer` | SÍ | `0` |

### \`cat_medios_canalizacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_medios_canalizacion_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_prioridades\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_prioridades_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `orden` | `integer` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |

### \`cat_radios\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_radios_id_seq'::regclass)` |
| 2 | `codigo` | `text` | NO | — |
| 3 | `tipo` | `text` | SÍ | — |
| 4 | `estado` | `text` | NO | `'operativo'::character varying` |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_sectores\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_sectores_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `clave` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_subtipos_emergencia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_subtipos_emergencia_id_seq'::regclass)` |
| 2 | `tipo_emergencia_id` | `integer` | NO | — |
| 3 | `codigo` | `text` | NO | — |
| 4 | `nombre` | `text` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_tipos_emergencia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_tipos_emergencia_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |
| 6 | `codigo` | `text` | SÍ | — |
| 7 | `dependencia_sugerida_id` | `integer` | SÍ | — |

### \`cat_tipos_incidente\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_tipos_incidente_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `clasificacion_cad` | `text` | SÍ | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |
| 7 | `subtipo_emergencia_id` | `integer` | SÍ | — |
| 8 | `codigo_catalogo` | `text` | SÍ | — |
| 9 | `prioridad_catalogo` | `text` | SÍ | — |

### \`cat_tipos_observacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_tipos_observacion_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `codigo` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`cat_turnos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_turnos_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `hora_inicio` | `time without time zone` | NO | — |
| 4 | `hora_fin` | `time without time zone` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |

### \`contestaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `solicitud_id` | `uuid` | NO | — |
| 3 | `fecha_contestacion` | `date` | NO | — |
| 4 | `archivo_pdf_url` | `text` | SÍ | — |
| 5 | `fecha_entrega` | `date` | SÍ | — |
| 6 | `hora_entrega` | `text` | SÍ | — |
| 7 | `nombre_quien_recibio` | `text` | SÍ | — |
| 8 | `creado_por` | `text` | SÍ | — |
| 9 | `creado_en` | `timestamp` | NO | `now()` |

### \`evidencias\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `solicitud_id` | `uuid` | NO | — |
| 3 | `incidente_id` | `uuid` | NO | — |
| 4 | `tipo` | `text` | NO | — |
| 5 | `nombre_original` | `text` | SÍ | — |
| 6 | `url_expediente` | `text` | NO | — |
| 7 | `subido_por` | `text` | NO | — |
| 8 | `creado_en` | `timestamp` | NO | `now()` |

### \`evidencias_detenido\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `tipo_foto` | `text` | NO | — |
| 3 | `url_archivo` | `text` | NO | — |
| 4 | `nombre_archivo` | `text` | SÍ | — |
| 5 | `subido_por` | `text` | SÍ | — |
| 6 | `creado_en` | `timestamp` | SÍ | `now()` |
| 7 | `reporte_campo_id` | `uuid` | NO | — |
| 8 | `detenido_index` | `integer` | SÍ | — |
| 9 | `tipo_contenido` | `text` | SÍ | `'detenido'::character varying` |

### \`fichas_busqueda\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `tipo` | `text` | NO | — |
| 3 | `folio` | `text` | SÍ | — |
| 4 | `enlace` | `text` | SÍ | — |
| 5 | `fecha_activacion` | `timestamp` | NO | — |
| 6 | `carpeta_investigacion` | `text` | SÍ | — |
| 7 | `nombre_desaparecida` | `text` | NO | — |
| 8 | `edad` | `integer` | SÍ | — |
| 9 | `fecha_aceptacion` | `timestamp` | SÍ | — |
| 10 | `rt_atiende` | `text` | SÍ | — |
| 11 | `elemento_novedades` | `text` | SÍ | — |
| 12 | `status` | `text` | NO | `'activa'::character varying` |
| 13 | `fecha_cancelacion` | `timestamp` | SÍ | — |
| 14 | `fiscal_cancela` | `text` | SÍ | — |
| 15 | `motivo_cancelacion` | `text` | SÍ | — |
| 16 | `creado_por` | `text` | SÍ | — |
| 17 | `creado_en` | `timestamp` | NO | `now()` |

### \`fichas_inteligencia_detenidos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('fichas_inteligencia_detenidos_id_seq'::regclass)` |
| 2 | `nombre_detenido` | `text` | SÍ | — |
| 3 | `folio` | `text` | SÍ | — |
| 4 | `foto_frontal_url` | `text` | SÍ | — |
| 5 | `foto_objetos_url` | `text` | SÍ | — |
| 6 | `fecha_nacimiento` | `date` | SÍ | — |
| 7 | `origen` | `text` | SÍ | — |
| 8 | `genero` | `text` | SÍ | — |
| 9 | `escolaridad` | `text` | SÍ | — |
| 10 | `estado_civil` | `text` | SÍ | — |
| 11 | `ocupacion` | `text` | SÍ | — |
| 12 | `domicilio` | `text` | SÍ | — |
| 13 | `rasgos_particulares` | `text` | SÍ | — |
| 14 | `eventos_delictivos` | `text` | SÍ | — |
| 15 | `fecha_hora_evento` | `timestamp` | SÍ | — |
| 16 | `rnd` | `text` | SÍ | — |
| 17 | `iph` | `text` | SÍ | — |
| 18 | `expediente` | `text` | SÍ | — |
| 19 | `lugar_evento` | `text` | SÍ | — |
| 20 | `lugar_detencion` | `text` | SÍ | — |
| 21 | `nexos_delictivos` | `text` | SÍ | — |
| 22 | `zona_operacion` | `text` | SÍ | — |
| 23 | `puesta_disposicion` | `text` | SÍ | — |
| 24 | `modus_operandi` | `text` | SÍ | — |
| 25 | `info_adicional` | `text` | SÍ | — |
| 26 | `antecedentes` | `text` | SÍ | — |
| 27 | `faltas_admin` | `text` | SÍ | — |
| 28 | `capturado_por` | `text` | SÍ | — |
| 29 | `creado_en` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |

### \`formato_n_armas_aseguradas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `carpeta_investigacion` | `text` | SÍ | — |
| 4 | `tipo_arma` | `text` | NO | — |
| 5 | `matricula` | `text` | SÍ | — |
| 6 | `calibre` | `text` | SÍ | — |
| 7 | `observaciones` | `text` | SÍ | — |
| 8 | `capturado_por` | `text` | NO | — |
| 9 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_atencion_victimas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `periodo` | `text` | NO | — |
| 4 | `capturado_por` | `text` | NO | — |
| 5 | `numero_atenciones` | `integer` | NO | `0` |
| 6 | `atenciones_medicas` | `integer` | NO | `0` |
| 7 | `atenciones_psicologicas` | `integer` | NO | `0` |
| 8 | `asesorias_juridicas` | `integer` | NO | `0` |
| 9 | `observaciones` | `text` | SÍ | — |
| 10 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_eventos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `hora` | `time without time zone` | NO | — |
| 4 | `region` | `text` | NO | — |
| 5 | `evento` | `text` | NO | — |
| 6 | `ubicacion` | `text` | SÍ | — |
| 7 | `descripcion` | `text` | SÍ | — |
| 8 | `atenciones` | `text` | SÍ | — |
| 9 | `capturado_por` | `text` | NO | — |
| 10 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_fge\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `periodo` | `text` | NO | — |
| 4 | `capturado_por` | `text` | NO | — |
| 5 | `carpetas_iniciadas` | `integer` | NO | `0` |
| 6 | `numero_cateos` | `integer` | NO | `0` |
| 7 | `vehiculos_asegurados` | `integer` | NO | `0` |
| 8 | `domicilios_cateados` | `integer` | NO | `0` |
| 9 | `personas_aseguradas` | `integer` | NO | `0` |
| 10 | `aprehensiones` | `integer` | NO | `0` |
| 11 | `audiencias_iniciales` | `integer` | NO | `0` |
| 12 | `abreviados` | `integer` | NO | `0` |
| 13 | `audiencias_intermedias` | `integer` | NO | `0` |
| 14 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_fgr\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `periodo` | `text` | NO | — |
| 4 | `capturado_por` | `text` | NO | — |
| 5 | `carpetas_iniciadas` | `integer` | NO | `0` |
| 6 | `numero_cateos` | `integer` | NO | `0` |
| 7 | `vehiculos_asegurados` | `integer` | NO | `0` |
| 8 | `domicilios_cateados` | `integer` | NO | `0` |
| 9 | `personas_aseguradas` | `integer` | NO | `0` |
| 10 | `aprehensiones` | `integer` | NO | `0` |
| 11 | `audiencias_iniciales` | `integer` | NO | `0` |
| 12 | `abreviados` | `integer` | NO | `0` |
| 13 | `audiencias_intermedias` | `integer` | NO | `0` |
| 14 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_medios_alternativos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `periodo` | `text` | NO | — |
| 4 | `capturado_por` | `text` | NO | — |
| 5 | `asuntos_canalizados_por_fiscalia` | `integer` | NO | `0` |
| 6 | `acuerdos` | `integer` | NO | `0` |
| 7 | `monto_reparacion_danos` | `numeric` | NO | `0` |
| 8 | `creado_en` | `timestamp` | NO | `now()` |

### \`formato_n_observaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `observaciones` | `text` | SÍ | — |
| 4 | `elaboro` | `text` | SÍ | — |
| 5 | `capturado_por` | `text` | NO | — |
| 6 | `creado_en` | `timestamp` | SÍ | `now()` |

### \`formato_n_rnd\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `hora_detencion` | `time without time zone` | NO | — |
| 4 | `delito` | `text` | NO | — |
| 5 | `autoridad_que_realizo_detencion` | `text` | NO | — |
| 6 | `folio` | `text` | NO | — |
| 7 | `capturado_por` | `text` | NO | — |
| 8 | `creado_en` | `timestamp` | NO | `now()` |

### \`incidente_alarma_escolar\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `establecimiento` | `text` | SÍ | — |
| 4 | `direccion` | `text` | SÍ | — |
| 5 | `inmueble` | `text` | SÍ | — |
| 6 | `responsable` | `text` | SÍ | — |
| 7 | `reporte_descripcion` | `text` | SÍ | — |
| 8 | `hora_canalizacion` | `text` | SÍ | — |
| 9 | `unidad_arribo` | `text` | SÍ | — |
| 10 | `hora_arribo` | `text` | SÍ | — |
| 11 | `nombre_responsable` | `text` | SÍ | — |
| 12 | `nombre_verificador` | `text` | SÍ | — |
| 13 | `activaciones` | `integer` | NO | `0` |
| 14 | `creado_en` | `timestamp` | NO | `now()` |

### \`incidente_despacho\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `fecha_hora_despacho` | `timestamp` | NO | `now()` |
| 4 | `despachado_por` | `text` | NO | — |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`incidente_despacho_elementos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `despacho_id` | `uuid` | NO | — |
| 3 | `elemento_ext_id` | `text` | SÍ | — |
| 4 | `elemento_nomina` | `text` | SÍ | — |
| 5 | `elemento_nombre` | `text` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |
| 7 | `oficial_id` | `uuid` | SÍ | — |
| 8 | `es_prioritario` | `boolean` | NO | `false` |
| 9 | `es_refuerzo` | `boolean` | NO | `false` |

### \`incidente_despacho_unidades\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `despacho_id` | `uuid` | NO | — |
| 3 | `unidad_ext_id` | `text` | SÍ | — |
| 4 | `unidad_placa` | `text` | SÍ | — |
| 5 | `creado_en` | `timestamp` | NO | `now()` |
| 6 | `es_refuerzo` | `boolean` | NO | `false` |
| 7 | `hora_salida` | `timestamp` | SÍ | — |
| 8 | `hora_llegada` | `timestamp` | SÍ | — |

### \`incidente_extorsion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `telefono_extorsion` | `text` | SÍ | — |
| 4 | `grupo_delictivo` | `text` | SÍ | — |
| 5 | `modus_operandi` | `text` | SÍ | — |
| 6 | `unidad_resultado` | `text` | SÍ | — |
| 7 | `folio_reporte` | `text` | SÍ | — |
| 8 | `fecha` | `date` | SÍ | — |
| 9 | `creado_en` | `timestamp` | NO | `now()` |

### \`incidente_personas_afectadas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `nombre` | `text` | SÍ | — |
| 4 | `sexo` | `text` | SÍ | — |
| 5 | `edad` | `integer` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`incidente_reporte_campo\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `contenido_reporte` | `text` | SÍ | — |
| 4 | `lugar_calle` | `text` | SÍ | — |
| 5 | `lugar_colonia` | `text` | SÍ | — |
| 6 | `lugar_entre_calles` | `text` | SÍ | — |
| 7 | `lugar_referencia` | `text` | SÍ | — |
| 8 | `datos_positivos_negativos` | `text` | SÍ | — |
| 9 | `acciones_realizadas` | `text` | SÍ | — |
| 10 | `hay_detencion` | `boolean` | NO | `false` |
| 11 | `nombre_detenidos` | `text` | SÍ | — |
| 12 | `autoridad_recibe` | `text` | SÍ | — |
| 13 | `expediente_ci` | `text` | SÍ | — |
| 14 | `delito_falta` | `text` | SÍ | — |
| 15 | `monto_robo` | `integer` | SÍ | — |
| 16 | `objetos_recuperados` | `text` | SÍ | — |
| 17 | `vehiculos_recuperados` | `text` | SÍ | — |
| 18 | `tipo_vehiculo` | `text` | SÍ | — |
| 19 | `destino_vehiculo` | `text` | SÍ | — |
| 20 | `hay_cateo` | `boolean` | NO | `false` |
| 21 | `domicilio_cateado` | `text` | SÍ | — |
| 22 | `resultado_cateo` | `text` | SÍ | — |
| 23 | `policia_a_cargo` | `text` | SÍ | — |
| 24 | `personal_ingreso_ci` | `text` | SÍ | — |
| 25 | `capturado_por` | `text` | NO | — |
| 26 | `creado_en` | `timestamp` | NO | `now()` |
| 27 | `hay_robo` | `boolean` | SÍ | `false` |
| 28 | `vehiculos` | `jsonb` | SÍ | `'[]'::jsonb` |
| 29 | `cateo_calle` | `text` | SÍ | — |
| 30 | `cateo_colonia` | `text` | SÍ | — |
| 31 | `cateo_latitud` | `numeric` | SÍ | — |
| 32 | `cateo_longitud` | `numeric` | SÍ | — |
| 33 | `hay_vehiculo` | `boolean` | SÍ | `false` |
| 34 | `hay_orden_aprehension` | `boolean` | SÍ | `false` |
| 35 | `ordenes_aprehension` | `jsonb` | SÍ | `'[]'::jsonb` |
| 36 | `hay_hidrocarburo` | `boolean` | SÍ | `false` |
| 37 | `hidrocarburos` | `jsonb` | SÍ | `'[]'::jsonb` |
| 38 | `hay_arma_fuego` | `boolean` | SÍ | `false` |
| 39 | `armas_fuego` | `jsonb` | SÍ | `'[]'::jsonb` |
| 40 | `hay_droga` | `boolean` | SÍ | `false` |
| 41 | `drogas` | `jsonb` | SÍ | `'[]'::jsonb` |
| 42 | `observaciones` | `text` | SÍ | — |
| 43 | `apoyo_fiestas_patronales` | `boolean` | SÍ | `false` |
| 44 | `operativos_metropolitano` | `boolean` | SÍ | `false` |
| 45 | `eco8` | `boolean` | SÍ | `false` |
| 46 | `alcoholimetria` | `boolean` | SÍ | `false` |
| 47 | `motocicletas` | `boolean` | SÍ | `false` |
| 48 | `apoyo_actuarios` | `boolean` | SÍ | `false` |
| 49 | `apoyo_cateos_fgr` | `boolean` | SÍ | `false` |
| 50 | `apoyo_cateos_fge` | `boolean` | SÍ | `false` |
| 51 | `armas_blancas` | `jsonb` | SÍ | `'[]'::jsonb` |
| 52 | `hay_arma_blanca` | `boolean` | SÍ | `false` |

### \`incidentes\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `folio` | `text` | NO | — |
| 3 | `folio_consecutivo` | `integer` | NO | — |
| 4 | `canal` | `text` | NO | — |
| 5 | `tipo_reporte` | `text` | NO | — |
| 6 | `nombre_reportante` | `text` | SÍ | — |
| 7 | `anonimo` | `boolean` | NO | `false` |
| 8 | `sexo` | `text` | SÍ | — |
| 9 | `edad` | `integer` | SÍ | — |
| 10 | `es_usuario_frecuente` | `boolean` | NO | `false` |
| 11 | `es_persona_afectada` | `boolean` | NO | `false` |
| 12 | `es_migrante` | `boolean` | NO | `false` |
| 13 | `calle` | `text` | SÍ | — |
| 14 | `colonia` | `text` | SÍ | — |
| 15 | `entre_calles` | `text` | SÍ | — |
| 16 | `referencia_ubicacion` | `text` | SÍ | — |
| 17 | `municipio` | `text` | NO | `'San Juan del Río'::character varying` |
| 18 | `tipo_emergencia_id` | `integer` | SÍ | — |
| 19 | `tipo_incidente_id` | `integer` | SÍ | — |
| 20 | `prioridad_id` | `integer` | SÍ | — |
| 21 | `descripcion` | `text` | SÍ | — |
| 22 | `observaciones` | `text` | SÍ | — |
| 23 | `fecha_hora_inicio` | `timestamp` | NO | — |
| 24 | `fecha_hora_fin` | `timestamp` | SÍ | — |
| 25 | `grupo_whatsapp` | `text` | SÍ | — |
| 26 | `nombre_oficial` | `text` | SÍ | — |
| 27 | `medio_canalizacion_id` | `integer` | SÍ | — |
| 28 | `requiere_despacho` | `boolean` | NO | `false` |
| 29 | `estatus` | `text` | NO | `'sin_despachar'::character varying` |
| 30 | `capturado_por` | `text` | NO | — |
| 31 | `creado_en` | `timestamp` | NO | `now()` |
| 32 | `actualizado_en` | `timestamp` | NO | `now()` |
| 33 | `latitud` | `numeric` | SÍ | — |
| 34 | `longitud` | `numeric` | SÍ | — |
| 35 | `numero_exterior` | `text` | SÍ | — |
| 36 | `numero_interior` | `text` | SÍ | — |
| 37 | `origen_rondin` | `boolean` | SÍ | `false` |
| 38 | `folio_cad` | `text` | SÍ | — |
| 39 | `svv_notificado` | `boolean` | SÍ | `false` |
| 40 | `dependencia_id` | `integer` | SÍ | — |
| 41 | `telefono_reportante` | `text` | SÍ | — |

### \`incidentes_camara\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | `CURRENT_DATE` |
| 3 | `registrado_por` | `text` | NO | — |
| 4 | `personas_sin_novedad` | `integer` | SÍ | `0` |
| 5 | `personas_con_antecedentes` | `integer` | SÍ | `0` |
| 6 | `vehiculos_revisar` | `integer` | SÍ | `0` |
| 7 | `vehiculos_repuve` | `integer` | SÍ | `0` |
| 8 | `persecuciones` | `integer` | SÍ | `0` |
| 9 | `asegurados_camara` | `integer` | SÍ | `0` |
| 10 | `vehiculos_recuperados` | `integer` | SÍ | `0` |
| 11 | `incendios` | `integer` | SÍ | `0` |
| 12 | `hechos_transito` | `integer` | SÍ | `0` |
| 13 | `motos_revisadas` | `integer` | SÍ | `0` |
| 14 | `total_personas_revisadas` | `integer` | SÍ | `0` |
| 15 | `creado_en` | `timestamp` | SÍ | `now()` |
| 16 | `turno` | `text` | NO | `'MATUTINO'::text` |

### \`iph_detenidos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `folio` | `text` | NO | — |
| 3 | `usuario_registra` | `uuid` | SÍ | — |
| 4 | `estatus` | `text` | NO | `'CAPTURADO'::character varying` |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `fecha_creacion` | `timestamp` | NO | `now()` |
| 7 | `fecha_actualizacion` | `timestamp` | SÍ | — |
| 8 | `fecha_nacimiento` | `date` | SÍ | — |
| 9 | `edad` | `integer` | SÍ | — |
| 10 | `genero` | `text` | SÍ | — |
| 11 | `alias` | `text` | SÍ | — |
| 12 | `ciudad_origen` | `text` | SÍ | — |
| 13 | `calle_detenido` | `text` | SÍ | — |
| 14 | `numero_detenido` | `text` | SÍ | — |
| 15 | `colonia_detenido` | `text` | SÍ | — |
| 16 | `articulo` | `text` | SÍ | — |
| 17 | `tipo_falta` | `text` | SÍ | — |
| 18 | `rnd` | `text` | SÍ | — |
| 19 | `calle_arresto` | `text` | SÍ | — |
| 20 | `colonia_arresto` | `text` | SÍ | — |
| 21 | `sector_arresto` | `text` | SÍ | — |
| 22 | `agrupamiento_arresto` | `text` | SÍ | — |
| 23 | `latitud_arresto` | `numeric` | SÍ | — |
| 24 | `longitud_arresto` | `numeric` | SÍ | — |
| 25 | `presencia` | `boolean` | SÍ | `false` |
| 26 | `verbalizacion` | `boolean` | SÍ | `false` |
| 27 | `control_contacto` | `boolean` | SÍ | `false` |
| 28 | `control_fisico` | `boolean` | SÍ | `false` |
| 29 | `tecnicas_no_letales` | `boolean` | SÍ | `false` |
| 30 | `fuerza_letal` | `boolean` | SÍ | `false` |
| 31 | `folio_iph` | `text` | SÍ | — |
| 32 | `folio_911` | `text` | SÍ | — |
| 33 | `dia_evento` | `text` | SÍ | — |
| 34 | `fecha_evento` | `date` | SÍ | — |
| 35 | `fecha_reporte` | `date` | SÍ | — |
| 36 | `hora_reporte` | `time without time zone` | SÍ | — |
| 37 | `hora_inicio_evento` | `time without time zone` | SÍ | — |
| 38 | `hora_final_evento` | `time without time zone` | SÍ | — |
| 39 | `hora_promedio` | `time without time zone` | SÍ | — |
| 40 | `delito` | `text` | SÍ | — |
| 41 | `modus_operandi` | `text` | SÍ | — |
| 42 | `articulos_objetos` | `text` | SÍ | — |
| 43 | `calle_hecho` | `text` | SÍ | — |
| 44 | `numero_hecho` | `text` | SÍ | — |
| 45 | `colonia_hecho` | `text` | SÍ | — |
| 46 | `latitud_hecho` | `numeric` | SÍ | — |
| 47 | `longitud_hecho` | `numeric` | SÍ | — |
| 48 | `sector_hecho` | `text` | SÍ | — |
| 49 | `rt_responsable` | `text` | SÍ | — |
| 50 | `turno_responsable` | `text` | SÍ | — |
| 51 | `crp_unidad` | `text` | SÍ | — |
| 52 | `nombre_afectado` | `text` | SÍ | — |
| 53 | `telefono_afectado` | `text` | SÍ | — |
| 54 | `calle_afectado` | `text` | SÍ | — |
| 55 | `numero_afectado` | `text` | SÍ | — |
| 56 | `colonia_afectado` | `text` | SÍ | — |
| 57 | `marca_vehiculo` | `text` | SÍ | — |
| 58 | `submarca_vehiculo` | `text` | SÍ | — |
| 59 | `tipo_vehiculo` | `text` | SÍ | — |
| 60 | `color_vehiculo` | `text` | SÍ | — |
| 61 | `placas_vehiculo` | `text` | SÍ | — |
| 62 | `estado_vehiculo` | `text` | SÍ | — |
| 63 | `niv_vehiculo` | `text` | SÍ | — |
| 64 | `motor_vehiculo` | `text` | SÍ | — |
| 65 | `modelo_vehiculo` | `text` | SÍ | — |
| 66 | `ap_nuc` | `text` | SÍ | — |
| 67 | `fuero` | `text` | SÍ | — |
| 68 | `agente_aprehensor` | `text` | SÍ | — |
| 69 | `es_rnd` | `boolean` | NO | `false` |
| 70 | `reporte_denuncia_id` | `uuid` | SÍ | — |
| 71 | `ficha_inteligencia_completa` | `boolean` | SÍ | `false` |
| 72 | `ficha_inteligencia_id` | `uuid` | SÍ | — |
| 73 | `actualizado_en` | `timestamp` | SÍ | `now()` |

### \`medida_autoridades_adicionales\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `medida_id` | `uuid` | NO | — |
| 3 | `autoridad` | `text` | NO | — |
| 4 | `n_oficio` | `text` | SÍ | — |
| 5 | `fecha_oficio` | `date` | SÍ | — |
| 6 | `creado_por` | `text` | SÍ | — |
| 7 | `creado_en` | `timestamp` | NO | `now()` |

### \`medidas_proteccion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `expediente` | `text` | NO | — |
| 3 | `n_oficio` | `text` | NO | — |
| 4 | `fecha_oficio` | `date` | NO | — |
| 5 | `fecha_recepcion` | `date` | NO | — |
| 6 | `persona_recepciona` | `text` | NO | — |
| 7 | `autoridad` | `text` | NO | — |
| 8 | `nombre_autoridad` | `text` | SÍ | — |
| 9 | `delitos` | `text` | SÍ | — |
| 10 | `victima` | `text` | NO | — |
| 11 | `demandado` | `text` | SÍ | — |
| 12 | `tipo_medida` | `text` | SÍ | — |
| 13 | `domicilio_proteccion` | `text` | NO | — |
| 14 | `colonia` | `text` | SÍ | — |
| 15 | `telefono` | `text` | SÍ | — |
| 16 | `tiempo_medida` | `text` | SÍ | — |
| 17 | `fecha_vencimiento` | `date` | SÍ | — |
| 18 | `tipo_apercibimiento` | `text` | SÍ | — |
| 19 | `enlace` | `text` | SÍ | — |
| 20 | `observaciones` | `text` | SÍ | — |
| 21 | `status` | `text` | NO | `'activa'::character varying` |
| 22 | `creado_por` | `text` | SÍ | — |
| 23 | `creado_en` | `timestamp` | NO | `now()` |
| 24 | `actualizado_en` | `timestamp` | NO | `now()` |
| 25 | `prorrogada` | `boolean` | NO | `false` |
| 26 | `archivo_prorroga_url` | `text` | SÍ | — |

### \`modulos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('modulos_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `ruta` | `text` | SÍ | — |
| 5 | `icono` | `text` | SÍ | — |
| 6 | `padre_id` | `integer` | SÍ | — |
| 7 | `orden` | `integer` | NO | `0` |
| 8 | `activo` | `boolean` | NO | `true` |

### \`moni_evidencias_denuncia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('moni_evidencias_denuncia_id_seq'::regclass)` |
| 2 | `ofi_reporte_denuncia_id` | `uuid` | NO | — |
| 3 | `solicitud_id` | `uuid` | NO | — |
| 4 | `url_archivo` | `text` | NO | — |
| 5 | `nombre_archivo` | `text` | SÍ | — |
| 6 | `creado_por_id` | `integer` | SÍ | — |
| 7 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |

### \`monitorista_historial\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `monitorista_id` | `text` | NO | — |
| 3 | `accion` | `text` | NO | — |
| 4 | `solicitud_id` | `uuid` | SÍ | — |
| 5 | `incidente_id` | `uuid` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`notificaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `user_id` | `text` | NO | — |
| 3 | `tipo` | `text` | NO | — |
| 4 | `titulo` | `text` | NO | — |
| 5 | `mensaje` | `text` | NO | — |
| 6 | `href` | `text` | SÍ | — |
| 7 | `leida` | `boolean` | NO | `false` |
| 8 | `ficha_id` | `uuid` | SÍ | — |
| 9 | `hito` | `text` | SÍ | — |
| 10 | `creado_en` | `timestamp` | NO | `now()` |

### \`novedades_captura\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `capturado_por` | `text` | NO | — |
| 4 | `datos` | `jsonb` | SÍ | `'{}'::jsonb` |
| 5 | `creado_en` | `timestamp` | SÍ | `now()` |

### \`ofi_detalles_asegurados\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `reporte_campo_id` | `uuid` | NO | — |
| 3 | `nombre_detenido` | `text` | NO | — |
| 4 | `ap_paterno_detenido` | `text` | SÍ | — |
| 5 | `ap_materno_detenido` | `text` | SÍ | — |
| 6 | `calle` | `text` | SÍ | — |
| 7 | `colonia` | `text` | SÍ | — |
| 8 | `numero` | `text` | SÍ | — |
| 9 | `cod_postal` | `text` | SÍ | — |
| 10 | `latitud` | `numeric` | SÍ | — |
| 11 | `longitud` | `numeric` | SÍ | — |
| 12 | `created_at` | `timestamp` | SÍ | `now()` |
| 13 | `updated_at` | `timestamp` | SÍ | `now()` |

### \`ofi_fichas_inteligencia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `iph_id` | `uuid` | NO | — |
| 3 | `reporte_campo_id` | `uuid` | NO | — |
| 4 | `origen` | `text` | SÍ | — |
| 5 | `escolaridad` | `text` | SÍ | — |
| 6 | `estado_civil` | `text` | SÍ | — |
| 7 | `ocupacion` | `text` | SÍ | — |
| 8 | `rasgos_particulares` | `text` | SÍ | — |
| 9 | `eventos_delictivos` | `text` | SÍ | — |
| 10 | `fecha_hora_analisis` | `timestamp` | SÍ | — |
| 11 | `expediente_judicial` | `text` | SÍ | — |
| 12 | `nexos_delictivos` | `text` | SÍ | — |
| 13 | `zona_operacion` | `text` | SÍ | — |
| 14 | `puesta_disposicion` | `text` | SÍ | — |
| 15 | `antecedentes_penales` | `text` | SÍ | — |
| 16 | `foto_frontal_url` | `text` | SÍ | — |
| 17 | `foto_objetos_url` | `text` | SÍ | — |
| 18 | `capturado_por` | `text` | NO | — |
| 19 | `created_at` | `timestamp` | SÍ | `now()` |

### \`ofi_oficiales\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `ofi_estatus` | `text` | SÍ | `'activo'::character varying` |
| 3 | `created_at` | `timestamp` | SÍ | `now()` |
| 4 | `updated_at` | `timestamp` | SÍ | `now()` |
| 5 | `user_id` | `text` | NO | — |
| 6 | `no_nomina` | `text` | SÍ | — |
| 7 | `numero_empleado` | `text` | SÍ | — |
| 8 | `telefono` | `text` | SÍ | — |
| 9 | `patrulla_id` | `uuid` | SÍ | — |
| 10 | `departamento_id` | `uuid` | SÍ | — |

### \`ofi_puesta_disposicion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `reporte_campo_id` | `uuid` | NO | — |
| 3 | `gestion_interna` | `boolean` | NO | — |
| 4 | `dependencia_externa` | `text` | SÍ | — |
| 5 | `actas` | `jsonb` | NO | `'{}'::jsonb` |
| 6 | `otros_actos` | `text` | SÍ | — |
| 7 | `hora_inicio_traslado` | `time without time zone` | NO | — |
| 8 | `hora_llegada_sede` | `time without time zone` | NO | — |
| 9 | `tiempo_traslado_total` | `integer` | NO | — |
| 10 | `hora_puesta_disposicion` | `time without time zone` | NO | — |
| 11 | `creado_por` | `text` | NO | — |
| 12 | `creado_en` | `timestamp` | NO | `now()` |
| 13 | `completado_en` | `timestamp` | SÍ | — |

### \`ofi_reporte_denuncia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `folio_denuncia` | `text` | NO | — |
| 3 | `iph` | `text` | SÍ | — |
| 4 | `folio_cu` | `text` | SÍ | — |
| 5 | `corporacion` | `text` | SÍ | `'SSPM'::character varying` |
| 6 | `sector` | `text` | SÍ | — |
| 7 | `grupo_adscripcion` | `text` | SÍ | — |
| 8 | `fecha_reporte` | `date` | NO | — |
| 9 | `hora_reporte` | `time without time zone` | NO | — |
| 10 | `fecha_avistamiento` | `date` | SÍ | — |
| 11 | `hora_avistamiento` | `time without time zone` | SÍ | — |
| 12 | `fecha_despacho` | `date` | SÍ | — |
| 13 | `hora_despacho` | `time without time zone` | SÍ | — |
| 14 | `fecha_confirmacion` | `date` | SÍ | — |
| 15 | `hora_confirmacion` | `time without time zone` | SÍ | — |
| 16 | `fecha_llegada` | `date` | SÍ | — |
| 17 | `hora_llegada` | `time without time zone` | SÍ | — |
| 18 | `hora_inicio_denuncia` | `time without time zone` | SÍ | — |
| 19 | `hora_fin_denuncia` | `time without time zone` | SÍ | — |
| 20 | `hora_termino_atencion` | `time without time zone` | SÍ | — |
| 21 | `hora_cuestionario` | `time without time zone` | SÍ | — |
| 22 | `lugar_hecho` | `text` | SÍ | — |
| 23 | `lugar_apoyo` | `text` | SÍ | — |
| 24 | `colonia_hecho` | `text` | SÍ | — |
| 25 | `colonia_apoyo` | `text` | SÍ | — |
| 26 | `municipio` | `text` | SÍ | `'San Juan del Río'::character varying` |
| 27 | `latitud` | `numeric` | SÍ | — |
| 28 | `longitud` | `numeric` | SÍ | — |
| 29 | `nomina_mando` | `text` | SÍ | — |
| 30 | `policia_a_cargo` | `text` | SÍ | — |
| 31 | `policia_denuncia` | `text` | SÍ | — |
| 32 | `policia_firma_d1` | `text` | SÍ | — |
| 33 | `policia_ingresa_cu` | `text` | SÍ | — |
| 34 | `tipo_evento` | `text` | NO | — |
| 35 | `delito` | `text` | NO | — |
| 36 | `violencia` | `boolean` | SÍ | `false` |
| 37 | `crp` | `text` | SÍ | — |
| 38 | `requirio_tablet` | `boolean` | SÍ | `false` |
| 39 | `funcionaba_tablet` | `boolean` | SÍ | `false` |
| 40 | `ofendido_hombre` | `integer` | SÍ | `0` |
| 41 | `ofendido_mujer` | `integer` | SÍ | `0` |
| 42 | `num_cuestionarios` | `integer` | SÍ | `0` |
| 43 | `intervino_gs` | `boolean` | SÍ | `false` |
| 44 | `se_genero_d1` | `boolean` | SÍ | `false` |
| 45 | `se_va_a_generar_d1` | `boolean` | SÍ | `false` |
| 46 | `observaciones` | `text` | SÍ | — |
| 47 | `capturado_por` | `text` | NO | — |
| 48 | `created_at` | `timestamp` | SÍ | `now()` |
| 49 | `updated_at` | `timestamp` | SÍ | `now()` |
| 50 | `reporte_campo_id` | `uuid` | SÍ | — |
| 51 | `estado_tramite` | `text` | NO | `'RECIBIDA'::character varying` |
| 52 | `estado_evidencia` | `text` | NO | `'SIN_SOLICITUD'::character varying` |
| 53 | `monitorista_fechas_requeridas` | `jsonb` | NO | `'[]'::jsonb` |
| 54 | `num_carpeta_investigacion` | `text` | SÍ | — |
| 55 | `fecha_cierre` | `timestamp` | SÍ | — |
| 56 | `oficial_id` | `text` | SÍ | — |
| 57 | `folio_sija` | `text` | SÍ | `NULL::character varying` |
| 58 | `registro_tableta` | `boolean` | SÍ | `false` |
| 59 | `folio_remision` | `text` | SÍ | `NULL::character varying` |
| 60 | `marco_legal` | `text` | SÍ | — |
| 61 | `domicilio_calle` | `text` | SÍ | `NULL::character varying` |
| 62 | `domicilio_numero` | `text` | SÍ | `NULL::character varying` |
| 63 | `domicilio_colonia` | `text` | SÍ | `NULL::character varying` |
| 64 | `domicilio_municipio` | `text` | SÍ | `NULL::character varying` |
| 65 | `incidente_id` | `uuid` | SÍ | — |

### \`ofi_reportes_campo\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `ofi_folio_cad` | `text` | SÍ | `'S/C'::character varying` |
| 3 | `ofi_nombre_reportante` | `text` | SÍ | — |
| 4 | `ofi_anonimo` | `boolean` | SÍ | `false` |
| 5 | `ofi_tipo_incidente` | `text` | SÍ | — |
| 6 | `ofi_tipo_emergencia` | `text` | SÍ | — |
| 7 | `ofi_prioridad` | `text` | SÍ | — |
| 8 | `ofi_descripcion` | `text` | SÍ | — |
| 9 | `ofi_contenido_reporte` | `text` | SÍ | — |
| 10 | `ofi_calle` | `text` | SÍ | — |
| 11 | `ofi_colonia` | `text` | SÍ | — |
| 12 | `ofi_latitud` | `numeric` | SÍ | — |
| 13 | `ofi_longitud` | `numeric` | SÍ | — |
| 14 | `ofi_datos_pn` | `text` | SÍ | — |
| 15 | `ofi_acciones` | `text` | SÍ | — |
| 16 | `ofi_hay_detencion` | `boolean` | SÍ | `false` |
| 17 | `ofi_detenidos` | `jsonb` | SÍ | `'[]'::jsonb` |
| 18 | `ofi_autoridad_recibe` | `text` | SÍ | — |
| 19 | `ofi_monto_robo` | `numeric` | SÍ | — |
| 20 | `ofi_objetos_recuperados` | `text` | SÍ | — |
| 21 | `ofi_hay_vehiculo` | `boolean` | SÍ | `false` |
| 22 | `ofi_vehiculos` | `jsonb` | SÍ | `'[]'::jsonb` |
| 23 | `ofi_hay_cateo` | `boolean` | SÍ | `false` |
| 24 | `ofi_cateo` | `jsonb` | SÍ | — |
| 25 | `ofi_resultado_cateo` | `text` | SÍ | — |
| 26 | `ofi_estatus` | `text` | SÍ | `'registrado'::character varying` |
| 27 | `created_at` | `timestamp` | SÍ | `now()` |
| 28 | `updated_at` | `timestamp` | SÍ | `now()` |
| 29 | `ofi_oficial_id` | `uuid` | SÍ | — |
| 30 | `quiere_denuncia` | `boolean` | SÍ | `false` |
| 31 | `folio_reporte_campo` | `text` | SÍ | — |
| 32 | `modus_operandi` | `text` | SÍ | — |
| 33 | `falta_administrativa` | `text` | SÍ | — |
| 34 | `delito` | `text` | SÍ | — |
| 35 | `marco_legal` | `text` | SÍ | — |
| 36 | `ofi_hay_robo` | `boolean` | SÍ | `false` |
| 37 | `ofi_hay_orden_aprehension` | `boolean` | SÍ | `false` |
| 38 | `ofi_ordenes_aprehension` | `jsonb` | SÍ | `'[]'::jsonb` |
| 39 | `ofi_hay_hidrocarburo` | `boolean` | SÍ | `false` |
| 40 | `ofi_hidrocarburos` | `jsonb` | SÍ | `'[]'::jsonb` |
| 41 | `ofi_hay_arma_fuego` | `boolean` | SÍ | `false` |
| 42 | `ofi_armas_fuego` | `jsonb` | SÍ | `'[]'::jsonb` |
| 43 | `ofi_hay_droga` | `boolean` | SÍ | `false` |
| 44 | `ofi_drogas` | `jsonb` | SÍ | `'[]'::jsonb` |
| 45 | `ofi_telefono_reportante` | `text` | SÍ | — |
| 46 | `ofi_observaciones` | `text` | SÍ | — |
| 47 | `folio_reporte_asegurados` | `text` | SÍ | — |
| 48 | `ofi_apoyo_fiestas_patronales` | `boolean` | SÍ | `false` |
| 49 | `ofi_operativos_metropolitano` | `boolean` | SÍ | `false` |
| 50 | `ofi_eco8` | `boolean` | SÍ | `false` |
| 51 | `ofi_alcoholimetria` | `boolean` | SÍ | `false` |
| 52 | `ofi_motocicletas` | `boolean` | SÍ | `false` |
| 53 | `ofi_apoyo_actuarios` | `boolean` | SÍ | `false` |
| 54 | `ofi_apoyo_cateos_fgr` | `boolean` | SÍ | `false` |
| 55 | `ofi_apoyo_cateos_fge` | `boolean` | SÍ | `false` |
| 56 | `ofi_armas_blancas` | `jsonb` | SÍ | `'[]'::jsonb` |
| 57 | `ofi_hay_arma_blanca` | `boolean` | SÍ | `false` |
| 58 | `incidente_id` | `uuid` | SÍ | — |
| 59 | `ofi_entre_calles` | `text` | SÍ | — |
| 60 | `ofi_referencia` | `text` | SÍ | — |
| 61 | `expediente_ci` | `text` | SÍ | — |
| 62 | `personal_ingreso_ci` | `text` | SÍ | — |
| 63 | `tipo_emergencia_id` | `integer` | SÍ | — |
| 64 | `tipo_incidente_id` | `integer` | SÍ | — |
| 65 | `prioridad_id` | `integer` | SÍ | — |

### \`permisos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `usuario_id` | `text` | NO | — |
| 3 | `seccion` | `text` | NO | — |
| 4 | `puede_ver` | `boolean` | NO | `true` |
| 5 | `puede_crear` | `boolean` | NO | `true` |
| 6 | `puede_editar` | `boolean` | NO | `true` |
| 7 | `creado_en` | `timestamp` | NO | `now()` |
| 8 | `puede_eliminar` | `boolean` | NO | `true` |

### \`permisos_plantillas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `integer` | NO | — |
| 3 | `seccion` | `text` | NO | — |
| 4 | `puede_ver` | `boolean` | NO | `true` |
| 5 | `puede_crear` | `boolean` | NO | `true` |
| 6 | `puede_editar` | `boolean` | NO | `true` |
| 7 | `creado_en` | `timestamp` | NO | `now()` |
| 8 | `puede_eliminar` | `boolean` | NO | `true` |

### \`rol_asignaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `uuid` | NO | — |
| 3 | `seccion` | `text` | NO | — |
| 4 | `unidad_ext_id` | `text` | SÍ | — |
| 5 | `unidad_placa` | `text` | SÍ | — |
| 6 | `elemento_ext_id` | `text` | SÍ | — |
| 7 | `elemento_nomina` | `text` | SÍ | — |
| 8 | `elemento_nombre` | `text` | SÍ | — |
| 9 | `zona` | `text` | SÍ | — |
| 10 | `servicio` | `text` | SÍ | — |
| 11 | `radio_id` | `integer` | SÍ | — |
| 12 | `body_cam_id` | `integer` | SÍ | — |
| 13 | `orden` | `integer` | NO | `0` |
| 14 | `creado_en` | `timestamp` | NO | `now()` |

### \`rol_estado_fuerza\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `uuid` | NO | — |
| 3 | `concepto_id` | `integer` | NO | — |
| 4 | `cantidad` | `integer` | NO | `0` |

### \`rol_observaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `uuid` | NO | — |
| 3 | `tipo_id` | `integer` | NO | — |
| 4 | `descripcion` | `text` | SÍ | — |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

### \`roles\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('roles_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `descripcion` | `text` | SÍ | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |
| 6 | `es_admin` | `boolean` | NO | `false` |

### \`roles_servicio\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `folio` | `text` | NO | — |
| 3 | `folio_consecutivo` | `integer` | NO | — |
| 4 | `turno` | `text` | NO | — |
| 5 | `horario_inicio` | `time without time zone` | SÍ | — |
| 6 | `horario_fin` | `time without time zone` | SÍ | — |
| 7 | `responsable_turno` | `text` | SÍ | — |
| 8 | `sector_id` | `integer` | SÍ | — |
| 9 | `fecha` | `date` | NO | — |
| 10 | `fundamento_legal` | `text` | SÍ | — |
| 11 | `status` | `text` | NO | `'borrador'::character varying` |
| 12 | `firma_responsable_url` | `text` | SÍ | — |
| 13 | `firma_jefe_sectorial_url` | `text` | SÍ | — |
| 14 | `firmado_por` | `text` | SÍ | — |
| 15 | `firmado_en` | `timestamp` | SÍ | — |
| 16 | `creado_por` | `text` | SÍ | — |
| 17 | `creado_en` | `timestamp` | NO | `now()` |
| 18 | `actualizado_en` | `timestamp` | NO | `now()` |

### \`seguimientos_busqueda\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `ficha_id` | `uuid` | NO | — |
| 3 | `tipo` | `text` | NO | — |
| 4 | `fecha_hora_envio` | `timestamp` | NO | — |
| 5 | `registrado_por` | `text` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |
| 7 | `archivo_url` | `text` | SÍ | — |

### \`sessions\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `expires_at` | `timestamp` | NO | — |
| 3 | `token` | `text` | NO | — |
| 4 | `created_at` | `timestamp` | NO | `now()` |
| 5 | `updated_at` | `timestamp` | NO | `now()` |
| 6 | `ip_address` | `text` | SÍ | — |
| 7 | `user_agent` | `text` | SÍ | — |
| 8 | `user_id` | `text` | NO | — |

### \`solicitud_fotos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `tipo_foto` | `text` | NO | — |
| 3 | `enviado_a` | `text` | SÍ | — |
| 4 | `estado` | `text` | NO | `'pendiente'::character varying` |
| 5 | `reporte_campo_id` | `uuid` | NO | — |

### \`solicitudes_c4_internas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `solicitud_id` | `uuid` | NO | — |
| 3 | `descripcion_evidencias` | `text` | NO | — |
| 4 | `status` | `text` | NO | `'pendiente'::character varying` |
| 5 | `creado_por` | `text` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

### \`solicitudes_detenido\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `nombre_detenido` | `text` | NO | — |
| 3 | `folio` | `text` | NO | — |
| 4 | `tipo_evento` | `text` | SÍ | — |
| 5 | `delitos` | `text` | SÍ | — |
| 6 | `falta_admin` | `text` | SÍ | — |
| 7 | `modus_operandi` | `text` | SÍ | — |
| 8 | `solicitado_por` | `text` | NO | — |
| 9 | `creado_en` | `timestamp` | SÍ | `now()` |
| 10 | `completado_en` | `timestamp` | SÍ | — |

### \`solicitudes_evidencia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `folio_incidente` | `text` | SÍ | — |
| 4 | `solicitado_por` | `text` | NO | — |
| 5 | `solicitado_nombre` | `text` | SÍ | — |
| 6 | `descripcion` | `text` | NO | — |
| 7 | `status` | `text` | NO | `'pendiente'::character varying` |
| 8 | `creado_en` | `timestamp` | NO | `now()` |
| 9 | `completado_en` | `timestamp` | SÍ | — |

### \`solicitudes_informacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `enlace` | `text` | SÍ | — |
| 3 | `oficio` | `text` | NO | — |
| 4 | `fecha_activacion` | `timestamp` | NO | — |
| 5 | `autoridad` | `text` | NO | — |
| 6 | `fiscal_solicita` | `text` | SÍ | — |
| 7 | `delito` | `text` | SÍ | — |
| 8 | `carpeta_investigacion` | `text` | SÍ | — |
| 9 | `solicitud_texto` | `text` | SÍ | — |
| 10 | `fecha_aceptacion` | `timestamp` | SÍ | — |
| 11 | `status` | `text` | NO | `'nuevo'::character varying` |
| 12 | `creado_por` | `text` | SÍ | — |
| 13 | `creado_en` | `timestamp` | NO | `now()` |
| 14 | `actualizado_en` | `timestamp` | NO | `now()` |

### \`two_factors\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `secret` | `text` | NO | — |
| 3 | `backup_codes` | `text` | NO | — |
| 4 | `user_id` | `text` | NO | — |
| 5 | `verified` | `boolean` | SÍ | `false` |

### \`users\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `name` | `text` | NO | — |
| 3 | `apellido` | `text` | NO | `''::character varying` |
| 4 | `email` | `text` | NO | — |
| 5 | `email_verified` | `boolean` | NO | `false` |
| 6 | `image` | `text` | SÍ | — |
| 7 | `rol_id` | `integer` | SÍ | — |
| 8 | `activo` | `boolean` | NO | `true` |
| 9 | `two_factor_enabled` | `boolean` | SÍ | `false` |
| 10 | `created_at` | `timestamp` | NO | `now()` |
| 11 | `updated_at` | `timestamp` | NO | `now()` |
| 12 | `dependencia_id` | `integer` | SÍ | — |

### \`usuario_modulos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('usuario_modulos_id_seq'::regclass)` |
| 2 | `user_id` | `text` | NO | — |
| 3 | `modulo_id` | `integer` | NO | — |
| 4 | `puede_ver` | `boolean` | NO | `true` |

### \`verifications\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `identifier` | `text` | NO | — |
| 3 | `value` | `text` | NO | — |
| 4 | `expires_at` | `timestamp` | NO | — |
| 5 | `created_at` | `timestamp` | NO | `now()` |
| 6 | `updated_at` | `timestamp` | NO | `now()` |

### \`visitas_domiciliarias\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `medida_id` | `uuid` | NO | — |
| 3 | `fecha_visita` | `date` | NO | — |
| 4 | `hora_visita` | `text` | NO | — |
| 5 | `resultado` | `text` | SÍ | — |
| 6 | `apercibimiento_aplicado` | `boolean` | SÍ | `false` |
| 7 | `registrado_por` | `text` | SÍ | — |
| 8 | `creado_en` | `timestamp` | NO | `now()` |

## Schema \`via\`

### \`roles_permisos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('via.roles_permisos_id_seq'::regclass)` |
| 2 | `rol_id` | `integer` | NO | — |
| 3 | `permiso_id` | `uuid` | NO | — |
| 4 | `created_at` | `timestamp` | SÍ | `now()` |

### \`sectores\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id_sector` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `nombre_sector` | `text` | NO | — |
| 3 | `activo` | `boolean` | NO | `true` |

### \`usuarios\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `cus_id` | `text` | NO | — |
| 3 | `curp` | `character` | NO | — |
| 4 | `nombres` | `text` | NO | — |
| 5 | `apellido_p` | `text` | NO | — |
| 6 | `apellido_m` | `text` | SÍ | — |
| 7 | `correo` | `text` | NO | — |
| 8 | `correo_sec` | `text` | SÍ | — |
| 9 | `activo` | `boolean` | NO | `true` |
| 10 | `creado_en` | `timestamp` | NO | `now()` |
| 11 | `actualizado_en` | `timestamp` | NO | `now()` |

### \`v2_articulos_ley\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `numero` | `text` | NO | — |
| 3 | `descripcion` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |

### \`v2_catalogo_conceptos_sa7\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | — |
| 2 | `concept_id` | `text` | NO | — |
| 3 | `code` | `text` | NO | — |
| 4 | `name` | `text` | NO | — |
| 5 | `description` | `text` | SÍ | — |
| 6 | `category` | `text` | SÍ | — |
| 7 | `amount_currency` | `text` | NO | — |
| 8 | `amount_value` | `numeric` | NO | — |
| 9 | `valid_from` | `timestamp` | SÍ | — |
| 10 | `valid_until` | `timestamp` | SÍ | — |
| 11 | `last_updated` | `timestamp` | SÍ | — |
| 12 | `status` | `text` | NO | — |
| 13 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |
| 14 | `updated_at` | `timestamp` | SÍ | — |
| 15 | `clasificacion_type` | `text` | SÍ | — |

### \`v2_departamentos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `activo` | `boolean` | SÍ | `true` |
| 5 | `creado_en` | `timestamp` | SÍ | `now()` |

### \`v2_documentos_liberacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `solicitud_id` | `uuid` | NO | — |
| 3 | `tipo_documento` | `text` | NO | — |
| 4 | `url_documento` | `text` | NO | — |
| 5 | `estatus_revision` | `text` | NO | — |
| 6 | `observaciones` | `text` | SÍ | — |
| 7 | `revisado_por` | `uuid` | SÍ | — |
| 8 | `fecha_revision` | `timestamp` | SÍ | — |
| 9 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |
| 10 | `updated_at` | `timestamp` | SÍ | — |

### \`v2_fracciones_ley\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `articulo_id` | `uuid` | NO | — |
| 3 | `numero` | `text` | NO | — |
| 4 | `descripcion` | `text` | NO | — |
| 5 | `monto_umas` | `numeric` | NO | — |
| 6 | `activo` | `boolean` | NO | `true` |
| 7 | `clasificacion` | `text` | SÍ | — |

### \`v2_gruas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `nombre` | `text` | NO | — |
| 3 | `activo` | `boolean` | NO | `true` |

### \`v2_infracciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `folio` | `text` | NO | — |
| 3 | `seq_valor` | `integer` | NO | — |
| 4 | `estatus` | `text` | NO | — |
| 5 | `oficial_id` | `uuid` | NO | — |
| 6 | `patrulla_id` | `uuid` | SÍ | — |
| 7 | `articulo_id` | `uuid` | NO | — |
| 8 | `fraccion_id` | `uuid` | NO | — |
| 9 | `grua_id` | `uuid` | SÍ | — |
| 10 | `ciudadano_presente` | `boolean` | NO | `true` |
| 11 | `es_titular` | `boolean` | NO | `false` |
| 12 | `presenta_ine` | `boolean` | NO | `false` |
| 13 | `curp_infractor` | `text` | SÍ | — |
| 14 | `nombre_infractor` | `text` | SÍ | — |
| 15 | `apellido_paterno_infractor` | `text` | SÍ | — |
| 16 | `apellido_materno_infractor` | `text` | SÍ | — |
| 17 | `marca` | `text` | SÍ | — |
| 18 | `modelo` | `text` | SÍ | — |
| 19 | `color` | `text` | SÍ | — |
| 20 | `placa` | `text` | SÍ | — |
| 21 | `latitud` | `numeric` | SÍ | — |
| 22 | `longitud` | `numeric` | SÍ | — |
| 23 | `codigo_postal` | `text` | SÍ | — |
| 24 | `colonia` | `text` | SÍ | — |
| 25 | `calle` | `text` | SÍ | — |
| 26 | `numero` | `text` | SÍ | — |
| 27 | `municipio` | `text` | SÍ | — |
| 28 | `estado` | `text` | SÍ | — |
| 29 | `tipo_garantia` | `text` | SÍ | — |
| 30 | `garantia_entregada` | `boolean` | SÍ | `false` |
| 31 | `motivo_retencion` | `text` | SÍ | — |
| 32 | `monto_total` | `numeric` | SÍ | — |
| 33 | `aplica_descuento_inapam` | `boolean` | SÍ | `false` |
| 34 | `descuento_aplicado` | `numeric` | SÍ | — |
| 35 | `fecha_limite_descuento` | `timestamp` | SÍ | — |
| 36 | `monto_final` | `numeric` | SÍ | — |
| 37 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |
| 38 | `updated_at` | `timestamp` | SÍ | — |
| 39 | `correo_infractor` | `text` | SÍ | — |
| 40 | `url_inapam` | `text` | SÍ | — |
| 41 | `url_ine` | `text` | SÍ | — |
| 42 | `url_tarjeta_circulacion` | `text` | SÍ | — |
| 43 | `evidencias` | `jsonb` | SÍ | `'[]'::jsonb` |
| 44 | `dependencia_receptora` | `text` | SÍ | — |
| 45 | `no_oficio_fiscalia` | `text` | SÍ | — |
| 46 | `no_oficio_juzgado` | `text` | SÍ | — |
| 47 | `url_oficio_fiscalia` | `text` | SÍ | — |
| 48 | `url_oficio_juzgado` | `text` | SÍ | — |
| 49 | `estatus_dependencia` | `text` | SÍ | — |
| 50 | `no_carpeta_investigacion` | `text` | SÍ | — |
| 51 | `nombre_titular_liberacion` | `text` | SÍ | — |
| 52 | `appaterno_titular_liberacion` | `text` | SÍ | — |
| 53 | `apmaterno_titular_liberacion` | `text` | SÍ | — |
| 54 | `correo_titular_liberacion` | `text` | SÍ | — |
| 55 | `curp_titular_liberacion` | `text` | SÍ | — |
| 56 | `razon_social_empresa` | `text` | SÍ | — |
| 57 | `anio_vehiculo` | `text` | SÍ | — |
| 58 | `tipo_vehiculo` | `text` | SÍ | — |
| 59 | `url_oficio_pago_corralon` | `text` | SÍ | — |
| 60 | `no_serie_vehiculo` | `text` | SÍ | — |
| 61 | `url_orden_salida_liberaciones` | `text` | SÍ | — |
| 62 | `pin_acceso` | `text` | SÍ | — |
| 63 | `intentos_pin` | `integer` | SÍ | `0` |
| 64 | `bloqueado_pin_hasta` | `timestamp` | SÍ | — |
| 65 | `narrativa_hechos` | `text` | SÍ | — |

### \`v2_ordenes_pago_sa7\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `bigint` | NO | `nextval('via.v2_ordenes_pago_sa7_id_seq'::regclass)` |
| 2 | `infraccion_id` | `uuid` | NO | — |
| 3 | `folio_infraccion` | `text` | NO | — |
| 4 | `nombre_usuario` | `text` | NO | — |
| 5 | `apellidos_usuario` | `text` | NO | — |
| 6 | `concepto_id` | `text` | NO | — |
| 7 | `orden_pago_id` | `text` | NO | — |
| 8 | `estatus` | `text` | NO | — |
| 9 | `url_pago` | `text` | SÍ | — |
| 10 | `url_guardado` | `text` | SÍ | — |
| 11 | `folio_orden` | `text` | SÍ | — |
| 12 | `fecha_vencimiento` | `timestamp` | SÍ | — |
| 13 | `total_pesos` | `numeric` | NO | — |
| 14 | `total_umas` | `numeric` | NO | — |
| 15 | `request_payload` | `jsonb` | SÍ | — |
| 16 | `response_payload` | `jsonb` | SÍ | — |
| 17 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |
| 18 | `updated_at` | `timestamp` | SÍ | — |
| 19 | `vigente` | `boolean` | NO | `true` |

### \`v2_patrullas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `numero_unidad` | `text` | NO | — |
| 3 | `placas` | `text` | NO | — |
| 4 | `descripcion` | `text` | SÍ | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `sincronizado_en` | `timestamp` | SÍ | — |

### \`v2_permisos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `modulo` | `text` | NO | — |
| 3 | `accion` | `text` | NO | — |
| 4 | `descripcion` | `text` | NO | — |

### \`v2_solicitudes_liberacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `infraccion_id` | `uuid` | NO | — |
| 3 | `tipo_liberacion` | `text` | NO | — |
| 4 | `es_empresa` | `boolean` | NO | `false` |
| 5 | `nombre_empresa` | `text` | SÍ | — |
| 6 | `rfc_empresa` | `text` | SÍ | — |
| 7 | `estatus` | `text` | NO | — |
| 8 | `created_at` | `timestamp` | SÍ | `CURRENT_TIMESTAMP` |
| 9 | `updated_at` | `timestamp` | SÍ | — |
| 10 | `nombre_resp_fiscal` | `text` | SÍ | — |
| 11 | `appaterno_resp_fiscal` | `text` | SÍ | — |
| 12 | `apmaterno_resp_fiscal` | `text` | SÍ | — |

