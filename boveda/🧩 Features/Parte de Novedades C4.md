# Parte de Novedades C4

**Propósito**: El reporte diario más grande del sistema — 34 tablas, ventana operativa **06:00 → 06:00** (no un día natural). Un stepper de 11 pasos que autollena desde la BD lo que tiene fuente, pide captura manual lo que no, y genera el `.docx` completo al final. Fuente: `FORMATO NOVEDADES.docx` del C-4.

**Estrategia**: idéntica a Formato N (ver `Formato N.md`) — calcular al cargar, **snapshot al confirmar**. Es un documento oficial diario: si mañana se corrige un IPH, el parte de ayer no debe cambiar. La persistencia usa **3 tablas genéricas**, no una por sección (Formato N usa 8; con 34 tablas ese patrón no escala).

---

## Flujo

```mermaid
flowchart TD
    A[Hub /agente_reportes] --> B[Tile "Parte de Novedades C-4"]
    B --> C[/envio-de-formatos/novedades - consolidado por día/]
    C -- PENDIENTE: "Completar reporte" --> E[Stepper /envio-de-formatos/novedades/fecha]
    C -- LISTO: "Editar" --> E
    E -- 11 pasos confirmados --> F[novedades_estatus_dia = LISTO]
    E --> G[Descargar .docx /api/novedades/generar?fecha=]
```

## Stepper (11 pasos)

| # | Paso | Tablas | Modo |
|---|---|---|---|
| 1 | Periodo y encabezado | — | auto |
| 2 | Resumen general | 0-2 | auto + sector |
| 3 | Subsecretaría | 3-4 | auto |
| 4 | Unidad de Análisis | 5 | manual |
| 5 | C-4 (911 + cámaras) | 6 | **auto total** |
| 6 | Dirección de Tránsito | 7-13 | mixto |
| 7 | Prevención del Delito | 14-24 | mixto |
| 8 | Hechos delictivos | 25-28 | mixto |
| 9 | Supervisión y Operativos | 29-30 | manual + flags |
| 10 | Resumen de novedades | 31 | auto + plantillas |
| 11 | Estado de fuerza | 32 | auto |

`LISTO` = las 11 columnas `*_confirmado` de `novedades_estatus_dia` en `true`.

## Arquitectura

### Persistencia — 3 tablas, no 20

| Tabla | Forma de dato | Uso |
|-------|---------------|-----|
| `novedades_estatus_dia` | fecha (PK) + 11 booleanos `*_confirmado` + `completado_en` | Semáforo del stepper (clon de `formato_n_estatus_dia`) |
| `novedades_seccion` | `(fecha, seccion)` PK + `datos jsonb` | Matrices de contadores por sección |
| `novedades_filas` | `id`, `(fecha, seccion, orden)` + `datos jsonb` | Listados capturados (claves sufijadas: `transito.hechos`, `prevencion.convenios`, …) |

**Regla de contenido del jsonb**: los campos de catálogo guardan el **id real** (`sector_id`, `delito_id`, `grua_id`, `concepto_id`, `oficial_id`), nunca el nombre desnormalizado — el nombre se resuelve con JOIN al generar el documento. Si Administración renombra un sector, el parte histórico sigue resolviendo bien.

### Regla de datos: calcular al cargar, snapshot al confirmar

`obtenerDiaNovedades(fecha)` **no escribe**; devuelve lo calculado + lo ya capturado + el estatus. El snapshot ocurre solo en `confirmarSeccionNovedades(fecha, seccion, datos, userId)` y **solo sobre la sección que se confirma** — esa acotación evita el bug de Formato N donde un guardado sobreescribía con ceros los campos de otra pantalla. Si una sección ya fue confirmada, se devuelve el snapshot guardado, **no** el recálculo.

### Ventana 06:00 → 06:00

Helper único `ventanaNovedades(fecha)` → `[inicio, fin]`. **Ninguna query usa `::date`** sobre columnas de timestamp (la ventana no coincide con un día natural). Las tablas con fecha y hora separadas (`ofi_reporte_denuncia.fecha_reporte + hora_reporte`, `iph_detenidos.fecha_evento + hora_inicio_evento`) se filtran componiendo ambas. La única excepción es `incidentes_camara` (agregado por turno): `SUM WHERE fecha = D-1` — ver sección C-4.

**El esquema mezcla `timestamp with time zone` y `timestamp` sin zona**, y el servidor corre en `America/Mexico_City` (UTC-6). Un mismo literal se interpreta distinto según el tipo de la columna:

