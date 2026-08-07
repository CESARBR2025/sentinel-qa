# Esquema de Base de Datos — Sentinel SSPM

> Documentación generada desde `information_schema` el 2026-08-07.
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

**Foreign Keys**

- `accounts_user_id_users_id_fk`: `user_id` → `users(id)`

### \`antecedentes_externos_detenido\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `reporte_campo_id` | `uuid` | NO | — |
| 3 | `tipo` | `text` | NO | — |
| 4 | `descripcion` | `text` | NO | — |
| 5 | `fecha` | `date` | SÍ | — |
| 6 | `lugar` | `text` | SÍ | — |
| 7 | `capturado_por` | `text` | SÍ | — |
| 8 | `created_at` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `antecedentes_externos_detenido_capturado_por_fkey`: `capturado_por` → `users(id)`
- `antecedentes_externos_detenido_reporte_campo_id_fkey`: `reporte_campo_id` → `ofi_reportes_campo(id)`

**Índices**

- `idx_antecedentes_externos_reporte`: `CREATE INDEX idx_antecedentes_externos_reporte ON public.antecedentes_externos_detenido USING btree (reporte_campo_id)`

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

**Foreign Keys**

- `audit_log_user_id_fk`: `user_id` → `users(id)`

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

**Foreign Keys**

- `auxiliar_checklist_capturado_por_fkey`: `capturado_por` → `users(id)`
- `auxiliar_checklist_reporte_campo_id_fkey`: `reporte_campo_id` → `ofi_reportes_campo(id)`
- `auxiliar_checklist_reporte_d1_id_fkey`: `reporte_d1_id` → `ofi_reporte_denuncia(id)`

**Índices**

- `uq_checklist_par`: `CREATE UNIQUE INDEX uq_checklist_par ON public.auxiliar_checklist USING btree (reporte_campo_id, reporte_d1_id)`

### \`cat_body_cams\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_body_cams_id_seq'::regclass)` |
| 2 | `codigo` | `text` | NO | — |
| 3 | `estado` | `text` | NO | `'operativo'::character varying` |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_body_cams_codigo_uq`: `CREATE UNIQUE INDEX cat_body_cams_codigo_uq ON public.cat_body_cams USING btree (codigo)`

### \`cat_dependencias\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_dependencias_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `tipo` | `text` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_dependencias_clave_uq`: `CREATE UNIQUE INDEX cat_dependencias_clave_uq ON public.cat_dependencias USING btree (clave)`

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

**Índices**

- `cat_estado_fuerza_conceptos_codigo_uq`: `CREATE UNIQUE INDEX cat_estado_fuerza_conceptos_codigo_uq ON public.cat_estado_fuerza_conceptos USING btree (codigo)`

### \`cat_grupos_adscripcion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_grupos_adscripcion_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `autoridad` | `text` | NO | — |
| 5 | `activo` | `boolean` | SÍ | `true` |
| 6 | `orden` | `integer` | SÍ | `0` |

**Índices**

- `cat_grupos_adscripcion_clave_key`: `CREATE UNIQUE INDEX cat_grupos_adscripcion_clave_key ON public.cat_grupos_adscripcion USING btree (clave)`

### \`cat_medios_canalizacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_medios_canalizacion_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_medios_canalizacion_clave_uq`: `CREATE UNIQUE INDEX cat_medios_canalizacion_clave_uq ON public.cat_medios_canalizacion USING btree (clave)`

### \`cat_prioridades\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_prioridades_id_seq'::regclass)` |
| 2 | `clave` | `text` | NO | — |
| 3 | `nombre` | `text` | NO | — |
| 4 | `orden` | `integer` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |

**Índices**

- `cat_prioridades_clave_uq`: `CREATE UNIQUE INDEX cat_prioridades_clave_uq ON public.cat_prioridades USING btree (clave)`

### \`cat_radios\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_radios_id_seq'::regclass)` |
| 2 | `codigo` | `text` | NO | — |
| 3 | `tipo` | `text` | SÍ | — |
| 4 | `estado` | `text` | NO | `'operativo'::character varying` |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_radios_codigo_uq`: `CREATE UNIQUE INDEX cat_radios_codigo_uq ON public.cat_radios USING btree (codigo)`

### \`cat_sectores\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_sectores_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `clave` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_sectores_clave_uq`: `CREATE UNIQUE INDEX cat_sectores_clave_uq ON public.cat_sectores USING btree (clave)`

### \`cat_subtipos_emergencia\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_subtipos_emergencia_id_seq'::regclass)` |
| 2 | `tipo_emergencia_id` | `integer` | NO | — |
| 3 | `codigo` | `text` | NO | — |
| 4 | `nombre` | `text` | NO | — |
| 5 | `activo` | `boolean` | NO | `true` |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `cat_subtipos_emergencia_tipo_emergencia_id_fkey`: `tipo_emergencia_id` → `cat_tipos_emergencia(id)`

**Índices**

- `cat_subtipos_emergencia_tipo_codigo_key`: `CREATE UNIQUE INDEX cat_subtipos_emergencia_tipo_codigo_key ON public.cat_subtipos_emergencia USING btree (tipo_emergencia_id, codigo)`

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

