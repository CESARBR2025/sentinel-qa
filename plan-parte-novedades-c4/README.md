# Plan: Parte de Novedades del C-4 (FORMATO NOVEDADES)

## Contexto

Con `plan-formato-n-fge-fgr/` cerrado, el módulo **Formato N a Coordinación** ya
genera su documento correctamente desde `/envio-de-formatos/consolidar`. Este
plan retoma la tarea que dio origen a aquél: automatizar el **Parte de Novedades
del C-4**, el reporte diario más grande del sistema.

Fuente: `~/Downloads/Sistema SSPM/Formatos C4 Sistema/NOVEDADES/FORMATO NOVEDADES.docx`
(**34 tablas**, ventana **06:00 → 06:00**).

La estrategia es deliberadamente la misma que ya funciona en Formato N: un
stepper sección por sección, autollenado desde la BD donde hay fuente, captura
manual donde no la hay, confirmación por sección y generación del `.docx`
completo al final.

## Decisiones tomadas con el usuario (2026-08-10)

1. **Ventana 06:00 → 06:00 para todo el documento.** Aunque la tabla interna de
   Plataforma México dice "DE 05:00 A 05:00 HORAS", el documento se rige por una
   sola ventana: 06:00 del día anterior a 06:00 del día del parte. El literal de
   esa tabla se corrige a 06:00 en el generador.
2. **El sector de un hecho se hereda del oficial que lo atendió**, no de la
   colonia ni de la unidad.
3. **CENTRO se agrega al documento como tercera columna de sector.** Las tablas
   T0, T2 y T7 pasan de `ORIENTE | PONIENTE | TOTALES` a
   `ORIENTE | PONIENTE | CENTRO | TOTALES`. Es la única desviación estructural
   respecto del `.docx` original; conviene socializarla con el Secretario antes
   del primer envío.
4. **La tabla de cámaras (T6b) debe quedar automática**, sin captura manual.
5. **Turnos como concepto de primera clase: evaluado y descartado** — ver
   "Turnos: analizado y descartado" más abajo. Los datos se traen con rangos de
   timestamp, no con lógica de turnos.
6. **Limpiar deuda técnica en BD**: tablas sin sentido se eliminan
   ([Etapa 10](ETAPA-10.md)).

## Hallazgo que modifica la premisa 2 (verificado contra BD real)

`ofi_oficiales` **no tiene columna de sector**. Sus columnas reales son:

```
id, ofi_estatus, created_at, updated_at, user_id, no_nomina,
numero_empleado, telefono, patrulla_id, departamento_id,
ultima_lat, ultima_lng, ultima_ubicacion_en
```

- `departamento_id` → `via.v2_departamentos`, que solo contiene
  **Infracciones / Liberaciones / Tránsito**. No es sector.
- `patrulla_id` → `via.v2_patrullas`, cuyo campo `departamento` es texto libre y
  vale `'SSPM'` en el 100% de las filas.

Y existen **dos catálogos de sector compitiendo**:

| Catálogo | Filas | FKs que lo referencian |
|---|---|---|
| `via.sectores` | ORIENTE, PONIENTE, **CENTRO** | ninguna |
| `public.cat_sectores` | **vacío** | `roles_servicio.sector_id` |

**Premisa asumida** (Etapa 0): se consolida en `public.cat_sectores` —es el que
ya tiene FK real—, se siembra con ORIENTE/PONIENTE/CENTRO, se agrega
`ofi_oficiales.sector_id` con FK, y la resolución del sector de un hecho es:

```
sector(hecho) = sector del oficial que lo atendió
             ?? sector inferido por colonia   (fallback)
             ?? NULL → cae en captura manual del paso 2
```

Las tres claves —ORIENTE, PONIENTE, CENTRO— se imprimen como columnas propias
(decisión 3). Lo que no resuelva sector cae en "sin asignar" y se distribuye a
mano en el paso 2: no se pierde el dato ni se inventa la asignación.

## Turnos: analizado y descartado

Se evaluó introducir turnos como concepto de primera clase —catálogo
`cat_turnos` + asignación de turno a los usuarios del C-4 desde superadmin— y
**se descartó**. Tres razones, en orden de peso:

