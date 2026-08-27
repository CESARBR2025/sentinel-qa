# Changelog

**Propósito**: Historial cronológico de cambios.

---

## 2026 — Agosto

### — Armas de Fuego Aseguradas: captura estructurada en Fiscalía + auto-sync al paso 7 de Formato N (2026-08-10)
El paso 7 de Formato N era 100% manual porque no existía fuente estructurada de tipo/marca/matrícula/calibre en ningún lado del sistema (diagnóstico verificado contra BD real: `ofi_reportes_campo.ofi_armas_fuego` es jsonb con `datos` en texto libre; `obtenerArmasParaFormatoN` era código muerto). Se crea la infraestructura en Fiscalía y se sincroniza con el mismo patrón `origen_*_id` + `UPSERT` de Eventos/RND.
- **Migración `0048_fiscalia_armas_aseguradas.sql`**: tabla `fiscalia_armas_aseguradas` (FK `reporte_campo_id → ofi_reportes_campo(id)` y `capturado_por → users(id)`, regla `NO ACTION` como las gemelas `antecedentes_externos_detenido`/`evidencias_detenido` — verificado contra BD real, el template del plan decía `CASCADE` pero lo real es `NO ACTION`) + columna `origen_fiscalia_arma_id` (uuid, índice único parcial) en `formato_n_armas_aseguradas`.
- **Backend Fiscalía** (`lib/fiscalia`): tipos `ArmaAsegurada`/`ArmaAseguradaInput`/`ListaArmasAseguradas`, `rowToArmaAsegurada`, `listarArmasAseguradasFiscalia` (trae `num_carpeta_investigacion` del D1 como sugerencia), `insertarArmaAsegurada`, `eliminarArmaAsegurada`, services y actions calcando el patrón de `AntecedenteExterno`.
- **UI Fiscalía**: `components/fiscalia/ArmasAseguradas.tsx` (lista + alta/baja, estilos idénticos a `AntecedentesExternos.tsx`), montado en `FormularioAsegurado.tsx`.
- **Sync a Formato N**: `sincronizarArmasDelDia` en `formato-n-armas-aseguradas-service.ts` (`UPSERT ON CONFLICT (origen_fiscalia_arma_id)` + `eliminarDuplicadosArmasDelDia` en el mismo orden que Eventos/RND: huérfanos-por-origen antes que duplicados exactos), carpeta de investigación resuelta del D1 vía `LEFT JOIN ofi_reporte_denuncia` en el momento del sync. Endpoint nuevo `POST /api/reportes/formato-n-armas-aseguradas/sincronizar` + tercera llamada en el `Promise.all` del store `cargar`. Se elimina el código muerto `obtenerArmasParaFormatoN`/`ArmaFuente`.
- **Paso 7 UI**: tabla de armas auto-sincronizadas (Tipo, Marca, Matrícula, Calibre, Carpeta, Observaciones) + form manual conservado como respaldo para casos que Fiscalía aún no haya procesado. La `carpeta_investigacion` NO se guarda en `fiscalia_armas_aseguradas` (solo sugerencia visual).
- Verificación contra BD real: sync + idempotencia (2 corridas → 1 fila) + update tras editar tipo (no duplica). Typecheck y build completos OK. Scripts temporales eliminados.

### — Fix timezone + limpieza de duplicados en sync de eventos/RND Formato N (2026-08-10)
El paso 1 volvió a mostrar filas repetidas. Diagnóstico contra BD real (2026-08-10): `incidentes` tenía **3 eventos reales** (08:10 CRISTALAZO, 11:26 DAÑO, 11:43 DESPOJO), pero `formato_n_eventos` acumulaba **8 filas** (5 duplicadas) y `formato_n_rnd` **4 filas** para 2 detenciones (2 duplicadas).
- **Causa raíz 1 — timezone**: `buscarIncidentesPorRango`/`buscarDetencionesPorRango` usaban `new Date(...).toISOString()` que convierte a **UTC** — la hora local México (UTC-6) se guardaba +6h (14:10 en vez de 08:10). Eso además rompía la clave de dedupe entre syncs: al cambiar la hora, cada sync creaba filas "nuevas".
- **Fix**: las queries ahora calculan `fecha`/`hora` en SQL con `fecha_hora_inicio::date` y `TO_CHAR(fecha_hora_inicio,'HH24:MI')` (hora local de la sesión, `America/Mexico_City`) — sin conversión JS a UTC.
- **Limpieza BD real**: se eliminaron los duplicados existentes y se re-insertaron desde la fuente con la hora local correcta. Quedaron 3 eventos y 2 detenciones (únicos). El dedupe del sync (`eliminarDuplicadosEventosDelDia`/`eliminarDuplicadosRndDelDia`) ahora es consistente porque la hora ya no "flota".
- Typecheck, lint y build OK.

### — Formato N: FGR paso 3 con fuente automática (detenciones a Fiscalía Federal) (2026-08-10)
Corrección: el mensaje "Sin fuente automática — solo existe catálogo de Fiscalía del Estado" era incorrecto. El reporte de campo sí guarda el destino legal de la detención con el valor `FGR` (`ofi_autoridad_recibe`, catálogo de `SelectorDestinoLegal.tsx`).
- **`calcularConteosFgrPorFecha(fecha)`** (`formato-n-fgr-service.ts`): cuenta detenciones con `ofi_hay_detencion = true` y `ofi_autoridad_recibe = 'FGR'` del día → llena `personas_aseguradas` y `aprehensiones`; carpetas/cateos/vehículos/domicilios sin fuente federal quedan en 0.
- **`GET /api/reportes/formato-n-fgr/calcular`** (nuevo), gate de permiso `ver`.
- **Store `cargar`**: ejecuta también el cálculo FGR (además del FGE) al abrir el reporte.
- **Paso 3 UI**: mismo patrón que FGE — tabla de solo lectura con los 6 conteos automáticos + captura manual de las 3 audiencias. Se elimina el banner de "Sin fuente automática".
- Typecheck, lint y build OK.

### — Formato N: se eliminan botones "Confirmar sección" / "Omitir" de los pasos (2026-08-10)
El stepper pasa a confirmar al navegar: los pasos quedan presentacionales y "Siguiente" guarda + confirma la sección automáticamente.
- **`reporte/[fecha]/page.tsx`**: se elimina el componente `Acciones` (botones "Omitir / Sin novedad" y "Confirmar paso/sección") de los 8 pasos. `PasoView` ya no recibe `onGuardar`/`onOmitir` — los pasos solo leen del store. El botón **Siguiente** ahora es el que avanza y, según la sección, ejecuta su `guardar*` (FGE/FGR/Medios/Víctimas/Armas/Observaciones) antes de `confirmarSeccion` (Eventos/RND no guardan, solo confirman — sus datos ya se auto-sincronizan). El último paso tiene botón **"Finalizar reporte"** que guarda observaciones y confirma.
- Se elimina el import `Save` y el ícono ya no se usa.
- Typecheck, lint y build OK.

### — Fix duplicados de eventos/detenciones en el sync Formato N (2026-08-10)
El paso 1 mostraba filas repetidas idénticas (misma hora/evento/ubicación/descripción) — residuos de cuando el formulario permitía capturar manualmente el mismo incidente varias veces. El sync evitaba duplicados nuevos pero no limpiaba los existentes.
- **`eliminarDuplicadosEventosDelDia(fecha)`** (eventos) y **`eliminarDuplicadosRndDelDia(fecha)`** (RND): DELETE de duplicados por (fecha + hora + evento + ubicación + descripción) conservando la fila más antigua (`creado_en` menor; empate por `id` menor). Se ejecutan al inicio del sync, así la próxima apertura del reporte limpia los datos acumulados.
- **`sincronizarEventosDelDia` / `sincronizarDetencionesDelDia`**: la clave de dedupe ahora incluye `ubicacion` (eventos) y `autoridad_que_realizo_detencion` (RND), y se agrega un set `vistos` para no re-insertar si la fuente (incidentes/detenciones) ya trae duplicados.
- Typecheck, lint y build OK. Los duplicados existentes se eliminan al abrir el reporte (el `cargar` corre el sync antes del consolidado).

### — Stepper Formato N: RND y FGE automáticos en tabla, sin buscar/usar (2026-08-10)
Siguiendo el patrón del paso 1, RND y FGE pasan a datos automáticos visualizados en tabla; el resto conserva captura manual.
- **RND (paso 4)**: `sincronizarDetencionesDelDia` (en `formato-n-rnd-service.ts`) + `POST /api/reportes/formato-n-rnd/sincronizar` (nuevo). Al abrir el reporte se crean en `formato_n_rnd` las detenciones del día (idempotente por hora+delito). UI = tabla (Hora, Delito, Autoridad, Folio) + "Confirmar sección". Se eliminan `rndForm`, `rndFuente`, `rndBuscando`, `buscarRndFuente`, `guardarRnd` y la captura manual.
- **FGE (paso 2)**: `calcularConteosPorFecha` se ejecuta en `cargar` (antes botón "Calcular de reportes"). UI = tabla de solo lectura con los 6 conteos automáticos (carpetas, cateos, vehículos, domicilios, personas, aprehensiones) + captura manual de las 3 audiencias (Iniciales, Abreviados, Intermedias). Se elimina `calculando`/`calcularFge`/`setCalculando` del store.
- **FGR, Medios, Víctimas, Armas y Observaciones**: sin cambios — conservan su captura manual (no tienen fuente automática).
- Store limpio de estado muerto (`RndForm`, `FuenteRnd`, `setRnd*`, `calcularFge`); la page ya no importa `Calculator`/`Search`/`btnTiny`/`filaFuente`.
- Typecheck, build y lint (0 errores) OK.

### — Paso 1 Formato N: eventos en tabla, se elimina la captura manual (2026-08-10)
Con los eventos ya auto-sincronizados del día, el paso 1 pasa de formulario de captura a **tabla de solo lectura**:
- **`PasoEventos`** reescrito: tabla (`--apple-font-display`, `--radius-lg`, `--shadow-card`, `.tabla-wrap` para scroll móvil) con columnas Hora / Evento / Región / Ubicación / Descripción / Atenciones + botón "Confirmar sección". Empty state "Sin eventos registrados para esta fecha".
- **`formato-n-store.ts`**: se eliminan `eventosForm`, `EventosForm`, `guardarEventos`, `setEventosForm` y el `Acciones` (Omitir/Confirmar) de eventos — ya no hay datos que capturar.
- Feature `Formato N.md` actualizado: paso 1 solo visualiza eventos.
- Typecheck, build y lint (0 errores) OK.

### — Auto-sync de eventos del día en el stepper Formato N (paso 1) (2026-08-10)
Se elimina el flujo manual "Buscar desde incidentes → Usar" del paso 1 de `/envio-de-formatos/reporte/[fecha]`: al entrar al formulario los eventos de la fecha ya están cargados automáticamente.
- **`sincronizarEventosDelDia(fecha, capturadoPor)`** en `formato-n-eventos-service.ts`: trae los incidentes del día (`buscarIncidentesPorRango`) y los inserta en `formato_n_eventos` (región default "San Juan del Río"), idempotente por (hora, evento). Devuelve la lista resultante.
- **`POST /api/reportes/formato-n-eventos/sincronizar`** (nuevo): gate de permiso `crear` + session → `sincronizarEventosDelDia`.
- **`formato-n-store.ts`**: `cargar` ejecuta el sync antes de pedir el consolidado, así `consolidado.eventos` ya trae los eventos del día. Se eliminan `eventosFuente`, `eventosBuscando`, `buscarEventosFuente` y el tipo `FuenteCandidato` (sin uso).
- **Paso 1 UI**: sin botón "Buscar desde incidentes" ni "Usar" — se listan los eventos ya registrados (hora + evento + ubicación); el formulario manual queda para agregar eventos no capturados en incidentes.
- Typecheck, build y lint (0 errores) OK.

