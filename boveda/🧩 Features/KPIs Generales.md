# KPIs Generales — Panel 911 (SSPM)

**Propósito**: dar al admin de SSPM una lectura ejecutiva de los 3 flujos de reportes que pasan por 911 (**normal**, **alarma escolar**, **extorsión**) por rango de fecha/hora. Es el primer bloque de un dashboard de KPIs más grande (segmentos SSPM / Infracciones, y dentro de SSPM sub-módulos futuros); aquí solo vive el sub-módulo **911**.

Ruta: card **"KPIs Generales"** en `/dashboard` (sección "SSPM General", solo `esAdmin`) → `/dashboard/kpis`, con segmento de nivel 1 **SSPM / Infracciones** y de nivel 2 (dentro de SSPM) el tab **911**.

---

## Qué muestra

1. **Filtro de rango** — presets **Últimas 24 h / 7 días / 30 días / Hoy** (aplican de inmediato, no solo llenan los inputs) + rango custom con `<input type="datetime-local">` + botón **Actualizar**. Refresco **manual, sin polling** (mismo patrón que `KpiIncidenciasView`, pero reimplementado en Apple-style — ese módulo sigue en lenguaje táctico, no migrado).
2. **Resumen del periodo** — total de reportes, desglose por tipo (Normales / Alarmas escolares / Extorsiones) y por canal.
3. **Atención y despacho** — canalizados a despacho, sin canalización, **sin despachar ahora** (con acento de alerta si > 0) + desglose por estatus y por prioridad. El desglose por estatus/prioridad reusa tal cual `obtenerKpiIncidencias` (`lib/incidentes/repository.ts`) — no se reimplementa.
4. **Tiempos de respuesta** — captura→despacho, despacho→llegada, captura→llegada (primera unidad en llegar por despacho; `muestras` = despachos con llegada registrada; si 0 → estado vacío legible). Formato `Xm`, o `X.Xh` si supera 60 min.
5. **Alarmas escolares** — total, falsas, % falsas (alerta si > 20%), activaciones totales, tiempo de arribo promedio y top 5 establecimientos.
6. **Extorsión** — total, % canalizadas a despacho, top 5 grupos delictivos y **tendencia diaria** en gráfica de barras (recharts).
7. **Acceso al mapa** — enlace a `/agente_despacho/kpi-incidencias` ("Ver mapa de incidencias →"). No se duplica ni reconstruye el mapa.

## Modelo de datos

Fuentes: `incidentes` (`tipo_reporte` con `COALESCE(...,'normal')`, `canal`, `requiere_despacho`, `estatus`, `fecha_hora_inicio`), `incidente_despacho`, `incidente_despacho_unidades` (primera llegada: `MIN(hora_llegada)` agrupado por `despacho_id`), `incidente_alarma_escolar`, `incidente_extorsion`.

**Hallazgo de Etapa 1 (BD real sobre documentación)**: `incidente_alarma_escolar` **no tiene** columnas `hora_canalizacion` / `hora_arribo` (asumidas en el plan desde la lectura de código). Se derivan de despacho, igual que `obtenerAlarmasEscolaresDetalle` (`lib/reportes-operativos/repository.ts`): canalización = `incidente_despacho.fecha_hora_despacho`, arribo = `MIN(incidente_despacho_unidades.hora_llegada)` con `es_refuerzo = false` (LATERAL).

**Unidad real en extorsión**: el % de canalización a despacho usa el **mismo subquery de resolución de unidad** que `obtenerExtorsionesDetalle` (`lib/reportes-operativos/repository.ts`) — cruza con `incidente_despacho_unidades.unidad_placa` vía `incidente_despacho`, default `'C4'` si no hubo despacho. Se cuenta como canalizado cuando el subquery devuelve una placa (unidad ≠ `'C4'`). No se asumió una columna directa.

## Archivos

