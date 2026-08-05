# Etapa 1 — Capa de datos

Leer primero `00-contexto.md` completo (mapa de columnas y decisiones). Esta etapa **no toca UI**.

## Archivos a modificar (no crear módulo nuevo)

- `lib/formatos-udai/types.ts` — agregar 2 interfaces nuevas.
- `lib/formatos-udai/repository.ts` — agregar 4 funciones nuevas + 2 `SELECT_BASE` nuevos. No tocar lo que ya existe (`FaltaAdministrativaRow`, `rowToFaltaAdministrativa`, `SELECT_BASE`, `listarFaltasAdministrativas*`).

## 1. Tipos — agregar a `lib/formatos-udai/types.ts`

```ts
export interface ReporteIncidenciaRow {
  id: string
  iph: string | null
  folio911: string | null           // fantasma — ver 00-contexto.md
  fechaEvento: string | null
  fechaReporte2: string | null
  diaEvento: string | null          // fantasma
  horaReporte: string | null
  horaInicioEvento: string | null   // fantasma
  horaFinalEvento: string | null    // fantasma
  horaPromedio: string | null       // fantasma
  delito: string | null
  articulosObjetos: string | null
  modus: string | null              // fantasma
  calle: string | null
  numeroReferencia: string | null
  colonia: string | null
  sector: string | null
  rt: string | null
  turno: string | null
  crp: string | null
  afectado: string | null
  calleAfec: string | null
  numeroAfec: string | null
  coloniaAfec: string | null
  telefonoAfec: string | null       // fantasma
  marca: string | null
  submarca: string | null
  tipo: string | null
  color: string | null
  placas: string | null
  estado: string | null
  niv: string | null
  motor: string | null
  modelo: string | null
  apNuc: string | null              // fantasma
  fuero: string | null
  latitud: number | null
  longitud: number | null
  agenteAprehensor: string | null
}

export interface PuestaDisposicionRow {
  id: string
  iph: string | null
  folio911: string | null           // fantasma
  fechaEvento: string | null
  diaEvento: string | null          // fantasma
  horaEvento: string | null         // GAP — siempre null, ver 00-contexto.md
  delito: string | null
  articulosObjetos: string | null
  modus: string | null              // fantasma
  calle: string | null
  numeroReferencia: string | null
  colonia: string | null
  sector: string | null
  rt: string | null
  turno: string | null
  crp: string | null
  agrupamiento: string | null
  afectado: string | null
  calleAfec: string | null
  numeroAfec: string | null
  coloniaAfec: string | null
  marca: string | null
  submarca: string | null
  tipo: string | null
  color: string | null
  placas: string | null
  estado: string | null
  niv: string | null
  motor: string | null
  modelo: string | null
  detenido: string | null
  alias: string | null
  fechaNacimiento: string | null
  edad: number | null
  sexo: string | null
  calleDet: string | null
  numeroDet: string | null
  coloniaDet: string | null
  latitud: number | null
  longitud: number | null
  municipio: string | null          // enlace estructural existe, dato escaso hoy
  originario: string | null         // dato escaso hoy (2/14)
  nucCu: string | null              // best-fit -> da.curp, confirmar en 00-contexto.md
  fuero: string | null
  folioRnd: string | null
  latitud2: string | null           // best-fit -> latitud_hecho (fantasma), confirmar
  longitud3: string | null          // best-fit -> longitud_hecho (fantasma), confirmar
  agenteAprehensor: string | null
  fechaIngreso: string | null       // GAP — siempre null
  fechaSalida: string | null        // GAP — siempre null
  otroDelito: string | null         // GAP — siempre null
  masc: string | null               // GAP — siempre null
  umecas: string | null             // GAP — siempre null
}
```

Nota: `latitud2`/`longitud3` se tipan `string | null` (no `number`) porque son columnas duplicadas del template oficial sin semántica numérica confirmada — se muestran tal cual, sin operaciones aritméticas encima. Si se prefiere `number | null` para consistencia con `latitud`/`longitud`, es un cambio menor y aceptable.

