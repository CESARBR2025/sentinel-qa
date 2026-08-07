# KPI Incidencias — Mapa y tabla de incidencias por rango

**Propósito**: Dar al agente de despacho una lectura geográfica y numérica de las incidencias en un rango de fecha/hora. Es el primer módulo del proyecto que pinta incidentes sobre un mapa — antes solo existían pickers de captura y vistas read-only de un punto. Ver [[911]] y [[Reporte Campo]].

Ruta: `/agente_despacho/kpi-incidencias`, accesible desde la segunda tarjeta del hub `/agente_despacho`.

---

## Qué muestra

1. **Filtros** — rango con fecha **y hora** (`<input type="datetime-local">`), presets (24 h / 7 días / 30 días / Hoy) y filtros opcionales de estatus, canal, prioridad y tipo de incidente. Default al abrir: últimas 24 h.
2. **Tarjetas KPI** — total del periodo, desglose por estatus y desglose por prioridad.
3. **Un panel de mapa con toggle Puntos / Calor** (una sola instancia de Google Maps viva a la vez — montar las dos en paralelo con ~90 marcadores más la capa de calor saturaba el renderer y tiraba la pestaña):
   - *Ubicación de incidencias*: un marcador por incidente, color por prioridad; relleno sólido si la coordenada viene del reporte de campo y aro hueco si viene de la captura 911. Click → `InfoWindow` con preview (folio, tipo, hora, prioridad, canal, ubicación, origen de la coordenada) + botón "Detalles".
   - *Concentración por zona*: capa de calor con la misma data, para leer qué zona acumuló más incidencias. Click en el mapa → lista de las incidencias en 260 m a la redonda.
4. **Tabla** — folio, fecha/hora, tipo, prioridad, canal, ubicación, estatus. Fila clickeable → modal de detalle. Las filas sin coordenadas se marcan con un icono (existen en la tabla pero no en los mapas).
5. **Modal de detalle** — consume `GET /api/incidentes/[id]` (que ya registra audit `VIEW`) y muestra clasificación, reportante, ubicación, narrativa, despacho, personas afectadas, extorsión, alarma escolar y reporte de campo legacy.

**Refresco manual**, con botón "Actualizar" — a diferencia de `TablonDespacho`, aquí no hay polling: el rango puede ser histórico y no tiene sentido repolear. Aun así, **el rango default (últimas 24 h) se consulta automáticamente al montar** (`useEffect` → `recargar(filtrosIniciales())`): antes la vista abría con la tabla vacía hasta que el usuario presionaba un preset o "Actualizar".

## Regla de coordenadas — el reporte de campo manda

La ubicación del **reporte de campo** (`ofi_reportes_campo.ofi_latitud` / `ofi_longitud`) es la más exacta al lugar del suceso, porque la captura el oficial ya estando ahí. La del incidente (`incidentes.latitud` / `longitud`) la captura el operador por teléfono. Por eso:

```sql
COALESCE(orc.ofi_latitud,  i.latitud)  AS latitud
COALESCE(orc.ofi_longitud, i.longitud) AS longitud
```

Se expone además `origenCoordenada: 'reporte_campo' | 'incidente' | null`. El mapa de puntos lo refleja visualmente: marcador **sólido** para la coordenada del reporte de campo, **hueco** para la del incidente. El mapa de calor las trata igual.

`incidente_reporte_campo` (legacy) **no** aporta coordenadas: sus `cateo_latitud`/`cateo_longitud` son del cateo, no del incidente — no usarlas.

Al momento de construir el módulo: 90 incidentes, 89 con ubicación efectiva (8 desde reporte de campo, 81 desde el incidente, 1 sin nada). El `COALESCE` sube la cobertura de 84 a 89.

## Archivos

| Capa | Archivo |
|------|---------|
| Tipos | `lib/incidentes/types.ts` — `IncidenteGeoFiltros`, `IncidenteGeo`, `KpiIncidencias`, `KpiGeoResponse` |
| Mapper | `lib/incidentes/mapper.ts` — `rowToIncidenteGeo` |
| Repository | `lib/incidentes/repository.ts` — `listarIncidentesGeo`, `obtenerKpiIncidencias` (comparten `construirWhereGeo`, `JOIN_GEO`) |
| Service | `lib/incidentes/service.ts` — `getKpiGeo`, `normalizarRangoGeo` |
| API | `app/api/incidentes/kpi-geo/route.ts` |
| Página | `app/agente_despacho/kpi-incidencias/page.tsx` |
| Componentes | `components/911/kpi/` — `KpiIncidenciasView`, `FiltrosRangoKpi`, `MapaPuntosIncidencias`, `MapaCalorIncidencias`, `TablaIncidencias`, `ModalDetalleIncidencia`, `useMapaIncidencias`, `formato` |

## Decisiones

