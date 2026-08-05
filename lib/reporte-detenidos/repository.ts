import { query } from '@/lib/db'
import type { DetenidoCompleto, FichaDetenidoCompleta, AntecedenteFicha } from './types'
import { listarAntecedentesExternos } from '@/lib/fiscalia/repository'

function fmtFecha(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return null
    const y = val.getFullYear()
    const m = String(val.getMonth() + 1).padStart(2, '0')
    const d = String(val.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const s = String(val).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

function parseNombreDetenido(raw: unknown): string {
  // Misma lógica que lib/monitorista/mapper.ts / ppt-service.ts — se duplica
  // intencionalmente para no acoplar este módulo de solo lectura a Monitorista
  // (el proyecto ya tiene esta función duplicada 3 veces con el mismo criterio).
  if (typeof raw === 'string') {
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) && arr.length > 0 ? (arr[0].nombre || 'Sin nombre') : 'Sin nombre'
    } catch {
      return String(raw || 'Sin nombre')
    }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw[0].nombre || 'Sin nombre'
  return 'Sin nombre'
}

export async function listarDetenidosCompletos(): Promise<DetenidoCompleto[]> {
  const res = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.delito, rc.marco_legal, rc.falta_administrativa, rc.modus_operandi,
            rc.created_at,
            d.folio_denuncia, d.iph,
            d.delito as delito_denuncia, d.marco_legal as marco_legal_denuncia
     FROM ofi_reporte_denuncia d
     INNER JOIN ofi_reportes_campo rc ON rc.id = d.reporte_campo_id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND (
         SELECT COUNT(DISTINCT ed.tipo_foto) FROM evidencias_detenido ed
         WHERE ed.reporte_campo_id = rc.id
           AND ed.tipo_contenido = 'detenido'
           AND ed.detenido_index = 0
           AND ed.tipo_foto IN ('frontal', 'derecho', 'izquierdo')
       ) = 3
     ORDER BY rc.created_at DESC`,
    [],
  )

  return res.rows.map((row): DetenidoCompleto => ({
    id: String(row.id),
    folio: String(row.folio_reporte_campo || ''),
    folioDenuncia: String(row.folio_denuncia || ''),
    iph: row.iph ? String(row.iph) : null,
    nombre: parseNombreDetenido(row.ofi_detenidos),
    evento: String(row.ofi_tipo_incidente || '—'),
    delito: String(row.delito || row.delito_denuncia || '—'),
    faltaAdministrativa: String(row.falta_administrativa || row.marco_legal || row.marco_legal_denuncia || '—'),
    modusOperandi: String(row.modus_operandi || '—'),
    createdAt: new Date(row.created_at as string).toISOString(),
  }))
}

export interface AntecedenteLocal {
  fecha: string | null
  descripcion: string
  lugar: string | null
}

export async function obtenerAntecedentesLocales(
  reporteCampoIdActual: string,
  curp: string | null,
  nombreCompleto: string,
): Promise<{ delitos: AntecedenteLocal[]; faltas: AntecedenteLocal[] }> {
  const usarCurp = !!curp
  const condicionIdentidad = usarCurp
    ? `da.curp = $2`
    : `LOWER(TRIM(CONCAT(da.nombre_detenido, ' ', COALESCE(da.ap_paterno_detenido, ''), ' ', COALESCE(da.ap_materno_detenido, '')))) = LOWER(TRIM($2))`

  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT rc.id, rc.delito, rc.falta_administrativa, rc.created_at, rc.ofi_colonia
     FROM ofi_detalles_asegurados da
     INNER JOIN ofi_reportes_campo rc ON rc.id = da.reporte_campo_id
     WHERE rc.id <> $1
       AND ${condicionIdentidad}
     ORDER BY rc.created_at DESC`,
    [reporteCampoIdActual, usarCurp ? curp : nombreCompleto],
  )

  const delitos: AntecedenteLocal[] = []
  const faltas: AntecedenteLocal[] = []
  for (const row of result.rows) {
    const fecha = row.created_at ? new Date(row.created_at as string).toISOString().slice(0, 10) : null
    const lugar = row.ofi_colonia ? String(row.ofi_colonia) : null
    if (row.delito) delitos.push({ fecha, descripcion: String(row.delito), lugar })
    if (row.falta_administrativa) faltas.push({ fecha, descripcion: String(row.falta_administrativa), lugar })
  }
  return { delitos, faltas }
}