## 2. Repository — agregar a `lib/formatos-udai/repository.ts`

Reusar el mismo patrón del `SELECT_BASE` existente (alias `iph`, `rd`, `rc`, `da`). Para `PuestaDisposicionRow` se agrega un JOIN nuevo a `incidentes`.

```ts
import type { FaltaAdministrativaRow, ReporteIncidenciaRow, PuestaDisposicionRow } from './types'

function rowToReporteIncidencia(r: Record<string, unknown>): ReporteIncidenciaRow {
  return {
    id: r.id as string,
    iph: r.iph as string | null,
    folio911: r.folio911 as string | null,
    fechaEvento: r.fechaEvento as string | null,
    fechaReporte2: r.fechaReporte2 as string | null,
    diaEvento: r.diaEvento as string | null,
    horaReporte: r.horaReporte as string | null,
    horaInicioEvento: r.horaInicioEvento as string | null,
    horaFinalEvento: r.horaFinalEvento as string | null,
    horaPromedio: r.horaPromedio as string | null,
    delito: r.delito as string | null,
    articulosObjetos: r.articulosObjetos as string | null,
    modus: r.modus as string | null,
    calle: r.calle as string | null,
    numeroReferencia: r.numeroReferencia as string | null,
    colonia: r.colonia as string | null,
    sector: r.sector as string | null,
    rt: r.rt as string | null,
    turno: r.turno as string | null,
    crp: r.crp as string | null,
    afectado: r.afectado as string | null,
    calleAfec: r.calleAfec as string | null,
    numeroAfec: r.numeroAfec as string | null,
    coloniaAfec: r.coloniaAfec as string | null,
    telefonoAfec: r.telefonoAfec as string | null,
    marca: r.marca as string | null,
    submarca: r.submarca as string | null,
    tipo: r.tipo as string | null,
    color: r.color as string | null,
    placas: r.placas as string | null,
    estado: r.estado as string | null,
    niv: r.niv as string | null,
    motor: r.motor as string | null,
    modelo: r.modelo as string | null,
    apNuc: r.apNuc as string | null,
    fuero: r.fuero as string | null,
    latitud: r.latitud as number | null,
    longitud: r.longitud as number | null,
    agenteAprehensor: r.agenteAprehensor as string | null,
  }
}

const SELECT_INCIDENCIA = `
  SELECT
    iph.id AS id,
    COALESCE(rd.iph, iph.folio_iph) AS iph,
    iph.folio_911 AS "folio911",
    iph.fecha_evento::text AS "fechaEvento",
    iph.fecha_reporte::text AS "fechaReporte2",
    iph.dia_evento AS "diaEvento",
    iph.hora_reporte::text AS "horaReporte",
    iph.hora_inicio_evento::text AS "horaInicioEvento",
    iph.hora_final_evento::text AS "horaFinalEvento",
    iph.hora_promedio::text AS "horaPromedio",
    iph.delito AS delito,
    iph.articulos_objetos AS "articulosObjetos",
    iph.modus_operandi AS modus,
    iph.calle_hecho AS calle,
    iph.numero_hecho AS "numeroReferencia",
    iph.colonia_hecho AS colonia,
    COALESCE(iph.sector_hecho, iph.sector_arresto) AS sector,
    iph.rt_responsable AS rt,
    iph.turno_responsable AS turno,
    iph.crp_unidad AS crp,
    iph.nombre_afectado AS afectado,
    iph.calle_afectado AS "calleAfec",
    iph.numero_afectado AS "numeroAfec",
    iph.colonia_afectado AS "coloniaAfec",
    iph.telefono_afectado AS "telefonoAfec",
    iph.marca_vehiculo AS marca,
    iph.submarca_vehiculo AS submarca,
    iph.tipo_vehiculo AS tipo,
    iph.color_vehiculo AS color,
    iph.placas_vehiculo AS placas,
    iph.estado_vehiculo AS estado,
    iph.niv_vehiculo AS niv,
    iph.motor_vehiculo AS motor,
    iph.modelo_vehiculo AS modelo,
    iph.ap_nuc AS "apNuc",
    iph.fuero AS fuero,
    COALESCE(iph.latitud_hecho, iph.latitud_arresto) AS latitud,
    COALESCE(iph.longitud_hecho, iph.longitud_arresto) AS longitud,
    iph.agente_aprehensor AS "agenteAprehensor"
  FROM iph_detenidos iph
  LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
