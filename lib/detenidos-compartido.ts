import { query } from '@/lib/db'

export interface DetenidoFotoPendiente {
  id: string
  nombre_detenido: string
  folio_reporte_campo: string | null
  tipo_incidente: string | null
  fotos: {
    tipo_foto: string
    estado: string
    enviado_a: string | null
  }[]
  total_fotos: number
  completadas: number
}

export interface DetenidoFotoDetalle {
  id: string
  nombre_detenido: string
  folio_reporte_campo: string | null
  tipo_incidente: string | null
  created_at: string
  delito: string | null
  marco_legal: string | null
  falta_administrativa: string | null
  modus_operandi: string | null
  fotos: {
    tipo_foto: string
    estado: string
    enviado_a: string | null
    url_archivo: string | null
    nombre_archivo: string | null
  }[]
  hay_detencion: boolean
  hay_vehiculo: boolean
  hay_cateo: boolean
}

function nombreDetenido(raw: unknown): string {
  if (Array.isArray(raw) && raw.length > 0 && raw[0]?.nombre) return String(raw[0].nombre)
  if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); return p[0]?.nombre || 'Sin nombre' } catch { /* ignore */ }
  }
  return 'Sin nombre'
}

export async function listarDetenidosParaRol(rol: 'FISCALIA' | 'JUZGADO_CIVICO', pagina: number = 1, porPagina: number = 10): Promise<{ detenidos: DetenidoFotoPendiente[]; total: number }> {
  const offset = (pagina - 1) * porPagina

  const countR = await query<{ total: number }>(
    `SELECT count(DISTINCT rc.id)::int as total
     FROM ofi_reportes_campo rc
     INNER JOIN solicitud_fotos sf ON sf.reporte_campo_id = rc.id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND rc.id IN (
         SELECT DISTINCT reporte_campo_id FROM solicitud_fotos
         WHERE estado IN ('enviado', 'rechazado')
         AND enviado_a IN ($1, 'AMBOS')
       )`,
    [rol],
  )
  const total = countR.rows[0]?.total ?? 0

  const r = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.delito, rc.falta_administrativa, rc.modus_operandi,
            sf.tipo_foto, sf.estado, sf.enviado_a
     FROM ofi_reportes_campo rc
     INNER JOIN solicitud_fotos sf ON sf.reporte_campo_id = rc.id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND rc.id IN (
         SELECT DISTINCT reporte_campo_id FROM solicitud_fotos
         WHERE estado IN ('enviado', 'rechazado')
         AND enviado_a IN ($1, 'AMBOS')
       )
     ORDER BY rc.created_at DESC, sf.tipo_foto
     LIMIT $2 OFFSET $3`,
    [rol, porPagina, offset],
  )

  const map = new Map<string, DetenidoFotoPendiente>()
  for (const row of r.rows) {
    const id = String(row.id)
    if (!map.has(id)) {
      map.set(id, {
        id,
        nombre_detenido: nombreDetenido(row.ofi_detenidos),
        folio_reporte_campo: row.folio_reporte_campo ? String(row.folio_reporte_campo) : null,
        tipo_incidente: row.ofi_tipo_incidente ? String(row.ofi_tipo_incidente) : null,
        fotos: [],
        total_fotos: 0,
        completadas: 0,
      })
    }
    const entry = map.get(id)!
    entry.fotos.push({
      tipo_foto: String(row.tipo_foto),
      estado: String(row.estado),
      enviado_a: row.enviado_a ? String(row.enviado_a) : null,
    })
    entry.total_fotos++
    if (String(row.estado) === 'completado') {
      entry.completadas++
    }
  }
  return { detenidos: Array.from(map.values()), total }
}

export async function obtenerDetenidoParaRol(reporteCampoId: string, rol: 'FISCALIA' | 'JUZGADO_CIVICO'): Promise<DetenidoFotoDetalle | null> {
  const rcResult = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.created_at,
            COALESCE(rc.delito, ord.delito) as delito,
            COALESCE(rc.marco_legal, ord.marco_legal) as marco_legal,
            rc.falta_administrativa, rc.modus_operandi,
            rc.ofi_hay_detencion, rc.ofi_hay_vehiculo, rc.ofi_hay_cateo
     FROM ofi_reportes_campo rc
     LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
     WHERE rc.id = $1`,
    [reporteCampoId],
  )
  if (!rcResult.rows.length) return null
  const rc = rcResult.rows[0]

  const fotosResult = await query<Record<string, unknown>>(
    `SELECT sf.tipo_foto, sf.estado, sf.enviado_a,
            ed.url_archivo, ed.nombre_archivo
     FROM solicitud_fotos sf
     LEFT JOIN evidencias_detenido ed ON ed.reporte_campo_id = sf.reporte_campo_id AND ed.tipo_foto = sf.tipo_foto
     WHERE sf.reporte_campo_id = $1
     ORDER BY sf.tipo_foto`,
    [reporteCampoId],
  )

  return {
    id: String(rc.id),
    nombre_detenido: nombreDetenido(rc.ofi_detenidos),
    folio_reporte_campo: rc.folio_reporte_campo ? String(rc.folio_reporte_campo) : null,
    tipo_incidente: rc.ofi_tipo_incidente ? String(rc.ofi_tipo_incidente) : null,
    created_at: String(rc.created_at),
    delito: rc.delito ? String(rc.delito) : null,
    marco_legal: rc.marco_legal ? String(rc.marco_legal) : null,
    falta_administrativa: rc.falta_administrativa ? String(rc.falta_administrativa) : null,
    modus_operandi: rc.modus_operandi ? String(rc.modus_operandi) : null,
    fotos: fotosResult.rows.map(f => ({
      tipo_foto: String(f.tipo_foto),
      estado: String(f.estado),
      enviado_a: f.enviado_a ? String(f.enviado_a) : null,
      url_archivo: f.url_archivo ? String(f.url_archivo) : null,
      nombre_archivo: f.nombre_archivo ? String(f.nombre_archivo) : null,
    })),
    hay_detencion: rc.ofi_hay_detencion === true || rc.ofi_hay_detencion === 'true',
    hay_vehiculo: rc.ofi_hay_vehiculo === true || rc.ofi_hay_vehiculo === 'true',
    hay_cateo: rc.ofi_hay_cateo === true || rc.ofi_hay_cateo === 'true',
  }
}