### — Stepper Formato N con store Zustand (`formato-n-store.ts`) + REGLA de formularios (2026-08-10)
El formulario de `/envio-de-formatos/reporte/[fecha]` pasa a controlarse con un store Zustand, y se eleva a regla del software que todo formulario institucional nuevo use Zustand.
- **`lib/reportes/formato-n-store.ts`** (nuevo): store tipado con navegación (`paso`), `consolidado` cargado, `loading/error/msg`, drafts de las 8 secciones (eventos, fge/fgr, rnd, medios/víctimas, armas, observaciones) y toda la lógica de fetch/guardado centralizada (`cargar`, `confirmarSeccion`, `avanzar`, `guardar*`, `buscar*Fuente`, `calcularFge`). Reutiliza `guardarUpsert` para el patrón POST→409→PATCH de FGE/FGR/medios/víctimas.
- **`app/envio-de-formatos/reporte/[fecha]/page.tsx`**: componentes presentacionales — leen del store con selectores y disparan acciones, sin `useState` de datos ni `fetch` directos. Los drafts ahora **persisten entre pasos** (antes `key={seccion.key}` remontaba el componente y perdía lo escrito). El `msg` que antes se seteaba sin mostrar ahora se muestra como banner de éxito inline.
- **Convenciones.md → "Formularios multi-paso con Zustand (REGLA)"**: todo formulario nuevo usa un store por formulario en `lib/<modulo>/store.ts`; componentes presentacionales con selectores; drafts en el store (no `useState` con `key`); sin fetch en la UI.
- Typecheck, build y lint (0 errores) OK.

### — Migración Apple-style del flujo `/envio-de-formatos` (consolidar + stepper reporte) (2026-08-10)
Se alinean las dos páginas activas del módulo (`consolidar` y `reporte/[fecha]`) al lenguaje Apple-style de `DESIGN.md`; el redirect server-side de `/envio-de-formatos` no renderiza y no requería cambios.
- **`components/reportes/form-styles.ts`** (solo lo consumen estas dos páginas): `inputStyle` → `--apple-font-display` 14px, `--radius-lg`, focus tokens; `btnPrimario`/`btnSecundario`/`btnTiny` → sentence-case 600 14px/12px con `--radius-lg`; `Label` → 12px 500; `sectionCard` → superficie plana `--shadow-card` + `--radius-lg` + `overflow:hidden`; `sectionHeader`/`sectionTitleStyle` → flex con título 600 16px acento (antes Barlow Condensed uppercase). Se elimina el `@import` de Google Fonts tácticas (`fontsImport`).
- **`app/envio-de-formatos/consolidar/page.tsx`**: cards por día a superficie plana `--radius-lg` con `--shadow-card`, barra de estado vertical a `--radius-full` tintada por estado (verde `#16a34a` listo / gris pendiente), badges LISTO/PENDIENTE → pill `--radius-full` con pareja `success-bg`/`warning-bg`, títulos de día sentence-case, botones con hover (`translateY(-2px)` + sombra glass) + press (`scale(0.97)`) y `prefers-reduced-motion` vía `.enf-btn`. Filtro de fechas con labels/inputs Apple.
- **`app/envio-de-formatos/reporte/[fecha]/page.tsx`**: el stepper de chips numerados (prohibido por DESIGN.md §4) se reemplaza por `StepIndicator` (Paso N de M + nombre + barra `--radius-full`); secciones a `sectionCard` Apple; banners informativos a `--radius-lg`; botones Anterior/Siguiente/Acciones a `btnPrimario`/`btnTiny` Apple.
- **`components/partials/StepIndicator.tsx`** (corrección hacia DESIGN.md §4, que ya lo documentaba Apple-style): título 600 `clamp(20px,5vw,28px)` sentence-case, nombre 13px 500, barra 3px `--radius-full` — antes Barlow Condensed 800 uppercase + JetBrains Mono.
- Typecheck y build OK. Lint solo muestra avisos preexistentes (no introducidos).

### — Migración a Apple-style del módulo Reportes (hub + 10 páginas destino) (2026-08-10)
Se alinea todo el flujo de `agente_reportes` al lenguaje Apple-style de `DESIGN.md` (el hub y sus 10 destinos seguían en el lenguaje táctico: Barlow Condensed/JetBrains Mono, mayúsculas, radios sharp `2-4px`, `borderLeft` 4px como sello de tarjeta, `@import` de Google Fonts).
- **`OptionSquare`** (`components/reportes/menuOption.tsx`) reescrito: card glass (`var(--apple-glass-bg)`, blur, `--radius-xl`, sombras tintadas de primary), icono 28px gris → acento en hover con `scale(1.1)`, título sentence-case `--apple-font-display` 600 26px, stats con borde superior sutil, CTA "Ingresar" con flecha. Se eliminan los adornos de esquina tipo bracket y el chip "SISTEMA ACTIVO".
- **Hub `/agente_reportes`**: secciones con barra accent 4×16 `--radius-full` + título 600 22px (antes Barlow uppercase 700 con barra sharp 4×28); root con `--apple-font-display` y fondo `#f1f5f9`; se elimina el `@import` de fuentes tácticas.
- **`envio-de-formatos`**: el grid inline `repeat(auto-fit, minmax(320px,1fr))` pasa a `.cat-cards-grid` (REGLA §4 — antes dejaba cards con ancho arbitrario); `formatos-udai` idem root/fuentes.
- **Stats de todas las vistas destino** (`ReportStat`, `IncidenteStat`): se elimina el `borderLeft: 4px solid #1f355a` (sello táctico prohibido en §7), pasan a superficie plana `--shadow-card` + `--radius-lg`, valor 28px 600 tabular-nums, label 12px 500.
- **Filtros** (`deteccion_camara/ReportFilters`, `incidentes/FiltrosIncidencias`, `modulo_incidentes/ReportFilters`, `d1/D1Filters`, `d1_noiniciada/DescargaFilters`, `sin_robos/ReportFilters`): labels `--apple-font-display` 12px 500, inputs `--radius-lg` bg `#f8fafc`, botones `--radius-lg` sentence-case; los grids inline se reemplazan por flex con `flexWrap` + `minWidth` (responsive sin media query).
- **Tabs** (`modulo_incidentes/ReportesTabs`): de pestañas con `borderBottom` 4px y Barlow uppercase a pills `--radius-full` (activo `#1f355a`/blanco, inactivo `#f1f5f9`/`#64748b`), con `.scrollbar-hide`.
- **Tablas y paginación**: headers de tabla `--apple-font-display` 600 12px sentence-case; badges de estatus a pills `--radius-full` 12px 500; paginaciones a `--radius-md` con texto sentence-case ("Mostrando X-Y de Z"); `reporte-detenidos` y `nCoordinacion` migran su tabla/form inline al mismo lenguaje.
- `reportes_incidentes`: subtitle y botón Excel a sentence-case con acento `#1f355a` (se quita el override verde `#16a34a` de los botones de exportación en `reportes_incidentes`, `d1`, `sin_robos` para respetar "un solo acento por vista").
- Typecheck y build OK.

## 2026 — Agosto

### — KPIs Generales: card en /dashboard + Panel 911 (SSPM) (2026-08-07)
Primer bloque del dashboard de KPIs para el admin de SSPM. Analiza los 3 flujos de reportes 911 (normal, alarma escolar, extorsión) por rango de fecha/hora.
- **Card "KPIs Generales"** en `/dashboard` (sección "SSPM General", solo `esAdmin`) → `/dashboard/kpis`, con `SegmentPage` nivel 1 **SSPM / Infracciones** (Infracciones = placeholder "Próximamente") y nivel 2 dentro de SSPM el tab **911**.
- **Panel 911** (`components/911/kpi-generales/Panel911.tsx` + `FiltroRango911.tsx`): filtro Apple-style con presets 24h/7d/30d/Hoy + rango custom `datetime-local` + refresco manual (sin polling, patrón de `FiltrosRangoKpi` reimplementado en Apple-style). 5 secciones: resumen por tipo/canal, atención y despacho, tiempos de respuesta, alarmas escolares, extorsión (tendencia diaria con barras CSS, sin librería de charts). Enlace al mapa de `/agente_despacho/kpi-incidencias` (no se duplica).
- **Queries nuevas** en `lib/911/repository.ts` (`obtenerResumenPorTipoYCanal`, `obtenerTiemposRespuesta911`, `obtenerKpiAlarmaEscolar`, `obtenerKpiExtorsion`) + service `obtenerKpisGenerales911` que reusa `obtenerKpiIncidencias` de `lib/incidentes`. API `GET /api/incidentes/kpi-911-generales` admin-only.
- **Hallazgo BD real**: `incidente_alarma_escolar` no tiene `hora_canalizacion`/`hora_arribo` — se derivan de despacho (`fecha_hora_despacho` + `MIN(hora_llegada)` con `es_refuerzo=false`), como `obtenerAlarmasEscolaresDetalle`. El % de canalización de extorsión reusa el JOIN de unidad real de `obtenerExtorsionesDetalle` (default `'C4'`).
- **Estados de los stats KPI**: cards glass individuales por métrica (`.kpi-stat`: `--apple-glass-bg` + blur, `--radius-xl`, sombra glass, número 44px con `tabular-nums`), alineadas al estilo de las cards de `/dashboard` (`module-cards.tsx`); en móvil colapsan a una sola fila de columnas iguales (densidad nativa §8).
- **Cards de `/dashboard`** ("Catálogos" / "KPIs Generales" en `sspm-general.tsx`): alineadas al patrón module-card (icono lucide 24px con `transform-origin: top left` en el scale hover, título 26px, CTA "Acceder →", hover/press por CSS sin hooks, sin barra de color superior, contenedor `.cat-cards-grid`).
- **Documentación**: nuevo patrón "Cards individuales — anatomía interna" en `DESIGN.md` §4 (icono → título → sub → CTA, tokens, estados de motion, reglas server/client y prohibiciones).
- Typecheck, lint (0 errores) y build OK; rutas `/dashboard/kpis` y `/api/incidentes/kpi-911-generales` compiladas; verificado con sesión admin real (API 200, páginas 200, gate no-admin redirige).

