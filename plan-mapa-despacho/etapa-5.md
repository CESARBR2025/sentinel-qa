# Etapa 5 — Polling ligero mientras el modal está abierto

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 5 de 5 (última) del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` en esta misma carpeta para trasfondo completo. **Requiere que las etapas 1 a 4 ya estén hechas y validadas.**

## Objetivo

Que las posiciones de las unidades en el mapa se refresquen mientras el despachador tiene el modal de selección abierto, dando sensación de "vivo" — sin introducir websockets/SSE (fuera de alcance de todo este plan) y sin romper el estado de selección ya elegido por el usuario.

## Archivos

- **Modificar (único archivo a tocar):** `components/911/despacho/SeleccionarUnidadesModal.tsx`

No modificar `AsignacionMapa.tsx` en esta etapa — no debería necesitarlo, ya que solo consume la prop `unidades` que le pasa el modal; al actualizar esa prop en el padre, React re-renderiza los `MarkerF` con la nueva posición usando la misma `key={u.id}` que ya deberían tener (si no la tienen, agrégala como parte de esta etapa, es un ajuste menor dentro de la regla de "no tocar `AsignacionMapa.tsx`" solo si es estrictamente necesario para que el polling funcione bien — si ya tiene `key` correcta, no toques el archivo).

## Contexto técnico necesario

- Patrón de referencia ya existente en el proyecto para polling con cleanup: `components/911/despacho/TablonDespacho.tsx`, el `useEffect` que hace polling cada 20s (`INTERVALO_MS`) para el tab "pendientes", con su `return () => clearInterval(...)` en el cleanup. Sigue ese mismo patrón, no inventes uno distinto.
- El endpoint a re-consultar es el mismo que ya usa `DespachoForm.tsx` al montar: `GET /api/despacho/unidades-cercanas?lat=<incidenteLat>&lng=<incidenteLng>&prioritarioPatrullaId=<...>` (revisa la construcción exacta de query params en `DespachoForm.tsx`, debe replicarse igual en el modal para consistencia).
- El modal ya recibe `unidades: UnidadParaDespacho[]` como prop desde `DespachoForm.tsx` — para el polling, el modal necesita su **propio estado local** derivado de esa prop inicial, que luego el polling actualiza, en vez de mutar la prop del padre (el padre no debe hacer polling — el punto es que el refresh se detenga solo con el modal, y `DespachoForm` sigue abierto aunque el modal se cierre).

## Instrucciones

1. Dentro de `SeleccionarUnidadesModal`, agrega un estado local `const [unidadesActuales, setUnidadesActuales] = useState(unidades)` inicializado con la prop `unidades` recibida al montar.
2. Usa `unidadesActuales` (no la prop `unidades` directamente) como fuente de datos para: la lista filtrada (`filtradas`), `masCercanaId`, y lo que se le pasa a `AsignacionMapa`. La prop `unidades` original solo se usa para inicializar el estado.
3. Agrega un `useEffect` que, solo si `mostrarMapa` es `true` (hay coordenadas del incidente — mismo booleano ya definido en la Etapa 3) y el componente está montado:
   - Dispare un `fetch` al endpoint de unidades cercanas cada 15-20 segundos (elige un valor fijo dentro de ese rango, ej. `18000` ms) usando `setInterval`.
   - Al recibir la respuesta, actualiza `unidadesActuales` con los datos frescos.
   - Limpie el `setInterval` en el `return` del `useEffect` (cleanup), para que se detenga al desmontar el modal (cerrarlo).
   - No dispares un fetch adicional inmediato al montar el `useEffect` más allá del que ya hace `DespachoForm.tsx` al abrir el acordeón — el modal empieza con los datos que ya le pasó el padre vía prop `unidades`, y el primer refresh ocurre en el primer tick del intervalo.
4. **Preservar el estado de selección durante el refresh**: `seleccionLocal` (el estado de selección del modal) se mantiene como está — no lo reinicialices ni lo recalcules a partir de `unidadesActuales`. Si una unidad ya seleccionada sigue existiendo en la respuesta nueva (mismo `id`), su chip/marcador debe seguir marcado como seleccionado (esto debería funcionar naturalmente si `seleccionLocal` sigue siendo la fuente de verdad de selección y `unidadesActuales` solo aporta datos de posición/distancia — no dupliques ni cruces estos dos estados).
5. Si una unidad que estaba seleccionada deja de aparecer en la respuesta nueva (caso raro, ej. se dio de baja), no la elimines automáticamente de `seleccionLocal` — mantenerla no rompe el flujo de despacho (el usuario puede quitarla manualmente con el botón "Quitar" que ya existe). No es necesario manejar este caso de forma especial más allá de "no crashear" si el `find` correspondiente no encuentra la unidad en algún render derivado.

## Qué NO hacer en esta etapa

- No introducir WebSockets/SSE.
- No tocar `DespachoForm.tsx` (el polling vive enteramente dentro del modal).
- No tocar `OficialUbicacionTracker.tsx` ni la frecuencia del heartbeat del oficial (30s) — es un componente distinto, fuera de alcance de todo este plan.
- No implementar interpolación/animación manual de movimiento entre posiciones — el salto de posición en cada ciclo de poll es aceptable y suficiente para este alcance.
- No hagas polling si `mostrarMapa` es `false` (incidente sin coordenadas) — no tiene sentido refrescar datos que no se están mostrando en mapa (la lista sin mapa puede seguir comportándose como hoy, sin polling, igual que antes de este plan).

## Criterios de aceptación (verificar — última etapa del plan)

1. `npx tsc --noEmit` corre sin errores nuevos.
2. Con el modal abierto (caso con coordenadas), usando las DevTools del navegador (pestaña Network), confirmar que se dispara una nueva request a `/api/despacho/unidades-cercanas` cada 15-20 segundos mientras el modal permanece abierto.
3. Cerrar el modal y confirmar que las requests periódicas se detienen (no siguen apareciendo en Network después de cerrar).
4. Seleccionar una o más unidades, esperar a que ocurra al menos un ciclo de polling, y confirmar que las unidades seleccionadas siguen marcadas como seleccionadas (tanto en la lista como en el mapa) después del refresh — no se pierde el estado.
5. Si es posible simular o esperar un cambio real de posición de alguna unidad entre ciclos de polling, confirmar que su marcador se mueve en el mapa sin que la página parpadee, pierda el scroll de la lista, o resetee el texto de búsqueda.
6. No se tocó ningún archivo fuera de `SeleccionarUnidadesModal.tsx` (y, si fue estrictamente necesario, el `key={u.id}` en `AsignacionMapa.tsx` mencionado arriba).

## Checklist final de todo el plan (una vez completada esta etapa)

1. `npx tsc --noEmit` y `npm run build` sin errores en todo el proyecto.
2. `npx graphify update` (regla del proyecto, ver AGENTS.md en la raíz del repo).
3. Actualizar la bóveda del proyecto (`boveda/`): agregar entrada en `🧩 Features/` describiendo el mapa de asignación de unidades, y una entrada en `🗺 Roadmap/Changelog.md`.
4. Prueba manual end-to-end cubriendo: incidente con coordenadas, incidente sin coordenadas, selección desde mapa y desde lista, cierre del modal deteniendo el polling.
