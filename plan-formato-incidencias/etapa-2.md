# Etapa 2 — Capa de datos: consulta unificada + acción de guardado

Depende de Etapa 1. Leer `00-contexto.md` completo — en particular la cadena de JOIN y la advertencia sobre las llaves inconsistentes de `ofi_vehiculos`/`ofi_detenidos`. Esta etapa no toca UI.

## Archivos a modificar/crear

- `lib/formatos-udai/types.ts` — agregar `ReporteIncidenciaCompleto` (reemplaza cualquier tipo previo de una revisión anterior de este plan si ya se llegó a escribir).
- `lib/formatos-udai/repository.ts` — agregar `listarReportesIncidencia()` y `listarReportesIncidenciaParaExportar()`, ancladas en `incidentes`, **sin `iph_detenidos`**.
- `lib/formatos-udai/actions.ts` — crear, con `guardarComplementoIncidencia()` (un solo `UPSERT`, ya no hay `UPDATE` a `iph_detenidos` porque esa tabla salió de la cadena).

No tocar nada de Faltas Administrativas.

## 1. Tipo — `lib/formatos-udai/types.ts`

```ts
export type EstadoCompletitudIncidencia = 'pendiente' | 'completa'

export interface ReporteIncidenciaCompleto {
  id: string // incidentes.id
  estadoCompletitud: EstadoCompletitudIncidencia
  completadoEn: string | null

  iph: string | null
  folio911: string | null
  fechaEvento: string | null
  diaEvento: string | null            // calculado
  fechaReporte2: string | null
  horaReporte: string | null
  horaInicioEvento: string | null
  horaFinalEvento: string | null
  horaPromedio: string | null         // calculado
  delito: string | null
  articulosObjetos: string | null
  modus: string | null
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
  telefonoAfec: string | null
  marca: string | null
  submarca: string | null
  tipo: string | null
  color: string | null
  placas: string | null
  estadoVehiculo: string | null
  niv: string | null
  motor: string | null
  modelo: string | null
  apNuc: string | null
  fuero: string | null
  latitud: string | null
  longitud: string | null
  agenteAprehensor: string | null
  agrupamiento: string | null
  detenido: string | null
  alias: string | null
  fechaNacimiento: string | null
  edad: number | null
  sexo: string | null
  calleDet: string | null
  numeroDet: string | null
  coloniaDet: string | null
  municipio: string | null
  originario: string | null
  nucCu: string | null
  folioRnd: string | null
  latitud2: string | null
  longitud3: string | null
  fechaIngreso: string | null
  fechaSalida: string | null
  otroDelito: string | null
  masc: string | null
  umecas: string | null
}
```

## 2. Repository — `lib/formatos-udai/repository.ts`

```ts
import type { ReporteIncidenciaCompleto } from './types'

const DIAS_SEMANA = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

function calcularDiaEvento(fechaEvento: string | null): string | null {
  if (!fechaEvento) return null
  const m = fechaEvento.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const fecha = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return DIAS_SEMANA[fecha.getUTCDay()]
}

function calcularHoraPromedio(inicio: string | null, final: string | null): string | null {
  if (!inicio || !final) return null
  const [hi, mi] = inicio.split(':').map(Number)
  const [hf, mf] = final.split(':').map(Number)
  const promedio = Math.round(((hi * 60 + mi) + (hf * 60 + mf)) / 2)
  const h = Math.floor(promedio / 60) % 24
  const min = promedio % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`
}

function calcularFuero(grupoAdscripcion: string | null, override: string | null): string | null {
  if (override) return override
  if (!grupoAdscripcion) return null
  return grupoAdscripcion.toUpperCase().includes('FEDERAL') ? 'FEDERAL' : 'COMÚN'
}

// El reporte de campo captura vehículo/detenido como JSON sin esquema fijo —
// llaves observadas varían entre "placa"/"placas", "marca" a veces ausente,
// "submarca"/"niv"/"motor"/"estado" casi nunca presentes. Leer con variantes.
interface VehiculoJson {
  marca?: string; submarca?: string; tipo?: string; color?: string
  placa?: string; placas?: string; niv?: string; motor?: string; modelo?: string; estado?: string
}
interface DetenidoJson {
  nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string
}