### — Eliminación completa del flujo "Fotos de Detenidos" (2026-08-07)
Flujo descartado por decisión del usuario; se removió **todo** el workflow (no solo la card de monitorista), verificado previamente con un análisis de usos:
- **Monitorista**: card del hub, páginas `/monitorista/detenidos{/,[id],/nueva}`, componentes `BatchEnvioFotos`, `CardEnvioFoto`, `EditarCampoDetenido`, `BuscadorEvento`, `SubirFotoDetenido`, `TablaDetenidos`/`AccionesDetenido` (código muerto), APIs `/api/monitorista/detenidos/[id]/{subir-foto,enviar-foto,editar-campo}`, `lib/monitorista/detenido-service.ts` y funciones de detenidos de `repository/service/mapper/types`.
- **Oficial**: página `/oficial/reportes/[id]/fotos` y el `redirect` en `lib/oficial/actions.ts` (al cerrar reporte con detenido ahora va directo a `/oficial?exito=1`).
- **Fiscalía/Juzgado**: páginas `/fiscalia/detenidos*` y `/agente_juzgado/detenidos*`, `components/{fiscalia,agente_juzgado}/SubirFotoDetenido.tsx`, `components/FilaDetenidoRol.tsx`, `lib/detenidos-compartido.ts`, `/api/expediente/subir-foto-detenido`. Se quitaron las cards de "Fotos de Detenidos" de sus hubs.
- **Notificaciones**: se eliminaron los eventos `incidente.cerrado_detencion`, `foto.solicitada`, `foto.rechazada` (nunca se emitían). Se conservan `evidencia.solicitada`/`evidencia.entregada` (flujo de solicitudes).
- **Permisos**: se eliminó la sección `detenidos` (permisos.ts/registro.ts/mapa-secciones.ts). Las APIs de Análisis IPH/ficha (`/api/detenidos/*`, `/api/registro-detenidos/registrar`) se re-gatearon de `monitorista('detenidos')` a `analisis` (siguen usando el repository de monitorista).
- **Se conserva**: flujo de solicitudes de evidencia, incidentes cámara, historial, módulo Análisis (IPH/ficha), `lib/reporte-detenidos` + `/reporte-detenidos` (PPT vivo, lee `evidencias_detenido`), `/api/fiscalia/expediente/subir-foto` + `FotosExpedienteSection` (expediente de Fiscalía). Tablas `solicitud_fotos`/`evidencias_detenido` quedan sin escritores (datos conservados).
- Typecheck, lint (0 errores), build y `check:responsive` (0 nuevas) verificados.

### — Migración Apple-style del módulo Monitorista (2026-08-07)
- **Hub `app/monitorista/page.tsx`**: cards `.card-o` glass (blur + `--apple-shadow-glass` + radius `--radius-xl`), hover/press + `prefers-reduced-motion`, un solo acento `#1f355a` (antes mezclaba `#059669`/`#7c3aed`), tipografía `var(--apple-font-display)` sentence-case. Se eliminó el `@import` de Google Fonts (Barlow Condensed/JetBrains Mono) y los badges "ONLINE"/"ACCEDER →" tácticos.
- **Páginas destino de las cards** (`solicitudes`, `detenidos`, `incidentes-camara`, `historial`): quitaron `@import` táctico, fondo raíz `var(--color-background)`, tipografía Apple, botón de regreso vía `backHref` en `DashboardHeader` (patrón nativo) en vez del `PageHeaderLink "← Panel"`, y StatCards tácticos → panel KPI flat (`.kpi-panel` + `.stat-bloque` con divisores, patrón `StatBloque` de `agente_despacho`).
- **`components/monitorista/BandejaSolicitudes.tsx`**: tabs a `SegmentPage` pill; badges de estado y origen → pill `--radius-full` con tokens; botones Subir/Completar/Ver → clases `.mon-btn-*` (radius `--radius-lg`, sentence-case, hover/press).
- **`components/monitorista/FilaIncidenteCamara.tsx`**: celdas y chip de turno → Apple (pill `--radius-full`).
- **`components/partials/SegmentPage.tsx`**: migrado a pill Apple-style según DESIGN.md §4 (antes Barlow Condensed/uppercase con borde inferior). API sin cambios. Impacta a `components/fiscalia/TabSolicitudes.tsx` y `app/formatos-udai/reportes-incidencias/page.tsx`.
- **Pendiente**: sub-páginas (`solicitudes/[id]`, `detenidos/[id]`, `detenidos/nueva`, `incidentes-camara/nuevo`, `incidentes-camara/[id]`, `denuncias/[id]`) y componentes restantes (`BatchEnvioFotos`, `SubirFotoDetenido`, `GaleriaEvidencias`, `CardEnvioFoto`, `SubirEvidenciaModal`, `AccionesDetenido`, `EditarCampoDetenido`, `BuscadorEvento`, `BotonSubirDenuncia`).
- Typecheck, lint (0 errores) y build OK.

### — Reporte de Números Telefónicos accesible desde el panel Agente 911 (2026-08-06)
- **Card "Reportes"** en `app/agente_911/page.tsx` → `agente_911/reportes` → card "Reporte de Números Telefónicos" → `agente_911/reportes/numeros`.
- **Página de tabla** (`app/agente_911/reportes/numeros/page.tsx`): título "Reporte de Números Telefónicos" + fecha de reporte, filtro por rango de fechas (`components/911/reportes/FiltroRangoFechas.tsx`, URL params `from`/`to`), tabla de 4 columnas (Folio / Número de teléfono reportado / Fecha de reporte / Tipo de incidencia, `TablaNumerosTelefonicos.tsx`) y botón Exportar a Excel.
- **Export** `app/api/reportes/numeros-extorsion/exportar/route.ts` con ExcelJS (cabecera institucional + columnas + autofiltro), que reutiliza `obtenerDatosNumeros911()` para que tabla y Excel coincidan.
- **Origen de datos**: `incidentes` (`telefono_reportante`, `fecha_hora_inicio`, folio) + `cat_tipos_incidente.nombre`, canal `911`, filtrado por rango de fechas. Incluye **todos** los reportes 911 (no solo extorsión) — cada reporte 911 es una incidencia.
- **Corrección de alcance**: inicialmente se consultaba `incidente_extorsion` (solo extorsión), por lo que folios de tipo `normal` (ej. `SSPM-AL-20260806-000015` "DAÑO A PROPIEDAD AJENA") no aparecían. Se cambió a la fuente `incidentes` canal 911; `obtenerDatosTelefonicos`/`incidente_extorsion` queda intacto para `/estadisticos`.
- **Seguridad**: sesión + `tieneAccesoSeccion('911_ciudadano')` en páginas y API.
- **Fix descarga Excel**: el botón usaba `<a href>` nativo a la ruta API, pero `PageTransition` (globla en `app/layout.tsx`, captura de clics) intercepta la navegación interna y aborta la descarga. Se reemplaza por botón **cliente** `components/911/reportes/BotonExportarExcel.tsx` (fetch → blob → `a.download()`), patrón ya probado en formatos UDAI / camara / D1.
- Typecheck y build OK; rutas `/agente_911/reportes`, `/agente_911/reportes/numeros` y `/api/reportes/numeros-extorsion/exportar` compiladas.

### — Clasificación técnica 911: catálogo nacional en mayúsculas legible (2026-08-06)
- **Causa raíz en BD**: `cat_subtipos_emergencia.nombre` se almacenaba en snake_case (`actos_relacionados_con_el_patrimonio`) y `cat_tipos_emergencia.nombre` en proper-case (`Médico`, `Seguridad`); el select anteponía el código (`304 - actos_...`).
- **Fix de datos real** (vía `DATABASE_URL`): subtipos → `UPPER(REPLACE(nombre,'_',' '))` y tipos → `UPPER(nombre)`. Ej: `304 - ACTOS RELACIONADOS CON EL PATRIMONIO`, `3 - SEGURIDAD`.
- **Prevención de regresión** (`lib/db/seed-catalogo-nacional.ts`): el seed normaliza subtipo (`subKey.toUpperCase().replace(/_/g,' ')`) y tipo (`tipoData.nombre.toUpperCase()`) al insertar, para que re-sembrar no revierta.
- **UI (`Formulario911.tsx`, Clasificación Técnica)**: tipo y subtipo muestran solo el nombre en mayúsculas (sin prefijo de código); el incidente específico muestra solo el texto. Se elimina el campo **"Ajuste Manual de Prioridad"** (`select prioridadId`); la prioridad queda regida por el catálogo (se conserva el campo readonly "Prioridad autocompletada" + hidden `prioridadCatalogo`).
- Typecheck, lint (0 errores) y build OK.

### — Formulario 911 ciudadano: folio real, usuario frecuente auto, fusionar paso de personas (2026-08-06)
- **Folio real (`lib/incidentes/folio.ts`)**: formato `SSPM-AL-AAAAMMDD-######` (antes `SSPM/INC/año/###`). Se genera server-side al publicar el reporte (commit), usando la secuencia `folio_consecutivo` por año con `pg_advisory_xact_lock` + el UNIQUE `incidentes_folio_uq`; el campo del formulario es informativo ("Se asigna al publicar") y el folio real llega vía `?creado=true&folio=...`.
- **Usuario frecuente automático** (`lib/incidentes/actions.ts`): `resolverEsUsuarioFrecuente` marca `es_usuario_frecuente=true` si el teléfono tiene 5+ reportes previos en `incidentes.telefono_reportante`. Nueva server action `verificarTelefonoFrecuente` para check en vivo (onBlur) desde el formulario; el campo pasa de `select` manual a indicador readonly + hidden `esUsuarioFrecuente`.
- **Fusionar personas en paso Reportante**: el campo `esPersonaAfectada` ahora significa "¿el reportante es la persona afectada?"; si es `false` se renderiza la lista dinámica de personas (p_nombre/p_sexo/p_edad) dentro del paso 2. Se elimina el paso 3 → wizard de 7 a 6 pasos (pasos reindexados).
- **Estatus Inicial oculto**: se retira el input readonly de Estatus en Canalización (el estatus se fija `sin_despachar` server-side).
- **Ruta dedicada** `/agente_911/ciudadano/nuevoreporte` para la captura; `/agente_911/ciudadano` queda como redirect (backward-compatible, conserva guard de permisos `911_ciudadano`). Links de bitácora y revisar apuntan a la nueva ruta.
- Typecheck, lint (0 errores) y build OK; ruta `/nuevoreporte` registrada.

### — Nuevo componente global SegmentPage + REGLA en Convenciones (2026-08-05)
Se estandariza la navegación por segmentos de estado al estilo del tablón de despacho:
- **Nuevo componente `components/partials/SegmentPage.tsx`**: segmento de página con botones Barlow Condensed 14/700 (borde `#e2e8f0`, activo con fondo `accent` sólido, icono + badge de conteo `rgba(255,255,255,.2)`). Soporta `onChange` (estado local) o `href` por tab (`<Link>` server-safe).
- **Nueva REGLA en `Convenciones.md`**: "Segmento de Página (SegmentPage)" — análoga a PageHeader (estructura + tokens + reglas + referencias conformes). Prohibido reimplementar el patrón inline.
- **`TabSolicitudes` (fiscalia/solicitudes)** migra sus tabs inline (JetBrains Mono con border-bottom) al `SegmentPage` estilo tablón.
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas (100).

