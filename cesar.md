## Fase 1 — Creación de Solicitud (2 Canales de Entrada)

| Tabla | ¿Qué información captura? |
|-------|--------------------------|
| `incidentes` | Todo incidente: `folio` (UUID único), `canal` (`ciudadano`, `whatsapp`, `rondin`), `estatus` (`sin_despachar` inicial), `origen_rondin` (bool), `tipo_emergencia_id`, `tipo_incidente_id`, `prioridad_id`, `nombre_reportante`, `telefono`, `ubicacion` (calle/colonia/municipio/lat/lng), `descripcion`, `anonimo`, `fecha_hora_inicio`, `capturado_por` |
| `incidente_extorsion` | (Opcional) Datos extra cuando el incidente es extorsión: `telefono_extorsion`, `grupo_delictivo`, `modus_operandi` |
| `incidente_alarma_escolar` | (Opcional) Datos extra para alarma escolar: `establecimiento`, `direccion`, `responsable`, `activaciones` |

**Para reportes**: Filtrar por `incidentes.canal` para separar 911 vs rondín vs whatsapp. Usar `incidentes.fecha_hora_inicio` para ventanas de tiempo.

---

## Fase 2 — Despacho y Asignación

| Tabla | ¿Qué información captura? |
|-------|--------------------------|
| `incidente_despacho` | El acto de despacho en sí: `incidente_id` (FK → incidentes), `fecha_hora_despacho`, `despachado_por` (quién asignó) |
| `incidente_despacho_unidades` | Unidades/patrullas asignadas: `despacho_id`, `unidad_ext_id`, `unidad_placa` |
| `incidente_despacho_elementos` | Elementos/oficiales asignados: `despacho_id`, `elemento_nomina`, `elemento_nombre`, `oficial_id` (FK → `ofi_oficiales`, nullable) |

**Estado que refleja**: `incidentes.estatus` cambia de `sin_despachar` → `en_despacho`. Cuando marcan arribo (no hay tabla dedicada, se infiere por el estatus `en_sitio` en `incidentes.estatus`). Para el "Tab de Control Activo": filtrar `incidentes.estatus IN ('en_despacho', 'en_sitio')`.

**Para reportes**: JOIN `incidente_despacho` → `incidente_despacho_unidades` + `incidente_despacho_elementos` para ver todo lo asignado por folio.

---

## Fase 3 — Reporte de Campo (Cierre de Despacho)

| Tabla | ¿Qué información captura? |
|-------|--------------------------|
| `ofi_reportes_campo` | **El reporte principal de cierre**: `incidente_id` (FK que cierra el despacho), `folio_reporte_campo`, `ofi_contenido_reporte`, `ofi_acciones`, `ofi_calle`, `ofi_colonia`, `ofi_latitud`, `ofi_longitud`, `ofi_hay_detencion` (bool — este es el bloqueador de la Fase 3 paso 7), `ofi_detenidos` (JSONB), `ofi_vehiculos` (JSONB), `ofi_hay_cateo`, `ofi_cateo` (JSONB), `ofi_armas_fuego` (JSONB), `ofi_drogas` (JSONB), `ofi_hidrocarburos` (JSONB), `ofi_observaciones`, `ofi_estatus`, `quiere_denuncia`, `ofi_autoridad_recibe`, `expediente_ci`, etc. |
| `ofi_detalles_asegurados` | Detalles estructurados de detenidos: `reporte_campo_id`, `nombre_detenido`, `ap_paterno_detenido`, `ap_materno_detenido`, `calle`, `colonia`, `numero`, `latitud`, `longitud` |
| `ofi_puesta_disposicion` | Registro de traslado/puesta a disposición: `reporte_campo_id`, `gestion_interna`, `dependencia_externa`, `actas` (JSONB), `hora_inicio_traslado`, `hora_llegada_sede`, `hora_puesta_disposicion`, `tiempo_traslado_total` |

**Estado que refleja**: El INSERT en `ofi_reportes_campo` con `incidente_id` dispara `UPDATE incidentes SET estatus='atendido'` (Rama A) en la misma transacción. Si `ofi_hay_detencion=true` pero no tiene D1 vinculada, se considera "D1 pendiente" (bandera calculada).

**Para reportes**: La columna `ofi_hay_detencion` separa la Rama A vs B. JOIN `ofi_reportes_campo.incidente_id` → `incidentes.id` para el vínculo completo.

---

## Fase 4 — Cierre Administrativo o Canalización Legal

### Rama A: Sin Detenidos
`incidentes.estatus = 'atendido'` — No hay más tablas involucradas.

### Rama B: Con Detenidos

| Tabla | ¿Qué información captura? |
|-------|--------------------------|
| `ofi_reporte_denuncia` (D1) | El **Reporte D1**: `reporte_campo_id` (FK), `folio_denuncia`, `iph` (folio IPH), `folio_cu`, `delito`, `fecha_reporte`, `hora_reporte`, `lugar_hecho`, `colonia_hecho`, `latitud`, `longitud`, `policia_denuncia`, `policia_firma_d1`, `se_genero_d1`, `estado_tramite` (→ `RECIBIDA` / `EN_ANALISIS` / `EN_REVISION_JUZGADO` / `CERRADO`), `estado_evidencia`, `folio_sija`, `folio_remision`, `num_carpeta_investigacion`, `marco_legal`, `incidente_id` |
| `moni_evidencias_denuncia` | Evidencias subidas por monitorista: `ofi_reporte_denuncia_id`, `url_archivo`, `nombre_archivo` |
| `solicitud_fotos` | Solicitudes de foto de detenidos: `reporte_campo_id`, `tipo_foto`, `estado`, `enviado_a` |
| `evidencias_detenido` | Fotos de detenidos subidas: `reporte_campo_id`, `tipo_foto`, `url_archivo` |
| `iph_detenidos` | Registro IPH (Informe Policial Homologado): `folio`, `rnd`, `folio_iph`, `folio_911`, `delito`, `modus_operandi`, datos del detenido, ubicación del hecho, vehículo, etc. |
| `ofi_fichas_inteligencia` | Ficha de inteligencia del detenido: `iph_id`, `reporte_campo_id`, `escolaridad`, `estado_civil`, `ocupacion`, `rasgos_particulares`, `nexos_delictivos`, `puesta_disposicion`, `antecedentes_penales`, fotos |

**Destino legal y selección** (Paso 8.B.2): Se determina por `ofi_reportes_campo.ofi_autoridad_recibe`:
- `'FISCALIA'` → FGE (fuero común)
- `'FGR'` → Fiscalía Federal
- `'JUZGADO CIVICO'` → Juzgado Cívico

**Estado final**: `incidentes.estatus = 'atendido'` (o `'cerrado_detencion'` — revisar si se usa realmente).

---

## Notas clave para el dev de reportes

1. **La tabla central de todo el flujo es `incidentes`** — TODO se vincula a `incidentes.id` directa o indirectamente.
2. **La tabla de cierre operativo es `ofi_reportes_campo`** (la tabla legacy `incidente_reporte_campo` está deprecada, no se escriben filas nuevas).
3. **Los detenidos se guardan en 3 formatos**: JSONB en `ofi_reportes_campo.ofi_detenidos` (rápido), más estructurado en `ofi_detalles_asegurados`, e IPH/delito en `ofi_reporte_denuncia` + `iph_detenidos`.
4. **El estatus del incidente** vs el `estado_tramite` de la D1: el primero muere en `atendido`, el segundo sigue vivo (`RECIBIDA → EN_ANALISIS → EN_REVISION_JUZGADO → CERRADO`).