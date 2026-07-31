# Etapa 1 — Pipeline de datos: lat/lng del incidente hasta el oficial

> Lee primero [`00-contexto.md`](./00-contexto.md) si no tienes el contexto del problema y las decisiones ya tomadas.

**Archivos a modificar:** `lib/oficial/repository.ts`, `lib/oficial/types.ts`, `lib/oficial/mapper.ts`, `components/oficial/DespachoContent.tsx`, `lib/maps/googleMapsConfig.ts`

## Objetivo

Sin esto no hay destino que pasarle a Directions API en la Etapa 2. Extender el pipeline que hoy trae `asignacion` a `/oficial/despachos/[id]` para que incluya `latitud`/`longitud` del incidente, y agregar la librería `geometry` al loader compartido de Google Maps (se necesita en la Etapa 3 para medir desviación de ruta).

## Cambios a aplicar

### 1. `lib/oficial/repository.ts::obtenerDespachosAsignados`

Localiza la función por su nombre (no por línea, puede haber cambiado). El `SELECT` actual es:

```ts
export async function obtenerDespachosAsignados(
  userId: string,
): Promise<DespachoAsignado[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       i.id AS incidente_id, i.folio, i.canal, i.estatus, i.descripcion,
       i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion,
       i.fecha_hora_inicio,
       i.tipo_emergencia_id, i.tipo_incidente_id, i.prioridad_id,
       cti.nombre AS tipo_incidente_nombre,
       cp.nombre AS prioridad_nombre,
       d.fecha_hora_despacho,
       u.name AS despachador_nombre,
       COALESCE(
         (SELECT array_agg(du.unidad_placa) FROM incidente_despacho_unidades du WHERE du.despacho_id = d.id),
         '{}'
       ) AS unidades
     FROM incidente_despacho_elementos de
     JOIN incidente_despacho d ON d.id = de.despacho_id
     JOIN incidentes i ON i.id = d.incidente_id
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN users u ON d.despachado_por = u.id
       WHERE de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
         AND i.estatus IN ('en_despacho', 'en_sitio')
         AND NOT EXISTS (SELECT 1 FROM ofi_reportes_campo WHERE incidente_id = i.id)
       ORDER BY cp.orden NULLS LAST, d.fecha_hora_despacho DESC`,
    [userId],
  );
  return result.rows.map(rowToDespachoAsignado);
}
```

Agrega `i.latitud, i.longitud` a la lista de columnas seleccionadas (junto a `i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion` — mismo lugar). No cambies nada más de la query (joins, where, order by quedan igual).

### 2. `lib/oficial/types.ts::DespachoAsignado`

Interfaz actual:

```ts
export interface DespachoAsignado {
  incidenteId: string;
  folio: string;
  canal: string;
  estatus: string;
  descripcion: string | null;
  calle: string | null;
  colonia: string | null;
  entreCalles: string | null;
  referenciaUbicacion: string | null;
  tipoIncidente: string | null;
  prioridad: string | null;
  tipoEmergenciaId: number | null;
  tipoIncidenteId: number | null;
  prioridadId: number | null;
  fechaHoraInicio: string;
  fechaHoraDespacho: string | null;
  despachadorNombre: string | null;
  unidades: string[];
}
```

Agrega `latitud: number | null; longitud: number | null;` (por ejemplo, junto a `referenciaUbicacion`). Nota: `DespachoAtendido extends DespachoAsignado` en el mismo archivo — hereda los campos nuevos automáticamente, no hay que tocarlo.

### 3. `lib/oficial/mapper.ts::rowToDespachoAsignado`

Función actual:

```ts
export function rowToDespachoAsignado(row: Record<string, unknown>): DespachoAsignado {
  return {
    incidenteId: String(row.incidente_id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    estatus: String(row.estatus ?? ''),
    descripcion: (row.descripcion as string) ?? null,
    calle: (row.calle as string) ?? null,
    colonia: (row.colonia as string) ?? null,
    entreCalles: (row.entre_calles as string) ?? null,
    referenciaUbicacion: (row.referencia_ubicacion as string) ?? null,
    tipoIncidente: (row.tipo_incidente_nombre as string) ?? null,
    prioridad: (row.prioridad_nombre as string) ?? null,
    tipoEmergenciaId: row.tipo_emergencia_id != null ? Number(row.tipo_emergencia_id) : null,
    tipoIncidenteId: row.tipo_incidente_id != null ? Number(row.tipo_incidente_id) : null,
    prioridadId: row.prioridad_id != null ? Number(row.prioridad_id) : null,
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    fechaHoraDespacho: toStr(row.fecha_hora_despacho),
    despachadorNombre: (row.despachador_nombre as string) ?? null,
    unidades: Array.isArray(row.unidades) ? (row.unidades as string[]).filter(Boolean) : [],
  }
}
```

Agrega, junto a `referenciaUbicacion`:

```ts
    latitud: row.latitud != null ? Number(row.latitud) : null,
    longitud: row.longitud != null ? Number(row.longitud) : null,
```

Sigue el mismo patrón numérico que `tipoEmergenciaId`/`prioridadId` (parsear con `Number(...)` solo si no es `null`).

### 4. `components/oficial/DespachoContent.tsx` — interfaz local `Asignacion`

Interfaz actual (líneas 9-19):

```ts
interface Asignacion {
  folio: string
  descripcion?: string | null
  calle?: string | null
  colonia?: string | null
  tipoIncidente?: string | null
  prioridad?: string | null
  tipoEmergenciaId?: number | null
  tipoIncidenteId?: number | null
  prioridadId?: number | null
}
```

Agrega `latitud?: number | null` y `longitud?: number | null`. No uses todavía estos campos dentro del componente — eso es trabajo de la Etapa 4. Esta etapa solo asegura que el dato llega hasta aquí (la prop `asignacion` que recibe `DespachoContent` ya es del tipo `DespachoAsignado` completo, así que en cuanto el tipo tenga los campos, ya están disponibles sin tocar `app/oficial/despachos/[id]/page.tsx`).

### 5. `lib/maps/googleMapsConfig.ts` — agregar `geometry`

Archivo actual completo:

```ts
import type { Libraries } from '@react-google-maps/api'

export const GOOGLE_MAPS_LOADER_ID = 'google-map-script'
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'visualization']
```

Cambia la última línea a:

```ts
export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'visualization', 'geometry']
```

Es un cambio aditivo y centralizado — afecta a los 8 archivos que comparten `GOOGLE_MAPS_LOADER_ID`, pero agregar una library no invalida a ningún consumidor existente (solo agrega capacidades al script cargado). No se necesita ningún otro cambio en esos archivos.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] `obtenerDespachosAsignados` devuelve `latitud`/`longitud` para un incidente que sí las tiene en BD (verificar con una llamada directa o un `console.log` temporal, no hace falta UI todavía).
- [ ] Para un incidente sin coordenadas (`latitud`/`longitud` NULL en BD), la función no lanza error — devuelve `null` en esos campos.
- [ ] No se modificó el `WHERE`/`JOIN`/`ORDER BY` de la query — mismo comportamiento de filtrado que antes.
- [ ] `DespachoAtendido` (que extiende `DespachoAsignado`) sigue compilando sin cambios adicionales.
- [ ] `GOOGLE_MAPS_LIBRARIES` incluye `'geometry'` — confirmar que ningún componente existente que usa `useJsApiLoader({ id: GOOGLE_MAPS_LOADER_ID, ... })` con esa misma config se rompe (no debería, es aditivo, pero correr `npm run build` para confirmar que ninguna página con mapa falla en build).