### — Módulo Fiscalía alineado a Centinela + PageHeader + Responsive (2026-08-05)
Las 11 páginas de `app/fiscalia` (hub + solicitudes + asegurados + liberaciones + detenidos + expedientes y sus 5 vistas destino `[id]`) se alinean a la REGLA de diseño:
- **Header Centinela**: se retira el `backHref`/`backLabel` del `DashboardHeader` en las 10 páginas destino porque el regreso vive en el `PageHeader` (regla de regreso). El hub `/fiscalia` conserva su `backHref` dinámico (solo cuando el rol no es Fiscalía).
- **PageHeader**: se elimina el header inline del hub (tag + h1 + barra accent), el `<h1>` suelto de detenidos/expediente/detalle y el título inline "GESTIÓN DE LIBERACIONES" de `FiscaliaDashboard`. Todos se reemplazan por `PageHeader` con botón de regreso `variant="secondary"` en `actions`: listas → `← Panel`; detalles → `← Solicitudes`/`← Liberaciones`/`← Asegurados`/`← Detenidos`. `PrintButton` pasa a las `actions` del expediente. En los formularios compartidos (`FormularioAsegurado`, `FormularioPuestaDisposicion`, `CapturarDetallesForm`, `DetallesAseguradoView`) se agrega prop opcional `ocultarEncabezado` para no duplicar el título (juzgado sigue usándolos con su encabezado propio).
- **Responsive**: `main` → `.pad-pagina` (hub → `.pad-dashboard`), se eliminan los `maxWidth` fijos; tabla de detenidos con `overflow: 'hidden'` → `.tabla-wrap` + `minWidth`; grids inline (`2fr 1fr`, `1fr 1fr`, `repeat(2|3, 1fr)`, `auto-fill`) → `.grid-2`/`.grid-3`/`.cat-cards-grid`; layouts `1fr 300px` → flex con `flexWrap: wrap`; filas de paginación y botones con `flexWrap`; footer inline → `DashboardFooter`.
- **Limpieza**: se elimina `console.log(liberaciones)` en `liberaciones/page.tsx`.
- La deuda responsive del módulo baja de **20 → 0** (14 en `app/fiscalia` + 6 en `components/fiscalia`; baseline 120 → 100). Typecheck, lint (0 nuevos) y build OK.

### — Módulo Monitorista alineado a Centinela + PageHeader + Responsive (2026-08-04)
Las 11 páginas de `app/monitorista` (hub + solicitudes + detenidos + incidentes-cámara + historial) se alinean a la REGLA de diseño:
- **Header Centinela**: se reemplaza `SubHeader` por `DashboardHeader` en las 6 páginas que lo usaban (solicitudes, detenidos, detenidos/nueva, incidentes-camara, incidentes-camara/nuevo, incidentes-camara/[id], historial). En las páginas destino se retira el `backHref`/`backLabel` del header porque el regreso vive en el `PageHeader`.
- **PageHeader**: se elimina el header inline (tag + h1 + barra accent) y se reemplaza por `PageHeader`. Regla de regreso (botón `variant="secondary"` en `actions`): hub no lleva regreso; bandejas → `← Panel`; detalle → `← Bandeja`/`← Detenidos`; forms → `← Detenidos`/`← Incidentes`. `BotonGenerarPpt` pasa a las `actions` del `PageHeader` (detenidos); el botón "NUEVO REGISTRO" pasa a `PageHeaderLink` primary (incidentes-camara).
- **Responsive**: `main` → `.pad-pagina` (hub → `.pad-dashboard`), se eliminan `maxWidth` fijos; grids inline (`1fr 1fr`, `repeat(3|4, 1fr)`) → `.grid-2`/`.grid-3`/`.cat-cards-grid`; tablas con `.tabla-wrap` + `minWidth` (historial e incidentes-camara); layouts `1fr 300px`/`1fr 400px` → flex con `flexWrap: wrap`; filas de botones con `flexWrap: wrap`; footer inline → `DashboardFooter`.
- **`solicitudes/[id]`**: migra del tema oscuro aislado (`#050810` + card blur) al shell Centinela estándar (light, `DashboardHeader` + `PageHeader` + `.pad-pagina`); se elimina el `// @ts-nocheck` y el `as any` (mapeo tipado a `EvidenciaRow`).
- **Lint**: se exporta `SolicitudRow` de `BandejaSolicitudes` y se tipan los arreglos de la bandeja (elimina 2 `as any`); imports muertos eliminados (hub, `Plus`, `user` sin uso).
- La deuda responsive del módulo baja de **21 → 0** (baseline 141 → 120). Typecheck, lint y build OK.

### — Cierre de autorización por sección + tokens opacos en URLs de recursos (2026-08-04)
Plan auditoría-URL (respuesta al pedido "ocultar/encriptar las URLs", que era seguridad por oscuridad — el riesgo real era Broken Access Control/IDOR):
- **Etapa 0 — Auditoría**: `scripts/auditoria-permisos.mjs` recorre las 148 `page.tsx` + `route.ts` de `app/api/**` y genera `scripts/reportes/auditoria-permisos.csv` (qué rutas tienen check de permiso y cuál sección).
- **Etapa 1 — Gate grueso de sección en `proxy.ts`**: nuevo mapa `lib/permisos/mapa-secciones.ts` (prefijo de ruta → secciones, alimentado por el CSV) + endpoint Node `app/api/auth/secciones-permitidas` + check en el proxy entre `activo` y el `next()` (redirige a `/dashboard` si el rol no tiene `puede_ver` en ninguna sección requerida). El proxy sigue edge-compatible (dos `betterFetch` HTTP). No se tocó `lib/permisos/core.ts`.
- **Etapa 2 — IDOR hardening**: tabla `tokens_recurso` (migración `0030`) + helper `lib/recursos/token-recurso.ts` (`obtenerOCrearToken`/`resolverToken`, persistente por lookup, no consumeViewToken). URLs de expedientes/detenidos/denuncias usan token opaco en vez del id interno; token inventado → 404.
- Cierra el incidente de 2026-07-15 (`reportes_incidentes`) con defensa en profundidad a nivel proxy, no solo el fix puntual.
- Typecheck y build OK; prueba end-to-end con sesiones reales de prueba (rol con y sin la sección). Etapa 3 (cosmética, headers de seguridad) NO implementada — opcional, pendiente de confirmación del cliente.

### — Módulo Formato N alineado a Centinela + PageHeader + Responsive (2026-08-04)
Toda la familia `formato-n-*` + `/envio-de-formatos/consolidar` (22 páginas) se alinea a la REGLA de diseño:
- **Header Centinela**: se reemplaza `SubHeader` por `DashboardHeader` en las 22 páginas. `DashboardHeader` ahora acepta `user` opcional y cae a la sesión de cliente (`authClient.useSession()`) cuando la página es client component sin sesión server (mismo patrón que `SubHeader`).
- **PageHeader**: se elimina el header inline (tag + h1 + barra accent) y el `SubHeader` se reemplaza por `PageHeader` con botón de regreso `secondary` en `actions` (regla de regreso): lista → `← Envío de Formatos`, form → `← <Lista>`. Los botones "NUEVO" pasan a `PageHeaderLink` primary.
- **Responsive**: `main` → `.pad-pagina` (se quita `maxWidth: 1200/780` inline); grids `1fr 1fr` de formularios → clase `.grid-2`; tablas del consolidado con `overflow-x: auto` (vía `cardStyle`).
- Typecheck y build OK; `npm run check:responsive` ✅ **0 nuevas (141)** — baseline regenerado: desaparece la deuda de los 7 módulos `app/formato-n-*` y `envio-de-formatos` baja a 2 (solo grid).

### — Migración de reportes a hub único `/agente_reportes` (2026-08-04)
Consolidación del módulo de reportes para los roles `agente_reportes` y `Reportante`:
- **Hub `/agente_reportes` reconstruido**: las 9 cards (8 de la antigua `/reportes` + Reporte de Coordinación) organizadas por **sección funcional** (Incidentes · Carpetas y Cosmos · Validación · Estadísticas · Coordinación Formato N), con `OptionSquare` + `.cat-cards-grid`. Cada card se **filtra por permiso** de su sección (`obtenerPermisosUsuario`); `Reportante` no ve Coordinación (no tiene `formato_n_coordinacion`). Gate del hub → `reportes_ciudadano:ver` (antes `tieneAccesoFormatoN`).
- **Eliminada la vista `/reportes`** y sus referencias: hub de `Reportante` en `lib/auth/helpers.ts` → `/agente_reportes`; card del dashboard (`module-cards.tsx`), catálogo de notificaciones (`formato_n.capturado`) y `LoadingProvider` apuntan a `/agente_reportes`.
- **8 páginas destino alineadas a la REGLA PageHeader + Responsive**: `incidentes_camaras`, `reportes_incidentes`, `modulo_incidentes`, `estadisticos`, `d1`, `d1_noiniciada`, `sin_robos`, `envio-de-formatos` y `nCoordinacion`. Se reemplaza el header inline (`styles.headerContainer`/`tag`/`title`) por `PageHeader` con botón de regreso `← Panel de Reportes` (secondary) en `actions`, que **reemplaza** el `backHref` del `DashboardHeader`; `main` → `.pad-pagina`; tablas con `overflow-x: auto`; se eliminan estilos muertos de los `styles.ts` de `components/reportes`.
- `envio-de-formatos`: `SentinelHero` + `maxWidth:1200px` + footer inline → `PageHeader` + `.pad-pagina` + `DashboardFooter`.
- Typecheck y build OK; `npm run check:responsive` ✅ **0 nuevas (177)** — baseline regenerado (se paga deuda: `app/reportes` eliminado, `nCoordinacion` limpio, `envio-de-formatos` -1 padding).

### — Bitácora 911: polling en vivo (patrón de despacho) + segment TODOS/EN RUTA/CERRADO (2026-08-03)
La tabla de `/agente_911/ciudadano/incidentes` pasa a **refresco automático cada 20s** replicando la lógica de `TablonDespacho`:
- **Nueva API** `app/api/incidentes/bitacora-911/route.ts`: devuelve listado paginado + conteos por estatus (misma auth que los endpoints de despacho).
- **Nuevo componente cliente** `components/911/Bitacora911.tsx`: recibe los datos SSR de la página, hace refresh silencioso cada `INTERVALO_MS=20s` con guard `refrescandoRef` (sin sobreponer requests) y se re-monta con `key={estatus}-{page}` en cada navegación (sin efecto de sync).
- **Segment** de 3 opciones al estilo del tablón de despacho: **TODOS / EN RUTA (`en_despacho`) / CERRADO** (grupo `atendido`+`cerrado_detencion`). Se retira "EN SITIO" del filtro.
- La página servidor queda como SSR inicial + shell (PageHeader, DashboardFooter) y delega la tabla al cliente.
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas (182).

### — Bitácora 911: segment de estatus al estilo tablón de despacho (2026-08-03)
Los tabs de `/agente_911/ciudadano/incidentes` se reducen a **3 opciones** (TODOS / EN SITIO / CERRADO) y adoptan el estilo del segment del tablón de despacho (`/agente_911/despacho`):
- Botones con borde, fuente Barlow Condensed, icono por tab, **activo con fondo accent + count badge**; navegación por `estatus` con `<Link>` (server-safe, resetea a página 1 porque el href no lleva `page`).
- "CERRADO" agrupa `atendido` + `cerrado_detencion`: el repositorio `listarIncidentes` ahora interpreta `estatus='cerrado'` como `i.estatus = ANY(['atendido','cerrado_detencion'])` y el conteo del tab suma ambos.
- Se retira el uso de `SegmentControl` en esta vista (sigue disponible con `paramName` para otros casos).
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas (182).

### — Bitácora 911: tabs por estatus → SegmentControl (2026-08-03)
Los tabs tipo pill con colores (TODOS/NUEVO/EN RUTA/EN SITIO/CERRADO/CERRADO·DETENCIÓN) de `/agente_911/ciudadano/incidentes` se convierten al **`SegmentControl`** compartido (track gris, tab activo blanco + count badge):
- `SegmentControl` ahora acepta prop `paramName` (default `tab`) → la bitácora navega con `estatus`; además hace `flexWrap` (6 tabs, ya no desborda en móvil) y resetea `page` al cambiar de pestaña.
- Se elimina el campo `color` de los TABS (el segment control es monocromo; los colores de significado viven en los badges de estatus de cada fila).
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas (182).