function primerVehiculo(raw: unknown): VehiculoJson | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  return raw[0] as VehiculoJson
}
function primerDetenidoJson(raw: unknown): DetenidoJson | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  return raw[0] as DetenidoJson
}

function rowToReporteIncidencia(r: Record<string, unknown>): ReporteIncidenciaCompleto {
  const horaInicioEvento = r.horaInicioEvento as string | null
  const horaFinalEvento = r.horaFinalEvento as string | null
  const fechaEvento = r.fechaEvento as string | null
  const lat = (r.latitud as string | null)
  const lon = (r.longitud as string | null)

  const vehiculoJson = primerVehiculo(r.ofiVehiculos)
  const detenidoJson = primerDetenidoJson(r.ofiDetenidos)

  const nombreAnalisis = [r.daNombre, r.daApPaterno, r.daApMaterno].filter(Boolean).join(' ').trim()
  const nombreCampo = detenidoJson
    ? [detenidoJson.nombre, detenidoJson.apellidoPaterno, detenidoJson.apellidoMaterno].filter(Boolean).join(' ').trim()
    : ''

  return {
    id: r.id as string,
    estadoCompletitud: r.completadoEn ? 'completa' : 'pendiente',
    completadoEn: r.completadoEn as string | null,
    iph: r.iph as string | null,
    folio911: r.folio911 as string | null,
    fechaEvento,
    diaEvento: calcularDiaEvento(fechaEvento),
    fechaReporte2: r.fechaReporte2 as string | null,
    horaReporte: r.horaReporte as string | null,
    horaInicioEvento,
    horaFinalEvento,
    horaPromedio: calcularHoraPromedio(horaInicioEvento, horaFinalEvento),
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
    marca: (r.compMarca as string | null) ?? vehiculoJson?.marca ?? null,
    submarca: (r.compSubmarca as string | null) ?? vehiculoJson?.submarca ?? null,
    tipo: (r.compTipoVehiculo as string | null) ?? vehiculoJson?.tipo ?? null,
    color: (r.compColor as string | null) ?? vehiculoJson?.color ?? null,
    placas: (r.compPlacas as string | null) ?? vehiculoJson?.placas ?? vehiculoJson?.placa ?? null,
    estadoVehiculo: (r.compEstadoVehiculo as string | null) ?? vehiculoJson?.estado ?? null,
    niv: (r.compNiv as string | null) ?? vehiculoJson?.niv ?? null,
    motor: (r.compMotor as string | null) ?? vehiculoJson?.motor ?? null,
    modelo: (r.compModelo as string | null) ?? vehiculoJson?.modelo ?? null,
    apNuc: r.apNuc as string | null,
    fuero: calcularFuero(r.grupoAdscripcion as string | null, r.fueroOverride as string | null),
    latitud: lat,
    longitud: lon,
    agenteAprehensor: r.agenteAprehensor as string | null,
    agrupamiento: r.agrupamiento as string | null,
    detenido: nombreAnalisis || nombreCampo || null,
    alias: r.alias as string | null,
    fechaNacimiento: (r.daFechaNacimiento as string | null) ?? (r.compFechaNacimiento as string | null),
    edad: r.edad as number | null,
    sexo: (r.daGenero as string | null) ?? (r.compSexo as string | null),
    calleDet: (r.daCalle as string | null) ?? (r.compCalleDet as string | null),
    numeroDet: (r.daNumero as string | null) ?? (r.compNumeroDet as string | null),
    coloniaDet: (r.daColonia as string | null) ?? (r.compColoniaDet as string | null),
    municipio: r.municipio as string | null,
    originario: (r.daOriginario as string | null) ?? (r.compOriginario as string | null),
    nucCu: (r.compNucCu as string | null) ?? (r.daCurp as string | null),
    folioRnd: r.folioRnd as string | null,
    latitud2: lat,
    longitud3: lon,
    fechaIngreso: r.fechaIngreso as string | null,
    fechaSalida: r.fechaSalida as string | null,
    otroDelito: r.otroDelito as string | null,
    masc: r.masc as string | null,
    umecas: r.umecas as string | null,
  }
}

