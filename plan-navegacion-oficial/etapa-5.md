# Etapa 5 — Prefill de lat/lng en el cierre (`FormularioRecorrido`)

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende de [`etapa-4.md`](./etapa-4.md) (usa la versión de `DespachoContent.tsx` que esa etapa dejó).

**Archivos a modificar:** `components/oficial/FormularioRecorrido.tsx`, `components/oficial/DespachoContent.tsx`

## Objetivo

Cuando el oficial llega y pasa al formulario de cierre (`FormularioRecorrido embedded`), hoy se prellenan folio/descripción/calle/colonia/clasificación pero **no** la ubicación exacta (lat/lng) — el oficial tendría que volver a fijarla a mano en el mapa del formulario aunque ya la tengamos del incidente original. Esta etapa cierra ese hueco.

## Cambios a aplicar

### 1. `components/oficial/FormularioRecorrido.tsx` — extender `PrefillDespacho`

Interfaz actual:

```ts
interface PrefillDespacho {
  folioCad?: string
  descripcion?: string
  calle?: string
  colonia?: string
  tipoEmergenciaId?: number
  tipoIncidenteId?: number
  prioridadId?: number
}
```

Agrega `latitud?: number` y `longitud?: number`:

```ts
interface PrefillDespacho {
  folioCad?: string
  descripcion?: string
  calle?: string
  colonia?: string
  tipoEmergenciaId?: number
  tipoIncidenteId?: number
  prioridadId?: number
  latitud?: number
  longitud?: number
}
```

### 2. `FormularioRecorrido.tsx` — usar el prefill en el `useEffect` de inicialización

Localiza el bloque (dentro del `useEffect` que resetea el store al montar):

```ts
    if (prefill?.folioCad) store.setField('folioCad', prefill.folioCad)
    if (prefill?.calle) store.setField('calle', prefill.calle)
    if (prefill?.colonia) store.setField('colonia', prefill.colonia)
```

Agrega justo después:

```ts
    if (prefill?.latitud != null) store.setField('latitud', String(prefill.latitud))
    if (prefill?.longitud != null) store.setField('longitud', String(prefill.longitud))
```

**Importante**: el store (`lib/oficial/store.ts`) define `latitud`/`longitud` como `string` (no `number`) — confirmar contra `handleSubmit` (líneas ~209-210: `fd.set('ofi_latitud', st.latitud)`). Por eso el `String(...)` explícito al asignar — si se omite, TypeScript debe marcar error de tipos (`setField` espera `string`).

### 3. `components/oficial/DespachoContent.tsx` — pasar los campos al `prefill`

En el bloque `if (enSitio) { return <FormularioRecorrido ... prefill={{ ... }} /> }` (versión dejada por la Etapa 4), el objeto `prefill` actual es:

```tsx
        prefill={{
          folioCad: asignacion.folio,
          descripcion: asignacion.descripcion ?? undefined,
          calle: asignacion.calle ?? undefined,
          colonia: asignacion.colonia ?? undefined,
          tipoEmergenciaId: asignacion.tipoEmergenciaId ?? undefined,
          tipoIncidenteId: asignacion.tipoIncidenteId ?? undefined,
          prioridadId: asignacion.prioridadId ?? undefined,
        }}
```

Agrega dos líneas:

```tsx
        prefill={{
          folioCad: asignacion.folio,
          descripcion: asignacion.descripcion ?? undefined,
          calle: asignacion.calle ?? undefined,
          colonia: asignacion.colonia ?? undefined,
          tipoEmergenciaId: asignacion.tipoEmergenciaId ?? undefined,
          tipoIncidenteId: asignacion.tipoIncidenteId ?? undefined,
          prioridadId: asignacion.prioridadId ?? undefined,
          latitud: asignacion.latitud ?? undefined,
          longitud: asignacion.longitud ?? undefined,
        }}
```

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] Al llegar al formulario de cierre (`en_sitio` → `FormularioRecorrido embedded`) para un incidente que tenía `latitud`/`longitud`, el mapa de la sección "Ubicación" del formulario (`MapaUbicacion.tsx`) debe abrir ya centrado/marcado en esas coordenadas, no en el default genérico.
- [ ] Para un incidente sin `latitud`/`longitud` (el caso de fallback de la Etapa 4, con los botones manuales), el formulario de cierre sigue funcionando exactamente igual que antes — sin lat/lng prellenada, el oficial la fija a mano como siempre.
- [ ] Confirmar en el `handleSubmit` del formulario que `ofi_latitud`/`ofi_longitud` viajan correctamente en el `FormData` al guardar el reporte (sin cambios de comportamiento ahí, solo el valor inicial cambia).