**Foreign Keys**

- `cat_tipos_emergencia_dependencia_sugerida_id_fkey`: `dependencia_sugerida_id` → `cat_dependencias(id)`

**Índices**

- `cat_tipos_emergencia_clave_uq`: `CREATE UNIQUE INDEX cat_tipos_emergencia_clave_uq ON public.cat_tipos_emergencia USING btree (clave)`
- `cat_tipos_emergencia_codigo_key`: `CREATE UNIQUE INDEX cat_tipos_emergencia_codigo_key ON public.cat_tipos_emergencia USING btree (codigo)`

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

**Foreign Keys**

- `cat_tipos_incidente_subtipo_emergencia_id_fkey`: `subtipo_emergencia_id` → `cat_subtipos_emergencia(id)`

**Índices**

- `cat_tipos_incidente_clave_uq`: `CREATE UNIQUE INDEX cat_tipos_incidente_clave_uq ON public.cat_tipos_incidente USING btree (clave)`

### \`cat_tipos_observacion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('cat_tipos_observacion_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `codigo` | `text` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `cat_tipos_observacion_codigo_uq`: `CREATE UNIQUE INDEX cat_tipos_observacion_codigo_uq ON public.cat_tipos_observacion USING btree (codigo)`

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

**Foreign Keys**

- `contestaciones_creado_por_users_id_fk`: `creado_por` → `users(id)`
- `contestaciones_solicitud_id_solicitudes_informacion_id_fk`: `solicitud_id` → `solicitudes_informacion(id)`

**Índices**

- `contestaciones_solicitud_id_unique`: `CREATE UNIQUE INDEX contestaciones_solicitud_id_unique ON public.contestaciones USING btree (solicitud_id)`

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

**Foreign Keys**

- `evidencias_solicitud_id_fkey`: `solicitud_id` → `solicitudes_evidencia(id)`
- `evidencias_subido_por_fkey`: `subido_por` → `users(id)`

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

**Foreign Keys**

- `evidencias_detenido_reporte_campo_id_fkey`: `reporte_campo_id` → `ofi_reportes_campo(id)`
- `evidencias_detenido_subido_por_fkey`: `subido_por` → `users(id)`

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

**Foreign Keys**

- `fichas_busqueda_creado_por_users_id_fk`: `creado_por` → `users(id)`

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

**Índices**

- `fichas_inteligencia_detenidos_folio_key`: `CREATE UNIQUE INDEX fichas_inteligencia_detenidos_folio_key ON public.fichas_inteligencia_detenidos USING btree (folio)`

### \`formato_incidencia_complemento\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `rt` | `text` | SÍ | — |
| 4 | `turno` | `text` | SÍ | — |
| 5 | `articulos_objetos` | `text` | SÍ | — |
| 6 | `ap_nuc` | `text` | SÍ | — |
| 7 | `calle_afec` | `text` | SÍ | — |
| 8 | `numero_afec` | `text` | SÍ | — |
| 9 | `colonia_afec` | `text` | SÍ | — |
| 10 | `fuero_override` | `text` | SÍ | — |
| 11 | `agrupamiento` | `text` | SÍ | — |
| 12 | `folio_rnd` | `text` | SÍ | — |
| 13 | `originario` | `text` | SÍ | — |
| 14 | `nuc_cu` | `text` | SÍ | — |
| 15 | `edad` | `integer` | SÍ | — |
| 16 | `fecha_nacimiento` | `date` | SÍ | — |
| 17 | `sexo` | `text` | SÍ | — |
| 18 | `calle_det` | `text` | SÍ | — |
| 19 | `numero_det` | `text` | SÍ | — |
| 20 | `colonia_det` | `text` | SÍ | — |
| 21 | `marca` | `text` | SÍ | — |
| 22 | `submarca` | `text` | SÍ | — |
| 23 | `tipo_vehiculo` | `text` | SÍ | — |
| 24 | `color` | `text` | SÍ | — |
| 25 | `placas` | `text` | SÍ | — |
| 26 | `estado_vehiculo` | `text` | SÍ | — |
| 27 | `niv` | `text` | SÍ | — |
| 28 | `motor` | `text` | SÍ | — |
| 29 | `modelo` | `text` | SÍ | — |
| 30 | `fecha_ingreso` | `timestamp` | SÍ | — |
| 31 | `fecha_salida` | `timestamp` | SÍ | — |
| 32 | `otro_delito` | `text` | SÍ | — |
| 33 | `masc` | `text` | SÍ | — |
| 34 | `umecas` | `text` | SÍ | — |
| 35 | `completado_en` | `timestamp` | SÍ | — |
| 36 | `completado_por` | `text` | SÍ | — |
| 37 | `creado_en` | `timestamp` | NO | `now()` |
| 38 | `actualizado_en` | `timestamp` | SÍ | — |

**Foreign Keys**

- `formato_incidencia_complemento_completado_por_fkey`: `completado_por` → `users(id)`
- `formato_incidencia_complemento_incidente_id_fkey`: `incidente_id` → `incidentes(id)`