const SELECT_REPORTE_INCIDENCIA = `
  SELECT
    inc.id AS id,
    rd.iph AS iph,
    inc.folio AS "folio911",
    inc.fecha_hora_inicio::date::text AS "fechaEvento",
    rd.fecha_reporte::text AS "fechaReporte2",
    rd.hora_reporte::text AS "horaReporte",
    inc.fecha_hora_inicio::time::text AS "horaInicioEvento",
    inc.fecha_hora_fin::time::text AS "horaFinalEvento",
    COALESCE(rd.delito, rc.delito) AS delito,
    comp.articulos_objetos AS "articulosObjetos",
    rc.modus_operandi AS modus,
    rc.ofi_calle AS calle,
    rc.ofi_referencia AS "numeroReferencia",
    rc.ofi_colonia AS colonia,
    rd.sector AS sector,
    comp.rt AS rt,
    comp.turno AS turno,
    rd.crp AS crp,
    afe.nombre AS afectado,
    comp.calle_afec AS "calleAfec",
    comp.numero_afec AS "numeroAfec",
    comp.colonia_afec AS "coloniaAfec",
    inc.telefono_reportante AS "telefonoAfec",
    rc.ofi_vehiculos AS "ofiVehiculos",
    rc.ofi_detenidos AS "ofiDetenidos",
    comp.marca AS "compMarca",
    comp.submarca AS "compSubmarca",
    comp.tipo_vehiculo AS "compTipoVehiculo",
    comp.color AS "compColor",
    comp.placas AS "compPlacas",
    comp.estado_vehiculo AS "compEstadoVehiculo",
    comp.niv AS "compNiv",
    comp.motor AS "compMotor",
    comp.modelo AS "compModelo",
    comp.ap_nuc AS "apNuc",
    rd.grupo_adscripcion AS "grupoAdscripcion",
    comp.fuero_override AS "fueroOverride",
    COALESCE(rc.ofi_latitud, rd.latitud, inc.latitud)::text AS latitud,
    COALESCE(rc.ofi_longitud, rd.longitud, inc.longitud)::text AS longitud,
    CONCAT_WS(' ', u.name, u.apellido) AS "agenteAprehensor",
    comp.agrupamiento AS agrupamiento,
    da.nombre_detenido AS "daNombre",
    da.ap_paterno_detenido AS "daApPaterno",
    da.ap_materno_detenido AS "daApMaterno",
    da.apodo AS alias,
    da.fecha_nacimiento::text AS "daFechaNacimiento",
    comp.fecha_nacimiento::text AS "compFechaNacimiento",
    comp.edad AS edad,
    da.genero AS "daGenero",
    comp.sexo AS "compSexo",
    da.calle AS "daCalle",
    comp.calle_det AS "compCalleDet",
    da.numero AS "daNumero",
    comp.numero_det AS "compNumeroDet",
    da.colonia AS "daColonia",
    comp.colonia_det AS "compColoniaDet",
    inc.municipio AS municipio,
    da.originario AS "daOriginario",
    comp.originario AS "compOriginario",
    comp.nuc_cu AS "compNucCu",
    da.curp AS "daCurp",
    comp.folio_rnd AS "folioRnd",
    COALESCE(
      comp.fecha_ingreso,
      CASE WHEN pd.hora_llegada_sede IS NOT NULL THEN (inc.fecha_hora_inicio::date + pd.hora_llegada_sede)::timestamptz END
    )::text AS "fechaIngreso",
    COALESCE(
      comp.fecha_salida,
      CASE WHEN pd.hora_inicio_traslado IS NOT NULL THEN (inc.fecha_hora_inicio::date + pd.hora_inicio_traslado)::timestamptz END
    )::text AS "fechaSalida",
    comp.otro_delito AS "otroDelito",
    comp.masc AS masc,
    comp.umecas AS umecas,
    comp.completado_en::text AS "completadoEn"
  FROM incidentes inc
  LEFT JOIN ofi_reportes_campo rc ON rc.incidente_id = inc.id
  LEFT JOIN ofi_reporte_denuncia rd ON rd.incidente_id = inc.id
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
  LEFT JOIN ofi_puesta_disposicion pd ON pd.reporte_campo_id = rc.id
  LEFT JOIN ofi_oficiales ofic ON ofic.id = rc.ofi_oficial_id
  LEFT JOIN users u ON u.id = ofic.user_id
  LEFT JOIN incidente_personas_afectadas afe ON afe.incidente_id = inc.id
  LEFT JOIN formato_incidencia_complemento comp ON comp.incidente_id = inc.id
  WHERE inc.estatus IN ('atendido', 'cerrado_detencion')
`

