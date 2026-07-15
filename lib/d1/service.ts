import { obtenerReportesD1, obtenerGruposAdscripcion } from './repository'
import type { GrupoAdscripcion } from './types'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarGruposAdscripcion(autoridad?: string): Promise<GrupoAdscripcion[]> {
  return obtenerGruposAdscripcion(autoridad)
}

export async function listarReportesD1(desde?: string, hasta?: string, folio?: string) {
    const rows = await obtenerReportesD1(desde, hasta, folio)
    return rows.map(r => ({
        id: r.id ?? '',
        folioDenuncia: r.folioDenuncia ?? '—',
        iph: r.iph ?? '—',
        folioCu: r.folioCu ?? '—',
        folioSija: r.folioSija ?? '—',
        delito: r.delito ?? '—',
        tipoEvento: r.tipoEvento ?? '—',
        violencia: r.violencia,
        fechaReporte: r.fechaReporte ?? '—',
        horaReporte: r.horaReporte ?? '—',
        lugarHecho: r.lugarHecho ?? '—',
        coloniaHecho: r.coloniaHecho ?? '—',
        municipio: r.municipio ?? '—',
        policiaACargo: r.policiaACargo ?? '—',
        crp: r.crp ?? '—',
        nominaMando: r.nominaMando ?? '—',
        seGeneroD1: r.seGeneroD1,
        estadoTramite: r.estadoTramite ?? '—',
        estadoEvidencia: r.estadoEvidencia ?? '—',
        ofendidoHombre: r.ofendidoHombre,
        ofendidoMujer: r.ofendidoMujer,
        tipoIncidente: r.tipoIncidente ?? '—',
        oficialNombre: r.oficialNombre ?? '—',
        folioCad: r.folioCad ?? '—',
    }))
}
