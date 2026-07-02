import { insertarReporteCampo, verificarReporteCampo } from './repository'

export async function crearReporteCampo(params: {
    incidenteId: string
    contenidoReporte: string | null
    lugarCalle: string | null
    lugarColonia: string | null
    lugarEntreCalles: string | null
    lugarReferencia: string | null
    datosPositivosNegativos: string | null
    accionesRealizadas: string | null
    hayDetencion: boolean
    nombreDetenidos: string | null
    autoridadRecibe: string | null
    expedienteCi: string | null
    delitoFalta: string | null
    hayRobo: boolean
    montoRobo: number | null
    objetosRecuperados: string | null
    hayVehiculo: boolean
    vehiculos: object[]
    hayCateo: boolean
    domicilioCateado: string | null
    cateoCalle: string | null
    cateoColonia: string | null
    cateoLatitud: string | null
    cateoLongitud: string | null
    resultadoCateo: string | null
    policiaACargo: string | null
    personalIngresoCi: string | null
    capturadoPor: string
    hayOrdenAprehension: boolean
    ordenesAprehension: object[]
    hayHidrocarburo: boolean
    hidrocarburos: object[]
    hayArmaFuego: boolean
    armasFuego: object[]
    hayDroga: boolean
    drogas: object[]
    observaciones: string | null
}) {
    const { inc, existe } = await verificarReporteCampo(params.incidenteId)

    if (!inc) throw new Error('Incidente no encontrado')
    if (inc.estatus === 'atendido') throw new Error('El incidente ya está atendido')
    if (inc.estatus === 'sin_despachar') throw new Error('El incidente debe estar en_despacho antes de reportar')
    if (existe) throw new Error('El incidente ya tiene un reporte de campo')

    if (params.montoRobo !== null && (params.montoRobo < 0 || !Number.isInteger(params.montoRobo)))
        throw new Error('montoRobo debe ser un entero positivo')

    await insertarReporteCampo(params)

    return { estatusAnterior: inc.estatus }
}