```
'2026-08-10T06:00:00.000Z'::timestamptz  ->  2026-08-10 00:00:00-06   (00:00 local)
'2026-08-10T06:00:00.000Z'::timestamp    ->  2026-08-10 06:00:00      (06:00 local)
```

Por eso **no existe un solo literal correcto para ambos tipos**. `ventanaNovedades` emite los límites como hora local ingenua (`'YYYY-MM-DD 06:00:00'`) y cada query declara el tipo de su columna con uno de dos helpers de `lib/novedades/ventana.ts`:

| Helper | Para |
|---|---|
| `rangoTz(col)` | columnas `timestamp with time zone` — `incidentes.fecha_hora_inicio`, `ofi_reportes_campo.created_at`, `via.v2_infracciones.created_at`, `ofi_puesta_disposicion.creado_en` |
| `rangoNaive(col)` | columnas sin zona y expresiones `date + time` — `medidas_proteccion.creado_en`, `visitas_domiciliarias.creado_en`, `fichas_busqueda.creado_en` / `.fecha_activacion`, `(fecha_reporte + hora_reporte)` |

**Usar el helper equivocado corre la ventana 6 horas en silencio.** Antes de esta corrección, todo evento entre 00:00 y 06:00 hora local caía en el parte del día siguiente: un incidente de las 02:00 del 11-ago se reportaba en el parte del 12. Los helpers dejan la comparación sargable (convierten el parámetro, no la columna).

### Generación del .docx

`lib/novedades/docx/` con **un builder por bloque** (`resumen`, `subsecretaria`, `analisis`, `c4`, `transito`, `prevencion`, `delictivos`, `operativos`, `resumen-nov`, `fuerza`, `encabezado`) que concatena `index.ts`. Todos importan los helpers compartidos de `lib/reportes/docx-helpers.ts` (extraídos de nCoordinación en la Etapa 1). Ruta: `GET /api/novedades/generar?fecha=`.

## Reglas de negocio

1. **C-4 (paso 5) es 100% automático**: T6a (911) desde `incidentes` con `canal='911'` en la ventana; T6b (cámaras) = `SUM(incidentes_camara WHERE fecha = D-1)` — los 3 turnos del día anterior. **Depende del fix de la Etapa 0.6**: `fecha` significa la fecha de **inicio** del turno (el NOCTURNO cruza la medianoche 22:00→07:00). Si el fix no está aplicado, produce números mal en silencio — validado en la carga.
2. **El sector de un hecho se hereda del oficial que lo atendió** (`ofi_oficiales.sector_id`), con fallback por colonia **sin fuente** (no existe catálogo colonia→sector; solo texto libre). Lo que no resuelve sector cae en "sin asignar" y se distribuye a mano en el paso 2 — **nunca se reparte solo**. `ofi_oficiales.sector_id` es nuevo (Etapa 0.2) y está en NULL hasta que Administración lo asigne.
3. **CENTRO es la tercera columna de sector** (decisión del usuario, 2026-08-10): T0, T2 y T7 imprimen `ORIENTE | PONIENTE | CENTRO | TOTALES`. Es la única desviación estructural respecto del `.docx` original. Las columnas se generan iterando `cat_sectores` activos.
4. **Ventana única 06→06** aunque el documento original diga "DE 05:00 A 05:00 HORAS" en T5 — el literal se corrige en el generador.
5. **Catálogos por id, nunca por nombre** dentro del jsonb (ver arriba).
6. **Los catálogos se sembraron en la Etapa 0**: `cat_sectores` (ORIENTE/PONIENTE/CENTRO), `cat_clasificacion_delitos` (4 familias: PATRIMONIALES CU / CONTRA LA SOCIEDAD / CONTRA LAS PERSONAS / OTROS), `cat_estado_fuerza_conceptos` (12 conceptos de T32 en dos grupos PERSONAL/PARQUE). Los delitos que aparezcan después y no estén en el catálogo caen en `OTROS` y se listan en el paso 8 para clasificación manual — el catálogo crece solo con el uso.
7. **T31 "RESUMEN DE NOVEDADES"** tiene filas normales autollenadas desde `incidentes` + filas **INFORMATIVOS** (ECO 8, INTERINSTITUCIONAL, METROPOLITANO II) que son **plantillas de texto con estructura fija** alimentadas por los valores capturados — no textarea libre.
8. El `.docx` se genera con "SIN NOVEDAD" en cada tabla de listado vacía (`tablaSinNovedad`) y `00` en las matrices de contadores — igual que el formato en blanco.