| Capa | Archivo |
|------|---------|
| Tipos | `lib/911/types.ts` — `Resumen911`, `TiemposRespuesta911`, `KpiAlarmaEscolar`, `KpiExtorsion`, `KpisGenerales911` |
| Repository | `lib/911/repository.ts` — `obtenerResumenPorTipoYCanal`, `obtenerTiemposRespuesta911`, `obtenerKpiAlarmaEscolar`, `obtenerKpiExtorsion` |
| Service | `lib/911/service.ts` — `obtenerKpisGenerales911` (orquesta en paralelo + reusa `obtenerKpiIncidencias` de `lib/incidentes`) |
| API | `app/api/incidentes/kpi-911-generales/route.ts` (admin-only) |
| Página + layout | `app/dashboard/kpis/page.tsx`, `app/dashboard/kpis/layout.tsx` |
| Panel | `components/911/kpi-generales/Panel911.tsx` (orquestador: filtro + hero strip + grid de secciones + skeleton + error) |
| Filtro | `components/911/kpi-generales/FiltroRango911.tsx` (presets con estado activo + `aria-pressed`, rango custom, link al mapa como acción secundaria) |
| Primitivas | `components/911/kpi-generales/StatBloque.tsx` (tile de stat compartido, variantes `tile`/`hero`, tonos success/warning/danger), `components/911/kpi-generales/SkeletonKpi.tsx` (skeleton de hero + grid, shimmer con `prefers-reduced-motion`), `components/911/kpi-generales/formatos.ts` (`TIPOS`/`etiquetaTipo`/`formatearMinutos` + re-export de `ETIQUETA_ESTATUS`/`COLOR_ESTATUS`/`colorPrioridad`) |
| Secciones | `components/911/kpi-generales/secciones/SeccionCard.tsx` (shell de sección plana + `Subtitulo` + `Chip`), `SeccionResumen.tsx`, `SeccionAtencion.tsx`, `SeccionTiempos.tsx`, `SeccionAlarmasEscolares.tsx`, `SeccionExtorsion.tsx` |
| Gráficas | `components/911/kpi-generales/graficos/DonutKpi.tsx` (dona con total al centro + leyenda %, por tipo/por estatus), `BarraRankeada.tsx` (barra horizontal rankeada, top establecimientos/grupos/prioridad/tiempos), `TendenciaDiaria.tsx` (área con degradado, tendencia diaria extorsión) — las 3 sobre `components/ui/chart.tsx` (shadcn/ui Charts, primitiva compartida: `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`) |
| Home | `app/dashboard/sspm-general.tsx` (card "KPIs Generales") |
| Reusados | `obtenerKpiIncidencias` (`lib/incidentes/repository.ts`), `isoAInputLocal`/`inputLocalAIso`/`ETIQUETA_ESTATUS`/`COLOR_ESTATUS` (`components/911/kpi/formato.ts`), `colorPrioridad` (`components/911/kpi/useMapaIncidencias.ts`), `SegmentPage`, `PageHeader` |

## Decisiones