### — Bitácora 911: footer y Page Assembly alineados (2026-08-03)
`/agente_911/ciudadano/incidentes` ya tenía `PageHeader`, `.pad-pagina` y tabla responsive; se completa la alineación:
- Contenedor de página ahora es flex column y `<main>` lleva `flex: 1` → el footer queda anclado al fondo (Page Assembly Pattern).
- El footer custom ("SISTEMA CENTINELA · ATENCIÓN CIUDADANA 911") se reemplaza por el componente compartido `DashboardFooter` (consistente con el resto de la app). Se elimina la constante `footerStyle`.
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas (182).

### — Revisar reporte (`/agente_911/ciudadano/revisar`) alineado a REGLA Responsive/PageHeader + StepIndicator (2026-08-03)
La vista de confirmación previa a publicar se alinea:
- **PageHeader regla**: se agrega `<PageHeader title="Revisar" accent="Reporte" />` con action `← Formulario` (secondary); se quita `backHref`/`backLabel` del `DashboardHeader`.
- **Responsive / Page Assembly**: contenedor `maxWidth: 800px` + `padding: '40px 32px'` inline → `.pad-pagina`; `main` flex column con footer anclado.
- **StepIndicator**: se elimina el stepper inline de círculos 1/2/3 con conectores (`RevisarFormulario`) y se usa `<StepIndicator paso total nombre>` (pasos dinámicos: 2 si no canaliza, 3 si requiere despacho).
- Grids de revisión `1fr 1fr` inline → `.grid-2` (colapsa a 1 columna en móvil); footer de botones con `flexWrap`.
- El allowlist baja de 183 a 182 (sale `RevisarFormulario.tsx` de `gridMulticol`); `npm run check:responsive` ✅ 0 nuevas. Typecheck, lint y build OK.

### — Vocabulario de estados estandarizado al C4/CNI (2026-08-03)
Se estandarizan las etiquetas de estado del incidente al vocabulario de la bóveda canónica (flu-001 / form-001 / form-003), **sin tocar los valores internos de BD**:
- **Nuevo archivo `lib/911/estatus-c4.ts`**: mapa central `ESTATUS_C4` + helpers `labelEstatus()` / `tooltipEstatus()` (null-safe). Mapeo: `sin_despachar`→**Nuevo**, `en_despacho`→**En Ruta**, `en_sitio`→**En Sitio**, `atendido`→**Cerrado**, `cerrado_detencion`→**Cerrado · Detención**.
- Se reemplazan las etiquetas hardcodeadas (SIN DESPACHAR / EN DESPACHO / ATENDIDO / CERRADO DET / C/DETENCIÓN) y los `estatus.replace('_',' ').toUpperCase()` por `labelEstatus()` en: bitácora 911 (tabs, tooltips, badges), listados y detalle WhatsApp/Rondín, `app/incidentes`, `TablonDespacho`, `FiltrosIncidentes`, `RondinTabla`, `oficial/despachos` y el "Estatus Inicial" del `Formulario911`.
- Regla documentada en `Convenciones.md` → "Vocabulario de estados del incidente (C4/CNI)": prohibido hardcodear etiquetas; usar siempre `labelEstatus()`.
- Bonus: se limpiaron casts `as any` de `session.user` en los listados WhatsApp/Rondín (quedan lint-limpios).
- Typecheck, lint (0 errores) y build OK; `npm run check:responsive` ✅ 0 nuevas.

### — Registro 911 (`/agente_911/ciudadano`) alineado a REGLA Responsive/PageHeader + wizard con StepIndicator (2026-08-03)
La página de nuevo registro de incidentes 911 se alinea y se convierte en formulario multi-paso:
- **PageHeader regla**: se agrega `<PageHeader title="Nuevo" accent="Registro" />` con action `← Bitácora` (secondary). Se quitan `backHref`/`backLabel` del `DashboardHeader` y el bloque de "ENCABEZADO" inline (descripción movida al `subtitle` del `PageHeader`).
- **Responsive / Page Assembly**: contenedor `maxWidth: 1200px` + `padding: '40px 32px'` inline → `.pad-pagina`; `main` ahora es flex column y el footer (`DashboardFooter`) queda anclado abajo con `flex: 1`.
- **Wizard con StepIndicator**: `Formulario911` (una sola página larga de 7 paneles) se convierte en wizard de **7 pasos** controlado por `<StepIndicator paso total nombre>` (paso 1 Incidente → 7 Observaciones). Los pasos se ocultan con `display: none` (no se desmontan) para que `FormData` del submit conserve todos los campos. Navegación ← ANTERIOR / SIGUIENTE → / PUBLICAR REPORTE con `flexWrap`.
- Se elimina la **card blanca** que envolvía al formulario (los `.panel` de `Formulario911` ya traen su propio fondo/borde/padding, así el formulario se integra directo a la sección).
- `.titulo-con-boton` (Personas Afectadas) gana `flexWrap` + `gap` para móvil.
- Typecheck, lint (sin errores nuevos) y build OK; `npm run check:responsive` ✅ 0 nuevas (183).

### — Bitácora 911 (`/agente_911/ciudadano/incidentes`) alineada a REGLA Responsive y PageHeader (2026-08-03)
La vista de listado de incidentes 911 (destino de la card "Ciudadano") se alinea con `Convenciones.md`:
- **PageHeader regla**: se agrega `<PageHeader title="Bitácora" accent="911" />` con actions = `← Panel 911` (secondary) + `+ Nuevo Registro` (primary). Se quitan `backHref`/`backLabel` del `DashboardHeader` (el regreso vive en `PageHeaderLink` secondary) y el botón "NUEVO REGISTRO" que iba como `children` del header — ese `children` **se ocultaba en móvil/tablet** (Header.tsx), así que en pantallas angostas no había forma de crear un registro; ahora vive en las actions del `PageHeader` que hacen wrap.
- **Responsive / Page Assembly**: `<main>` con `padding: '40px 48px'` inline + `maxWidth: 1240px` → `.pad-pagina` (colapsa a `20px 16px` en móvil) sin maxWidth. La tabla ya estaba bien (`.overflow-x:auto` + `minWidth`).
- Limpieza de casts `as any` innecesarios (`item.folioCad/codigoCatalogo/svvNotificado` ya tipados en `IncidenteDetalle`; `session.user.apellido` en additionalFields).
- El allowlist baja de 184 a 183 (sale `app/agente_911/ciudadano/incidentes/page.tsx` de `paddingPagina`); `npm run check:responsive` ✅ 0 nuevas. Typecheck, lint y build OK.

### — Hub Agente 911 alineado a REGLA Responsive y PageHeader (2026-08-03)
`/agente_911` (hub del rol Agente 911) se alinea con `Convenciones.md`:
- **PageHeader regla**: se agrega `<PageHeader title="Panel" accent="911" subtitle="… · central de atención y despacho" />` (antes la vista no usaba el componente; referencia conforme: hub `/oficial`). Como es hub, no lleva botón de regreso.
- **Responsive / Page Assembly**: el padding inline `40px 64px` se reemplaza por la clase `.pad-dashboard` (colapsa a `20px 16px` en móvil) y se elimina el `maxWidth: 1400` del contenedor de página (prohibido por el patrón). Footer con `flexWrap: 'wrap'` + `gap` para no apretarse en pantallas angostas.
- **KPI único**: las dos tarjetas sueltas "Incidentes Hoy" y "911 Hoy" se unifican en una sola tarjeta KPI — "Incidentes Hoy" (`stats.hoy`) como métrica principal + "Vía 911" (`hoy911`) como desglose secundario separado por divisor.
- El allowlist baja de 185 a 184 (sale `app/agente_911/page.tsx` de `paddingPagina`); `npm run check:responsive` ✅ 0 nuevas. Typecheck, lint y build OK.

### — Regla de diseño: Indicador de Pasos (StepIndicator) — prohibidos los steppers (2026-08-03)
Se crea la regla de diseño "Indicador de Pasos (StepIndicator)" en `Convenciones.md`: **prohibido usar steppers** (círculos numerados con conectores, dots de progreso, barras segmentadas); toda vista multi-paso usa `components/partials/StepIndicator.tsx` ("**Paso N de M**" + nombre del paso + barra de progreso).
- **Nuevo componente `components/partials/StepIndicator.tsx`**: props `paso` (1-based), `total`, `nombre`. Sin hooks (SSR-safe), `flexWrap` responsive. Tokens: "Paso N de M" en Barlow Condensed 800/28px `#1f355a`; nombre en JetBrains Mono 600/11px `#94a3b8`; barra 2px (ancho = paso/total).
- `FormularioRecorrido` ahora usa `<StepIndicator>` (extraído del bloque inline).
- **Migrado `components/analisis/formAnalisis.tsx`** (`RegistroDetenidoStepper`): el stepper de dots + conectores + etiquetas "01-06" se reemplaza por `<StepIndicator>` con STEPS de 6 pasos (paso 5 "Tiempos y Folios"); se eliminan el componente local `StepIndicator` (dot+label), la clase `.step-dot` y la constante `lineStyle` huérfana. De paso se elimina el desbordamiento móvil de la fila de dots.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` OK, lint sin errores nuevos, `npm run check:responsive` ✅ 0 nuevas, `graphify update` OK.

### — Despacho oficial / reporte de recorrido alineado a la REGLA Responsive (2026-08-03)
`FormularioRecorrido` (`components/oficial/FormularioRecorrido.tsx`, renderizado por `/oficial/despachos/[id]` cuando el incidente está `en_sitio`) salía del allowlist de deuda responsive:
- Todos los grids inline `repeat(3,1fr)`/`repeat(2,1fr)` pasan a las clases `.grid-3`/`.grid-2` (colapsan a 1 columna en ≤720px), conservando el `gap` original. Los `gridColumn: 'span 3'/'span 2'` → `'1 / -1'` para no desbordar en la columna única móvil (incluye `SelectorDestinoLegal`).
- `flexWrap: 'wrap'` en el stepper de 7 pasos, fila reportante/teléfono, filas de detenidos y vehículos, items de apoyos, botones de denuncia y navegación anterior/siguiente.
- `.of-resumen-grid` (resumen) ahora hace `@media (max-width:720px){ grid-template-columns:1fr }`.
- El padding inline `40px 48px` del wrapper standalone se reemplaza por `.pad-pagina`.
- **Área negra del footer**: el `<html>/<body>` es `#070b16` (casi negro, `app/layout.tsx`); el desbordamiento horizontal del formulario dejaba ver el fondo negro a la derecha, más visible en la zona del footer. Se corrige con los puntos anteriores + `overflowX: 'clip'` en `<main>` de la página (red de seguridad, no rompe el sticky del header) + `borderTop` en el footer.
- El allowlist (`exceptions.json`) baja de 187 a 185 (sale `FormularioRecorrido` de `gridMulticol` y `paddingPagina`); `npm run check:responsive` ✅ 0 nuevas. Typecheck, lint y build OK.
- El stepper inline de 7 pasos (círculos + conectores) se reemplaza por un indicador compacto "**Paso N de 7**" + nombre del paso en Barlow Condensed y barra de progreso (ancho = paso/7), que hace `flexWrap` y no desborda en móvil.
- **Ubicación precargada en el paso 3**: `MapaUbicacion` acepta `initialLocation` opcional. En el despacho (`embedded`), el paso Ubicación ya llega con el marker y la dirección del incidente colocados (lat/lng + calle/colonia del store, precargados del prefill), sin esperar al GPS ni sobreescribir la ubicación del incidente. El flujo standalone y el mapa de cateo siguen usando GPS.

