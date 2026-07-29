# Etapa 10 — Color del marcador del incidente según prioridad (última etapa, cierra el plan)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 10 (última) del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que la Etapa 9 ya esté construida y validada.**

## Objetivo

El mapa de asignación debe comunicar de un vistazo qué tan urgente es el incidente, coloreando su marcador según la prioridad ya resuelta por el sistema — **azul = baja, amarillo = media, rojo = alta** — y unificar esa misma paleta con el color de acento que hoy usa `TablonDespacho.tsx` para el borde de cada tarjeta del tablón (hoy gris/ámbar/rojo), para que la app sea consistente en cómo se ve la prioridad.

## Confirmado por investigación de código (no reabrir esta parte)

- Existe un catálogo real `cat_prioridades` (BAJA/MEDIA/ALTA en uso; un cuarto valor CRITICA está contemplado en el código pero no es alcanzable hoy por el flujo normal — no hace falta tratarlo especialmente).
- El nombre de la prioridad ya llega resuelto como string (`"ALTA"`/`"MEDIA"`/`"BAJA"`) en `IncidentePendiente.prioridad` e `IncidenteConDespacho.prioridad` (`lib/incidentes/types.ts`), vía JOIN en `lib/incidentes/repository.ts` — no falta ningún join nuevo, solo falta hacer llegar ese dato hasta el mapa.
- `TablonDespacho.tsx` ya tiene un mapeo local `PRIO_COLORS` (~línea 38-42, gris/ámbar/rojo) usado para el borde de las tarjetas (~línea 255-264).
- `AsignacionMapa.tsx` tiene el marcador del incidente hardcodeado en rojo fijo (`INCIDENTE_SVG`, `fill="#dc2626"`).
- `DespachoForm.tsx` no recibe hoy la prioridad del incidente como prop — hay que agregarla y pasarla por toda la cadena hasta el mapa.

## Archivos a modificar

### 1. Nuevo: `lib/incidentes/prioridad-colores.ts`

Mapeo compartido, reemplaza el `PRIO_COLORS` local de `TablonDespacho.tsx`:

```ts
export interface PrioridadColor { principal: string; oscuro: string }

export const PRIORIDAD_COLORES: Record<string, PrioridadColor> = {
  BAJA:  { principal: '#2563eb', oscuro: '#1d4ed8' }, // azul
  MEDIA: { principal: '#eab308', oscuro: '#a16207' }, // amarillo
  ALTA:  { principal: '#dc2626', oscuro: '#991b1b' }, // rojo
}
export const PRIORIDAD_COLOR_DEFAULT: PrioridadColor = { principal: '#94a3b8', oscuro: '#475569' } // gris neutro, sin prioridad resuelta

export function colorPorPrioridad(prioridad: string | null | undefined): PrioridadColor {
  if (!prioridad) return PRIORIDAD_COLOR_DEFAULT
  return PRIORIDAD_COLORES[prioridad.toUpperCase()] ?? PRIORIDAD_COLOR_DEFAULT
}
```

### 2. `components/911/despacho/TablonDespacho.tsx`

- Elimina el objeto local `PRIO_COLORS` (~línea 38-42) e importa `colorPorPrioridad` del archivo nuevo.
- En el punto de uso (~línea 255-257), reemplaza:
  ```ts
  const prio = card.prioridad?.toUpperCase() ?? 'SIN PRIORIDAD'
  const pc = PRIO_COLORS[prio] ?? PRIO_COLORS.BAJA
  ```
  por:
  ```ts
  const pc = colorPorPrioridad(card.prioridad)
  ```
  usando `pc.principal` donde antes se usaba `.bar`/`.dot`, y `pc.oscuro` donde se usaba `.text`. Esto además corrige un detalle menor: hoy el fallback de "sin prioridad" reutilizaba por accidente el color de BAJA (`PRIO_COLORS[prio] ?? PRIO_COLORS.BAJA`); con `colorPorPrioridad` el fallback pasa a ser el gris neutro dedicado, que es lo correcto (no confundir "sin prioridad" con "prioridad baja").
- No toques `SLA_MINUTOS` ni la lógica de `slaPorcentaje` — solo el color de acento cambia, el cálculo de urgencia por SLA no se toca.
- En el punto donde se instancia `<DespachoForm .../>` (~línea 373-383), pasa `incidentePrioridad={card.prioridad}` como prop nueva (aplica también a la instancia en modo `refuerzo`, ~línea 393, si el incidente tiene prioridad disponible ahí también).

### 3. `components/911/despacho/DespachoForm.tsx`

Acepta la nueva prop `incidentePrioridad?: string | null`, y pásala hacia abajo a `<SeleccionarUnidadesModal ... incidentePrioridad={incidentePrioridad} />`.

### 4. `components/911/despacho/SeleccionarUnidadesModal.tsx`

Acepta `incidentePrioridad?: string | null` y pásala a `<AsignacionMapa ... prioridad={incidentePrioridad} />`.

### 5. `components/911/despacho/AsignacionMapa.tsx`

Agrega prop nueva `prioridad?: string | null`. Reemplaza el `fill="#dc2626"` fijo de `INCIDENTE_SVG` por una construcción dinámica del ícono usando `colorPorPrioridad(prioridad).principal` (mismo patrón que ya usa `buildUnidadSvgIcon` para construir SVGs data-URI parametrizados) — convierte `INCIDENTE_SVG` de constante a una función `buildIncidenteSvgIcon(prioridad)` ya que ahora depende de una prop, y úsala en el `icon` del `MarkerF` del incidente.

## Qué NO hacer en esta etapa

- No tocar el catálogo `cat_prioridades` en BD ni `resolverPrioridadId` — la resolución de prioridad ya funciona correctamente, esta etapa es puramente de presentación (color).
- No agregar el valor "CRITICA" a la paleta — no es alcanzable hoy por el flujo normal; si en el futuro se vuelve alcanzable, se agrega ahí mismo en `PRIORIDAD_COLORES`.
- No tocar `SLA_MINUTOS` ni la lógica de urgencia por SLA en `TablonDespacho.tsx`.
- No tocar los colores de las unidades (Etapas 4, 6, 9) — esta etapa solo cambia el color del marcador del INCIDENTE, no el de las patrullas.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. En el tablón (`/agente_911/despacho`), las tarjetas de incidentes con prioridad ALTA se ven con acento rojo, MEDIA con acento amarillo, BAJA con acento azul — visualmente distinto del esquema anterior (gris/ámbar/rojo).
3. Un incidente sin prioridad resuelta se ve con acento gris neutro (no azul, no confundible con "baja").
4. Al abrir "Unidades cercanas al hecho" de un incidente con prioridad conocida, el marcador del lugar del hecho en el mapa usa el color correspondiente (azul/amarillo/rojo).
5. Un incidente sin prioridad resuelta muestra el marcador del mapa en gris neutro.
6. No se rompió ninguna validación de las etapas anteriores (Etapa 4: diferenciación de unidades por cercanía; Etapa 6: unidades ocupadas; Etapa 9: unidad prioritaria preseleccionada) — los colores de las UNIDADES no cambian, solo el marcador del INCIDENTE.

Con esta etapa completada y validada, el plan del mapa de asignación de unidades queda cerrado por completo. No quedan etapas pendientes.