`

export async function listarReportesIncidencia(): Promise<ReporteIncidenciaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_INCIDENCIA} ORDER BY "fechaEvento" DESC NULLS LAST, "horaReporte" DESC NULLS LAST`,
  )
  return result.rows.map(rowToReporteIncidencia)
}

export async function listarReportesIncidenciaParaExportar(): Promise<ReporteIncidenciaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_INCIDENCIA} ORDER BY "fechaEvento" ASC NULLS LAST, "horaReporte" ASC NULLS LAST`,
  )
  return result.rows.map(rowToReporteIncidencia)
}

function rowToPuestaDisposicion(r: Record<string, unknown>): PuestaDisposicionRow {
  return {
    id: r.id as string,
    iph: r.iph as string | null,
    folio911: r.folio911 as string | null,
    fechaEvento: r.fechaEvento as string | null,
    diaEvento: r.diaEvento as string | null,
    horaEvento: null,
    delito: r.delito as string | null,
    articulosObjetos: r.articulosObjetos as string | null,
    modus: r.modus as string | null,
    calle: r.calle as string | null,
    numeroReferencia: r.numeroReferencia as string | null,
    colonia: r.colonia as string | null,
    sector: r.sector as string | null,
    rt: r.rt as string | null,
    turno: r.turno as string | null,
    crp: r.crp as string | null,
    agrupamiento: r.agrupamiento as string | null,
    afectado: r.afectado as string | null,
    calleAfec: r.calleAfec as string | null,
    numeroAfec: r.numeroAfec as string | null,
    coloniaAfec: r.coloniaAfec as string | null,
    marca: r.marca as string | null,
    submarca: r.submarca as string | null,
    tipo: r.tipo as string | null,
    color: r.color as string | null,
    placas: r.placas as string | null,
    estado: r.estado as string | null,
    niv: r.niv as string | null,
    motor: r.motor as string | null,
    modelo: r.modelo as string | null,
    detenido: r.detenido as string | null,
    alias: r.alias as string | null,
    fechaNacimiento: r.fechaNacimiento as string | null,
    edad: r.edad as number | null,
    sexo: r.sexo as string | null,
    calleDet: r.calleDet as string | null,
    numeroDet: r.numeroDet as string | null,
    coloniaDet: r.coloniaDet as string | null,
    latitud: r.latitud as number | null,
    longitud: r.longitud as number | null,
    municipio: r.municipio as string | null,
    originario: r.originario as string | null,
    nucCu: r.nucCu as string | null,
    fuero: r.fuero as string | null,
    folioRnd: r.folioRnd as string | null,
    latitud2: r.latitud2 as string | null,
    longitud3: r.longitud3 as string | null,
    agenteAprehensor: r.agenteAprehensor as string | null,
    fechaIngreso: null,
    fechaSalida: null,
    otroDelito: null,
    masc: null,
    umecas: null,
  }
}

const SELECT_PUESTA_DISPOSICION = `
  SELECT
    iph.id AS id,
    COALESCE(rd.iph, iph.folio_iph) AS iph,
    iph.folio_911 AS "folio911",
    iph.fecha_evento::text AS "fechaEvento",
    iph.dia_evento AS "diaEvento",
    iph.delito AS delito,
    iph.articulos_objetos AS "articulosObjetos",
    iph.modus_operandi AS modus,
    iph.calle_hecho AS calle,
    iph.numero_hecho AS "numeroReferencia",
    iph.colonia_hecho AS colonia,
    COALESCE(iph.sector_hecho, iph.sector_arresto) AS sector,
    iph.rt_responsable AS rt,
    iph.turno_responsable AS turno,
    iph.crp_unidad AS crp,
    iph.agrupamiento_arresto AS agrupamiento,
    iph.nombre_afectado AS afectado,
    iph.calle_afectado AS "calleAfec",
    iph.numero_afectado AS "numeroAfec",
    iph.colonia_afectado AS "coloniaAfec",
    iph.marca_vehiculo AS marca,
    iph.submarca_vehiculo AS submarca,
    iph.tipo_vehiculo AS tipo,
    iph.color_vehiculo AS color,
    iph.placas_vehiculo AS placas,
    iph.estado_vehiculo AS estado,
    iph.niv_vehiculo AS niv,
    iph.motor_vehiculo AS motor,
    iph.modelo_vehiculo AS modelo,
    NULLIF(TRIM(CONCAT_WS(' ', da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido)), '') AS detenido,
    iph.alias AS alias,
    iph.fecha_nacimiento::text AS "fechaNacimiento",
    iph.edad AS edad,
    iph.genero AS sexo,
    iph.calle_detenido AS "calleDet",
    iph.numero_detenido AS "numeroDet",
    iph.colonia_detenido AS "coloniaDet",
    iph.latitud_arresto AS latitud,
    iph.longitud_arresto AS longitud,
    inc.municipio AS municipio,
    da.originario AS originario,
    da.curp AS "nucCu",
    iph.fuero AS fuero,
    iph.rnd AS "folioRnd",
    iph.latitud_hecho::text AS latitud2,
    iph.longitud_hecho::text AS longitud3,
    iph.agente_aprehensor AS "agenteAprehensor"
  FROM iph_detenidos iph
  LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
  LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
  LEFT JOIN incidentes inc ON inc.id = rc.incidente_id