**Índices**

- `formato_incidencia_complemento_incidente_id_key`: `CREATE UNIQUE INDEX formato_incidencia_complemento_incidente_id_key ON public.formato_incidencia_complemento USING btree (incidente_id)`
- `idx_formato_incidencia_complemento_incidente`: `CREATE INDEX idx_formato_incidencia_complemento_incidente ON public.formato_incidencia_complemento USING btree (incidente_id)`

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

**Índices**

- `fnav_fecha_periodo_uq`: `CREATE UNIQUE INDEX fnav_fecha_periodo_uq ON public.formato_n_atencion_victimas USING btree (fecha, periodo)`
- `formato_n_atencion_victimas_fecha_key`: `CREATE UNIQUE INDEX formato_n_atencion_victimas_fecha_key ON public.formato_n_atencion_victimas USING btree (fecha)`

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

**Índices**

- `fnf_fecha_periodo_uq`: `CREATE UNIQUE INDEX fnf_fecha_periodo_uq ON public.formato_n_fge USING btree (fecha, periodo)`
- `formato_n_fge_fecha_key`: `CREATE UNIQUE INDEX formato_n_fge_fecha_key ON public.formato_n_fge USING btree (fecha)`

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

**Índices**

- `fng_fecha_periodo_uq`: `CREATE UNIQUE INDEX fng_fecha_periodo_uq ON public.formato_n_fgr USING btree (fecha, periodo)`
- `formato_n_fgr_fecha_key`: `CREATE UNIQUE INDEX formato_n_fgr_fecha_key ON public.formato_n_fgr USING btree (fecha)`

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

**Índices**

- `fnma_fecha_periodo_uq`: `CREATE UNIQUE INDEX fnma_fecha_periodo_uq ON public.formato_n_medios_alternativos USING btree (fecha, periodo)`
- `formato_n_medios_alternativos_fecha_key`: `CREATE UNIQUE INDEX formato_n_medios_alternativos_fecha_key ON public.formato_n_medios_alternativos USING btree (fecha)`

### \`formato_n_observaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `observaciones` | `text` | SÍ | — |
| 4 | `elaboro` | `text` | SÍ | — |
| 5 | `capturado_por` | `text` | NO | — |
| 6 | `creado_en` | `timestamp` | SÍ | `now()` |

**Foreign Keys**

- `formato_n_observaciones_capturado_por_fkey`: `capturado_por` → `users(id)`

**Índices**

- `formato_n_observaciones_fecha_key`: `CREATE UNIQUE INDEX formato_n_observaciones_fecha_key ON public.formato_n_observaciones USING btree (fecha)`

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
| 4 | `inmueble` | `text` | SÍ | — |
| 5 | `responsable` | `text` | SÍ | — |
| 6 | `reporte_descripcion` | `text` | SÍ | — |
| 7 | `nombre_responsable` | `text` | SÍ | — |
| 8 | `nombre_verificador` | `text` | SÍ | — |
| 9 | `activaciones` | `integer` | NO | `0` |
| 10 | `creado_en` | `timestamp` | NO | `now()` |
| 11 | `es_falso` | `boolean` | SÍ | — |

**Foreign Keys**

- `iae_incidente_fk`: `incidente_id` → `incidentes(id)`

**Índices**

- `incidente_alarma_escolar_incidente_uq`: `CREATE UNIQUE INDEX incidente_alarma_escolar_incidente_uq ON public.incidente_alarma_escolar USING btree (incidente_id)`

### \`incidente_despacho\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `fecha_hora_despacho` | `timestamp` | NO | `now()` |
| 4 | `despachado_por` | `text` | NO | — |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `id_despachado_por_fk`: `despachado_por` → `users(id)`
- `id_incidente_fk`: `incidente_id` → `incidentes(id)`

**Índices**

- `incidente_despacho_incidente_uq`: `CREATE UNIQUE INDEX incidente_despacho_incidente_uq ON public.incidente_despacho USING btree (incidente_id)`

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
| 10 | `atiende_caso` | `boolean` | NO | `true` |

**Foreign Keys**

- `ide_despacho_fk`: `despacho_id` → `incidente_despacho(id)`
- `incidente_despacho_elementos_oficial_id_fkey`: `oficial_id` → `ofi_oficiales(id)`

**Índices**

- `idx_despacho_elementos_oficial`: `CREATE INDEX idx_despacho_elementos_oficial ON public.incidente_despacho_elementos USING btree (oficial_id)`

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

**Foreign Keys**

- `idu_despacho_fk`: `despacho_id` → `incidente_despacho(id)`

### \`incidente_extorsion\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `telefono_extorsion` | `text` | SÍ | — |
| 4 | `grupo_delictivo` | `text` | SÍ | — |
| 5 | `modus_operandi` | `text` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |
| 7 | `resultado` | `text` | SÍ | — |

**Foreign Keys**

- `iext_incidente_fk`: `incidente_id` → `incidentes(id)`

**Índices**

- `incidente_extorsion_incidente_uq`: `CREATE UNIQUE INDEX incidente_extorsion_incidente_uq ON public.incidente_extorsion USING btree (incidente_id)`

