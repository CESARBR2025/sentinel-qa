import { query } from '@/lib/db'
import type { DetenidoCompleto } from './types'

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
            ord.delito as delito_denuncia, ord.marco_legal as marco_legal_denuncia
     FROM ofi_reportes_campo rc
     LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND (
         SELECT COUNT(*) FROM solicitud_fotos sf
         WHERE sf.reporte_campo_id = rc.id AND sf.estado = 'completado'
       ) = 3
     ORDER BY rc.created_at DESC`,
    [],
  )

  return res.rows.map((row): DetenidoCompleto => ({
    id: String(row.id),
    folio: String(row.folio_reporte_campo || ''),
    nombre: parseNombreDetenido(row.ofi_detenidos),
    evento: String(row.ofi_tipo_incidente || '—'),
    delito: String(row.delito || row.delito_denuncia || '—'),
    faltaAdministrativa: String(row.falta_administrativa || row.marco_legal || row.marco_legal_denuncia || '—'),
    modusOperandi: String(row.modus_operandi || '—'),
    createdAt: new Date(row.created_at as string).toISOString(),
  }))
}
