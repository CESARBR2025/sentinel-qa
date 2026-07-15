import type { AuxChecklist, AuxParReporte, AuxCuestionarioRobo } from './types'

function toStr(val: unknown): string | null {
    if (val === null || val === undefined) return null
    if (val instanceof Date) return val.toISOString()
    return String(val)
}

export function rowToChecklist(row: Record<string, unknown>): AuxChecklist {
    return {
        id: String(row.id ?? ''),
        reporteCampoId: String(row.reporte_campo_id ?? ''),
        reporteD1Id: String(row.reporte_d1_id ?? ''),
        denunciaCuD1: Boolean(row.denuncia_cu_d1),
        denunciaCuD1Duracion: toStr(row.denuncia_cu_d1_duracion),
        detenidoFge: Boolean(row.detenido_fge),
        detenidoFgr: Boolean(row.detenido_fgr),
        detenidoJc: Boolean(row.detenido_jc),
        convenios: Boolean(row.convenios),
        trabajosComunidad: Boolean(row.trabajos_comunidad),
        coincideGps: Boolean(row.coincide_gps),
        visualizoCamara: Boolean(row.visualizo_camara),
        tiPi: Boolean(row.ti_pi),
        observaciones: toStr(row.observaciones),
        capturadoPor: String(row.capturado_por ?? ''),
        createdAt: toStr(row.created_at) ?? '',
        updatedAt: toStr(row.updated_at) ?? '',
    }
}

export function rowToParReporte(row: Record<string, unknown>): AuxParReporte {
    return {
        reporteCampoId: String(row.reporte_campo_id ?? ''),
        folioCad: String(row.folio_cad ?? ''),
        tipoIncidente: toStr(row.tipo_incidente),
        oficialNombre: toStr(row.oficial_nombre),
        fechaReporte: toStr(row.fecha_reporte) ?? '',
        reporteD1Id: String(row.reporte_d1_id ?? ''),
        folioDenuncia: String(row.folio_denuncia ?? ''),
        delito: toStr(row.delito),
        ofiHayDetencion: Boolean(row.ofi_hay_detencion),
        ofiAutoridadRecibe: toStr(row.ofi_autoridad_recibe),
        d1Id:               toStr(row.reporte_d1_id),
        checklist: row.checklist_id ? rowToChecklist({
            id: row.checklist_id,
            reporte_campo_id: row.reporte_campo_id,
            reporte_d1_id: row.reporte_d1_id,
            denuncia_cu_d1: row.denuncia_cu_d1,
            denuncia_cu_d1_duracion: row.denuncia_cu_d1_duracion,
            detenido_fge: row.detenido_fge,
            detenido_fgr: row.detenido_fgr,
            detenido_jc: row.detenido_jc,
            convenios: row.convenios,
            trabajos_comunidad: row.trabajos_comunidad,
            coincide_gps: row.coincide_gps,
            visualizo_camara: row.visualizo_camara,
            ti_pi: row.ti_pi,
            observaciones: row.observaciones,
            capturado_por: row.capturado_por,
            created_at: row.cl_created_at,
            updated_at: row.cl_updated_at,
        }) : null,
    }
}

export function rowToCuestionarioRobo(row: Record<string, unknown>): AuxCuestionarioRobo {
    const fecha = row.fecha instanceof Date ? row.fecha : new Date(String(row.fecha ?? ''))
    return {
        reporteCampoId: String(row.reporte_campo_id ?? ''),
        folioIncidente: String(row.reporte_campo_id ?? ''),
        folioReporte: String(row.folio_cad ?? ''),
        fecha: isNaN(fecha.getTime()) ? '' : fecha.toLocaleDateString('es-MX'),
        hora: isNaN(fecha.getTime()) ? '' : fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        folioCuestionario: String(row.folio_denuncia ?? ''),
        robo: toStr(row.delito),
        nombrePolicia: toStr(row.nombre_policia),
        nominaPolicia: toStr(row.nomina_policia),
        registroTableta: toStr(row.registro_tableta),
        sector: toStr(row.sector),
        nombreIngreso: toStr(row.nombre_ingreso),
    }
}