### \`incidente_personas_afectadas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `incidente_id` | `uuid` | NO | — |
| 3 | `nombre` | `text` | SÍ | — |
| 4 | `sexo` | `text` | SÍ | — |
| 5 | `edad` | `integer` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `ipa_incidente_fk`: `incidente_id` → `incidentes(id)`

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

**Foreign Keys**

- `inc_capturado_por_fk`: `capturado_por` → `users(id)`
- `inc_medio_canalizacion_fk`: `medio_canalizacion_id` → `cat_medios_canalizacion(id)`
- `inc_prioridad_fk`: `prioridad_id` → `cat_prioridades(id)`
- `inc_tipo_emergencia_fk`: `tipo_emergencia_id` → `cat_tipos_emergencia(id)`
- `inc_tipo_incidente_fk`: `tipo_incidente_id` → `cat_tipos_incidente(id)`
- `incidentes_dependencia_id_fkey`: `dependencia_id` → `cat_dependencias(id)`

**Índices**

- `idx_incidentes_creado`: `CREATE INDEX idx_incidentes_creado ON public.incidentes USING btree (creado_en)`
- `idx_incidentes_estatus_canal`: `CREATE INDEX idx_incidentes_estatus_canal ON public.incidentes USING btree (estatus, canal)`
- `idx_incidentes_tipo_incidente`: `CREATE INDEX idx_incidentes_tipo_incidente ON public.incidentes USING btree (tipo_incidente_id)`
- `incidentes_folio_uq`: `CREATE UNIQUE INDEX incidentes_folio_uq ON public.incidentes USING btree (folio)`

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

**Foreign Keys**

- `incidentes_camara_registrado_por_fkey`: `registrado_por` → `users(id)`

**Índices**

- `incidentes_camara_fecha_turno_key`: `CREATE UNIQUE INDEX incidentes_camara_fecha_turno_key ON public.incidentes_camara USING btree (fecha, turno)`

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

**Foreign Keys**

- `fk_iph_denuncia`: `reporte_denuncia_id` → `ofi_reporte_denuncia(id)`

**Índices**

- `idx_iph_apnuc`: `CREATE INDEX idx_iph_apnuc ON public.iph_detenidos USING btree (ap_nuc)`
- `idx_iph_delito`: `CREATE INDEX idx_iph_delito ON public.iph_detenidos USING btree (delito)`
- `idx_iph_estatus`: `CREATE INDEX idx_iph_estatus ON public.iph_detenidos USING btree (estatus)`
- `idx_iph_fecha`: `CREATE INDEX idx_iph_fecha ON public.iph_detenidos USING btree (fecha_creacion)`
- `idx_iph_fecha_reporte`: `CREATE INDEX idx_iph_fecha_reporte ON public.iph_detenidos USING btree (fecha_reporte)`
- `idx_iph_folio`: `CREATE INDEX idx_iph_folio ON public.iph_detenidos USING btree (folio)`
- `idx_iph_folio911`: `CREATE INDEX idx_iph_folio911 ON public.iph_detenidos USING btree (folio_911)`
- `idx_iph_rnd`: `CREATE INDEX idx_iph_rnd ON public.iph_detenidos USING btree (rnd)`
- `iph_detenidos_folio_key`: `CREATE UNIQUE INDEX iph_detenidos_folio_key ON public.iph_detenidos USING btree (folio)`

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

**Foreign Keys**

- `medida_autoridades_adicionales_creado_por_users_id_fk`: `creado_por` → `users(id)`
- `medida_autoridades_adicionales_medida_id_medidas_proteccion_id_`: `medida_id` → `medidas_proteccion(id)`

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

**Foreign Keys**

- `medidas_proteccion_creado_por_users_id_fk`: `creado_por` → `users(id)`

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

**Índices**

- `modulos_clave_unique`: `CREATE UNIQUE INDEX modulos_clave_unique ON public.modulos USING btree (clave)`

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

**Foreign Keys**

- `fk_moni_evidencias_denuncia`: `ofi_reporte_denuncia_id` → `ofi_reporte_denuncia(id)`

**Índices**

- `idx_evidencias_denuncia_solicitud`: `CREATE INDEX idx_evidencias_denuncia_solicitud ON public.moni_evidencias_denuncia USING btree (ofi_reporte_denuncia_id, solicitud_id)`

