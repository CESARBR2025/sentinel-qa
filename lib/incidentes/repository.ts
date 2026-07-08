import { query } from '@/lib/db'

export async function insertarReporteCampo(params: {
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
    apoyoFiestasPatronales : boolean
    operativosMetropolitano : boolean
    eco8 : boolean
    alcoholimetria : boolean
    motocicletas : boolean
    apoyoActuarios : boolean
    apoyoCateosFgr : boolean
    apoyoCateosFge : boolean
}) {
    await query(
        `INSERT INTO incidente_reporte_campo (
    incidente_id,
    contenido_reporte, lugar_calle, lugar_colonia, lugar_entre_calles, lugar_referencia,
    datos_positivos_negativos, acciones_realizadas,
    hay_detencion, nombre_detenidos, autoridad_recibe, expediente_ci, delito_falta,
    hay_robo, monto_robo, objetos_recuperados,
    hay_vehiculo, vehiculos,
    hay_cateo, domicilio_cateado, cateo_calle, cateo_colonia, cateo_latitud, cateo_longitud, resultado_cateo,
    policia_a_cargo, personal_ingreso_ci,
    capturado_por,
    hay_orden_aprehension, ordenes_aprehension,
    hay_hidrocarburo,      hidrocarburos,
    hay_arma_fuego,        armas_fuego,
    hay_droga,             drogas, observaciones,
    apoyo_fiestas_patronales, operativos_metropolitano, eco8,
    alcoholimetria, motocicletas, apoyo_actuarios,
    apoyo_cateos_fgr, apoyo_cateos_fge
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,
    $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,
    $29, $30::jsonb, $31, $32::jsonb, $33, $34::jsonb, $35, $36::jsonb, $37,
    $38,$39,$40,$41,$42,$43,$44,$45
  )`,
        [
            params.incidenteId,
            params.contenidoReporte,
            params.lugarCalle,
            params.lugarColonia,
            params.lugarEntreCalles,
            params.lugarReferencia,
            params.datosPositivosNegativos,
            params.accionesRealizadas,
            params.hayDetencion,
            params.nombreDetenidos,
            params.autoridadRecibe,
            params.expedienteCi,
            params.delitoFalta,
            params.hayRobo,
            params.montoRobo,
            params.objetosRecuperados,
            params.hayVehiculo,
            JSON.stringify(params.vehiculos),
            params.hayCateo,
            params.domicilioCateado,
            params.cateoCalle,
            params.cateoColonia,
            params.cateoLatitud,
            params.cateoLongitud,
            params.resultadoCateo,
            params.policiaACargo,
            params.personalIngresoCi,
            params.capturadoPor,
            params.hayOrdenAprehension, JSON.stringify(params.ordenesAprehension),
            params.hayHidrocarburo, JSON.stringify(params.hidrocarburos),
            params.hayArmaFuego, JSON.stringify(params.armasFuego),
            params.hayDroga, JSON.stringify(params.drogas),
            params.observaciones,
            params.apoyoFiestasPatronales, 
            params.operativosMetropolitano, 
            params.eco8,
            params.alcoholimetria, 
            params.motocicletas, 
            params.apoyoActuarios,
            params.apoyoCateosFgr, 
            params.apoyoCateosFge,
        ]
    )

    await query(
        `UPDATE incidentes SET estatus = 'atendido', actualizado_en = now() WHERE id = $1`,
        [params.incidenteId]
    )
}

export async function verificarReporteCampo(incidenteId: string) {
    const incResult = await query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId]
    )
    const existeResult = await query<{ id: string }>(
        `SELECT id FROM incidente_reporte_campo WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId]
    )
    return {
        inc: incResult.rows[0] ?? null,
        existe: existeResult.rows.length > 0,
    }
}