# Etapa 2 — Service layer (`lib/911/service.ts`)

Depende de la Etapa 1 (usa las 4 funciones nuevas de `repository.ts`).

## Objetivo

Agregar `obtenerKpisGenerales911(desde, hasta)` en `lib/911/service.ts`, orquestando en paralelo las 4 queries nuevas de la Etapa 1 **más** `obtenerKpiIncidencias` de `lib/incidentes/repository.ts` (reusada tal cual, no duplicada — ver `00-contexto.md`).

Seguir el mismo estilo pass-through que ya tiene el archivo (funciones `get*` delgadas que llaman al repository).

## Archivo: `lib/911/types.ts`

Agregar el tipo combinado (además de los 4 de la Etapa 1):

```ts
import type { KpiIncidencias } from '@/lib/incidentes/types'

export interface KpisGenerales911 {
  resumen: Resumen911
  atencion: KpiIncidencias
  tiempos: TiemposRespuesta911
  alarmaEscolar: KpiAlarmaEscolar
  extorsion: KpiExtorsion
}
```

## Archivo: `lib/911/service.ts`

```ts
import {
  obtenerCatalogos, obtenerStats, obtenerStatsPorTipo, listarIncidentes, obtenerIncidente,
  obtenerIncidenteConExtras, obtenerTiposIncidente, contarPorCanalizacion, obtenerDespachadores,
  obtenerResumenPorTipoYCanal, obtenerTiemposRespuesta911, obtenerKpiAlarmaEscolar, obtenerKpiExtorsion,
} from './repository'
import { obtenerKpiIncidencias } from '@/lib/incidentes/repository'
import type { /* ...tipos existentes..., */ KpisGenerales911 } from './types'

// ...funciones existentes sin cambios...

export async function obtenerKpisGenerales911(desde: string, hasta: string): Promise<KpisGenerales911> {
  const [resumen, atencion, tiempos, alarmaEscolar, extorsion] = await Promise.all([
    obtenerResumenPorTipoYCanal(desde, hasta),
    obtenerKpiIncidencias({ desde, hasta }),
    obtenerTiemposRespuesta911(desde, hasta),
    obtenerKpiAlarmaEscolar(desde, hasta),
    obtenerKpiExtorsion(desde, hasta),
  ])
  return { resumen, atencion, tiempos, alarmaEscolar, extorsion }
}
```

`obtenerKpiIncidencias` espera un objeto `IncidenteGeoFiltros` (`{ desde, hasta, estatus?, canal?, prioridadId?, tipoIncidenteId? }`, ver `lib/incidentes/types.ts:24-31`) — pasar solo `{ desde, hasta }`, sin filtros adicionales.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores (el import cruzado a `@/lib/incidentes/repository` y `@/lib/incidentes/types` debe resolver limpio).
2. `obtenerKpisGenerales911('2026-01-01', '2026-12-31')` corrido manualmente (script puntual o log temporal) devuelve las 5 llaves sin excepciones.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
