import type { SolicitudEvidencia, ViaInfraccionDetalle, AseguradoRow, DetalleAseguradoCompleto, DetalleDetenidoGuardado, PuestaDisposicionRow } from './types'

function str(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function bool(val: unknown): boolean | null {
  if (val === null || val === undefined) return null
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true' || val === '1'
  return Boolean(val)
}

function num(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return Number.isNaN(n) ? null : n
}

export function rowToSolicitud(row: Record<string, unknown>): SolicitudEvidencia {
  return {
    id:                       str(row.id) ?? '',
    folioDenuncia:            str(row.folio_denuncia),
    folioSija:                str(row.folio_sija),
    iph:                      str(row.iph),
    folioCu:                  str(row.folio_cu),
    corporacion:              str(row.corporacion),
    sector:                   str(row.sector),
    grupoAdscripcion:         str(row.grupo_adscripcion),
    fechaReporte:             str(row.fecha_reporte),
    horaReporte:              str(row.hora_reporte),
    fechaAvistamiento:        str(row.fecha_avistamiento),
    horaAvistamiento:         str(row.hora_avistamiento),
    fechaDespacho:            str(row.fecha_despacho),
    horaDespacho:             str(row.hora_despacho),
    fechaConfirmacion:        str(row.fecha_confirmacion),
    horaConfirmacion:         str(row.hora_confirmacion),
    fechaLlegada:             str(row.fecha_llegada),
    horaLlegada:              str(row.hora_llegada),
    horaInicioDenuncia:       str(row.hora_inicio_denuncia),
    horaFinDenuncia:          str(row.hora_fin_denuncia),
    horaTerminoAtencion:      str(row.hora_termino_atencion),
    horaCuestionario:         str(row.hora_cuestionario),
    lugarHecho:               str(row.lugar_hecho),
    lugarApoyo:               str(row.lugar_apoyo),
    coloniaHecho:             str(row.colonia_hecho),
    coloniaApoyo:             str(row.colonia_apoyo),
    municipio:                str(row.municipio),
    latitud:                  str(row.latitud),
    longitud:                 str(row.longitud),
    nominaMando:              str(row.nomina_mando),
    policiaACargo:            str(row.policia_a_cargo),
    policiaDenuncia:          str(row.policia_denuncia),
    policiaFirmaD1:           str(row.policia_firma_d1),
    policiaIngresaCu:         str(row.policia_ingresa_cu),
    tipoEvento:               str(row.tipo_evento),
    delito:                   str(row.delito),
    violencia:                str(row.violencia),
    crp:                      str(row.crp),
    requirioTablet:           bool(row.requirio_tablet),
    funcionabaTablet:         bool(row.funcionaba_tablet),
    ofendidoHombre:           num(row.ofendido_hombre),
    ofendidoMujer:            num(row.ofendido_mujer),
    numCuestionarios:         num(row.num_cuestionarios),
    intervinoGs:              bool(row.intervino_gs),
    seGeneroD1:               bool(row.se_genero_d1),
    seVaAGenerarD1:           bool(row.se_va_a_generar_d1),
    observaciones:            str(row.observaciones),
    capturadoPor:             str(row.capturado_por),
    createdAt:                str(row.created_at),
    updatedAt:                str(row.updated_at),
    reporteCampoId:           str(row.reporte_campo_id),
    estadoTramite:            str(row.estado_tramite),
    estadoEvidencia:          str(row.estado_evidencia),
    monitoristaFechasRequeridas: (() => {
      const v = row.monitorista_fechas_requeridas
      if (v === null || v === undefined) return null
      if (typeof v === 'string') return v
      return JSON.stringify(v)
    })(),
    numCarpetaInvestigacion:  str(row.num_carpeta_investigacion),
    fechaCierre:              str(row.fecha_cierre),
  }
}

export function rowToInfraccionDetalle(row: Record<string, unknown>): ViaInfraccionDetalle {
  const parseEvidencias = (val: unknown): string[] => {
    if (!val || val === 'NO_DATA') return []
    if (Array.isArray(val)) return val.map(String)
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) ? parsed.map(String) : [val]
      } catch {
        return val ? [val] : []
      }
    }
    return []
  }

  const concatName = (...parts: (unknown)[]): string =>
    parts.map(p => String(p ?? '')).filter(Boolean).join(' ') || '—'

  return {
    Header: {
      id_infraccion:                str(row.id) ?? '',
      folio_de_infraccion:          str(row.folio) ?? '',
      fecha_de_registro_de_infraccion: str(row.created_at) ?? '',
      estatus_de_infraccion:        str(row.estatus) ?? '',
      url_ine:                      str(row.url_ine) ?? '',
      url_tarjeta_circulacion:      str(row.url_tarjeta_circulacion) ?? '',
      url_inapam:                   str(row.url_inapam) ?? '',
      url_evidencias:               parseEvidencias(row.evidencias),
      no_oficio_fiscalia:           str(row.no_oficio_fiscalia) ?? undefined,
      url_oficio_fiscalia:          str(row.url_oficio_fiscalia) ?? undefined,
      no_carpeta_investigacion:     str(row.no_carpeta_investigacion) ?? undefined,
      url_orden_salida_liberaciones: str(row.url_orden_salida_liberaciones) ?? undefined,
    },
    Infraccion: {
      articulo_numero:              str(row.articulo_numero) ?? '',
      articulo_descripcion:         str(row.articulo_descripcion) ?? '',
      fraccion_numero:              str(row.fraccion_numero) ?? '',
      fraccion_descripcion:         str(row.fraccion_descripcion) ?? '',
      total_umas:                   str(row.total_umas) ?? '0',
      total_pesos:                  str(row.total_pesos) ?? '0',
      tieneOrdenPago:               row.tiene_orden_pago === true || row.tiene_orden_pago === 'true',
    },
    datos_infractor: {
      nombre_infractor: concatName(row.nombre_infractor, row.apellido_paterno_infractor, row.apellido_materno_infractor),
      appaterno_infractor:          str(row.apellido_paterno_infractor) ?? undefined,
      apmaterno_infractor:          str(row.apellido_materno_infractor) ?? undefined,
      correo_infractor:             str(row.correo_infractor) ?? '',
      curp_infractor:               str(row.curp_infractor) ?? '',
    },
    vehiculo: {
      placa:                        str(row.placa) ?? '',
      tipo:                         str(row.tipo_garantia) ?? '',
      marca:                        str(row.marca) ?? '',
      modelo:                       str(row.modelo) ?? '',
      anio:                         str(row.anio) ?? '',
      color:                        str(row.color) ?? '',
    },
    garantia: {
      garantia_retenida:            str(row.tipo_garantia) ?? '',
    },
    ubicacion: {
      latitud:                      str(row.latitud) ?? '',
      longitud:                     str(row.longitud) ?? '',
      calle:                        str(row.calle) ?? '',
      cod_postal:                   str(row.codigo_postal) ?? '',
      numero:                       str(row.numero) ?? '',
      municipio:                    str(row.municipio) ?? '',
      estado:                       str(row.estado) ?? '',
    },
    oficial: {
      numero_empleado:              str(row.oficial_numero_empleado) ?? '',
      nombre_completo:              concatName(row.oficial_nombres, row.oficial_apellido_p, row.oficial_apellido_m),
      patrulla_nombre:              str(row.patrulla_nombre) ?? '',
      activo:                       str(row.oficial_activo) ?? '',
    },
  }
}

