# Plan: Mapa "tipo Uber" en Asignar Unidades (TablonDespacho)

Carpeta de trabajo para construir el mapa de asignación de unidades en el módulo de despacho 911. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Contexto del problema, decisiones ya tomadas, y la alternativa técnica elegida. Cada etapa lo repite en resumen, pero este archivo tiene el detalle completo.
2. [etapa-1.md](etapa-1.md) — Componente de mapa base (aislado, sin integrar al modal). ✅ construida.
3. [etapa-2.md](etapa-2.md) — Ajuste de backend: dejar de truncar la lista de unidades a 10. ✅ construida.
4. [etapa-3.md](etapa-3.md) — Integrar el mapa en el modal de selección (split-view). ✅ construida.
5. [etapa-4.md](etapa-4.md) — Diferenciación visual de marcadores (cercana/más cercana/lejana/seleccionada/stale). ✅ construida.
6. [etapa-5.md](etapa-5.md) — Polling ligero mientras el modal está abierto (sensación de "vivo"). ✅ construida.
7. [etapa-6.md](etapa-6.md) — Regla de negocio: bloquear unidades ya asignadas a un despacho activo en otro incidente. ✅ construida (confirmado en código: `incidenteId` viaja al endpoint, `toggle()` ya ignora unidades `ocupada`).
8. [test-qa.md](test-qa.md) — Fase de QA con datos sembrados en BD para validar visual y funcionalmente la Etapa 6.
9. [etapa-7.md](etapa-7.md) — Fix: el modal "Unidades cercanas al hecho" mostraba datos desactualizados al abrirse (esperaba el primer tick del polling de 18s en vez de pedir datos frescos de inmediato). ✅ construida.
10. [etapa-8.md](etapa-8.md) — Fix: el primer reporte de ubicación del oficial tras iniciar sesión tardaba hasta 30s en enviarse (esperaba el conteo completo del heartbeat en vez de enviar apenas se obtiene el primer fix de GPS). ✅ construida.
11. [etapa-9.md](etapa-9.md) — **Nuevo.** Fix de negocio: la unidad prioritaria (de un rondín escalado) debe aparecer preseleccionada pero deseleccionable en el picker "Unidades cercanas al hecho", en vez de fija e inamovible. Incluye migración de BD (columna `atiende_caso` en `incidente_despacho_elementos`).
12. [etapa-10.md](etapa-10.md) — Color del marcador del incidente en el mapa según su prioridad (azul=baja, amarillo=media, rojo=alta), unificado con el color de acento del tablón. ✅ construida.
13. [etapa-11.md](etapa-11.md) — Etiqueta de texto de prioridad en cada tarjeta del tablón (alineada a los colores ya definidos) + marcador del incidente en el mapa más grande y con mejor contraste. ✅ construida.
14. [etapa-12.md](etapa-12.md) — **Nuevo, última etapa.** Fix: el catálogo real de prioridad tiene 4 niveles (BAJA/MEDIA/ALTA/**CRITICA**), no 3 — CRÍTICA caía en gris por accidente (mismo color que "sin prioridad"). Se agrega CRÍTICA con un gradiente de color por urgencia (rojo→naranja→amarillo→azul) y se cambia el glifo del marcador del incidente (de "!" a un rayo). Con esta etapa se cierra el plan completo.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos listados en esa etapa, antes de reportar la etapa como lista.
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo, puede haber cambiado.

## Fuera de alcance (no implementar salvo pedido explícito)

- Distance Matrix / Directions API para distancia real por calles — se mantiene Haversine (línea recta), como ya funciona hoy.
- WebSockets/SSE para posición push en tiempo real.
- Cambios al heartbeat de `OficialUbicacionTracker.tsx` (frecuencia, background tracking).

## Checklist general al terminar TODAS las etapas (incluye Etapa 6, QA, Etapa 7, Etapa 8, Etapa 9, Etapa 10, Etapa 11 y Etapa 12)

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update` (regla del proyecto tras varios edits, ver AGENTS.md en la raíz del repo).
3. Confirmar que la migración `lib/db/manual-migrations/0026_incidente_despacho_elementos_atiende_caso.sql` (Etapa 9) fue aplicada contra la BD de desarrollo/staging.
4. Actualizar bóveda (`boveda/`): agregar entrada en `🧩 Features/` (o el módulo 911 existente) describiendo el mapa de asignación de unidades, la regla de "unidad ocupada", el reporte de ubicación inmediato al login del oficial, la preselección editable de la unidad prioritaria, y el gradiente de color/etiqueta de prioridad (4 niveles: BAJA/MEDIA/ALTA/CRITICA); agregar entrada en `🗺 Roadmap/Changelog.md`.
5. Prueba manual end-to-end en navegador cubriendo: incidente con coordenadas, incidente sin coordenadas, selección desde mapa y desde lista, cierre del modal deteniendo el polling, unidad ocupada no seleccionable, datos frescos al abrir el modal (Etapa 7), reporte inmediato de ubicación al iniciar sesión como oficial (Etapa 8), unidad prioritaria preseleccionada/deseleccionable con un caso originado por rondín (Etapa 9), color del marcador del incidente según prioridad (Etapa 10), etiqueta de prioridad en tarjetas y marcador agrandado (Etapa 11), los 4 niveles de prioridad con su gradiente correcto y el nuevo ícono de rayo en el marcador (Etapa 12), y los casos de `test-qa.md`.

## Estado: feature cerrada tras Etapa 12

Una vez validada la Etapa 12, no quedan etapas pendientes en este plan.