### — Páginas propias ante caída de señal / crash (PWA Offline) (2026-08-03)
Se agrega un service worker manual (`public/sw.js`, sin dependencias) que sustituye la página genérica del navegador cuando se va la señal, cae el servidor o devuelve 5xx: **network-first** en navegaciones con fallback a `/offline` precacheado en `install`; **cache-first** para `/_next/static` (la página offline sale con estilos); `stale-while-revalidate` para el resto; `activate` limpia cachés viejas + `clients.claim()`.
- **`app/offline/page.tsx`**: página "CONEXIÓN PERDIDA" clara estilo login (grid + esquinas doradas + escudo SVG inline), **autocontenida** (estilos inline, sin red), distingue "sin conexión a internet" vs "el servicio no responde" vía `navigator.onLine`, botón **Reintentar** + auto-recarga al volver la señal.
- **`components/sw-register.tsx`** registra `/sw.js` solo en producción (montado en `app/layout.tsx`).
- **`public/manifest.json`** + metadata (`manifest`, `themeColor`, `appleWebApp`) → tratable como app nativa/instalable.
- **`app/error.tsx` / `app/global-error.tsx`**: páginas de error propias (500/runtime) en vez de la genérica de Next; usan `unstable_retry` (Next 16.2+); `global-error` con su propio `<html>/<body>`.
- **`proxy.ts`**: `/offline` en `PUBLIC_PATHS`; el matcher ahora excluye `.json` (manifiesto no pasa por auth).
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exitoso (`/offline` prerendered estático), `/offline` 200 sin sesión, `sw.js`/`manifest.json` 200, `npm run check:responsive` 0 violaciones nuevas. Lógica del SW validada con test de mocks (install/navigate-fallback/5xx/cache-first/POST). Limitación documentada: el primer acceso ya offline no se puede interceptar (SW aún no instalado).

### — Flujo Agente Despacho alineado a la REGLA Responsive (2026-08-03)
Se alinean `/agente_despacho` y las vistas destino de sus cards (`/agente_despacho/kpi-incidencias`, `/agente_911/despacho`) con el Page Assembly Pattern y la "Responsive (REGLA)" de `Convenciones.md`:
- Se eliminan los `maxWidth` fijos de los contenedores de página (`1400/1600/1400px`) — prohibidos por el patrón — y el padding inline se reemplaza por las utilidades `.pad-dashboard` (hub) y `.pad-pagina` (vistas destino), que colapsan en tablet/móvil (desktop 48/64 · tablet 32/48 · móvil 20/16).
- `TablonDespacho`: la fila de tabs (Pendientes/En despacho/Atendidos) ahora hace `flexWrap: 'wrap'` para no desbordarse en móvil. La fila 1 de cada card de reporte también hace `flexWrap: 'wrap'` (folio + badges + tiempo ya no se cortan por el `overflow: hidden` del contenedor). Se elimina el bloque de cabecera duplicado "CENTRO DE MANDO Y COMUNICACIONES / MÓDULO DE DESPACHO" (el `PageHeader` de la página lo sustituye).
- Sección desplegable de la card (`DespachoForm`): el grid fijo `1fr 1fr` pasa a `.grid-2` (colapsa a 1 columna en móvil). El modal de selección de unidades (`SeleccionarUnidadesModal`) deja el grid `55% 45%` por flex: en móvil apila el mapa (altura 220px) sobre la lista; la fila de acciones hace `flexWrap: 'wrap'`. `AsignacionMapa` recibe prop `altura` (antes 500px fijos).
- El allowlist (`exceptions.json`) se reduce a 187 (salen además `DespachoForm` y `SeleccionarUnidadesModal` de `gridMulticol`); `npm run check:responsive` sigue ✅ con 0 violaciones nuevas. Typecheck y build OK.

### — Filtros de búsqueda en /dashboard/catalogos/patrullas (2026-08-03)
Nuevo componente `PatrullasTablaConFiltros` (cliente, patrón de `OficialesTablaConFiltros`): Card con búsqueda por texto (placa, serie/VIN, características, marca, modelo, GPS, radio, cámaras) + selects de **Departamento**, **Marca** y **Estatus** (Activa/Inactiva), botón **Limpiar** y contador de resultados. Departamentos y marcas se derivan de los valores únicos del catálogo. `PatrullasTable` acepta `mensajeVacio` para el estado "sin resultados". El server page solo carga la lista y la pasa al componente.

### — Cumplimiento automático de la REGLA Responsive (lint + auditoría + pre-commit) (2026-08-03)
Se convierte la "Responsive (REGLA)" de convención en un gate automático que revisa cada vista contra los breakpoints del proyecto (**móvil ≤720px · tablet 721–1200px · desktop >1200px**):
- **Regla ESLint `responsive/no-inline-multicol-grid`** (`eslint.config.mjs`): error al escribir `style={{ gridTemplateColumns: '1fr 1fr' }}` inline (multi-columna); permite single-columna (`'1fr'`) y el flag `esMulticolumna`. El allowlist se carga desde `scripts/responsive/exceptions.json` (clave `gridMulticol`), que lista la deuda permitida.
- **Auditoría `scripts/audit-responsive.mjs`** (`npm run check:responsive`): escáner sobre `app/` + `components/` con 6 detectores (grid inline multi-columna, `overflow:'hidden'` en archivos con tabla, `minWidth ≥ 800px` sin `.tabla-wrap`, padding de página inline ≥ 24/32px, padding de header `'0 Npx' ≥ 48px`, `position:sticky` con offset ≥ 100px). Exit 1 ante violaciones nuevas; `--init` regenera el allowlist; `--json` para CI.
- **Baseline de deuda** (`scripts/responsive/exceptions.json`): 201 violaciones permitidas (86 grid inline, 14 overflow en tablas, 101 padding de página), inventariadas por módulo en `boveda/🗺 Roadmap/Deuda Responsive.md`.
- **Pre-commit de husky** (`.husky/pre-commit`): `lint-staged` (eslint solo en archivos staged, para no bloquear commits con deuda preexistente del repo) + `npm run check:responsive`.
- `login-desing/**` (mockups, no vistas de la app) se excluye del lint vía `globalIgnores`.
- Checklist post-cambio de AGENTS.md: paso 5 ahora exige `npm run check:responsive` al tocar vistas.

### — Retirado el importador Excel del parque vehicular (2026-08-03)
Se elimina por completo el flujo de "Importar desde Excel" del catálogo de patrullas: se borran `components/catalogos/ImportarParqueButton.tsx`, la server action `importarParqueVehicularAction` (`lib/catalogos/actions.ts`), el núcleo compartido `lib/catalogos/importar-parque.ts` y el CLI `scripts/importar-parque-vehicular.ts` (junto con el tipo `ImportarResultado`). El catálogo `via.v2_patrullas` ahora se mantiene solo con el CRUD manual de `/dashboard/catalogos/patrullas`. Bóveda actualizada (Catalogos.md, Flota.md, Troubleshooting.md).

### — Login CENTINELA responsive en 3 niveles (móvil/tablet/desktop) (2026-08-03)
Se refactorizó `/login` (`app/(auth)/login/page.tsx`) para alinear breakpoints con la convención del proyecto (**móvil ≤720px · tablet 721–1200px · desktop >1200px**; antes usaba 480px/960px sueltos):
- El `<style>` embebido se extrajo a `app/(auth)/login/login.css` (variables scoped a `.login-scope`, clases semánticas `login-*`, breakpoints documentados).
- **Desktop >1200px**: split 2 columnas intacto (hero + formulario), stage con `height:100dvh` y scroll interno del formulario (se eliminó el abuso de `overflow:hidden` global en `body`).
- **Tablet 721–1200px**: columna única; el panel izquierdo con el hero gigante se oculta y se muestra una cabecera compacta (`login-compact-head`) con escudo + CENTINELA + SSPM·SJR·QRO + sesión.
- **Móvil ≤720px**: cabecera mínima (se ocultan divisores y datos de sesión), paddings y tipografía reducidos, stepper y OTP escalados.
- Errores de lint `react-hooks/set-state-in-effect` corregidos: `sessionId` con inicializador lazy; el contador TOTP se deriva de `Date.now()` en render con un tick de 1s (sin `setState` síncrono en efectos).

### — Dashboard segmentado: sección "SSPM General" → Catálogos (Oficiales / Patrullas) (2026-08-03)
`/dashboard` ahora arranca la segmentación por secciones: se agrega **"SSPM General"** (solo `esAdmin`) con una card **"Catalogos"** → `/dashboard/catalogos` (vista con 2 cards: **OFICIALES** y **PATRULLAS**).
- **CRUD de patrullas** (nuevo, `lib/catalogos/`): tabla con placa/serie/departamento/características/marca/modelo/GPS/radio/cámaras/estatus + crear/editar/eliminar (eliminación **bloqueada si tiene oficiales asignados**) + botón **"Importar desde Excel"**.
- **CRUD de oficiales** (nuevas vistas bajo `/dashboard/catalogos/oficiales`): reutiliza la lógica de `lib/admin-transito` pero con **server actions gateadas a `esAdmin`** (las de admin-transito exigen rol `admin_transito`); `/admin-transito/oficiales` queda intacto.
- Núcleo del importador extraído a `lib/catalogos/importar-parque.ts` (compartido por la acción y el CLI); el script pasa a `scripts/importar-parque-vehicular.ts` (npx tsx).
- Acceso: `app/dashboard/catalogos/layout.tsx` valida `esAdmin`.

### — v2_patrullas: simplificación de identidad + bicicletas corregidas (2026-08-03)
Migration `0028_v2_patrullas_placa.sql`: se eliminan `numero_unidad` y `descripcion`, y `placas` se renombra a `placa` (`num_serie` sigue siendo la llave UNIQUE; `id uuid` PK interna intacta). El mapper calcula `etiqueta` (placa → si no hay, `caracteristicas — marca — modelo` sin repetir → `num_serie`) y `detalle` descriptivo; los selectores de unidad (`UnidadCards`, `SeleccionarUnidadesModal`, `ModalSeleccionarUnidad`, `PatrullaSelector`, `ModalReactivarOficial`, `UnidadAsignadaSection`) ahora leen `etiqueta`/`placa` (renombres, sin eliminar UI). Los `SELECT` que usaban `p.numero_unidad` (`oficial/service`, `admin-transito`, `fiscalia`, `agente_juzgado`, `shared/infracciones`) pasan a `p.placa`. El importador se actualizó y re-importó el catálogo (110 vehículos): en `BICICLETA` ahora `marca='TREK'`, `modelo='MARILN 4 GEN 3'`, `num_serie` = serial `WTU…`.

