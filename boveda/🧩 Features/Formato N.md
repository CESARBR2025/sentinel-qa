# Formato N — Envío de Formatos a Coordinación

**Propósito**: Reporte diario de coordinación en una sola vista: consolidado por día (LISTO/PENDIENTE) + stepper de 8 pasos que reemplaza las 7 páginas sueltas. Cada sección guarda en su propia tabla; el estatus del día vive en `formato_n_estatus_dia`.

---

## Flujo

```mermaid
flowchart TD
    A[Hub /agente_reportes] --> B[Tile "Envío de Formatos"]
    B --> C[/envio-de-formatos]
    C -- redirect --> D[Consolidado por día /envio-de-formatos/consolidar]
    D -- PENDIENTE: "Completar reporte" --> E[Stepper /envio-de-formatos/reporte/fecha]
    D -- LISTO: "Editar" --> E
    E -- 8 pasos confirmados --> F[formato_n_estatus_dia = LISTO]
    E --> G[Descargar .docx /api/nCoordinacion/generar?fecha=]
```

## Stepper (8 pasos, orden = tablas A-H del documento)

1. Eventos Informados
2. Fiscalía General del Estado (FGE) — precálculo "CALCULAR DE REPORTES" + campos manuales
3. Fiscalía General de la República (FGR) — 100% manual
4. Registro Nacional de Detenciones (RND)
5. Medios Alternativos de Solución de Conflictos (MASC)
6. Atención a Víctimas
7. Armas de Fuego Aseguradas
8. Observaciones

`LISTO` = las 8 columnas `*_confirmado` de `formato_n_estatus_dia` en `true` para esa fecha.

## Componentes involucrados

| Archivo | Rol |
|---------|-----|
| `app/envio-de-formatos/page.tsx` | Redirige a `/envio-de-formatos/consolidar` |
| `app/envio-de-formatos/consolidar/page.tsx` | Consolidado por día: badge LISTO/PENDIENTE, descargar Word, entrar al stepper |
| `app/envio-de-formatos/reporte/[fecha]/page.tsx` | Stepper único con 8 pasos |
| `app/api/reportes/formato-n-estatus/route.ts` | Confirma/desconfirma secciones (`confirmarSeccion`) |
| `app/api/reportes/formato-n-observaciones/route.ts` | GET/POST observaciones (`upsertObservaciones`) |
| `lib/reportes/formato-n-estatus-service.ts` | Estatus por día (`obtenerEstatusDia`, `confirmarSeccion`, `desconfirmarSeccion`) |
| `lib/reportes/formato-n-consolidado-service.ts` | Consolidado completo + estatus del día |
| `lib/reportes/formato-n-eventos-service.ts` | Lógica de eventos informados |
| `lib/reportes/formato-n-fge-service.ts` | Lógica de FGE |
| `lib/reportes/formato-n-fgr-service.ts` | Lógica de FGR |
| `lib/reportes/formato-n-rnd-service.ts` | Lógica de RND |
| `lib/reportes/formato-n-medios-alternativos-service.ts` | Lógica de medios alternativos |
| `lib/reportes/formato-n-atencion-victimas-service.ts` | Lógica de atención a víctimas |
| `lib/reportes/formato-n-armas-aseguradas-service.ts` | Lógica de armas aseguradas (form manual + auto-sync desde Fiscalía) |
| `app/api/reportes/formato-n-armas-aseguradas/sincronizar/route.ts` | Dispara `sincronizarArmasDelDia` al abrir el reporte del día |
| `app/api/nCoordinacion/generar/route.ts` | Generador del `.docx` (lee los datos guardados de las 8 secciones) |

## BD