**1. El reporte nunca consume el turno de un usuario.** `incidentes_camara` ya
trae su propio `turno` en cada fila. Ninguna de las 34 tablas del documento
pregunta "¿en qué turno trabaja este usuario?". El turno solo sirve para
delimitar qué filas de cámaras caen en la ventana, y ese dato ya está en la fila.

**2. Sería la tercera implementación de turno en el sistema.** `roles_servicio`
ya tiene `turno`, `responsable_turno`, `horario_inicio` y `horario_fin`: la
gestión de turnos **ya existe como dominio**, en Rol de Servicios. Agregarla
también a `users` crea dos fuentes de verdad que se contradicen en cuanto
alguien cubre un turno ajeno — y no hay regla obvia sobre cuál gana.

**3. `cat_turnos` no cambia ninguna query.** La regla que se necesita es
`fecha = D-1`; los horarios sirven para *derivarla*, no para ejecutarla. Un
catálogo de tres filas estáticas más migración de columna más tocar cinco
archivos de UI, `lib/camara`, `lib/monitorista` y el export a xlsx, para dejar
el SQL idéntico.

Sobre el filtro "solo usuarios de C-4, no policías ni
infracciones/liberaciones/corralones": el discriminador **sí existe**
(`users.dependencia_id` → `cat_dependencias`, donde los ids 1–6 son las áreas
del C-4: Líneas 911, Despacho y Bitácora, Novedades, Investigación, Monitoreo de
Cámaras, Jefatura C4). Es implementable. Pero obliga a superadmin a sostener esa
regla en cada alta, indefinidamente, para alimentar un dato que ningún reporte
lee. Si más adelante se quiere gestión de turnos por persona, el lugar correcto
es **extender Rol de Servicios**, no `users`, y va en su propio plan.

## Segundo hallazgo: la fecha del turno nocturno es ambigua

Lo que sí es un bug real, y es preexistente. `incidentes_camara.fecha` tiene
`DEFAULT CURRENT_DATE` y el formulario la prellena con `new Date()`
([`nuevo/page.tsx:113`](../app/monitorista/incidentes-camara/nuevo/page.tsx)).
El turno NOCTURNO corre de 22:00 a 07:00, o sea cruza la medianoche:

| Quién captura | Cuándo | Qué guarda |
|---|---|---|
| Monitorista nocturno | 23:00 del día D-1 | `fecha = D-1` |
| Monitorista nocturno | 02:00 del día D | `fecha = D` |

**La misma jornada queda con fecha distinta según a qué hora le dio guardar.**
Eso rompe cualquier regla de ventana, y ya está ensuciando el reporte de cámaras
y el export a xlsx que existen hoy.

El arreglo (Etapa 0.6) es de un archivo: `fecha` pasa a significar
inequívocamente **la fecha de inicio del turno**, el formulario la calcula según
el turno elegido y muestra la jornada resultante en texto. Los horarios se
centralizan en la constante `TURNOS` que ya existe en
`lib/monitorista/service.ts:18`, en vez de estar escritos a mano en cinco
archivos. **Sin tabla nueva, sin migración de columna, sin FK.**

Con eso la regla queda exacta y la sección de C-4 es **100% automática**:

```
parte(D).camaras = SUM(incidentes_camara WHERE fecha = D - 1)
```

los tres turnos del día anterior. Cada turno pertenece a exactamente un parte —
ninguno se duplica ni se pierde (justificación en Etapa 4.1).

## Todo lo demás: rangos de timestamp, sin turnos

Las 33 tablas restantes no son agregados por turno sino hechos con su propia
marca de tiempo. Todas se filtran con la ventana explícita:

```sql
WHERE columna >= $inicio AND columna < $fin   -- [D-1 06:00, D 06:00)
```

Nunca `::date` sobre un timestamp: la ventana **no coincide con un día natural**,
así que recortar por día es incorrecto por construcción. Las tablas que guardan
fecha y hora en columnas separadas (`ofi_reporte_denuncia.fecha_reporte` +
`hora_reporte`, `iph_detenidos.fecha_evento` + `hora_inicio_evento`) se filtran
componiendo ambas. Detalle en la Etapa 3.

## Mapeo del documento a fuentes reales

### Autollenado sólido — ~40% del documento