export async function listarReportesIncidencia(): Promise<ReporteIncidenciaCompleto[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_REPORTE_INCIDENCIA} ORDER BY inc.fecha_hora_inicio DESC`,
  )
  return result.rows.map(rowToReporteIncidencia)
}

export async function listarReportesIncidenciaParaExportar(): Promise<ReporteIncidenciaCompleto[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_REPORTE_INCIDENCIA} AND comp.completado_en IS NOT NULL ORDER BY inc.fecha_hora_inicio ASC`,
  )
  return result.rows.map(rowToReporteIncidencia)
}
```

**Nota sobre `users`**: revisar que la columna se llame `name`/`apellido` (así aparece usada en `app/formatos-udai/page.tsx:16` — `session.user as { name: string; apellido?: string; email: string }`). Si el esquema real de `users` usa otros nombres de columna, ajustar el `CONCAT_WS` a lo real.

**Nota sobre `incidente_personas_afectadas`**: no tiene FK de vuelta a `ofi_reportes_campo`, solo a `incidente_id` — si un incidente tiene más de una persona afectada, este `JOIN` duplica la fila del incidente (una por afectado). Hoy hay 1 sola fila en toda la tabla, así que no se manifiesta, pero si el volumen crece hay que decidir cómo colapsar (ej. tomar solo la primera, o mover a un LATERAL con LIMIT 1) — se deja como limitación conocida, no se resuelve preventivamente.

## 3. Server action — crear `lib/formatos-udai/actions.ts`

Un solo `UPSERT` (ya no hay `UPDATE` a otra tabla, porque `iph_detenidos` no es parte de la cadena):

```ts
'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { tienePermiso } from './permisos'

export interface ComplementoIncidenciaInput {
  incidenteId: string
  rt?: string | null
  turno?: string | null
  articulosObjetos?: string | null
  apNuc?: string | null
  calleAfec?: string | null
  numeroAfec?: string | null
  coloniaAfec?: string | null
  fueroOverride?: string | null
  agrupamiento?: string | null
  folioRnd?: string | null
  originario?: string | null
  nucCu?: string | null
  edad?: number | null
  fechaNacimiento?: string | null
  sexo?: string | null
  calleDet?: string | null
  numeroDet?: string | null
  coloniaDet?: string | null
  marca?: string | null
  submarca?: string | null
  tipoVehiculo?: string | null
  color?: string | null
  placas?: string | null
  estadoVehiculo?: string | null
  niv?: string | null
  motor?: string | null
  modelo?: string | null
  fechaIngreso?: string | null
  fechaSalida?: string | null
  otroDelito?: string | null
  masc?: string | null
  umecas?: string | null
  marcarCompleto: boolean
}

