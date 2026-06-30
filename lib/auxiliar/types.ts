export interface AuxChecklist {
    id: string
    reporteCampoId: string
    reporteD1Id: string
    denunciaCuD1: boolean
    denunciaCuD1Duracion: string | null
    detenidoFge: boolean
    detenidoFgr: boolean
    detenidoJc: boolean
    convenios: boolean
    trabajosComunidad: boolean
    coincideGps: boolean
    visualizoCamara: boolean
    tiPi: boolean
    observaciones: string | null
    capturadoPor: string
    createdAt: string
    updatedAt: string
}

export interface AuxParReporte {
    reporteCampoId: string
    folioCad: string
    tipoIncidente: string | null
    oficialNombre: string | null
    fechaReporte: string
    reporteD1Id: string
    folioDenuncia: string
    delito: string | null
    checklist: AuxChecklist | null
    ofiHayDetencion: boolean
    ofiAutoridadRecibe: string | null
    d1Id:              string | null
}

export interface AuxCuestionarioRobo {
    reporteCampoId: string
    folioIncidente: string
    folioReporte: string
    fecha: string
    hora: string
    folioCuestionario: string
    robo: string | null
    nombrePolicia: string | null
    nominaPolicia: string | null
    registroTableta: string | null
    sector: string | null
    nombreIngreso: string | null
}

export interface UpsertChecklistInput {
    reporteCampoId: string
    reporteD1Id: string
    denunciaCuD1: boolean
    denunciaCuD1Duracion: string | null
    detenidoFge: boolean
    detenidoFgr: boolean
    detenidoJc: boolean
    convenios: boolean
    trabajosComunidad: boolean
    coincideGps: boolean
    visualizoCamara: boolean
    tiPi: boolean
    observaciones: string | null
    capturadoPor: string
}