### — Migración del parque vehicular: se retira la API externa de flota (2026-08-03)
Se elimina la integración con `proyecto-flota.vercel.app`: `lib/flota/service.ts` ya no hace fetch/cache/sync, se borraron `app/api/rol-servicios/externos/flota/route.ts` y `hooks/useFlota.ts`, y las env vars `FLOTA_API_SECRET_KEY` / `NEXT_PUBLIC_FLOTA_API_KEY`. El catálogo `via.v2_patrullas` ahora se carga desde el Excel del parque vehicular (`public/files-xlsx/flota-vehicular-nuevo.xlsx`) vía `scripts/importar-parque-vehicular.ts`.
- **BD** (migration `0027_patrullas_parque_vehicular.sql`): `num_serie` (VIN) es la nueva **llave de negocio UNIQUE** (la PK interna `id uuid` se conserva intacta); `numero_unidad`/`placas` pasan a nullable; se agregan `departamento`, `caracteristicas`, `marca`, `modelo`, `gps`, `radio`, `camaras`. Catálogo vaciado y reimportado: **110 vehículos**, 98 con placa, 12 sin placa real (10 bicicletas TREK con serial `WTU…`, remolques `S/P`).
- **UI**: los selectores de unidad hacen fallback a `descripción` cuando no hay placa (`etiquetaUnidad` en `lib/flota/mapper.ts`).

## 2026 — Julio

### — Mapa en vivo del oficial en la card expandida de "En Despacho" (2026-07-31)
El despachador ahora puede ver en dónde viene el oficial: al expandir una card en la tab "En despacho" del tablón (`/agente_911/despacho`), si el incidente tiene coordenadas se muestra un **mapa Google top-down** (`components/911/despacho/MapaSeguimientoOficial.tsx`, nuevo) con el marcador del incidente + un marcador "P" por cada unidad/oficial asignado. Los datos viajan en el payload de `/api/incidentes/en-despacho`: `obtenerUnidadesElementos` (`lib/incidentes/repository.ts`) resuelve la última posición en vivo desde `ofi_oficiales` (elementos por `oficial_id`; unidades por patrulla vía `LEFT JOIN LATERAL` con la posición más reciente de la tripulación). El refresco lo hereda el poll silencioso de 20s del tablón (sin endpoint nuevo); el techo real de frescura es el heartbeat de 30s del oficial. Marcador atenuado con borde discontinuo si la lectura no es fresca (`formatAntiguedad` <5min) + leyenda con antigüedad. Solo lectura.

### — Card rediseñada + modal de navegación + pantalla de llegada (plan-navegacion-modal)
Nuevo flujo en `/oficial/despachos/[id]`: se eliminó la pantalla embebida "INICIAR NAVEGACIÓN" interna de `NavegacionDespacho.tsx` (rama `fase === 'no_iniciado'`). Ahora `DespachoContent.tsx` monta `components/oficial/navegacion/AsignacionCard.tsx` (card blanca: folio, ubicación, badge "Impacto" por prioridad, botón "INICIAR NAVEGACIÓN"). Al tocarlo abre `NavegacionModal.tsx` — modal **full-screen** vía `createPortal` a `document.body` (zIndex 1000, scroll del body bloqueado, **sin botón de cierre**). Al montar, `NavegacionDespacho` dispara `marcarEnCaminoOficial` automáticamente (ref contra StrictMode) y arranca **directo en modo navegación 3D** (antes top-down). La llegada (geofence 80m o botón manual "YA ESTOY AQUÍ", renombrado de "✓ LLEGUÉ") ahora muestra una pantalla de confirmación "HAS LLEGADO A DESTINO" con ícono animado; solo el botón "ATENDER" dispara `onAtender` (prop renombrada de `onLlegada`), que cierra el modal y pasa al `FormularioRecorrido` embebido. `marcarEnSitioOficial` corre en background (`startTransition`) para no bloquear la confirmación visual.

### — Rediseño de `/oficial/despachos/[id]` — solo navegación a altura completa (2026-07-31)
Se eliminó el armado incorrecto de la vista (timeline `HistorialIncidente` arriba + tarjeta `NavegacionDespacho` con `minHeight: 480` debajo). La vista ahora se arma con Page Assembly Pattern: **Sección Header** (`DashboardHeader`) → **Sección Body** (`<main>` flex:1, sin padding) → **dentro del body, sección de navegación** (`NavegacionDespacho` a `flex: 1`, estilo DiDi). `DespachoContent.tsx` se simplificó: solo conserva la rama `en_sitio` → `FormularioRecorrido` embebido (transición al llegar). Se eliminó `obtenerHistorialCompleto` del page (el check de existencia queda con `obtenerIncidenteBasico`). **Se borraron `MarcarEnCaminoButton.tsx`/`MarcarEnSitioButton.tsx`**: todo incidente tiene coordenadas, el fallback "SIN COORDENADAS — REGISTRO MANUAL" y sus botones quedan eliminados por decisión de negocio.

### — Refresco de datos en vistas de oficial y despacho
- **`/oficial` (dashboard)**: el badge de asignaciones activas dejó de contarse en el render del server component y ahora es `components/oficial/ContadorAsignaciones.tsx` — cliente que consulta el endpoint ligero `app/api/oficial/contador/route.ts` (`{ asignados }`, auth + `verificarRolOficial`) con `usePolling` cada 30s y pausa cuando la pestaña está oculta (patrón de la campanita). `app/oficial/page.tsx` solo monta el badge.
- **`/agente_911/despacho` (`TablonDespacho.tsx`)**: el polling de 20s ahora refresca **las 3 tabs** (Pendientes / En Despacho / Atendidos), no solo Pendientes. `cargarTodo` acepta modo silencioso (`cargarTodo(true)`) para no parpadear el estado vacío ni mostrar banner ante errores transitorios del poll; el primer fetch al montar y el botón "Reintentar" usan modo no silencioso. `onCambio` simplificado a un solo `cargarTodo()` (se eliminó `cargarSoloPendientes`).
- **`/agente_911/despacho` — refresco invisible (2026-07-31)**: se quitó el indicador "PRÓXIMA ACTUALIZACIÓN" (cuenta regresiva circular) y el "REFRESCANDO…" del header del tablón. El polling de 20s sigue corriendo de forma silenciosa (modo silencioso + guarda `refrescandoRef` contra solapamientos); se eliminaron el timer de 1s y los estados `segundosRestantes`/`refrescando` que solo alimentaban la UI. Menos renders y sin ruido visual para el operador.
- **`despacho.asignado` al oficial prioritario de rondín (2026-07-31)**: el badge de "ASIGNACIONES ACTIVAS" en `/oficial` aparecía al confirmar el despacho de un rondín escalado, pero el oficial que había escalado (pre-asignado como `es_prioritario`) nunca recibía la notificación en la campanita — `createDespacho` resolvía los destinatarios solo por los elementos de la llamada. Ahora la query de `usuariosNotificar` en `createDespacho` (`lib/incidentes/actions.ts`) incluye también el `oficial_id` del elemento `es_prioritario` del despacho reutilizado; el disparo coincide con el paso a `en_despacho` y el `dedup` evita duplicados. Incidentes nuevos sin rondín: comportamiento intacto. Ver `docs/notificaciones-oficial-despacho/06-fix-prioritario-notificado-al-despachar.md`.
- **Polling de la campanita igualado a 30s (2026-07-31)**: `CampanillaNotificaciones.tsx` bajó su intervalo de 45s a 30s (`INTERVALO_MS = 30_000`) para sincronizarse con el badge de asignaciones de `/oficial` (`ContadorAsignaciones.tsx`) — ambos refrescan a la par. Se actualizaron las referencias de 45s en la bóveda y docs.

### — Navegación en vivo estilo DiDi para el oficial (plan-navegacion-oficial)
Reemplaza los botones manuales "VOY EN CAMINO"/"MARCAR EN SITIO" de `/oficial/despachos/[id]` por una vista de navegación en vivo. Pipeline de datos: `obtenerDespachosAsignados` ahora trae `latitud`/`longitud` del incidente; se agregó `'geometry'` a `GOOGLE_MAPS_LIBRARIES` (loader compartido). Nuevo componente `components/oficial/navegacion/NavegacionDespacho.tsx`: pantalla "INICIAR NAVEGACIÓN" que dispara `marcarEnCaminoOficial`, mapa con ruta real por **Google Directions API** desde un `watchPosition` propio de alta precisión, recálculo solo si hay desviación >150m y pasó ≥60s, detección de llegada por **geofence de 80m** (Haversine) + botón manual "✓ LLEGUÉ" que disparan `marcarEnSitioOficial`. Fallback: incidentes sin coordenadas conservan `MarcarEnCaminoButton`/`MarcarEnSitioButton` (badge "SIN COORDENADAS — REGISTRO MANUAL"). `FormularioRecorrido` prefill de `latitud`/`longitud`. `marcarEnCaminoOficial`/`marcarEnSitioOficial` emiten `despacho.en_camino`/`despacho.en_sitio` (eventos que eran huérfanos); backfill simétrico de `hora_llegada` en `insertarReporteCampo`. Layout de la página a ancho completo (Page Assembly Pattern, sin `maxWidth`).

### — Gradiente completo de prioridades (4 niveles) + nuevo ícono de rayo (Etapa 12)
Se agregó CRÍTICA a `PRIORIDAD_COLORES` con rojo intenso. ALTA cambió a naranja (`#f97316`) para crear un gradiente por urgencia: rojo (CRÍTICA) → naranja (ALTA) → amarillo (MEDIA) → azul (BAJA). El gris queda exclusivamente para prioridad no resuelta. El glifo interior del marcador del incidente cambió de signo de exclamación a rayo (lightning bolt polygon). `TablonDespacho.tsx` hereda el gradiente automáticamente sin cambios de código. Catálogo real verificado contra BD: 4 niveles activos (id 1 BAJA, 2 MEDIA, 3 ALTA, 4 CRITICA).

### — Etiqueta de prioridad en tarjetas + marcador del incidente más grande (Etapa 11)
Dos mejoras visuales: (1) etiqueta de texto "BAJA"/"MEDIA"/"ALTA" en cada tarjeta del tablón de despacho, coloreada con el mismo código de prioridad que el borde izquierdo — usando el nuevo campo `fondo` en `PrioridadColor`. (2) Marcador del incidente en el mapa escalado ×1.5 (36×36 → 54×54) con trazo más grueso (stroke-width 3) y halo blanco semi-transparente de fondo para mejor contraste contra el mapa. No se modificaron los marcadores de unidades.

### — Color del marcador del incidente según prioridad (Etapa 10)
Paleta de colores unificada para el marcador del incidente en el mapa de asignación y para el borde de las tarjetas del tablón de despacho: azul = BAJA, amarillo = MEDIA, rojo = ALTA. Nuevo módulo compartido `lib/incidentes/prioridad-colores.ts` con `colorPorPrioridad()`. Se eliminó el `PRIO_COLORS` local de `TablonDespacho.tsx`. El marcador del incidente en `AsignacionMapa.tsx` ahora se construye dinámicamente según `prioridad`. Gray neutro como fallback para incidentes sin prioridad resuelta (corrige bug previo donde el fallback reusaba color de BAJA).

### — Unidad prioritaria preseleccionada y deseleccionable con migración de BD (Etapa 9)
La unidad del oficial que reportó un rondín ya no es fija e inamovible — ahora aparece preseleccionada en el picker "Unidades cercanas al hecho" pero se puede deseleccionar. Migración: columna `atiende_caso` en `incidente_despacho_elementos` (booleano, NOT NULL DEFAULT true) separa "quién reportó" de "quién atiende". En `createDespacho`: UPDATE de `atiende_caso` según si la unidad prioritaria sigue entre las seleccionadas. En `DespachoForm`: se eliminó el filter que excluía la unidad prioritaria del modal, se añadió preselección, y la validación permite despachar con solo el prioritario. `UnidadCard` ahora acepta `esPrioritaria` y muestra badge índigo "PRIORITARIO". `UnidadResumenCard` renderiza badge y botón Quitar de forma independiente. `AsignacionMapa` agrega overlay "P" en el marcador de la unidad prioritaria.