| Tabla doc | Sección | Fuente |
|---|---|---|
| T6a | Línea 9-1-1 | `incidentes` (`canal='911'`) × `cat_tipos_emergencia`. El catálogo ya trae exactamente las columnas del formato: SEGURIDAD, MÉDICO, PROTECCIÓN CIVIL, SERVICIOS PÚBLICOS, ASISTENCIA, OTROS SERVICIOS, IMPROCEDENTES. Canalizadas = `medio_canalizacion_id IS NOT NULL` |
| T6b | C-4 cámaras | `incidentes_camara`, mapeo 1:1 de los 9 conceptos, sumando los 3 turnos de `fecha = D-1` (requiere el fix de fecha, Etapa 0.6) |
| T3/T13/T16 | PD Fiscalía | `ofi_reportes_campo` + `ofi_detalles_asegurados` + `ofi_puesta_disposicion` + `iph_detenidos` |
| T4/T12/T17 | Juzgado Cívico | `ofi_reporte_denuncia` (`folio_sija`, `folio_remision`, `marco_legal`, `iph`) + `iph_detenidos.rnd` |
| T9/T19 | Vehículos a corralón | `via.v2_infracciones` (`grua_id`, `motivo_retencion`) + `via.v2_gruas` |
| T1/T18 | Infracciones | `via.v2_infracciones` + `v2_patrullas` / `v2_departamentos` |
| T26 | Denuncias digitales | `ofi_reporte_denuncia` (`crp`, `folio_cu`, `num_cuestionarios`) — es el módulo `/d1` |
| T15 | Persona no localizada | `fichas_busqueda` + `seguimientos_busqueda` |
| T32 | Estado de fuerza | `roles_servicio` + `rol_estado_fuerza` + `cat_estado_fuerza_conceptos` |
| T31 | Resumen de novedades | `incidentes` + `ofi_reporte_denuncia.iph` |

### Parcial

- **T0 Aseguramientos / T7 Tránsito (19 conceptos):** los totales salen; el
  desglose Oriente/Poniente depende de Etapa 0.
- **T25 Delitos:** los delitos están en `ofi_reporte_denuncia.delito` e
  `iph_detenidos.delito`, pero no existe catálogo que los agrupe en las 4
  familias del formato (Patrimoniales CU / Contra la sociedad / Contra las
  personas / Otros). Se crea en Etapa 0.
- **T14 Atención a Víctimas (29 contadores):** ~8 tienen fuente
  (`medidas_proteccion`, `visitas_domiciliarias`, `fichas_busqueda`); el resto
  (mediación, vinculación, jornadas, custodias) no tiene módulo.
- **T27/T28 Vehículos robados/recuperados:** datos dispersos en
  `ofi_reportes_campo.ofi_vehiculos` (jsonb) y `formato_incidencia_complemento`.
- **T30 Operativos:** `ofi_reportes_campo` ya tiene los flags `ofi_eco8`,
  `ofi_operativos_metropolitano`, `ofi_apoyo_cateos_fge/fgr` → sirven para contar
  puestas a disposición por operativo; el estado de fuerza del operativo no.

### Sin fuente — captura 100% manual

T5 Plataforma México · T8 hechos de tránsito (detalle) · T10 vehículos
notificados · T11 operativos y despejes · T20/T21 convenios de mediación ·
T22 pláticas de vinculación · T23/T24 jornadas · T29 supervisión general.

## Arquitectura

### Persistencia — 3 tablas, no 20

34 tablas de documento no justifican una tabla SQL por sección (Formato N usa
ese patrón con 8 secciones; no escala a 34).

- `novedades_estatus_dia` — booleanos por paso + `completado_en`. Clon exacto de
  `formato_n_estatus_dia`.
- `novedades_seccion (fecha, seccion, datos jsonb)` — matrices de contadores.
- `novedades_filas (fecha, seccion, orden, datos jsonb)` — listados capturados.

`novedades_captura (fecha, datos jsonb)` ya existe en BD con **0 filas y sin uso
en código** (solo aparece en `lib/admin/sistema-constants.ts:38`). Es un intento
previo abandonado; se retira en Etapa 2.

**Los campos de catálogo dentro del jsonb guardan el id del catálogo real**
(delito, grúa, sector, tipo de arma, concepto de estado de fuerza), nunca texto
libre. El jsonb es contenedor de la sección, no excusa para datos sueltos.