export function rowToAsegurado(row: Record<string, unknown>): AseguradoRow {
  const rawDetenidos = row.ofi_detenidos
  let detenidosArr: unknown[] = []
  if (typeof rawDetenidos === 'string') {
    try { detenidosArr = JSON.parse(rawDetenidos) } catch { detenidosArr = [] }
  } else if (Array.isArray(rawDetenidos)) {
    detenidosArr = rawDetenidos
  }

  return {
    id: str(row.id) ?? '',
    folioReporteCampo: str(row.folio_reporte_campo) ?? 'S/C',
    folioDenuncia: str(row.folio_denuncia),
    createdAt: str(row.created_at) ?? '',
    cantidadDetenidos: detenidosArr.length,
    folioReporteAsegurados: str(row.folio_reporte_asegurados),
    oficialNombre: str(row.ofi_oficial_nombre),
    oficialPlaca: str(row.ofi_placa_unidad_asignada),
  }
}

export function rowToDetalleDetenidoGuardado(row: Record<string, unknown>): DetalleDetenidoGuardado {
  return {
    id: str(row.id) ?? '',
    nombreDetenido: str(row.nombre_detenido) ?? '',
    apPaterno: str(row.ap_paterno_detenido),
    apMaterno: str(row.ap_materno_detenido),
    calle: str(row.calle),
    colonia: str(row.colonia),
    numero: str(row.numero),
    codPostal: str(row.cod_postal),
    latitud: row.latitud != null ? Number(row.latitud) : null,
    longitud: row.longitud != null ? Number(row.longitud) : null,
  }
}

export function rowToPuestaDisposicion(row: Record<string, unknown>): PuestaDisposicionRow {
  let actas: Record<string, boolean> = {}
  if (typeof row.actas === 'string') {
    try { actas = JSON.parse(row.actas) } catch { actas = {} }
  } else if (row.actas && typeof row.actas === 'object') {
    actas = row.actas as Record<string, boolean>
  }

  return {
    id: str(row.id) ?? '',
    reporteCampoId: str(row.reporte_campo_id) ?? '',
    gestionInterna: row.gestion_interna === true || row.gestion_interna === 'true',
    dependenciaExterna: str(row.dependencia_externa),
    actas,
    otrosActos: str(row.otros_actos),
    horaInicioTraslado: str(row.hora_inicio_traslado) ?? '',
    horaLlegadaSede: str(row.hora_llegada_sede) ?? '',
    tiempoTrasladoTotal: row.tiempo_traslado_total != null ? Number(row.tiempo_traslado_total) : 0,
    horaPuestaDisposicion: str(row.hora_puesta_disposicion) ?? '',
    creadoPor: str(row.creado_por) ?? '',
    creadoEn: str(row.creado_en) ?? '',
    completadoEn: str(row.completado_en),
  }
}
