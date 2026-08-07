# Plan: KPIs Generales — card en /dashboard + Panel 911 (SSPM)

Primer bloque de un dashboard de KPIs más grande para el admin de SSPM. Analiza los 3 flujos de reportes 911 (normal, alarma escolar, extorsión) y expone sus métricas en una nueva card **"KPIs Generales"** en `/dashboard`, con segmentos **SSPM** / **Infracciones**, y dentro de SSPM el primer sub-módulo: **911**.

Diseñado por Claude (arquitecto), verificado contra el código real de `lib/911`, `lib/incidentes`, `lib/reportes-operativos` — ver `00-contexto.md` para el modelo de datos completo y las piezas reutilizables encontradas. A construir por DeepSeek (worker).

## Cómo llegó a esta forma

Ver `00-contexto.md` — resume el modelo de datos verificado (tablas `incidentes`, `incidente_despacho*`, `incidente_alarma_escolar`, `incidente_extorsion`), las piezas ya existentes que se reusan (`obtenerKpiIncidencias`, patrón de presets de fecha, `SegmentPage`, layout admin-gated de catálogos) y las decisiones de negocio ya tomadas con el usuario.

## Orden de trabajo

1. [etapa-01.md](etapa-01.md) — Queries y tipos nuevos en `lib/911` (resumen por tipo/canal, tiempos de respuesta, KPI alarma escolar, KPI extorsión).
2. [etapa-02.md](etapa-02.md) — Service layer: `obtenerKpisGenerales911` en `lib/911/service.ts` (orquesta la Etapa 1 + reusa `obtenerKpiIncidencias` de `lib/incidentes`).
3. [etapa-03.md](etapa-03.md) — API route `GET /api/incidentes/kpi-911-generales`, admin-only.
4. [etapa-04.md](etapa-04.md) — Componente cliente `Panel911` (filtro de rango Apple-style + 5 secciones de KPI).
5. [etapa-05.md](etapa-05.md) — Página `/dashboard/kpis`: layout admin-gated + `SegmentPage` SSPM/Infracciones + tab 911.
6. [etapa-06.md](etapa-06.md) — Card "KPIs Generales" en `app/dashboard/sspm-general.tsx`.
7. [etapa-07.md](etapa-07.md) — Verificación end-to-end + documentación en la bóveda.

Cada etapa depende únicamente de la anterior — orden estrictamente secuencial, no hay etapas paralelas en este plan.

## Decisiones ya tomadas (no volver a preguntar)

1. Alcance = solo panel 911 dentro de SSPM. Infracciones = placeholder "Próximamente". Otros sub-módulos de SSPM (Despacho, Flota, etc.) no se agregan en este plan.
2. Gate de acceso = `esAdmin` puro, mismo patrón que `app/dashboard/catalogos/layout.tsx`. No se crea un permiso de sección nuevo.
3. Filtro de fecha = presets 24h/7d/30d/Hoy + rango custom `datetime-local`, refresco manual (sin polling) — mismo patrón que `KpiIncidenciasView`/`FiltrosRangoKpi`, pero **reimplementado en Apple-style** (ese módulo sigue en lenguaje táctico, no migrado — no copiar el JSX, solo la lógica de presets y los helpers de fecha).
4. KPIs incluidos: resumen por tipo/canal, atención/despacho (reusa `obtenerKpiIncidencias`), tiempos de respuesta (captura→despacho→llegada), alarmas escolares (falsas alarmas, tiempo de arribo, top establecimientos), extorsión (tendencia diaria, top grupos delictivos, % canalizados). Ver el detalle completo en `00-contexto.md`.
5. No se duplica el mapa de `/agente_despacho/kpi-incidencias` — el panel solo trae un enlace.
6. `obtenerKpiIncidencias` (`lib/incidentes/repository.ts:82`) se reusa tal cual para el desglose por estatus/prioridad — no se reimplementa.

## Reglas para quien construye (DeepSeek)

- Leer `00-contexto.md` completo antes de tocar cualquier archivo — ahí está el modelo de datos y la lista de piezas a reusar.
- No combinar etapas ni adelantar trabajo de una etapa posterior. Cada etapa termina con `npx tsc --noEmit` (y `npm run build` cuando la etapa lo pida) + sus criterios de aceptación propios. **Detenerse y esperar confirmación del usuario antes de seguir con la siguiente.**
- **Antes de correr cualquier query SQL nueva** (Etapa 1), verificar los nombres de columna reales contra la BD — las columnas listadas en `00-contexto.md` y en las etapas vienen de leer el código existente, no de un `\d` directo a la tabla. Si algo no coincide, usar el nombre real y anotarlo al reportar la etapa (regla de AGENTS.md: "BD real sobre documentación").
- La Etapa 1 (`obtenerKpiExtorsion`) deja a propósito una query sin resolver — depende de leer primero `obtenerExtorsionesDetalle` en `lib/reportes-operativos/repository.ts` y copiar su JOIN de resolución de unidad real. No inventar esa lógica desde cero.
- `/dashboard` ya es 100% Apple-style — todo el UI nuevo de este plan (`Panel911`, `FiltroRango911`, la página `/dashboard/kpis`, la card nueva) sigue ese lenguaje (`DESIGN.md`), **no** el lenguaje táctico que todavía tiene `components/911/kpi/*` (JetBrains Mono, uppercase, bordes duros — ese módulo no ha sido migrado).
- Usar `SegmentPage` (`components/partials/SegmentPage.tsx`) para los tabs — prohibido reimplementar el patrón inline (`DESIGN.md §4`).
- No agregar dependencias nuevas (librerías de charts, etc.) — la tendencia diaria de extorsión se resuelve con barras CSS simples, no con una librería.
- Si el código real no coincide exactamente con lo descrito en una etapa, priorizar el código real, mantener el mismo objetivo, y avisarlo explícitamente al reportar la etapa — no resolverlo en silencio.

## Fuera de alcance (no implementar salvo pedido explícito)

- Contenido real de "Infracciones".
- Cualquier sub-módulo de SSPM distinto de 911 (Despacho, Flota, Rondín, etc.).
- Reconstruir o modificar `/agente_despacho/kpi-incidencias` (solo se enlaza).
- Un permiso de sección nuevo para no-admins.
- Comparativas contra periodo anterior (% vs periodo previo).
- Migrar `components/911/kpi/*` a Apple-style (fuera de este plan; ese módulo sigue táctico salvo que el usuario lo pida en un plan aparte).

## Checklist general al terminar TODAS las etapas

Ver el checklist detallado en `etapa-07.md`. Resumen:

1. `npx tsc --noEmit` + `npm run build` limpios.
2. Prueba manual end-to-end (los 4 presets + rango custom, ambos segmentos, gate admin en página y API).
3. Bóveda actualizada: `Feature.md` nuevo + `Index.md` + `Changelog.md`.
4. `npx graphify update`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