- **Gate de acceso**: `esAdmin` puro (mismo patrón que `app/dashboard/catalogos/layout.tsx`), tanto en la página como en el API route. No se creó un permiso de sección nuevo.
- **Infracciones = placeholder** "Próximamente" (sin datos) — fuera de alcance de este plan.
- **Sin polling**: refresco manual con "Actualizar" (el rango puede ser histórico).
- **Gráficas con `components/ui/chart.tsx` (shadcn/ui Charts, sobre `recharts`)** — única dependencia nueva del proyecto para visualización (decisión explícita del usuario, ver skill `dataviz`). Instalado con `npx shadcn@latest add chart` (ya trae `recharts` como dependencia). Los tokens de color de shadcn en `app/globals.css` (`--background`/`--foreground`/`--border`/`--muted-foreground`) **ya son los hex de `DESIGN.md` §2** (`#F1F5F9`/`#0F172A`/`#E2E8F0`/`#64748B`) — `ChartTooltipContent` hereda la paleta del proyecto sin overrides adicionales. Solo se convirtieron a gráfica las secciones donde la forma es "comparar magnitud" o "tendencia en el tiempo" (barra rankeada horizontal / columnas); los totales sueltos (Total de reportes, Sin despachar ahora, % falsas, etc.) se dejaron como stat tiles — un puñado de números no se convierte en gráfica (anti-patrón "eight categorical hues when the story is one number").
  - **Nota de instalación**: `npx shadcn add` reinstaló `node_modules` en un estado incompleto (faltó `@types/react-dom`, typecheck roto) — se resolvió con `npm install` normal después. Si se vuelve a correr el CLI de shadcn en este repo, correr `npm install` justo después como medida de seguridad.
  - **Paleta de series (tokens shadcn `var(--chart-N)`, 2026-08-07)**: 3 slots categóricos para "por tipo de reporte" vía los tokens de gráficas de `globals.css` — `var(--chart-1)` (Normales), `var(--chart-2)` (Alarmas escolares), `var(--chart-3)` (Extorsiones). Misma mecánica que el ejemplo shadcn/ui "donut chart with text" (config con `color: var(--chart-N)`). Sustituye la paleta anterior validada con skill dataviz (`#2a78d6`/`#eda100`/`#e34948`) y la alineación temporal a paleta light de DESIGN.md. `--chart-1..5` se definieron en `:root` con la paleta shadcn por defecto (oklch) para que las gráficas hereden el sistema. Nota: el valor siempre visible al final de la barra / leyenda con % mantiene la legibilidad (regla "nunca solo color").
  - **`#2a78d6` ("chart-blue")** se reusa como hue único para toda barra de una sola serie (tiempos de respuesta, top establecimientos, top grupos delictivos, tendencia diaria de extorsión) — no se generó un hue nuevo por gráfica.
  - **Por estatus y por prioridad NO usan la paleta nueva** — reusan `COLOR_ESTATUS` (`components/911/kpi/formato.ts`) y `colorPrioridad` (`components/911/kpi/useMapaIncidencias.ts`), ya establecidos en el resto del módulo 911. Ambos fallan el checklist categórico estricto del skill (son paletas de severidad, no de identidad) — legal porque siempre van con label visible + valor, nunca solo color (regla de "status siempre con icono/label").
  - **`por canal`** se dejó como Chips (no se convirtió) — 2-3 categorías, "handful of headline numbers", no amerita gráfica.
  - **Variedad de forma por el trabajo del dato, no por decoración** (pedido explícito del usuario: "no te cases con las gráficas de barras"): **donut** para "por tipo" y "por estatus" (part-to-whole real, ≤5 segmentos, con total al centro + leyenda con % — caso legítimo de dona, distinto de "comparar valores parecidos" que el skill sí desaconseja); **área con degradado** para la tendencia diaria de extorsión (tendencia en el tiempo → línea/área, no barras); **barra horizontal rankeada** para todo lo que es ranking/magnitud (top establecimientos, top grupos delictivos, por prioridad) — se mantiene barra ahí porque es la forma correcta para comparar una lista ordenada, no por default. "Tiempos de respuesta" usa barra con **rampa ordinal de un solo hue** (3 tonos de azul, claro→oscuro) en vez de un color plano, porque son 3 etapas secuenciales de un mismo flujo (el ejemplo canónico de "ordinal" en el skill es justo "funnel stage").
  - Componentes de gráfica en `components/911/kpi-generales/graficos/`: `DonutKpi.tsx`, `TendenciaDiaria.tsx` (ahora `AreaChart`, ya no barras CSS ni barras recharts), `BarraRankeada.tsx` — reusados varias veces en vez de repetir boilerplate de recharts por sección.
