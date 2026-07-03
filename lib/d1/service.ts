import { obtenerReportesD1 } from './repository'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarReportesD1(desde?: string, hasta?: string, folio?: string) {
    const rows = await obtenerReportesD1(desde, hasta, folio)
    return rows.map(r => ({
        id: toStr(r.id),
        folioDenuncia: toStr(r.folio_denuncia),
        iph: toStr(r.iph),
        folioCu: toStr(r.folio_cu),
        folioSija: toStr(r.folio_sija),
        delito: toStr(r.delito),
        tipoEvento: toStr(r.tipo_evento),
        violencia: Boolean(r.violencia),
        fechaReporte: r.fecha_reporte instanceof Date
            ? r.fecha_reporte.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : toStr(r.fecha_reporte),
        horaReporte: toStr(r.hora_reporte),
        lugarHecho: toStr(r.lugar_hecho),
        coloniaHecho: toStr(r.colonia_hecho),
        municipio: toStr(r.municipio),
        policiaACargo: toStr(r.policia_a_cargo),
        crp: toStr(r.crp),
        nominaMando: toStr(r.nomina_mando),
        seGeneroD1: Boolean(r.se_genero_d1),
        estadoTramite: toStr(r.estado_tramite),
        estadoEvidencia: toStr(r.estado_evidencia),
        ofendidoHombre: Number(r.ofendido_hombre ?? 0),
        ofendidoMujer: Number(r.ofendido_mujer ?? 0),
        tipoIncidente: toStr(r.ofi_tipo_incidente),
        oficialNombre: toStr(r.ofi_oficial_nombre),
        folioCad: toStr(r.ofi_folio_cad),
    }))
}