| Tabla | Columnas clave | Uso |
|-------|---------------|-----|
| `formato_n_estatus_dia` | `fecha` (PK), 8 columnas `*_confirmado` boolean, `completado_en`, `actualizado_por` | Estatus LISTO/PENDIENTE del día |
| `formato_n_eventos` | `id`, `fecha`, `hora`, `region`, `evento`, `ubicacion`, `descripcion`, `atenciones`, `capturado_por`, `origen_incidente_id` (uuid nullable, UNIQUE parcial) | Bitácora de eventos |
| `formato_n_fge` | `id`, `fecha`, `periodo`, `carpetas_iniciadas`, `cateos`, `vehiculos_asegurados`, `personas_aseguradas`, `aprehensiones` | Eventos FGE (agregado) |
| `formato_n_fgr` | `id`, `fecha`, `periodo`, `carpetas_iniciadas`, `cateos`, `vehiculos_asegurados`, `personas_aseguradas`, `aprehensiones` | Eventos FGR (agregado) |
| `formato_n_rnd` | `id`, `fecha`, `hora_detencion`, `delito`, `autoridad_que_realizo_detencion`, `folio`, `origen_reporte_campo_id` (uuid nullable, UNIQUE parcial) | Registro Nacional de Detenciones |
| `formato_n_medios_alternativos` | `id`, `fecha`, `periodo`, `asuntos_canalizados_por_fiscalia`, `acuerdos`, `monto_reparacion_danos` | Medios alternativos (agregado) |
| `formato_n_atencion_victimas` | `id`, `fecha`, `periodo`, `numero_atenciones`, `atenciones_medicas`, `atenciones_psicologicas`, `asesorias_juridicas` | Atención a víctimas (agregado) |
| `formato_n_armas_aseguradas` | `id`, `fecha`, `carpeta_investigacion`, `tipo_arma`, `matricula`, `calibre`, `observaciones`, `origen_fiscalia_arma_id` (uuid nullable, UNIQUE parcial) | Armas de fuego aseguradas |
| `fiscalia_armas_aseguradas` | `id`, `reporte_campo_id` (FK `ofi_reportes_campo`), `tipo_arma`, `marca`, `matricula`, `calibre`, `observaciones`, `capturado_por` (FK `users`), `creado_en` | Fuente de la captura estructurada en Fiscalía (varias armas por reporte) |
| `formato_n_observaciones` | `id`, `fecha`, `observaciones`, `capturado_por` | Observaciones (sección G) |

## Reglas de negocio

