# Contexto — KPIs Generales / Panel 911

## Qué problema resuelve

El admin de SSPM no tiene ninguna vista agregada de los 3 flujos de reportes que pasan por 911 (**normal**, **alarma escolar**, **extorsión**). Lo que existe hoy (`KpiTiposIncidencias`, `/agente_despacho/kpi-incidencias`) está pensado para el operador de despacho en tiempo real, no para lectura ejecutiva por rango de fechas.

Este plan construye el primer bloque de un dashboard de KPIs más grande: una card **"KPIs Generales"** en `/dashboard` → segmentos **SSPM** / **Infracciones** → dentro de SSPM, el primer sub-módulo: **911**. El resto de sub-módulos de SSPM y el contenido de Infracciones se agregan en planes futuros, cuando el usuario indique cuáles siguen.

Diseñado por Claude (arquitecto) tras investigar el modelo de datos real (`lib/911`, `lib/incidentes`, `lib/reportes-operativos`) y los patrones de UI ya existentes (`DESIGN.md`, `SegmentPage`, catálogos admin). A construir por DeepSeek (worker).

## Decisiones ya tomadas (no volver a preguntar)

1. **Alcance**: solo el panel 911 dentro de SSPM. Infracciones queda como placeholder "Próximamente" (sin datos). Otros sub-módulos de SSPM (Despacho, Flota, etc.) no se agregan aún — el segmento de nivel 2 dentro de SSPM solo tendrá el tab "911" por ahora.
2. **Gate de acceso**: solo `esAdmin`, mismo patrón exacto que `app/dashboard/catalogos/layout.tsx` (no se crea un permiso de sección nuevo).
3. **Filtro de fecha**: presets 24h / 7d / 30d / Hoy + rango custom con `<input type="datetime-local">`, refresco **manual** (botón "Actualizar", sin polling) — mismo patrón que `components/911/kpi/KpiIncidenciasView.tsx`.
4. **KPIs incluidos** (definidos por Claude tras revisar qué es medible con el esquema real, ver más abajo): resumen por tipo/canal, atención/despacho (reusando `obtenerKpiIncidencias` de `lib/incidentes`), tiempos de respuesta, alarmas escolares (falsas alarmas, tiempo de arribo), extorsión (tendencia, grupos delictivos).
5. **No se duplica el mapa** — la sección 911 del panel solo trae un enlace a `/agente_despacho/kpi-incidencias` (ya construido con mapa de calor/puntos).
6. **No se reimplementa nada que ya exista** — `obtenerKpiIncidencias` (`lib/incidentes/repository.ts:82-117`) se reusa tal cual para el desglose por estatus/prioridad; solo se agregan las queries que faltan.

## Modelo de datos verificado (consultado directamente en el código, no asumido)

- `incidentes`: `id`, `folio`, `canal`, `tipo_reporte` (`'normal' | 'alarma_escolar' | 'extorsion'`, puede venir `NULL` → tratar como `'normal'`, ver `lib/911/repository.ts:70`), `estatus`, `prioridad_id`, `fecha_hora_inicio`, `requiere_despacho`.
- `incidente_despacho`: `id`, `incidente_id`, `fecha_hora_despacho`.
- `incidente_despacho_unidades`: `id`, `despacho_id`, `unidad_placa`, `hora_salida`, `hora_llegada` (ver `lib/incidentes/repository.ts:263` y `mapper.ts` para el nombre exacto de columnas).
- `incidente_alarma_escolar`: `incidente_id`, `establecimiento`, `es_falso` (bool, confirmado en `lib/reportes-operativos/repository.ts:237`), `activaciones`, `hora_canalizacion`, `hora_arribo`.
- `incidente_extorsion`: `incidente_id`, `grupo_delictivo`, `modus_operandi`, `resultado` (texto libre desde migración 0044), y la resolución de **unidad real** (no columna directa) sigue el patrón ya construido en `obtenerExtorsionesDetalle` (`lib/reportes-operativos/repository.ts`) — cruza con `incidente_despacho_unidades.unidad_placa`, default `'C4'` si no hubo despacho.

**Regla de negocio**: antes de escribir cualquier query nueva, verificar los nombres de columna reales contra la BD (`Variables de Entorno.md` de la bóveda tiene las credenciales) o releyendo los archivos referenciados arriba — no asumir que los nombres sugeridos en este documento son exactos al 100%, son el resultado de una lectura de código pero no de un `\d` a la tabla.

## Piezas reutilizables (no reinventar)

| Pieza | Ubicación | Para qué |
|---|---|---|
| `obtenerKpiIncidencias(filtros)` | `lib/incidentes/repository.ts:82` | Desglose por estatus y por prioridad, ya filtrado por rango de fechas (`IncidenteGeoFiltros`). Se reusa tal cual desde `lib/911/service.ts`. |
| `construirWhereGeo(filtros)` | `lib/incidentes/repository.ts:48` | Patrón de WHERE dinámico por rango — referencia de estilo para las queries nuevas. |
| Derivación de "unidad real" en extorsión | `lib/reportes-operativos/repository.ts` (función `obtenerExtorsionesDetalle`) | Copiar la misma lógica de join para el % de canalización a despacho — no inventar una nueva. |
| `components/911/kpi/KpiIncidenciasView.tsx` | patrón de presets de fecha (24h/7d/30d/Hoy + custom) | Replicar el mismo patrón visual/interacción en el nuevo filtro (no es un componente exportado reusable, está acoplado al mapa — se copia el patrón). |
| `components/911/KpiTiposIncidencias.tsx` | clases `.desp-kpi-head`, `.desp-kpi-stats`, `.stat-bloque*` | Lenguaje visual de stat-bloque a reusar en las secciones del panel nuevo. |
| `app/dashboard/catalogos/layout.tsx` + `page.tsx` | patrón exacto de subpágina admin-gated bajo `/dashboard` | Base para `app/dashboard/kpis/layout.tsx` + `page.tsx`. |
| `app/dashboard/sspm-general.tsx` | patrón de card en el home del dashboard | Base para la card nueva "KPIs Generales". |
| `components/partials/SegmentPage.tsx` | único componente de tabs/segmentos permitido (`DESIGN.md §4`) | Prohibido reimplementar — usar para SSPM/Infracciones y para el tab 911. |
| Gate admin en API route | `app/api/admin/roles/route.ts:1-21` | Patrón exacto de `getUserWithRole(session.user.id)` + `if (!user?.esAdmin)` → 403, para el endpoint nuevo. |

## Fuera de alcance (no implementar salvo pedido explícito)

- Contenido real de "Infracciones" (queda placeholder).
- Cualquier otro sub-módulo de SSPM distinto de 911 (Despacho, Flota, Rondín, etc.).
- Reconstruir o modificar el mapa de `/agente_despacho/kpi-incidencias` (solo se enlaza).
- Un permiso de sección nuevo para dar acceso a no-admins (se decidió gate `esAdmin` puro).
- Comparativas contra periodo anterior (%vs periodo previo) — puede ser una etapa futura si el usuario la pide, no está en este plan.