`

export async function listarPuestasDisposicion(): Promise<PuestaDisposicionRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_PUESTA_DISPOSICION} ORDER BY "fechaEvento" DESC NULLS LAST`,
  )
  return result.rows.map(rowToPuestaDisposicion)
}

export async function listarPuestasDisposicionParaExportar(): Promise<PuestaDisposicionRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_PUESTA_DISPOSICION} ORDER BY "fechaEvento" ASC NULLS LAST`,
  )
  return result.rows.map(rowToPuestaDisposicion)
}
```

## Notas de implementación

- `iph.hora_promedio`, `hora_inicio_evento`, `hora_final_evento`, `dia_evento`, `folio_911`, `ap_nuc`, `modus_operandi`, `telefono_afectado` van a salir `null` en **todos** los registros actuales — es esperado (columnas fantasma, ver `00-contexto.md`). No es un bug de la query.
- `latitud_hecho`/`longitud_hecho` se castean a texto (`::text`) en vez de traerlos como `number`, porque hoy están siempre `NULL` y no se hace ninguna operación aritmética sobre `latitud2`/`longitud3` en el reporte — son de solo lectura/visualización.
- No agregar `ORDER BY` con columnas que no estén en el `SELECT` (Postgres lo permite por alias, ya está resuelto arriba usando los alias entre comillas).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. Un script ad-hoc (`npx tsx` con `dotenv.config()` + `import pool from './lib/db'`, igual que se usó para explorar) confirma que `listarReportesIncidencia()` y `listarPuestasDisposicion()` devuelven 10 filas cada una (mismo universo que `iph_detenidos`), sin lanzar excepción. Borrar el script ad-hoc al terminar, no commitear.
3. No se modificó ninguna función/tipo existente de `formatos-udai` (`FaltaAdministrativaRow`, `rowToFaltaAdministrativa`, `SELECT_BASE`, `listarFaltasAdministrativas`, `listarFaltasAdministrativasParaExportar`).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