### \`monitorista_historial\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `monitorista_id` | `text` | NO | — |
| 3 | `accion` | `text` | NO | — |
| 4 | `solicitud_id` | `uuid` | SÍ | — |
| 5 | `incidente_id` | `uuid` | SÍ | — |
| 6 | `creado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `monitorista_historial_monitorista_id_fkey`: `monitorista_id` → `users(id)`
- `monitorista_historial_solicitud_id_fkey`: `solicitud_id` → `solicitudes_evidencia(id)`

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

**Foreign Keys**

- `notificaciones_ficha_id_fichas_busqueda_id_fk`: `ficha_id` → `fichas_busqueda(id)`
- `notificaciones_user_id_users_id_fk`: `user_id` → `users(id)`

**Índices**

- `notificaciones_user_id_ficha_id_hito_unique`: `CREATE UNIQUE INDEX notificaciones_user_id_ficha_id_hito_unique ON public.notificaciones USING btree (user_id, ficha_id, hito)`

### \`notificaciones_config\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `clave` | `text` | NO | — |
| 2 | `valor` | `text` | NO | — |

### \`notificaciones_eventos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `integer` | SÍ | — |
| 3 | `user_id` | `text` | SÍ | — |
| 4 | `evento` | `text` | NO | — |
| 5 | `titulo` | `text` | NO | — |
| 6 | `mensaje` | `text` | NO | — |
| 7 | `href` | `text` | SÍ | — |
| 8 | `severidad` | `text` | NO | `'info'::text` |
| 9 | `entidad_tipo` | `text` | SÍ | — |
| 10 | `entidad_id` | `text` | SÍ | — |
| 11 | `emitida_por` | `text` | SÍ | — |
| 12 | `grupo_id` | `uuid` | SÍ | — |
| 13 | `clave_dedup` | `text` | SÍ | — |
| 14 | `creado_en` | `timestamp` | NO | `now()` |
| 15 | `push_reescalado_en` | `timestamp` | SÍ | — |

**Foreign Keys**

- `notificaciones_eventos_emitida_por_fkey`: `emitida_por` → `users(id)`
- `notificaciones_eventos_rol_id_fkey`: `rol_id` → `roles(id)`
- `notificaciones_eventos_user_id_fkey`: `user_id` → `users(id)`

**Índices**

- `notificaciones_eventos_clave_dedup_uq`: `CREATE UNIQUE INDEX notificaciones_eventos_clave_dedup_uq ON public.notificaciones_eventos USING btree (clave_dedup) WHERE (clave_dedup IS NOT NULL)`
- `notificaciones_eventos_evento_idx`: `CREATE INDEX notificaciones_eventos_evento_idx ON public.notificaciones_eventos USING btree (evento, creado_en DESC)`
- `notificaciones_eventos_rol_creado_idx`: `CREATE INDEX notificaciones_eventos_rol_creado_idx ON public.notificaciones_eventos USING btree (rol_id, creado_en DESC) WHERE (rol_id IS NOT NULL)`
- `notificaciones_eventos_user_creado_idx`: `CREATE INDEX notificaciones_eventos_user_creado_idx ON public.notificaciones_eventos USING btree (user_id, creado_en DESC) WHERE (user_id IS NOT NULL)`

### \`notificaciones_lecturas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `notificacion_id` | `uuid` | NO | — |
| 2 | `user_id` | `text` | NO | — |
| 3 | `leida_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `notificaciones_lecturas_notificacion_id_fkey`: `notificacion_id` → `notificaciones_eventos(id)`
- `notificaciones_lecturas_user_id_fkey`: `user_id` → `users(id)`

**Índices**

- `notificaciones_lecturas_user_idx`: `CREATE INDEX notificaciones_lecturas_user_idx ON public.notificaciones_lecturas USING btree (user_id)`

