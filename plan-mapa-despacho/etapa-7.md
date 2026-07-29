# Etapa 7 — Fix: datos desactualizados al abrir el modal (última etapa, cierra la feature)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Última parte del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que las etapas 1 a 6 ya estén construidas** (mapa integrado, split-view, diferenciación visual, polling, regla de "unidad ocupada" — todo ya en producción en este repo).

## Bug reportado por el usuario

El modal "Unidades cercanas al hecho" funciona bien, pero al abrirlo **no muestra datos frescos de inmediato** — se ve la posición de las unidades tal como estaba cuando se expandió el acordeón del incidente en el tablón (que puede llevar rato abierto), no la posición real al momento de abrir el modal. Hay que esperar al primer ciclo de polling para ver algo actualizado.

**Objetivo:** que al abrir el modal se pida y muestre de inmediato la posición más reciente de las unidades, para que el mapa/lista reflejen algo lo más parecido posible a "tiempo real" desde el primer instante.

## Causa raíz confirmada en el código real

Archivo: `components/911/despacho/SeleccionarUnidadesModal.tsx`.

1. `unidadesActuales` se inicializa así: `const [unidadesActuales, setUnidadesActuales] = useState(unidades)` — con la prop `unidades` que viene de `DespachoForm.tsx`. Esa prop se fetcheó **una sola vez**, cuando se expandió el acordeón del incidente (`DespachoForm`'s `useEffect` de montaje), momento que puede haber sido hace bastante rato si el despachador tardó en hacer click en "Elegir unidades cercanas".
2. El `useEffect` de polling agregado en la Etapa 5 arranca así (simplificado):
   ```ts
   useEffect(() => {
     if (!mostrarMapa) return;
     const params = new URLSearchParams(/* lat, lng, prioritarioPatrullaId, incidenteId */)

     const id = setInterval(() => {
       fetch(`/api/despacho/unidades-cercanas?${params.toString()}`)
         .then(res => res.json())
         .then((data: UnidadParaDespacho[]) => setUnidadesActuales(data))
         .catch(() => {})
     }, 18_000)

     return () => clearInterval(id)
   }, [mostrarMapa, incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId])
   ```
   `setInterval` **no ejecuta el callback de inmediato** — el primer fetch ocurre recién a los 18 segundos. Ese es exactamente el hueco de datos desactualizados que reporta el usuario: entre el render inicial (con datos potencialmente viejos) y el primer tick, el mapa/lista muestran algo que puede no reflejar la posición real.

## Archivo a tocar

- **Modificar (único archivo):** `components/911/despacho/SeleccionarUnidadesModal.tsx`

No tocar `AsignacionMapa.tsx` ni `DespachoForm.tsx` — el fix vive enteramente dentro de este `useEffect`.

## Instrucciones

1. Dentro del `useEffect` de polling (el que depende de `[mostrarMapa, incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId]`), extrae la función que hace el fetch a una constante nombrada en vez de dejarla inline dentro del `setInterval`:
   ```ts
   useEffect(() => {
     if (!mostrarMapa) return;

     const params = new URLSearchParams()
     if (incidenteLat != null) params.set('lat', String(incidenteLat))
     if (incidenteLng != null) params.set('lng', String(incidenteLng))
     if (prioritarioPatrullaId) params.set('prioritarioPatrullaId', prioritarioPatrullaId)
     if (incidenteId) params.set('incidenteId', incidenteId)

     const fetchUnidades = () => {
       fetch(`/api/despacho/unidades-cercanas?${params.toString()}`)
         .then(res => res.json())
         .then((data: UnidadParaDespacho[]) => setUnidadesActuales(data))
         .catch(() => {})
     }

     fetchUnidades() // refresco inmediato al abrir el modal — no esperar el primer tick del interval

     const id = setInterval(fetchUnidades, 18_000)

     return () => clearInterval(id)
   }, [mostrarMapa, incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId])
   ```
2. La llamada inmediata `fetchUnidades()` debe ir **antes** de crear el `setInterval`, para que el primer request salga apenas se monta el efecto (apenas se abre el modal), no 18 segundos después.
3. El `setInterval(fetchUnidades, 18_000)` posterior sigue funcionando exactamente igual que en la Etapa 5 — mismo intervalo, mismo `clearInterval` en el cleanup del `return`.
4. No cambies el valor de 18 segundos ni la condición `if (!mostrarMapa) return` — el fix es únicamente sobre el momento del primer fetch, no sobre la cadencia general del polling.
5. No es necesario agregar un spinner/loading adicional durante ese primer fetch inmediato: `unidadesActuales` ya arranca con los datos (potencialmente desactualizados) de la prop `unidades`, así que el mapa/lista igual tienen algo que mostrar de entrada, y se actualizan en cuanto responde el fetch inmediato — esto evita una pantalla en blanco y resuelve el bug sin agregar estado nuevo.
6. Confirma que el resto del componente (grid split-view, buscador, `toggle` con el guard de `ocupada`, etc.) no se ve afectado — este cambio es aislado al `useEffect` de polling.

## Qué NO hacer en esta etapa

- No tocar `AsignacionMapa.tsx` — ya reacciona correctamente a cambios de referencia en la prop `unidades` (su propio `useEffect` que resetea `boundsSetRef.current` ya depende de `unidades`), así que al llegar los datos frescos el mapa reencuadra automáticamente sin cambios adicionales ahí.
- No tocar `DespachoForm.tsx` — su fetch inicial (para poblar el botón "Elegir unidades cercanas" con el conteo antes de abrir el modal) sigue teniendo sentido tal cual.
- No cambiar la frecuencia de polling (18s) ni introducir websockets/SSE — sigue fuera de alcance de todo este plan.
- No agregar loading states, skeletons ni animaciones nuevas — el fix es puramente sobre timing del fetch.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Con las DevTools del navegador (pestaña Network) abiertas, al hacer click en "Elegir unidades cercanas" para abrir el modal, se debe ver una request a `/api/despacho/unidades-cercanas` disparada de inmediato (no 18 segundos después).
3. Simular un cambio de posición real: actualiza manualmente `ultima_lat`/`ultima_lng`/`ultima_ubicacion_en` de un oficial en la BD (de una unidad que aparezca en el picker) justo antes de abrir el modal — la posición nueva debe reflejarse en el mapa/lista desde el primer render útil del modal, no recién tras 18s.
4. El polling periódico posterior sigue funcionando igual que en la Etapa 5 (nuevas requests cada ~18s mientras el modal permanece abierto, detenidas al cerrarlo — verificar en Network que las requests dejan de aparecer al cerrar).
5. No se rompió ninguna validación de las etapas 1-6: split-view sigue funcionando, diferenciación visual de marcadores sigue correcta, unidades `ocupada` siguen sin ser seleccionables, caso sin coordenadas (`mostrarMapa = false`) sigue mostrando solo la lista sin errores.

Con esta etapa validada, la feature del mapa de asignación de unidades queda cerrada — no quedan etapas pendientes en este plan.
