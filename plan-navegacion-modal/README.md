# Plan: Card rediseñada + modal de navegación + pantalla de llegada

Carpeta de trabajo para rediseñar la experiencia de navegación del oficial: reemplazar la pantalla embebida "antes de navegar" por una card blanca (`AsignacionCard`), abrir la navegación en un modal a pantalla completa que entra directo en modo navegación 3D, y agregar una pantalla de confirmación visual ("Has llegado a destino" + botón "Atender") antes de pasar al formulario de cierre. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas 1-3 son **independientes entre sí** (archivos distintos, sin dependencias de código cruzadas) y pueden construirse en paralelo. La Etapa 4 depende de las tres anteriores. `test-qa.md` va al final.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Trasfondo, código real actual completo de los 2 archivos que se tocan, y un aviso importante: `DespachoContent.tsx` ya no tiene `HistorialIncidente` ni el fallback "sin coordenadas" que tenía un plan anterior — el dueño del proyecto los quitó después en un commit propio. Este plan trabaja sobre el código real actual, no los reintroduce.
2. [etapa-1.md](etapa-1.md) — `AsignacionCard.tsx` (nuevo): card blanca rediseñada con folio, ubicación, badge de impacto y botón. Aislada.
3. [etapa-2.md](etapa-2.md) — `NavegacionModal.tsx` (nuevo): modal a pantalla completa vía `createPortal`, mismo patrón que `SeleccionarUnidadesModal.tsx`. Aislada.
4. [etapa-3.md](etapa-3.md) — Refactor de `NavegacionDespacho.tsx`: quita la gate interna (se mudó a la Etapa 1), auto-dispara `marcarEnCaminoOficial` al montar, modo navegación pasa a ser el default, agrega la pantalla de llegada ("Has llegado a destino" + botón "Atender"), renombra el botón manual a "YA ESTOY AQUÍ" y la prop `onLlegada` a `onAtender`.
5. [etapa-4.md](etapa-4.md) — Integración final en `DespachoContent.tsx`: card → modal → `onAtender` → `FormularioRecorrido embedded`.
6. [test-qa.md](test-qa.md) — Verificación end-to-end de las 4 etapas + actualización de bóveda.

## Reglas para quien construye (DeepSeek)

- No combines etapas ni adelantes trabajo de una etapa posterior. Las Etapas 1-3 sí pueden trabajarse en paralelo entre ellas (no comparten archivo), pero cada una debe cerrarse con sus propios criterios de aceptación antes de pasar a la Etapa 4.
- **No tocar `lib/oficial/actions.ts::marcarEnCaminoOficial`/`marcarEnSitioOficial`** — se siguen llamando exactamente igual, con las mismas guardas y queries. Solo cambia desde dónde y cuándo se llaman.
- **No reintroducir `HistorialIncidente` ni el fallback "sin coordenadas"** en `DespachoContent.tsx` — fueron quitados deliberadamente por el dueño del proyecto en un commit posterior al plan que los había agregado. Si no está en el código real, no lo agregues de vuelta salvo que se pida explícitamente.
- **No agregar un botón de cerrar/cancelar al modal** — el único camino de salida es completar el flujo (llegar → Atender), tal como se pidió.
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-07-31).
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos listados en esa etapa.

## Fuera de alcance (no implementar salvo pedido explícito)

- Auto-refresh de datos en `/oficial` (hub del oficial) — pendiente para un plan futuro.
- Auto-refresh de datos en `/agente_911/despacho` — pendiente para un plan futuro.
- Vista de ruta aproximada del oficial dentro de la tarjeta expandida de "En Despacho" del tablón de despacho — pendiente para un plan futuro.
- Cambios al mapa de asignación del despachador (`AsignacionMapa.tsx`) — no se toca en este plan.
- Cambios al heartbeat de `OficialUbicacionTracker.tsx` — no se toca en este plan.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada (`🧩 Features/911.md` o `Reporte Campo.md`) con el nuevo flujo card → modal → llegada → Atender.
4. Prueba manual end-to-end en navegador cubriendo: flujo completo con geofence automático, botón "YA ESTOY AQUÍ" manual, recarga con modal abierto, permiso GPS denegado, incidente ya en `en_sitio` al entrar, y la revisión visual de la card/pantalla de llegada — ver [test-qa.md](test-qa.md) para el detalle completo.

## Estado: plan nuevo, sin etapas construidas aún

Ninguna etapa está marcada como construida todavía — este plan se generó el 2026-07-31, listo para que DeepSeek empiece por la Etapa 1 (o 1, 2 y 3 en paralelo).