export async function guardarComplementoIncidencia(input: ComplementoIncidenciaInput): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'editar'))) throw new Error('No autorizado')

  const campos = { ...input }
  delete (campos as Partial<ComplementoIncidenciaInput>).incidenteId
  delete (campos as Partial<ComplementoIncidenciaInput>).marcarCompleto

  await query(
    `INSERT INTO formato_incidencia_complemento (
       incidente_id, rt, turno, articulos_objetos, ap_nuc, calle_afec, numero_afec, colonia_afec,
       fuero_override, agrupamiento, folio_rnd, originario, nuc_cu, edad, fecha_nacimiento, sexo,
       calle_det, numero_det, colonia_det, marca, submarca, tipo_vehiculo, color, placas,
       estado_vehiculo, niv, motor, modelo, fecha_ingreso, fecha_salida, otro_delito, masc, umecas,
       completado_en, completado_por, actualizado_en
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,NOW())
     ON CONFLICT (incidente_id) DO UPDATE SET
       rt = EXCLUDED.rt, turno = EXCLUDED.turno, articulos_objetos = EXCLUDED.articulos_objetos,
       ap_nuc = EXCLUDED.ap_nuc, calle_afec = EXCLUDED.calle_afec, numero_afec = EXCLUDED.numero_afec,
       colonia_afec = EXCLUDED.colonia_afec, fuero_override = EXCLUDED.fuero_override,
       agrupamiento = EXCLUDED.agrupamiento, folio_rnd = EXCLUDED.folio_rnd, originario = EXCLUDED.originario,
       nuc_cu = EXCLUDED.nuc_cu, edad = EXCLUDED.edad, fecha_nacimiento = EXCLUDED.fecha_nacimiento,
       sexo = EXCLUDED.sexo, calle_det = EXCLUDED.calle_det, numero_det = EXCLUDED.numero_det,
       colonia_det = EXCLUDED.colonia_det, marca = EXCLUDED.marca, submarca = EXCLUDED.submarca,
       tipo_vehiculo = EXCLUDED.tipo_vehiculo, color = EXCLUDED.color, placas = EXCLUDED.placas,
       estado_vehiculo = EXCLUDED.estado_vehiculo, niv = EXCLUDED.niv, motor = EXCLUDED.motor,
       modelo = EXCLUDED.modelo, fecha_ingreso = EXCLUDED.fecha_ingreso, fecha_salida = EXCLUDED.fecha_salida,
       otro_delito = EXCLUDED.otro_delito, masc = EXCLUDED.masc, umecas = EXCLUDED.umecas,
       completado_en = COALESCE(EXCLUDED.completado_en, formato_incidencia_complemento.completado_en),
       completado_por = COALESCE(EXCLUDED.completado_por, formato_incidencia_complemento.completado_por),
       actualizado_en = NOW()`,
    [
      input.incidenteId, campos.rt ?? null, campos.turno ?? null, campos.articulosObjetos ?? null,
      campos.apNuc ?? null, campos.calleAfec ?? null, campos.numeroAfec ?? null, campos.coloniaAfec ?? null,
      campos.fueroOverride ?? null, campos.agrupamiento ?? null, campos.folioRnd ?? null, campos.originario ?? null,
      campos.nucCu ?? null, campos.edad ?? null, campos.fechaNacimiento ?? null, campos.sexo ?? null,
      campos.calleDet ?? null, campos.numeroDet ?? null, campos.coloniaDet ?? null, campos.marca ?? null,
      campos.submarca ?? null, campos.tipoVehiculo ?? null, campos.color ?? null, campos.placas ?? null,
      campos.estadoVehiculo ?? null, campos.niv ?? null, campos.motor ?? null, campos.modelo ?? null,
      campos.fechaIngreso ?? null, campos.fechaSalida ?? null, campos.otroDelito ?? null, campos.masc ?? null,
      campos.umecas ?? null,
      input.marcarCompleto ? new Date().toISOString() : null,
      input.marcarCompleto ? session.user.id : null,
    ],
  )

  revalidatePath('/formatos-udai/reportes-incidencias')
}
```

`marcarCompleto: false` conserva el `completado_en`/`completado_por` previos si ya existían (no "desmarca" — misma regla que en la revisión anterior de este plan).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Script ad-hoc (`dotenv.config()` + `import pool from './lib/db'`, borrar al terminar) confirma que `listarReportesIncidencia()` devuelve exactamente **7 filas** (los incidentes reales con `estatus IN ('atendido','cerrado_detencion')` verificados en esta investigación), todas `estadoCompletitud: 'pendiente'`.
3. Para el incidente `SSPM/INC/2026/007`, confirmar que `folio911`, `fechaEvento`, `horaInicioEvento`, `sector`, `crp`, `latitud`/`longitud`, `delito` (si `rd.delito` o `rc.delito` tienen valor) y `detenido`/vehículo (desde el JSON) **no** son `null` — son los campos que ya deberían resolverse solos.
4. `guardarComplementoIncidencia()` con `marcarCompleto: true` sobre ese mismo incidente hace que aparezca en `listarReportesIncidenciaParaExportar()`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
