# Etapa 1 — Capa de datos: `lib/formatos-udai/`

Leer primero `00-contexto.md`.

## Objetivo

Crear el módulo de datos que trae las 34 columnas del formato oficial, uniendo `iph_detenidos` con `ofi_reporte_denuncia`, `ofi_reportes_campo` y `ofi_detalles_asegurados` — calcando el patrón de `obtenerPrellenadoCompleto()` en `lib/monitorista/repository.ts:253-285`.

## Archivos a crear

### `lib/formatos-udai/types.ts`

```ts
export interface FaltaAdministrativaRow {
  id: string
  fecha: string | null
  hora: string | null
  responsableTurno: string | null
  horaSalida: string | null // GAP, siempre null por ahora — ver 00-contexto.md
  iph: string | null
  folioTablet: string | null // GAP, siempre null por ahora
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  nombre: string | null
  fechaNacimiento: string | null
  edad: number | null
  genero: string | null
  alias: string | null
  ciudadOrigen: string | null
  calleDet: string | null
  numero: string | null
  coloniaDet: string | null
  articulo: string | null
  tipoFalta: string | null
  rnd: string | null
  lugarArresto: string | null
  colonia: string | null
  oficialQueRemite: string | null
  oficialQueRemite2: string | null // GAP, siempre null por ahora
  sector: string | null
  agrupamiento: string | null
  latitud: number | null
  longitud: number | null
  presencia: boolean
  verbalizacion: boolean
  controlContacto: boolean
  controlFisico: boolean
  tecnicasNoLetales: boolean
  fuerzaLetal: boolean
}
```

### `lib/formatos-udai/repository.ts`

```ts
import { query } from '@/lib/db'
import type { FaltaAdministrativaRow } from './types'

function rowToFaltaAdministrativa(r: Record<string, unknown>): FaltaAdministrativaRow {
  return {
    id: r.id as string,
    fecha: r.fecha as string | null,
    hora: r.hora as string | null,
    responsableTurno: r.responsableTurno as string | null,
    horaSalida: null,
    iph: r.iph as string | null,
    folioTablet: null,
    apellidoPaterno: r.apellidoPaterno as string | null,
    apellidoMaterno: r.apellidoMaterno as string | null,
    nombre: r.nombre as string | null,
    fechaNacimiento: r.fechaNacimiento as string | null,
    edad: r.edad as number | null,
    genero: r.genero as string | null,
    alias: r.alias as string | null,
    ciudadOrigen: r.ciudadOrigen as string | null,
    calleDet: r.calleDet as string | null,
    numero: r.numero as string | null,
    coloniaDet: r.coloniaDet as string | null,
    articulo: r.articulo as string | null,
    tipoFalta: r.tipoFalta as string | null,
    rnd: r.rnd as string | null,
    lugarArresto: r.lugarArresto as string | null,
    colonia: r.colonia as string | null,
    oficialQueRemite: r.oficialQueRemite as string | null,
    oficialQueRemite2: null,
    sector: r.sector as string | null,
    agrupamiento: r.agrupamiento as string | null,
    latitud: r.latitud as number | null,
    longitud: r.longitud as number | null,
    presencia: Boolean(r.presencia),
    verbalizacion: Boolean(r.verbalizacion),
    controlContacto: Boolean(r.controlContacto),
    controlFisico: Boolean(r.controlFisico),
    tecnicasNoLetales: Boolean(r.tecnicasNoLetales),
    fuerzaLetal: Boolean(r.fuerzaLetal),
  }
}

const SELECT_BASE = `
  SELECT
    iph.id AS id,
    COALESCE(iph.fecha_reporte, rd.fecha_reporte) AS fecha,
    COALESCE(iph.hora_reporte, rd.hora_reporte) AS hora,
    iph.rt_responsable AS "responsableTurno",
    COALESCE(rd.iph, iph.folio_iph) AS iph,
    da.ap_paterno_detenido AS "apellidoPaterno",
    da.ap_materno_detenido AS "apellidoMaterno",
    da.nombre_detenido AS nombre,
    iph.fecha_nacimiento AS "fechaNacimiento",
    iph.edad AS edad,
    iph.genero AS genero,
    iph.alias AS alias,
    iph.ciudad_origen AS "ciudadOrigen",
    iph.calle_detenido AS "calleDet",
    iph.numero_detenido AS numero,
    iph.colonia_detenido AS "coloniaDet",
    iph.articulo AS articulo,
    iph.tipo_falta AS "tipoFalta",
    iph.rnd AS rnd,
    iph.calle_arresto AS "lugarArresto",
    iph.colonia_arresto AS colonia,
    iph.agente_aprehensor AS "oficialQueRemite",
    COALESCE(iph.sector_arresto, rd.sector) AS sector,
    iph.agrupamiento_arresto AS agrupamiento,
    iph.latitud_arresto AS latitud,
    iph.longitud_arresto AS longitud,
    iph.presencia AS presencia,
    iph.verbalizacion AS verbalizacion,
    iph.control_contacto AS "controlContacto",
    iph.control_fisico AS "controlFisico",
    iph.tecnicas_no_letales AS "tecnicasNoLetales",
    iph.fuerza_letal AS "fuerzaLetal"
  FROM iph_detenidos iph
  LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
  LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
`

export async function listarFaltasAdministrativas(): Promise<FaltaAdministrativaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_BASE} ORDER BY fecha DESC NULLS LAST, hora DESC NULLS LAST`,
  )
  return result.rows.map(rowToFaltaAdministrativa)
}

export async function listarFaltasAdministrativasParaExportar(): Promise<FaltaAdministrativaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_BASE} ORDER BY fecha ASC NULLS LAST, hora ASC NULLS LAST`,
  )
  return result.rows.map(rowToFaltaAdministrativa)
}
```

Ajusta el import de `query` al patrón real de conexión que uses en `lib/monitorista/repository.ts` (mismo helper, mismo estilo — no inventes un cliente nuevo).

## Verificación

1. `npx tsc --noEmit` en el nuevo módulo (no debe romper nada existente).
2. Prueba puntual: un script temporal (bórralo al terminar) que llame `listarFaltasAdministrativas()` contra la BD real y confirme que trae filas si hay registros en `iph_detenidos`, y que los nombres vienen poblados cuando el `reporte_denuncia_id` resuelve hasta `ofi_detalles_asegurados`.

## Criterios de aceptación

- Las 34 columnas del mapa en `00-contexto.md` tienen un campo correspondiente en `FaltaAdministrativaRow` (los 3 GAP quedan `null` explícitamente, no se omiten del tipo).
- El JOIN calca `obtenerPrellenadoCompleto()` — mismas tablas, mismas claves de join.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 2.**
