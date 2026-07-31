# Plan: Navegación en vivo estilo DiDi para el oficial (reemplaza VOY EN CAMINO / MARCAR EN SITIO)

Carpeta de trabajo para reemplazar los botones manuales de "VOY EN CAMINO" / "MARCAR EN SITIO" en `/oficial/despachos/[id]` por una vista de navegación en vivo (mapa + ruta calculada con Google Directions API + posición GPS en tiempo real), estilo apps de transporte (DiDi/Uber). Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas asumen que ya leíste `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Problema, decisión que este plan revierte (Directions API antes estaba fuera de alcance para el mapa del despachador — ahora se habilita para la vista del oficial), y estado actual del código.
2. [etapa-1.md](etapa-1.md) — Pipeline de datos: traer `latitud`/`longitud` del incidente hasta el oficial (hoy no llegan) + agregar `'geometry'` al loader compartido de Google Maps.
3. [etapa-2.md](etapa-2.md) — Componente `NavegacionDespacho` base: mapa + ruta calculada con Directions API, posición inicial estática (sin GPS en vivo todavía). Aislado, sin integrar al flujo real.
4. [etapa-3.md](etapa-3.md) — Geolocalización en vivo: `watchPosition` de alta precisión, marcador que se mueve, recálculo de ruta solo si hay desviación significativa (control de costo de Directions API).
5. [etapa-4.md](etapa-4.md) — **Etapa central.** Pantalla "INICIAR NAVEGACIÓN" (dispara `marcarEnCaminoOficial`), detección de llegada por geofence + botón manual "LLEGUÉ" (disparan `marcarEnSitioOficial`), e integración real en `DespachoContent.tsx` — con fallback a los botones manuales originales para incidentes sin coordenadas.
6. [etapa-5.md](etapa-5.md) — Prefill de `latitud`/`longitud` en el formulario de cierre (`FormularioRecorrido`), para no pedirle al oficial que vuelva a fijar la ubicación a mano.
7. [etapa-6.md](etapa-6.md) — Notificaciones `despacho.en_camino`/`despacho.en_sitio` (ya definidas en el catálogo, nunca emitidas) + backfill simétrico de `hora_llegada` en `insertarReporteCampo` (hoy solo `hora_salida` tiene red de seguridad).
8. [etapa-7.md](etapa-7.md) — Layout: corregir el `maxWidth` fijo de `/oficial/despachos/[id]/page.tsx` para seguir el Page Assembly Pattern documentado y darle ancho completo al mapa.
9. [test-qa.md](test-qa.md) — Verificación end-to-end de todas las etapas + actualización de la bóveda.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- **No borrar `MarcarEnCaminoButton.tsx`/`MarcarEnSitioButton.tsx`** — se conservan como fallback real para incidentes sin coordenadas (Etapa 4).
- **No tocar `lib/oficial/actions.ts::marcarEnCaminoOficial`/`marcarEnSitioOficial`** en su lógica interna hasta la Etapa 6 (que solo les agrega la emisión de notificación, no cambia sus guardas ni sus queries).
- **No tocar `components/911/despacho/AsignacionMapa.tsx`** ni el mapa de asignación del despachador — ese sigue con Haversine (línea recta), esa decisión no cambia. Este plan es exclusivamente del lado del oficial.
- **No tocar `components/oficial/OficialUbicacionTracker.tsx`** (el heartbeat de baja precisión) — el componente nuevo usa su propio `watchPosition` independiente.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos listados en esa etapa, antes de reportar la etapa como lista.
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-07-31), puede haber cambiado.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cambios al mapa de asignación del despachador (`AsignacionMapa.tsx`, `SeleccionarUnidadesModal.tsx`) — sigue con Haversine, sin ruta calculada.
- Cambios al heartbeat de `OficialUbicacionTracker.tsx` (frecuencia, precisión, tracking en background).
- App nativa / push notifications fuera del navegador — todo sigue siendo foreground-only, mismo límite ya aceptado en el resto del proyecto.
- Migración de BD — no hace falta ninguna, `incidentes.latitud`/`longitud` ya existen.
- Tocar la app móvil Flutter de infracciones/ciudadanos — módulo completamente distinto, sin relación con este plan.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada: `🧩 Features/Reporte Campo.md` (reemplazar sección de botones manuales), `🧩 Features/911.md` (nota sobre Directions API habilitada para esta vista), `🧩 Features/Notificaciones.md` (eventos ya no huérfanos).
4. Prueba manual end-to-end en navegador cubriendo: flujo completo con coordenadas (geofence automático), botón "LLEGUÉ" manual, fallback sin coordenadas, permiso GPS denegado, refuerzos con navegación independiente por oficial, y costo real de Directions API verificado en Google Cloud Console — ver [test-qa.md](test-qa.md) para el detalle completo de cada caso.

## Estado: plan nuevo, sin etapas construidas aún

Ninguna etapa está marcada como construida todavía — este plan se generó el 2026-07-31, listo para que DeepSeek empiece por la Etapa 1.