- **Tab 911 sin navegación**: al ser el único tab de nivel 2, se le dio `href` auto-referente (`/dashboard/kpis?seccion=sspm`) porque `SegmentPage` sin `href` renderiza `<button onClick>` y falla en server components (patrón del repo: tabs con `href` en páginas server). **Rediseño (2026-08-07)**: el SegmentPage anidado de 1 tab se eliminó — era ruido visual sin navegación real; el "911" quedó implícito en el contenido y en el subtítulo del `PageHeader` ("Indicadores operativos por área · 911"). Si llega un segundo sub-módulo de SSPM, se reintroduce el segmento con 2+ tabs.
- **Rediseño del layout (2026-08-07, aprobado por el usuario)**: de columna única full-width a **hero strip de KPIs ejecutivos + grid de 2 columnas** (≥900px) con las 5 secciones extraídas a componentes puros (`secciones/`). Hero: Total reportes · Canalizados a despacho · Sin despachar (alerta) · Tiempo prom. captura→llegada. Extorsión full-width (la tendencia diaria necesita ancho).
- **Superficies planas en contenido denso (§6)**: hero strip y cards de sección pasan de glass a **`#fff` + `--shadow-card`** — dato denso no debe cargar backdrop-filter (coste de compositing); el glass queda solo en el filtro (panel de control flotante). Los tiles de stat internos también son planos (antes `.kpi-stat` con blur por tile).
- **Skeleton loading (2026-08-07)**: el estado "Cargando KPIs…" de texto plano se reemplazó por `SkeletonKpi.tsx` que replica hero + grid (shimmer con `prefers-reduced-motion` anulado) y `aria-busy` en el contenedor del panel.
- **Filtro con estado activo (2026-08-07)**: los presets ahora marcan el rango activo (pill con acento `#1f355a` + `aria-pressed`); rango custom limpia el preset. El link "Ver mapa de incidencias" se movió del cuerpo suelto a la barra del filtro como acción secundaria (`acciones`). Spinner con `@media (prefers-reduced-motion: reduce)`.
- **Fondo del layout**: se eliminó el `maxWidth: 1600` + `margin: auto` del layout (violaba DESIGN.md §5 "Prohibido maxWidth en contenedores de página") y el fondo pasó de `#f8fafc` al token `var(--color-background)` (`#F1F5F9`).
- **StatBloque compartido**: extraído a `components/911/kpi-generales/StatBloque.tsx` (variantes `tile`/`hero`, tonos `success`/`warning`/`danger`). Queda pendiente consolidar las 5 duplicaciones existentes en `agente_despacho`, `agente_911`, `monitorista` (x2) y `KpiTiposIncidencias` — fuera de alcance de este rediseño, ver Pendiente.
- **Regla de regreso**: el botón "volver" vive en `DashboardHeader` (`backHref="/dashboard"`), no en `PageHeader` actions (DESIGN.md §4).
- **`FiltroRango911`**: replica la lógica de presets de `FiltrosRangoKpi` (el preset consulta de inmediato, recibe el rango exacto por parámetro para no leer el closure obsoleto del padre), pero con lenguaje Apple-style.

## Pendiente / fuera de alcance

- Contenido real de **Infracciones**.
- Otros sub-módulos de SSPM (Despacho, Flota, Rondín, etc.).
- Comparativas contra periodo anterior (% vs periodo previo).
- Migrar `components/911/kpi/*` a Apple-style (ese módulo sigue táctico).
- **Consolidar `StatBloque`**: las 5 definiciones duplicadas en `app/agente_despacho/page.tsx`, `app/agente_911/page.tsx`, `app/monitorista/solicitudes/page.tsx`, `app/monitorista/incidentes-camara/page.tsx` y `components/911/KpiTiposIncidencias.tsx` deberían migrar a `components/911/kpi-generales/StatBloque.tsx` (o subir a `components/partials/`). Fuera de alcance — toca 5 vistas más.