### Regla de datos: calcular al cargar, snapshot al confirmar

Igual que el flujo bueno de `/formato-n-fge`: el sistema computa, el usuario
revisa y corrige, y al confirmar la sección se congela el valor. Es un documento
oficial diario — si mañana se corrige un IPH, el parte de ayer no debe cambiar.

Esto también evita el bug que se corrigió en Formato N (sobreescritura del
snapshot con ceros): el snapshot solo se escribe desde el paso que lo posee.

### Ventana 06:00 → 06:00

Un helper único `ventanaNovedades(fecha)` en `lib/novedades/ventana.ts` devuelve
`[inicio, fin]` como timestamps. **Ninguna query usa `::date`** — ese fue
exactamente el bug de timezone ya registrado como decisión en Formato N
(`buscarIncidentesPorRango` / `buscarDetencionesPorRango`).

### Generación del .docx

`app/api/nCoordinacion/generar/route.ts` son **326 líneas para 8 tablas**. A ese
ritmo NOVEDADES sería ~1,400 líneas en un archivo. Se extraen los helpers
(`r`, `p`, `tc`, `tr`, `hRow`, `dRow`, header con logos, línea de firma) a
`lib/reportes/docx-helpers.ts` y se hace **un builder por bloque** en
`lib/novedades/docx/`.

### Stepper — 11 pasos, no 34

Agrupados por dirección, que es como el C-4 lo llena en la práctica:

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

Las 3 filas "INFORMATIVOS" de T31 (ECO 8, Interinstitucional, Metropolitano II)
son plantillas de texto con placeholders fijos → generador desde plantilla
alimentado por el estado de fuerza capturado, **no textarea libre**.

### Reutilización directa de Formato N

Store Zustand, `StepIndicator`, `components/reportes/form-styles`, el patrón
`/sincronizar` + `/calcular`, la vista consolidar y `PageHeader`/`DashboardHeader`
se copian sin cambios de fondo. Todo lo visual se rige por `DESIGN.md`.

## Etapas

| Etapa | Qué hace | Tier |
|---|---|---|
| [0](ETAPA-0.md) | Prerrequisitos de datos: sectores, `ofi_oficiales.sector_id`, clasificación de delitos, conceptos de estado de fuerza, fix de fecha del turno nocturno | T2 |
| [1](ETAPA-1.md) | Extraer helpers docx (refactor de nCoordinación, sin cambio funcional) | T2 |
| [2](ETAPA-2.md) | Esquema de persistencia (3 tablas) + retiro de `novedades_captura` | T2 |
| [3](ETAPA-3.md) | Capa de dominio `lib/novedades/` + ventana 06→06 | T2 |
| [4](ETAPA-4.md) | Cálculo grupo A — autollenado puro (C-4, Subsecretaría, Estado de fuerza) | T2 |
| [5](ETAPA-5.md) | Cálculo grupo B — con sector (Resumen general, Tránsito, Hechos delictivos) | T2 |
| [6](ETAPA-6.md) | Secciones de captura manual (Análisis, Prevención, Supervisión) | T2 |
| [7](ETAPA-7.md) | Store Zustand + stepper de 11 pasos | T2 |
| [8](ETAPA-8.md) | Generador `.docx` completo + ruta `/api/novedades/generar` | T2 |
| [9](ETAPA-9.md) | Integración, permisos y bóveda | T2 |
| [10](ETAPA-10.md) | Limpieza de deuda técnica en BD (auditoría con evidencia) | T2 |

Las etapas 0, 1 y 2 son prerequisito de todo lo demás y pueden hacerse en
paralelo entre sí. De la 3 en adelante es secuencial, salvo 4/5/6 que son
independientes entre ellas. La 10 es independiente de todo y puede correr
cuando sea.

## Criterio de terminado

- `/envio-de-formatos/consolidar` ofrece los dos formatos (Coordinación y
  Novedades) con su propio semáforo de secciones.
- Un día con datos completos genera el `.docx` con las 34 tablas pobladas.
- Un día sin datos genera el `.docx` con "SIN NOVEDAD" en cada tabla — igual que
  el formato en blanco original.
- `npx tsc --noEmit` y `npm run build` limpios.
