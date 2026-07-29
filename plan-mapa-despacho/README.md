# Plan: Mapa "tipo Uber" en Asignar Unidades (TablonDespacho)

Carpeta de trabajo para construir el mapa de asignación de unidades en el módulo de despacho 911. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Contexto del problema, decisiones ya tomadas, y la alternativa técnica elegida. Cada etapa lo repite en resumen, pero este archivo tiene el detalle completo.
2. [etapa-1.md](etapa-1.md) — Componente de mapa base (aislado, sin integrar al modal).
3. [etapa-2.md](etapa-2.md) — Ajuste de backend: dejar de truncar la lista de unidades a 10.
4. [etapa-3.md](etapa-3.md) — Integrar el mapa en el modal de selección (split-view).
5. [etapa-4.md](etapa-4.md) — Diferenciación visual de marcadores (cercana/más cercana/lejana/seleccionada/stale).
6. [etapa-5.md](etapa-5.md) — Polling ligero mientras el modal está abierto (sensación de "vivo").

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos listados en esa etapa, antes de reportar la etapa como lista.
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo, puede haber cambiado.

## Fuera de alcance (no implementar salvo pedido explícito)

- Distance Matrix / Directions API para distancia real por calles — se mantiene Haversine (línea recta), como ya funciona hoy.
- WebSockets/SSE para posición push en tiempo real.
- Cambios al heartbeat de `OficialUbicacionTracker.tsx` (frecuencia, background tracking).

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update` (regla del proyecto tras varios edits, ver AGENTS.md en la raíz del repo).
3. Actualizar bóveda (`boveda/`): agregar entrada en `🧩 Features/` (o el módulo 911 existente) describiendo el mapa de asignación de unidades, y una entrada en `🗺 Roadmap/Changelog.md`.
4. Prueba manual end-to-end en navegador cubriendo: incidente con coordenadas, incidente sin coordenadas, selección desde mapa y desde lista, cierre del modal deteniendo el polling.