## Componentes involucrados

| Archivo | Rol |
|---------|-----|
| `app/envio-de-formatos/page.tsx` + `components/envio-formatos/HubFormatos.tsx` | Selector de formatos (redirige directo si solo se tiene un permiso) |
| `app/envio-de-formatos/novedades/page.tsx` | Consolidado por día (rango de fechas, badge LISTO/PENDIENTE, n/11) |
| `app/envio-de-formatos/novedades/[fecha]/page.tsx` | Stepper de 11 pasos |
| `features/novedades/components/pasos.tsx` | PasoView + componentes genéricos `MatrizContadores`, `TablaEditable`, `TablaSoloLectura` |
| `lib/novedades/store.ts` | Store Zustand (maps genéricos `secciones`/`filas`/`calculado`) |
| `lib/novedades/types.ts` | Un tipo por sección + filas de listados |
| `lib/novedades/ventana.ts` | Ventana 06→06 + `fechaTurnosDelParte` |
| `lib/novedades/sector.ts` | Resolución del sector de un hecho (Etapa 0.3) |
| `lib/novedades/repository.ts` | SQL sobre las 3 tablas de persistencia |
| `lib/novedades/estatus.ts` | Semáforo del stepper (11 secciones) |
| `lib/novedades/service.ts` | `obtenerDiaNovedades` / `confirmarSeccionNovedades` |
| `lib/novedades/calculo/grupo-a.ts` | Autollenado puro: C-4, Subsecretaría, Fuerza |
| `lib/novedades/calculo/grupo-b.ts` | Con sector: Resumen (T0-T2), Tránsito (T7-T9), Delictivos (T25-T26) |
| `lib/novedades/calculo/manual.ts` | Manual: Análisis (T5), Prevención (T14-T15), Operativos (T29-T30) |
| `lib/novedades/docx/` | Generador del `.docx` por bloques |
| `app/api/novedades/{dia,confirmar,guardar,estatus,generar}/route.ts` | API de lectura, confirmación, guardado y generación |
| `lib/reportes/docx-helpers.ts` | Helpers docx compartidos (Etapa 1) |

## BD

| Tabla | Columnas clave | Uso |
|-------|---------------|-----|
| `novedades_estatus_dia` | `fecha` (PK), 11 `*_confirmado` boolean, `completado_en`, `actualizado_por` | Semáforo del stepper |
| `novedades_seccion` | `(fecha, seccion)` PK, `datos jsonb`, `capturado_por` | Matrices de contadores |
| `novedades_filas` | `id`, `(fecha, seccion, orden)`, `datos jsonb`, `capturado_por` | Listados |
| `cat_sectores` | `id`, `nombre`, `clave` (UNIQUE), `activo` | Sectores ORIENTE/PONIENTE/CENTRO (sembrado Etapa 0) |
| `cat_clasificacion_delitos` | `id`, `delito` (UNIQUE), `familia`, `activo` | Clasificación de delitos en 4 familias |
| `cat_estado_fuerza_conceptos` | `id`, `nombre`, `codigo` (UNIQUE), `grupo`, `orden` | 12 conceptos de T32 |
| `ofi_oficiales.sector_id` | FK `cat_sectores(id)` | Sector del oficial (nuevo, Etapa 0.2) |

## Decisiones clave (ADRs en `boveda/🏗 Arquitectura/Decisiones.md`)

- ADR-015: `cat_sectores` gana sobre `via.sectores` (este último queda como catálogo del subsistema VIA).
- ADR-016: `turno` se queda como enum TS, no como catálogo con FK.
- ADR-017: ventana única 06→06 pese al literal 05:00 del documento original.
- ADR-018: columna CENTRO agregada al formato oficial.
- Por qué 3 tablas genéricas en vez de una por sección.
- Qué significa `incidentes_camara.fecha` a partir de ahora (fecha de inicio del turno).
- Snapshot al confirmar vs. recálculo en vivo.

## Estado actual (2026-08-10)

Plan `plan-parte-novedades-c4/` completo hasta la Etapa 9. `roles_servicio`/`rol_estado_fuerza`/`incidentes_camara`/`fichas_busqueda`/`medidas_proteccion` están en 0 filas en desarrollo — el autollenado de esas secciones degrada a ceros/vacío (correcto: el formato en blanco muestra lo mismo). El estado de fuerza (T32) se alimentará cuando el módulo de Rol de Servicios entre a producción.