export async function obtenerFichaCompleta(reporteCampoId: string): Promise<FichaDetenidoCompleta | null> {
  const res = await query<Record<string, unknown>>(
    `SELECT
       rc.id, rc.delito, rc.falta_administrativa, rc.modus_operandi, rc.ofi_observaciones,
       rc.ofi_calle AS lugar_deteccion_calle, rc.ofi_colonia AS lugar_deteccion_colonia,
       rc.ofi_folio_cad, rc.expediente_ci, rc.created_at,
       d.folio_denuncia, d.iph, d.sector, d.num_carpeta_investigacion,
       d.lugar_hecho, d.colonia_hecho, d.fecha_reporte, d.hora_reporte,
       pd.gestion_interna, pd.dependencia_externa,
       da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido,
       da.calle AS domicilio_calle, da.numero AS domicilio_numero, da.colonia AS domicilio_colonia,
       da.apodo, da.curp, da.fecha_nacimiento, da.genero, da.originario,
       da.estado_civil, da.escolaridad, da.ocupacion, da.rasgos_particulares
     FROM ofi_reportes_campo rc
     INNER JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = rc.id
     LEFT JOIN ofi_puesta_disposicion pd ON pd.reporte_campo_id = rc.id
     LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
     WHERE rc.id = $1
     ORDER BY da.created_at ASC
     LIMIT 1`,
    [reporteCampoId],
  )
  if (!res.rows.length) return null
  const row = res.rows[0]

  const nombreCompleto = [row.nombre_detenido, row.ap_paterno_detenido, row.ap_materno_detenido]
    .filter(Boolean).join(' ').trim() || 'Sin nombre'

  const fechaNacimiento = fmtFecha(row.fecha_nacimiento)
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : null

  const domicilio = [row.domicilio_calle, row.domicilio_numero, row.domicilio_colonia]
    .filter(Boolean).join(' ') || '—'

  const lugarDetencion = [row.lugar_deteccion_calle, row.lugar_deteccion_colonia]
    .filter(Boolean).join(', ') || null
  const lugarEvento = [row.lugar_hecho, row.colonia_hecho].filter(Boolean).join(', ') || null

  const puestaDisposicion = row.gestion_interna === true
    ? 'Gestión Interna'
    : (row.dependencia_externa ? String(row.dependencia_externa) : null)

  const [locales, externos] = await Promise.all([
    obtenerAntecedentesLocales(reporteCampoId, row.curp ? String(row.curp) : null, nombreCompleto),
    listarAntecedentesExternos(reporteCampoId),
  ])

  const antecedentesDelitos: AntecedenteFicha[] = [
    ...locales.delitos.map(a => ({ ...a, fuente: 'LOCAL' as const })),
    ...externos.filter(e => e.tipo === 'DELITO').map(e => ({
      fecha: fmtFecha(e.fecha),
      descripcion: String(e.descripcion),
      lugar: e.lugar ? String(e.lugar) : null,
      fuente: 'EXTERNO' as const,
    })),
  ]
  const antecedentesFaltas: AntecedenteFicha[] = [
    ...locales.faltas.map(a => ({ ...a, fuente: 'LOCAL' as const })),
    ...externos.filter(e => e.tipo === 'FALTA_ADMINISTRATIVA').map(e => ({
      fecha: fmtFecha(e.fecha),
      descripcion: String(e.descripcion),
      lugar: e.lugar ? String(e.lugar) : null,
      fuente: 'EXTERNO' as const,
    })),
  ]

  return {
    nombreCompleto,
    apodo: row.apodo ? String(row.apodo) : null,
    folioFicha: String(row.folio_denuncia || ''),
    rubro: String(row.delito || row.falta_administrativa || '—'),
    fechaNacimiento,
    edad,
    genero: row.genero ? String(row.genero) : null,
    originario: row.originario ? String(row.originario) : null,
    estadoCivil: row.estado_civil ? String(row.estado_civil) : null,
    escolaridad: row.escolaridad ? String(row.escolaridad) : null,
    ocupacion: row.ocupacion ? String(row.ocupacion) : null,
    domicilio,
    rasgosParticulares: row.rasgos_particulares ? String(row.rasgos_particulares) : null,
    fechaHoraEvento: [fmtFecha(row.fecha_reporte), row.hora_reporte ? String(row.hora_reporte).slice(0, 5) : null].filter(Boolean).join(' '),
    rnd: row.ofi_folio_cad ? String(row.ofi_folio_cad) : null,
    expediente: row.expediente_ci ? String(row.expediente_ci) : (row.num_carpeta_investigacion ? String(row.num_carpeta_investigacion) : null),
    lugarEvento,
    lugarDetencion,
    iph: row.iph ? String(row.iph) : null,
    nexosDelictivos: null,
    zonaOperacion: row.sector ? String(row.sector) : null,
    puestaDisposicion,
    modusOperandi: String(row.modus_operandi || '—'),
    informacionAdicional: row.ofi_observaciones ? String(row.ofi_observaciones) : null,
    antecedentesDelitos,
    antecedentesFaltas,
  }
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}