- **Permisos**: la página usa `tieneAccesoSeccion(userId, '911_despacho')` — la misma verificación que `/agente_911/despacho`, para no inventar una sección nueva ni requerir migración de BD. La API usa `verificarAccesoIncidentesApi(userId, 'ver')` (sección `incidentes`), igual que el resto de rutas de incidentes.
- **Migración Apple-style (2026-08-07)**: el módulo completo (`KpiIncidenciasView`, `FiltrosRangoKpi`, `TablaIncidencias`, `ModalDetalleIncidencia`, overlays de mapas, `formato`) migró del lenguaje táctico a `DESIGN.md` (tipografía `var(--apple-font-display)`, sentence-case, radios de §6, superficies planas con `--shadow-card`, badges estatus con pareja `BG_ESTATUS`/`COLOR_ESTATUS`, botones con hover+press y `prefers-reduced-motion`). El wrapper de página quedó con la regla de regreso (`backHref` en `DashboardHeader`). Ver `DESIGN.md §10`.
- **Rediseño UI/UX (2026-08-07)**: la vista pasó de "pila vertical plana" a dashboard operativo (Enfoque A):
  - `FiltrosRangoKpi` → **toolbar compacta** (presets pills + botón "Filtros avanzados" con badge de conteo + Actualizar); los filtros avanzados (desde/hasta/estatus/canal/prioridad/tipo) van en un **disclosure colapsable** que se auto-abre al tocar un campo. Colapsado por defecto.
  - **`KpiResumen`** (nuevo): franja de 4 tarjetas con **count-up** (rAF + easing, respeta `prefers-reduced-motion`): Total (hero), Con ubicación (con barra de %), Desde reporte de campo, Sin coordenadas.
  - **`ColoniasCalientes`** (nuevo): card con **donut del top 5 de colonias más calientes** (SVG nativo, centro con total, **tooltip custom al hover** con colonia/valor/%) y debajo **tabla con el ranking y contador de incidentes** (top 8, medalla de ranking, chip MapPin, mini-barra). Colores tomados de la **columna Estatus** (`COLOR_ESTATUS` + variantes `BG_ESTATUS` de `formato.ts`), en orden de calor: rojo (más reportes) → teal (menos); cada fila de la tabla hereda su color y variante clara. Deriva el conteo client-side de `incidentes[].colonia` — sin backend nuevo. Reemplazó al panel `BarrasDistribucion` (barras % por estatus/prioridad), para que el agente identifique "áreas calientes" actuales por zona.
  - Grid desktop **mapa (2fr) + distribución (1fr)** (`minmax(280px,1fr)`), colapsa a 1 col ≤1000px. Altura del mapa 520px.
  - `TablaIncidencias` → **ordenamiento** (folio/fecha/prioridad/estatus), **búsqueda** (folio/tipo/canal/zona), **paginación** (20/página), header **sticky** (`.kpi-tabla-scroll`, max-height 560px), y **export CSV** client-side (BOM UTF-8 para Excel).
  - **`EstadosVista`** (nuevo): skeletons shimmer replicando la silueta del layout + empty state con CTA "Ampliar a 7 días".
  - La nota de "sin coordenadas" dejó de ser texto suelto: pasó a KPI card + pie del panel de mapa.
  - Modal de detalle: chips de estatus/prioridad/canal bajo el folio.
- **Loader de Google Maps**: ambos mapas comparten `useMapaIncidencias()`, que usa `useJsApiLoader` con el id `'google-map-script'` (el mismo que el resto del proyecto — otro id provoca "API loaded multiple times"). El array de librerías vive a nivel de módulo: inline se reiniciaría en cada render.
- **Basemap compartido**: `ESTILOS_MAPA` en `useMapaIncidencias.ts` atenúa el terreno y apaga los POIs comerciales. Lo usan las dos vistas, para que alternar Puntos/Calor no cambie el aspecto del panel y lo único saturado en pantalla sean los datos.

## Mapa de calor — por qué no se usa `HeatmapLayer`

`google.maps.visualization.HeatmapLayer` se descartó: se pinta con opacidad plana por punto y no permite controlar la normalización, que es justo lo que hacía falta aquí. Se dibuja con **`simpleheat` sobre un `<canvas>` propio** superpuesto al mapa (`pointer-events: none`, así el pan/zoom/clic siguen llegando al mapa). Tipos en `types/simpleheat.d.ts`.

Cuatro detalles que hay que respetar si se toca este componente:

1. **`draw()` no acepta gradiente.** Su única firma es `draw(minOpacity)`. La rampa se aplica con `gradient()` aparte; pasarla como segundo argumento la ignora en silencio.
2. **`simpleheat` cachea el tamaño del canvas al construirse.** Tras cambiar `canvas.width/height` hay que llamar a `resize()` o seguiría limpiando y coloreando con las medidas viejas.
3. **La normalización no puede usar el pico absoluto.** Con `max` = pico, un punto con 33 incidencias apiladas aplasta al resto contra el cero y las ubicaciones con un solo reporte desaparecen. Se usa el percentil 85 de la densidad acotado a `[3, 12]` más un piso de opacidad (`OPACIDAD_MINIMA = 0.22`), de modo que **toda ubicación con al menos un reporte deja huella visible** y los focos fuertes igual saturan en rojo.
4. **La proyección se calcula a mano (Web Mercator, `aMundo()`), no con `OverlayView.getProjection()`.** La proyección del overlay sólo existe después de que la API llame a su `draw()` de forma asíncrona; en esta pantalla ese callback no llegaba y la capa nunca se dibujaba. Con `getBounds()` + `getZoom()` el cálculo es determinista y siempre está disponible. El repintado se dispara con los eventos `bounds_changed` / `idle` / `resize`, coalescidos en un `requestAnimationFrame`.