1. **Fuente de verdad única**: los datos del documento salen de las tablas `formato_n_*` guardadas (no se recalculan en vivo) — `app/api/nCoordinacion/generar` usa `obtenerFormatoNConsolidado` + `obtenerObservacionesPorFecha`.
2. Reportes tipo "agregado" (FGE, FGR, medios alternativos, atención víctimas) tienen `UNIQUE (fecha, periodo)` — el stepper crea o actualiza según exista.
3. Reportes tipo "bitácora" (eventos, RND, armas) no tienen restricción unique por fecha — se agregan filas por día.
4. **Eventos (paso 1) se auto-sincronizan y se muestran en tabla**: al abrir el reporte de una fecha, `sincronizarEventosDelDia` hace `UPSERT` (`ON CONFLICT (origen_incidente_id)`) en `formato_n_eventos` por cada incidente del día (de `incidentes` vía `buscarIncidentesPorRango`), enlazado por `origen_incidente_id`. El paso 1 **solo visualiza** los eventos en una tabla (Hora, Evento, Región, Ubicación, Descripción, Atenciones) + botón "Confirmar sección". No hay captura manual de eventos (eliminada 2026-08-10).
5. **RND (paso 4) se auto-sincroniza y se muestra en tabla**: `sincronizarDetencionesDelDia` hace `UPSERT` (`ON CONFLICT (origen_reporte_campo_id)`) en `formato_n_rnd` por cada detención del día (de `ofi_reportes_campo` con `ofi_hay_detencion`, vía `buscarDetencionesPorRango`), enlazado por `origen_reporte_campo_id`. Solo visualiza (Hora, Delito, Autoridad, Folio) + "Confirmar sección". Sin captura manual ni buscar/usar. **Delito**: `ofi_reportes_campo.delito` nunca se escribe en el flujo real de captura del oficial (no está en el `INSERT` de `crearReporteCampo`, `lib/oficial/repository.ts`) — solo tiene valor en datos semilla antiguos. `buscarDetencionesPorRango` usa `COALESCE(NULLIF(d.delito,''), NULLIF(rc.delito,''), ti.nombre, 'Sin clasificar')`: primero el delito del D1 (`ofi_reporte_denuncia.delito`, si ya se generó la denuncia), luego el legacy `rc.delito`, y si no hay ninguno, el tipo de incidente del despacho (`cat_tipos_incidente.nombre` vía `incidentes.tipo_incidente_id`) como respaldo siempre disponible. Corregido 2026-08-10 (antes salía vacío para casi toda detención real, ver [[Troubleshooting]]).
6. **FGE (paso 2) auto-calculado + 3 campos manuales**: `calcularConteosPorFecha` se ejecuta al cargar y llena 6 conteos automáticos (carpetas, cateos, vehículos, domicilios, personas, aprehensiones) que se muestran en tabla de solo lectura. **Audiencias Iniciales, Abreviados y Audiencias Intermedias siguen siendo captura manual** (no existen en ningún lado del sistema). Sin botón "Calcular de reportes".
7. **FGR (paso 3) auto-calculado + 3 campos manuales**: `calcularConteosFgrPorFecha` se ejecuta al cargar y llena los 6 conteos automáticos desde `ofi_reportes_campo` filtrado por `ofi_autoridad_recibe = 'FGR'` (catálogo de `SelectorDestinoLegal.tsx`): detenciones (`ofi_hay_detencion`) → personas aseguradas/aprehensiones, cateos (`ofi_hay_cateo`) → número de cateos/domicilios cateados, vehículos (`jsonb_array_length(ofi_vehiculos)`) → vehículos asegurados, y carpetas iniciadas vía `ofi_reporte_denuncia` unido por `reporte_campo_id`. Las 3 audiencias siguen manuales. Corregido 2026-08-10: antes solo contaba detenciones y dejaba carpetas/cateos/vehículos fijos en 0 aunque la misma fila de `ofi_reportes_campo` ya traía esos datos (ver [[Troubleshooting]]).
8. Medios (paso 5), Víctimas (paso 6) y Observaciones (paso 8) **conservan su captura manual** — no tienen fuente automática en el sistema. Armas (paso 7) conserva el form manual solo como **respaldo**: ver regla 12. `guardarArmas` en el store solo hace `POST` si `armasForm.tipo_arma` tiene texto, y limpia el formulario tras guardar; así revisar el paso (Anterior → Siguiente) sin capturar un arma nueva no reinserta la última. `useFormatoNStore` expone `guardando` para deshabilitar los botones de navegación mientras `avanzar()` está en curso (evita doble-submit por doble clic). `cargar(fecha)` resetea `paso` y `armasForm` al inicio — antes persistían entre reportes de fechas distintas dentro de la misma sesión de navegación (bug corregido 2026-08-10, ver [[Troubleshooting]]).
9. `LISTO` = las 8 secciones confirmadas en `formato_n_estatus_dia` (aunque el operador confirme "sin novedad"/en cero).
10. Las 7 páginas sueltas (`/formato-n-fge`, etc.) fueron retiradas — el stepper cubre crear y editar; las API routes (`/api/reportes/formato-n-*`) se conservan.
11. El `.docx` es por día: `/api/nCoordinacion/generar?fecha=YYYY-MM-DD`. Generar Word para un rango de varios días queda fuera de alcance.
12. **Armas (paso 7) se auto-sincronizan desde Fiscalía y conservan respaldo manual**: la fuente estructurada es `fiscalia_armas_aseguradas` — capturada por el agente de Fiscalía en `/fiscalia/asegurados/[id]` (componente `ArmasAseguradas.tsx`, junto a la foto del arma en `evidencias_detenido`). Al abrir el reporte de una fecha, `sincronizarArmasDelDia` hace `UPSERT` (`ON CONFLICT (origen_fiscalia_arma_id)`) en `formato_n_armas_aseguradas` por cada arma capturada cuyo incidente cae ese día (vía `buscarArmasFiscaliaPorRango` uniendo `ofi_reportes_campo` → `incidentes`, con `LEFT JOIN ofi_reporte_denuncia` para traer `num_carpeta_investigacion`). El paso 7 muestra la tabla de armas auto-sincronizadas (Tipo, Marca, Matrícula, Calibre, Carpeta, Observaciones) **y debajo conserva el form manual** como respaldo para casos que Fiscalía todavía no haya procesado. `carpeta_investigacion` no existe en `fiscalia_armas_aseguradas` — se resuelve del D1 en el momento del sync. Si algo está mal en una fila sincronizada, se corrige en Fiscalía (no se edita desde el paso 7). Implementado 2026-08-10 (antes el paso 7 era 100% manual — no existía fuente estructurada de tipo/marca/matrícula/calibre en el sistema; ver [[Troubleshooting]]).