### \`notificaciones_suscripciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `evento` | `text` | NO | — |
| 3 | `rol_id` | `integer` | NO | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `actualizado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `notificaciones_suscripciones_rol_id_fkey`: `rol_id` → `roles(id)`

**Índices**

- `notificaciones_suscripciones_evento_rol_id_key`: `CREATE UNIQUE INDEX notificaciones_suscripciones_evento_rol_id_key ON public.notificaciones_suscripciones USING btree (evento, rol_id)`

### \`novedades_captura\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `fecha` | `date` | NO | — |
| 3 | `capturado_por` | `text` | NO | — |
| 4 | `datos` | `jsonb` | SÍ | `'{}'::jsonb` |
| 5 | `creado_en` | `timestamp` | SÍ | `now()` |

**Foreign Keys**

- `novedades_captura_capturado_por_fkey`: `capturado_por` → `users(id)`

**Índices**

- `novedades_captura_fecha_key`: `CREATE UNIQUE INDEX novedades_captura_fecha_key ON public.novedades_captura USING btree (fecha)`

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
| 14 | `apodo` | `text` | SÍ | — |
| 15 | `curp` | `text` | SÍ | — |
| 16 | `fecha_nacimiento` | `date` | SÍ | — |
| 17 | `genero` | `text` | SÍ | — |
| 18 | `originario` | `text` | SÍ | — |
| 19 | `estado_civil` | `text` | SÍ | — |
| 20 | `escolaridad` | `text` | SÍ | — |
| 21 | `ocupacion` | `text` | SÍ | — |
| 22 | `rasgos_particulares` | `text` | SÍ | — |

**Foreign Keys**

- `ofi_detalles_asegurados_reporte_campo_id_fkey`: `reporte_campo_id` → `ofi_reportes_campo(id)`

**Índices**

- `idx_detalles_asegurados_curp`: `CREATE INDEX idx_detalles_asegurados_curp ON public.ofi_detalles_asegurados USING btree (curp) WHERE (curp IS NOT NULL)`
- `idx_ofi_da_reporte`: `CREATE INDEX idx_ofi_da_reporte ON public.ofi_detalles_asegurados USING btree (reporte_campo_id)`

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

**Foreign Keys**

- `fk_ficha_campo`: `reporte_campo_id` → `ofi_reportes_campo(id)`
- `fk_ficha_iph`: `iph_id` → `iph_detenidos(id)`

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
| 11 | `ultima_lat` | `numeric` | SÍ | — |
| 12 | `ultima_lng` | `numeric` | SÍ | — |
| 13 | `ultima_ubicacion_en` | `timestamp` | SÍ | — |

**Foreign Keys**

- `ofi_oficiales_user_id_fkey`: `user_id` → `users(id)`

**Índices**

- `idx_ofi_oficiales_patrulla`: `CREATE INDEX idx_ofi_oficiales_patrulla ON public.ofi_oficiales USING btree (patrulla_id)`
- `uq_ofi_oficiales_num_empleado`: `CREATE UNIQUE INDEX uq_ofi_oficiales_num_empleado ON public.ofi_oficiales USING btree (numero_empleado)`

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

**Foreign Keys**

- `pd_creado_por_fk`: `creado_por` → `users(id)`
- `pd_reporte_campo_fk`: `reporte_campo_id` → `ofi_reportes_campo(id)`

**Índices**

- `pd_reporte_campo_unique`: `CREATE UNIQUE INDEX pd_reporte_campo_unique ON public.ofi_puesta_disposicion USING btree (reporte_campo_id)`

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
| 56 | `oficial_id` | `uuid` | SÍ | — |
| 57 | `folio_sija` | `text` | SÍ | `NULL::character varying` |
| 58 | `registro_tableta` | `boolean` | SÍ | `false` |
| 59 | `folio_remision` | `text` | SÍ | `NULL::character varying` |
| 60 | `marco_legal` | `text` | SÍ | — |
| 61 | `domicilio_calle` | `text` | SÍ | `NULL::character varying` |
| 62 | `domicilio_numero` | `text` | SÍ | `NULL::character varying` |
| 63 | `domicilio_colonia` | `text` | SÍ | `NULL::character varying` |
| 64 | `domicilio_municipio` | `text` | SÍ | `NULL::character varying` |
| 65 | `incidente_id` | `uuid` | SÍ | — |

**Foreign Keys**

- `fk_d1_incidente`: `incidente_id` → `incidentes(id)`
- `fk_reportes_d1_usuario`: `capturado_por` → `users(id)`
- `ofi_reporte_denuncia_oficial_id_fkey`: `oficial_id` → `ofi_oficiales(id)`
- `reportes_d1_reporte_campo_id_fkey`: `reporte_campo_id` → `ofi_reportes_campo(id)`

**Índices**

- `idx_d1_fecha`: `CREATE INDEX idx_d1_fecha ON public.ofi_reporte_denuncia USING btree (fecha_reporte DESC, hora_reporte DESC)`
- `idx_d1_oficial`: `CREATE INDEX idx_d1_oficial ON public.ofi_reporte_denuncia USING btree (oficial_id)`
- `idx_d1_reporte_campo`: `CREATE INDEX idx_d1_reporte_campo ON public.ofi_reporte_denuncia USING btree (reporte_campo_id)`
- `idx_denuncias_estados_paneles`: `CREATE INDEX idx_denuncias_estados_paneles ON public.ofi_reporte_denuncia USING btree (estado_tramite, estado_evidencia)`
- `uq_reportes_d1_folio`: `CREATE UNIQUE INDEX uq_reportes_d1_folio ON public.ofi_reporte_denuncia USING btree (folio_denuncia)`

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

**Foreign Keys**

- `ofi_reportes_campo_incidente_id_fkey`: `incidente_id` → `incidentes(id)`
- `ofi_reportes_campo_ofi_oficial_id_fkey`: `ofi_oficial_id` → `ofi_oficiales(id)`
- `ofi_reportes_campo_prioridad_id_fkey`: `prioridad_id` → `cat_prioridades(id)`
- `ofi_reportes_campo_tipo_emergencia_id_fkey`: `tipo_emergencia_id` → `cat_tipos_emergencia(id)`
- `ofi_reportes_campo_tipo_incidente_id_fkey`: `tipo_incidente_id` → `cat_tipos_incidente(id)`

**Índices**

- `idx_ofi_rc_creado`: `CREATE INDEX idx_ofi_rc_creado ON public.ofi_reportes_campo USING btree (created_at)`
- `idx_ofi_rc_oficial`: `CREATE INDEX idx_ofi_rc_oficial ON public.ofi_reportes_campo USING btree (ofi_oficial_id)`
- `uq_ofi_rc_incidente`: `CREATE UNIQUE INDEX uq_ofi_rc_incidente ON public.ofi_reportes_campo USING btree (incidente_id) WHERE (incidente_id IS NOT NULL)`

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

**Foreign Keys**

- `permisos_usuario_id_fkey`: `usuario_id` → `users(id)`

**Índices**

- `permisos_usuario_seccion_uq`: `CREATE UNIQUE INDEX permisos_usuario_seccion_uq ON public.permisos USING btree (usuario_id, seccion)`

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

**Foreign Keys**

- `permisos_plantillas_rol_id_fkey`: `rol_id` → `roles(id)`

**Índices**

- `permisos_plantillas_rol_seccion_uq`: `CREATE UNIQUE INDEX permisos_plantillas_rol_seccion_uq ON public.permisos_plantillas USING btree (rol_id, seccion)`

### \`push_subscriptions\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `user_id` | `text` | NO | — |
| 3 | `endpoint` | `text` | NO | — |
| 4 | `p256dh` | `text` | NO | — |
| 5 | `auth` | `text` | NO | — |
| 6 | `user_agent` | `text` | SÍ | — |
| 7 | `creado_en` | `timestamp` | NO | `now()` |
| 8 | `ultimo_uso` | `timestamp` | SÍ | — |

**Foreign Keys**

- `push_subscriptions_user_id_fkey`: `user_id` → `users(id)`

**Índices**

- `idx_push_subscriptions_user`: `CREATE INDEX idx_push_subscriptions_user ON public.push_subscriptions USING btree (user_id)`
- `push_subscriptions_endpoint_key`: `CREATE UNIQUE INDEX push_subscriptions_endpoint_key ON public.push_subscriptions USING btree (endpoint)`

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

**Foreign Keys**

- `rol_asignaciones_body_cam_id_fk`: `body_cam_id` → `cat_body_cams(id)`
- `rol_asignaciones_radio_id_fk`: `radio_id` → `cat_radios(id)`
- `rol_asignaciones_rol_id_fk`: `rol_id` → `roles_servicio(id)`

### \`rol_estado_fuerza\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `uuid` | NO | — |
| 3 | `concepto_id` | `integer` | NO | — |
| 4 | `cantidad` | `integer` | NO | `0` |

**Foreign Keys**

- `rol_estado_fuerza_concepto_id_fk`: `concepto_id` → `cat_estado_fuerza_conceptos(id)`
- `rol_estado_fuerza_rol_id_fk`: `rol_id` → `roles_servicio(id)`

**Índices**

- `rol_estado_fuerza_rol_concepto_uq`: `CREATE UNIQUE INDEX rol_estado_fuerza_rol_concepto_uq ON public.rol_estado_fuerza USING btree (rol_id, concepto_id)`

### \`rol_observaciones\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `rol_id` | `uuid` | NO | — |
| 3 | `tipo_id` | `integer` | NO | — |
| 4 | `descripcion` | `text` | SÍ | — |
| 5 | `creado_en` | `timestamp` | NO | `now()` |

**Foreign Keys**

- `rol_observaciones_rol_id_fk`: `rol_id` → `roles_servicio(id)`
- `rol_observaciones_tipo_id_fk`: `tipo_id` → `cat_tipos_observacion(id)`

### \`roles\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('roles_id_seq'::regclass)` |
| 2 | `nombre` | `text` | NO | — |
| 3 | `descripcion` | `text` | SÍ | — |
| 4 | `activo` | `boolean` | NO | `true` |
| 5 | `creado_en` | `timestamp` | NO | `now()` |
| 6 | `es_admin` | `boolean` | NO | `false` |