El radio de influencia es de **260 m reales** (`RADIO_METROS`), convertidos a píxeles según el zoom, para que la mancha represente siempre la misma superficie y el mapa signifique lo mismo a cualquier escala. Al hacer clic en el mapa se listan las incidencias dentro de ese mismo radio.

### Los presets de rango auto-aplican

`FiltrosRangoKpi` recibía `onAplicar: () => void`, así que los botones "Últimas 24 h / 7 días / 30 días / Hoy" sólo actualizaban los inputs de fecha (vía `onChange`) sin disparar la consulta — había que acordarse de presionar "Actualizar" aparte, y si no, la pantalla seguía mostrando el resultado del rango anterior con los inputs ya cambiados (confuso: se veía "30 días" en el selector pero el total seguía siendo el de antes). Ahora `onAplicar: (filtros: FiltrosKpi) => void` recibe el rango recién calculado y lo consulta de inmediato — pasarlo explícito evita depender de leer `filtros` del padre por closure (que en ese punto todavía tendría el valor de la render anterior, por el batching de React).

### El canvas de calor tapaba el InfoWindow — z-index sin depender de los panes de Google

El `<canvas>` del mapa de calor es un **hermano posterior** del div del mapa en el DOM (no un hijo). Sin `z-index` explícito, ese orden de documento basta para que quede por encima de TODO el subárbol del mapa —incluido el `floatPane` interno donde Google monta sus `InfoWindow`— y la ficha de detalle se veía "detrás" de la mancha de calor. La solución no fue ajustar z-index a ciegas (depender de cómo Google organiza sus panes internos es frágil): se **reemplazó `InfoWindowF` por una tarjeta propia** (`Callout` en `MapaCalorIncidencias.tsx`), posicionada con la misma proyección Mercator manual que ya se usa para pintar el canvas (`calcularPosPantalla`, recalculada en cada `bounds_changed`/`idle` para que seguir el terreno durante pan/zoom). Con DOM y z-index 100% propios, ya no depende del sistema de panes de Google — y de paso permite un diseño consistente con el resto de la vista (tarjeta blanca con puntero triangular, en vez del chrome genérico de `InfoWindow`).

### Radio y blur de la mancha — por qué se veían "círculos gigantes"

Los valores iniciales (`RADIO_METROS=260`, blur `radioPx*0.6`, tope `85px`) hacían que la mancha se leyera como una región completa cubriendo varias calles, no como un punto caliente localizado. Se ajustó a `RADIO_METROS=140`, blur `radioPx*0.35`, tope `46px`: el área pintada representa mejor los 140 m reales de influencia. El radio de búsqueda al hacer click (`RADIO_CLICK_M`) sigue atado al mismo valor, así que la lista de "incidencias en zona" siempre corresponde a lo que forma la mancha bajo el cursor.

### Trampa de StrictMode con `@react-google-maps/api`

`onUnmount={() => setMapa(null)}` **rompe** el componente en desarrollo: en el doble montaje de StrictMode ese callback corre después del `onLoad` del segundo montaje y deja el estado en `null` para siempre, así que los efectos que dependen del mapa no llegan a ejecutarse (aquí: el canvas nunca se dimensionaba y no se veía nada). Ambos mapas guardan ahora la instancia en un **ref** (`mapaRef`) y usan un contador `generacion` para relanzar los efectos; ninguno anula la referencia al desmontar, porque el estado muere con el componente de todos modos.

Relacionado: un `requestAnimationFrame` cancelado nunca ejecuta su callback, así que al cancelarlo hay que poner también el id a `null` — si no, el guard de "ya hay un frame en vuelo" bloquea todos los repintados posteriores.
- **Sin clustering**: `LIMIT 1000` acota el peor caso del mapa de puntos. Si en uso real la densidad molesta, agregar `MarkerClusterer`.
- **`normalizarRangoGeo`** defiende el rango en servidor: default 24 h, invierte extremos al revés, y recorta a 366 días máximo para no barrer la tabla entera.
- No se tocó `listarIncidentesConFiltros` ni `IncidenteListItem`: `app/incidentes/page.tsx` y `app/api/incidentes/route.ts` dependen de su forma actual.

## Pendiente / limitaciones

- El hub `/agente_despacho` exige `911_rondin` **o** `911_despacho`, mientras ambas subpáginas exigen `911_despacho`. Un usuario solo con `911_rondin` ve las tarjetas y ambas lo rebotan a `/dashboard`. Comportamiento previo, no corregido aquí.
- El modal no muestra el cierre vigente (`ofi_reportes_campo`), solo el legacy `incidente_reporte_campo`, porque es lo que devuelve `obtenerIncidenteCompleto`. Si se necesita, la vía es `obtenerHistorialCompleto` (`lib/incidentes/service.ts`).