### — Fix: primer reporte de ubicación inmediato al login del oficial (Etapa 8)
El oficial recién logueado tardaba hasta 30s en que se reportara su primera ubicación real, porque el envío solo ocurría cuando el contador del heartbeat llegaba a 0. Se extrajo `enviarUbicacion(lat, lng)` como función compartida, se agregó `primerEnvioRef` en el callback de `watchPosition`, y el primer fix de GPS ahora se envía de inmediato (en vez de esperar la cuenta regresiva). El heartbeat periódico (30s) sigue funcionando igual después del primer envío. Un solo archivo modificado (`OficialUbicacionTracker.tsx`).

### — Fix: fetch inmediato al abrir el modal de selección de unidades (Etapa 7)
El modal "Unidades cercanas al hecho" mostraba datos desactualizados al abrirse porque el polling (Etapa 5) usaba `setInterval` sin ejecutar el primer fetch de inmediato — tocaba esperar 18s. Se extrajo `fetchUnidades` como función nombrada, se llama una vez al montar el efecto, y `setInterval(fetchUnidades, 18000)` programa solo las repeticiones. Fix quirúrgico, un solo archivo modificado (`SeleccionarUnidadesModal.tsx`). No se afectaron la cadencia de 18s, el mapa, ni las validaciones de etapas previas.

### — Regla de negocio: bloquear unidades ocupadas en otro incidente activo
Validación en backend y frontend para evitar despachar la misma patrulla a dos incidentes activos simultáneamente. Defense-in-depth: `createDespacho`/`enviarRefuerzos` rechazan con `ValidationError`, y la UI (lista + mapa) muestra las unidades ocupadas como no seleccionables.
- **Tipos**: `UnidadConTripulacion.ocupada: boolean` agregado en `lib/flota/types.ts`; `mapper.ts` actualizado con valor default `false`.
- **Repo**: nueva función `listarIdsUnidadesOcupadas` en `lib/flota/repository.ts` — query DISTINCT via JOIN, devuelve `Set<string>`.
- **Service**: `listarUnidadesParaDespacho` recibe `incidenteIdActual` y agrega `ocupada` a cada unidad (no excluye del array).
- **API**: `/api/despacho/unidades-cercanas` acepta query param `incidenteId`.
- **UI lista**: badge "OCUPADA" rojo, opacidad 0.6, `cursor: not-allowed`, `onClick` condicional en `UnidadCard`.
- **UI mapa**: marcador rojo apagado (`#b91c1c`) en `AsignacionMapa`, sin `onClick`.
- **UI lógica**: `toggle` en `SeleccionarUnidadesModal` retorna temprano si `ocupada`.
- **Defense-in-depth**: validación con `ANY($2::text[])` en `createDespacho` y `enviarRefuerzos` (antes del `BEGIN`).
- **QA**: seed script (`scripts/seed-qa-despacho.ts`) y test script (`scripts/test-qa-ocupadas.ts`) ejecutados contra BD de desarrollo: 9/9 pruebas pasaron, limpieza completada sin registros huérfanos.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exitoso, `graphify update` actualizado.

### — Mapa de asignación de unidades en Despacho (tipo Uber)
Split-view con mapa Google Maps integrado en el modal "Unidades cercanas al hecho" de `SeleccionarUnidadesModal.tsx`, que muestra visualmente la posición del incidente y de todas las patrullas, con diferenciación por cercanía, frescura de ubicación y selección.
- **Mapa**: nuevo componente `components/911/despacho/AsignacionMapa.tsx` — `@react-google-maps/api`, marcadores SVG inline parametrizados por distancia/antigüedad/selección, `fitBounds` automático.
- **Backend**: `lib/flota/service.ts` — removido el truncado a `TOP_UNIDADES_CERCANAS = 10` en `listarUnidadesParaDespacho` para que el endpoint devuelva todas las unidades con ubicación.
- **Modal**: split-view `grid 55%/45%` (mapa izquierda, lista derecha) cuando el incidente tiene coordenadas; layout original (640px) sin coordenadas.
- **Polling**: `setInterval` de 18s dentro del modal que refresca posiciones vía `/api/despacho/unidades-cercanas`; se detiene al cerrar.
- **Diferenciación visual de marcadores**: verde (más cercana), azul (cercanas top 10), gris opacidad reducida (lejanas); borde discontinuo si ubicación >5 min; badge check si seleccionada.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exitoso, `graphify update` actualizado.

### — Ubicación GPS de oficiales y asignación unidad-céntrica en Despacho
Rediseño del modal "Asignar unidades" de `DespachoForm.tsx` para poder ver qué unidad está más cerca del incidente al despachar. Ver [[911]] regla #10.
- **BD**: `ofi_oficiales` += `ultima_lat`, `ultima_lng`, `ultima_ubicacion_en` (migration `0025_ubicacion_oficiales.sql`).
- **Tracking**: `components/oficial/OficialUbicacionTracker.tsx` (montado en `app/oficial/layout.tsx`) reporta la posición del oficial cada 30s vía `watchPosition` mientras tenga sesión abierta (foreground únicamente, sin background sync) → `reportarUbicacionOficial` (`lib/oficial/actions.ts`).
- **Query de tripulación**: `lib/flota/service.ts::listarUnidadesParaDespacho` agrupa `ofi_oficiales` por `patrulla_id` (ya era N:1 sin constraint) y calcula distancia Haversine (`lib/shared/geo.ts`) al incidente; expuesto en `/api/despacho/unidades-cercanas`.
- **DespachoForm**: reemplaza los buscadores sueltos de placa (`useFlota`) y nómina (`useEmpleado`, ambos contra APIs externas admin-only) por cards de unidad (unidad + tripulación + distancia + antigüedad del dato) ordenadas por cercanía; seleccionar una unidad asigna a toda su tripulación. Elemento suelto sin patrulla ahora busca en `ofi_oficiales` local (`buscarOficialesPorNominaONombre`, `/api/despacho/buscar-oficial`) en vez del proxy externo de RH.
- **Fix**: `listarIncidentesPendientesDespacho` restaurado a `ORDER BY cp.orden DESC NULLS LAST, i.fecha_hora_inicio DESC` (se había revertido a solo cronológico durante el rediseño visual del tablón).
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exit 0, migración aplicada contra BD real, `npm run db:schema` refrescado.

### — Flujo integral 911 → Despacho → Oficial → D1 → Legal
Ciclo operativo completo unificado sobre `ofi_reportes_campo` como única tabla de reporte de campo (`incidente_reporte_campo` queda legacy read-only). Ver [[Plan Flujo Despacho]].
- **BD**: `ofi_reportes_campo` += `incidente_id` (FK + índice único parcial; su INSERT cierra el despacho), `ofi_entre_calles`, `ofi_referencia`, `expediente_ci`, `personal_ingreso_ci`; `incidente_despacho_elementos` += `oficial_id` (FK → `ofi_oficiales`); `incidentes` += `origen_rondin`.
- **Filtros 911**: `FiltrosIncidentes` (canal, estatus, tipo, prioridad, rango fechas, folio) sobre `listarIncidentesConFiltros`; bitácora general (`/incidentes`) reescrita.
- **Despacho**: match automático `elemento_nomina` ↔ `ofi_oficiales.no_nomina` al asignar; tab Atendidos ahora lee de `ofi_reportes_campo`; bandera "D1 pendiente".
- **Oficial**: nueva vista `/oficial/despachos` (+`[id]`) — ve asignaciones, captura reporte y cierra en transacción (`insertarReporteCampo` con `incidenteId` → `estatus='atendido'`). Cards "Mis Despachos" y "Rondín" en el hub.
- **Historial generativo**: `HistorialIncidente` (timeline 911/rondín → despacho → campo → D1) vía `obtenerHistorialCompleto` (composición cross-dominio en service, con fallback legacy).
- **D1**: cierre permitido con detenidos; al crear la D1 se hereda `incidente_id` del reporte de campo (limpia la bandera).
- **Rondín**: SIEMPRE escala a despacho — `createRondinEscalado` crea incidente `sin_despachar` sin auto-cierre; `createRecorridoCompleto` deprecada. Nuevo `FormRondinEscalado` (avistamiento) en 911 y en `/oficial/rondin`.
- Verificado: `npx tsc --noEmit` 0 errores, `npm run build` exit 0, queries validadas contra BD real.

### — Normalización de detenidos en Reporte Campo
- `OfiDetenido` expandido: ahora almacena `nombre`, `apellidoPaterno`, `apellidoMaterno` en vez de solo `nombre`
- UI de Step 3 (Intervención y Detenciones) cambiada de 1 input a 3 inputs por detenido
- Inserción automática en `ofi_detalles_asegurados` al crear el reporte
- Serialización de detenidos vía `JSON.stringify` en vez de `join(',')`
- Todos los consumidores (detalle reporte, fotos, store) actualizados para mostrar nombre completo
- 0 errores TypeScript, build exitoso

### — Refactorización arquitectónica completa
- Migración de Drizzle ORM a raw SQL en toda la aplicación
- Creación de arquitectura en capas para 23 módulos (types, mapper, repository, service, actions)
- Eliminación de imports directos de query en pages, layouts y API routes
- Centralización de role checks con getUserWithRole()
- Implementación de manejo de errores centralizado (tryAction/tryActionRaw)
- Conversión de repos class-based a funcionales
- Eliminación de directorios duplicados (rol_servicios → rol-servicios)
- Creación de bóveda de conocimiento como única fuente de documentación
- 0 errores TypeScript, build exitoso

## 2026-08-03 — Responsive móvil / tablet / desktop
- Nuevo hook `hooks/useResponsive.ts` con 3 niveles alineados a los breakpoints de la app: móvil ≤720px, tablet 721–1200px, desktop >1200px.
- `DashboardHeader` y `SubHeader` ahora se adaptan en 3 niveles (altura, padding, logo, título, bloque de usuario y nav `children` solo en desktop; blur solo en desktop/tablet).
- Clases `.pad-pagina` / `.pad-dashboard` con 3 niveles de padding; nueva clase `.panel-lateral` (sticky del dashboard) que ajusta su offset al alto real del header y deja de ser sticky en móvil.

## 2026-08-03 — Catálogos responsive + regla de negocio
- Vistas de `/dashboard/catalogos` (índice, oficiales, patrullas, formularios nuevo/editar, modales) ahora son responsive móvil/tablet/desktop.
- `PageHeader` ahora hace `flexWrap: wrap` siempre (prop `wrap` eliminada) — beneficia a todas las vistas del sistema.
- Nuevos utilitarios responsive en `globals.css`: `.grid-2`, `.grid-3`, `.cat-cards-grid`, `.tabla-wrap` (patrón scroll horizontal para tablas).
- Formularios de catálogos migrados de `gridTemplateColumns` inline a `.grid-2`/`.grid-3`; filas de botones con `flexWrap`.
- Tabla de oficiales: wrapper `overflow-hidden` → `overflow-x-auto`; tabla de patrullas: `minWidth` 1080 → 900.
- **Regla de negocio**: nueva sección "Responsive (REGLA)" en `boveda/🛠 Stack/Convenciones.md` (breakpoints 720/1200, hook `useResponsive`, utilitarios CSS, patrón de tablas).