**Índices**

- `roles_nombre_unique`: `CREATE UNIQUE INDEX roles_nombre_unique ON public.roles USING btree (nombre)`

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

**Foreign Keys**

- `roles_servicio_creado_por_fk`: `creado_por` → `users(id)`
- `roles_servicio_firmado_por_fk`: `firmado_por` → `users(id)`
- `roles_servicio_sector_id_fk`: `sector_id` → `cat_sectores(id)`

**Índices**

- `roles_servicio_folio_uq`: `CREATE UNIQUE INDEX roles_servicio_folio_uq ON public.roles_servicio USING btree (folio)`

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

**Foreign Keys**

- `seguimientos_busqueda_ficha_id_fichas_busqueda_id_fk`: `ficha_id` → `fichas_busqueda(id)`
- `seguimientos_busqueda_registrado_por_users_id_fk`: `registrado_por` → `users(id)`

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

**Foreign Keys**

- `sessions_user_id_users_id_fk`: `user_id` → `users(id)`

**Índices**

- `sessions_token_unique`: `CREATE UNIQUE INDEX sessions_token_unique ON public.sessions USING btree (token)`

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

**Foreign Keys**

- `solicitudes_c4_internas_creado_por_users_id_fk`: `creado_por` → `users(id)`
- `solicitudes_c4_internas_solicitud_id_solicitudes_informacion_id`: `solicitud_id` → `solicitudes_informacion(id)`

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

**Foreign Keys**

- `solicitudes_detenido_solicitado_por_fkey`: `solicitado_por` → `users(id)`

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

**Foreign Keys**

- `solicitudes_evidencia_solicitado_por_fkey`: `solicitado_por` → `users(id)`

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

**Foreign Keys**

- `solicitudes_informacion_creado_por_users_id_fk`: `creado_por` → `users(id)`

### \`tokens_recurso\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `token` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `tipo` | `text` | NO | — |
| 3 | `recurso_id` | `text` | NO | — |
| 4 | `creado_en` | `timestamp` | NO | `now()` |

**Índices**

- `idx_tokens_recurso_tipo_id`: `CREATE INDEX idx_tokens_recurso_tipo_id ON public.tokens_recurso USING btree (tipo, recurso_id)`
- `tokens_recurso_tipo_recurso_uq`: `CREATE UNIQUE INDEX tokens_recurso_tipo_recurso_uq ON public.tokens_recurso USING btree (tipo, recurso_id)`

### \`two_factors\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `text` | NO | — |
| 2 | `secret` | `text` | NO | — |
| 3 | `backup_codes` | `text` | NO | — |
| 4 | `user_id` | `text` | NO | — |
| 5 | `verified` | `boolean` | SÍ | `false` |

**Foreign Keys**

- `two_factors_user_id_users_id_fk`: `user_id` → `users(id)`

**Índices**

- `two_factors_user_id_unique`: `CREATE UNIQUE INDEX two_factors_user_id_unique ON public.two_factors USING btree (user_id)`

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
| 13 | `ultima_actividad_despacho_en` | `timestamp` | SÍ | — |

**Foreign Keys**

- `users_dependencia_id_fk`: `dependencia_id` → `cat_dependencias(id)`
- `users_rol_id_roles_id_fk`: `rol_id` → `roles(id)`

**Índices**

- `users_email_unique`: `CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email)`

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

**Foreign Keys**

- `visitas_domiciliarias_medida_id_medidas_proteccion_id_fk`: `medida_id` → `medidas_proteccion(id)`
- `visitas_domiciliarias_registrado_por_users_id_fk`: `registrado_por` → `users(id)`

## Schema \`via\`

### \`roles_permisos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `integer` | NO | `nextval('via.roles_permisos_id_seq'::regclass)` |
| 2 | `rol_id` | `integer` | NO | — |
| 3 | `permiso_id` | `uuid` | NO | — |
| 4 | `created_at` | `timestamp` | SÍ | `now()` |

**Foreign Keys**

- `roles_permisos_permiso_id_fkey`: `permiso_id` → `v2_permisos(id)`

**Índices**

- `idx_via_roles_permisos_permiso`: `CREATE INDEX idx_via_roles_permisos_permiso ON via.roles_permisos USING btree (permiso_id)`
- `idx_via_roles_permisos_rol`: `CREATE INDEX idx_via_roles_permisos_rol ON via.roles_permisos USING btree (rol_id)`
- `uq_roles_permisos`: `CREATE UNIQUE INDEX uq_roles_permisos ON via.roles_permisos USING btree (rol_id, permiso_id)`

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

**Índices**

- `v2_departamentos_clave_key`: `CREATE UNIQUE INDEX v2_departamentos_clave_key ON via.v2_departamentos USING btree (clave)`

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

**Foreign Keys**

- `fk_documento_liberacion_solicitud`: `solicitud_id` → `v2_solicitudes_liberacion(id)`

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
| 4 | `latitud` | `numeric` | SÍ | — |
| 5 | `longitud` | `numeric` | SÍ | — |
| 6 | `direccion` | `text` | SÍ | — |

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

**Foreign Keys**

- `fk_orden_pago_infraccion`: `infraccion_id` → `v2_infracciones(id)`

**Índices**

- `idx_orden_pago_vigente_unico`: `CREATE UNIQUE INDEX idx_orden_pago_vigente_unico ON via.v2_ordenes_pago_sa7 USING btree (infraccion_id) WHERE (vigente = true)`

### \`v2_patrullas\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | `gen_random_uuid()` |
| 2 | `placa` | `text` | SÍ | — |
| 3 | `activo` | `boolean` | NO | `true` |
| 4 | `sincronizado_en` | `timestamp` | SÍ | — |
| 5 | `num_serie` | `text` | NO | — |
| 6 | `departamento` | `text` | SÍ | — |
| 7 | `caracteristicas` | `text` | SÍ | — |
| 8 | `marca` | `text` | SÍ | — |
| 9 | `modelo` | `text` | SÍ | — |
| 10 | `gps` | `text` | SÍ | — |
| 11 | `radio` | `text` | SÍ | — |
| 12 | `camaras` | `text` | SÍ | — |

**Índices**

- `v2_patrullas_num_serie_key`: `CREATE UNIQUE INDEX v2_patrullas_num_serie_key ON via.v2_patrullas USING btree (num_serie)`

### \`v2_permisos\`

| # | Columna | Tipo | Nulable | Default |
|---|---------|------|---------|--------|
| 1 | `id` | `uuid` | NO | — |
| 2 | `modulo` | `text` | NO | — |
| 3 | `accion` | `text` | NO | — |
| 4 | `descripcion` | `text` | NO | — |

**Índices**

- `uq_v2_permisos_modulo_accion`: `CREATE UNIQUE INDEX uq_v2_permisos_modulo_accion ON via.v2_permisos USING btree (modulo, accion)`

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

**Foreign Keys**

- `fk_solicitud_liberacion_infraccion`: `infraccion_id` → `v2_infracciones(id)`

