import {
  obtenerOficialPorUserId,
  insertarReporteCampo,
  insertarDetallesAsegurados,
  verificarFolioExiste,
  obtenerRolUsuario,
  obtenerCatalogoIncidentes,
  obtenerCatalogoEmergencias,
  obtenerCatalogoPrioridades,
  obtenerCatalogoCanalizaciones,
  contarDenunciasPendientes,
  obtenerReportesOficial,
  obtenerReporteDetalle,
  obtenerDespachosAsignados,
  contarDespachosAsignados,
} from './repository'
import { query } from '@/lib/db'
import type {
  OfiOficial,
  OfiDetenido,
  CrearReporteCampoInput,
  OfiReporteResumen,
  OfiReporteDetalle,
  CatalogoItem,
  DespachoAsignado,
} from './types'

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key)
  return v && typeof v === 'string' && v.trim() ? v.trim() : null
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === 'true'
}
function num(fd: FormData, key: string): number | null {
  const v = str(fd, key)
  return v ? Number(v) : null
}

function generarFolio(): string {
  const hoy = new Date()
  const y = hoy.getFullYear()
  const m = String(hoy.getMonth() + 1).padStart(2, '0')
  const d = String(hoy.getDate()).padStart(2, '0')
  const fecha = `${y}${m}${d}`
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SSPM/${fecha}/${codigo}`
}

async function generarFolioUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const folio = generarFolio()
    const existe = await verificarFolioExiste(folio)
    if (!existe) return folio
  }
  throw new Error('No se pudo generar un folio único después de 10 intentos')
}

export async function obtenerPlacaPatrulla(oficialId: string): Promise<string> {
  const result = await query<{ placa: string }>(
    `SELECT COALESCE(p.numero_unidad, '') AS placa
     FROM ofi_oficiales o
     LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
     WHERE o.id = $1 LIMIT 1`,
    [oficialId]
  )
  return result.rows[0]?.placa ?? ''
}

export async function verificarRolOficial(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'Oficial de Campo'
}

export async function obtenerMiPerfil(userId: string): Promise<OfiOficial | null> {
  return obtenerOficialPorUserId(userId)
}

export async function obtenerCatalogos() {
  const [emergencias, incidentes, prioridades, canalizaciones] = await Promise.all([
    obtenerCatalogoEmergencias(),
    obtenerCatalogoIncidentes(),
    obtenerCatalogoPrioridades(),
    obtenerCatalogoCanalizaciones(),
  ])
  return { emergencias, incidentes, prioridades, canalizaciones }
}

export async function contarDenunciasPendientesOficial(userId: string): Promise<number> {
  return contarDenunciasPendientes(userId)
}

export async function crearReporte(userId: string, formData: FormData): Promise<{
  reporteId: string
  quiereDenuncia: boolean
  calle: string | null
  colonia: string | null
  latitud: string | null
  longitud: string | null
  oficialId: string
  hayDetenidos: boolean
  destino: string | null
}> {
  const oficial = await obtenerOficialPorUserId(userId)
  if (!oficial) throw new Error('Usuario no registrado como oficial de campo')

  const folio = await generarFolioUnico()

  const detenidosRaw = str(formData, 'ofi_detenidos')
  const detenidosArr: OfiDetenido[] = detenidosRaw
    ? JSON.parse(detenidosRaw).filter((d: OfiDetenido) => d.nombre?.trim())
    : []

  const vehiculosRaw = str(formData, 'ofi_vehiculos')
  const vehiculosArr = vehiculosRaw
    ? vehiculosRaw.split('|').map(bloque => {
      const partes: Record<string, string> = {}
      bloque.split(',').forEach(p => {
        const [k, ...v] = p.split(':')
        if (k) partes[k.trim().toLowerCase()] = v.join(':').trim()
      })
      return { tipo: partes.tipo ?? '', placas: partes.placas ?? '', serie: partes.serie ?? '', color: partes.color ?? '', destino: partes.destino ?? '' }
    }).filter(v => v.placas || v.serie || v.color)
    : []

  const cateo = {
    calle: str(formData, 'ofi_cateo_calle'),
    colonia: str(formData, 'ofi_cateo_colonia'),
    numero: str(formData, 'ofi_cateo_numero'),
    lat: num(formData, 'ofi_cateo_latitud'),
    lng: num(formData, 'ofi_cateo_longitud'),
  }
  const hasCateo = !!(cateo.calle || cateo.colonia || cateo.numero)
  const quiereDenuncia = bool(formData, 'ofi_quiere_denuncia')
  const calle = str(formData, 'ofi_calle')
  const colonia = str(formData, 'ofi_colonia')
  const latitud = str(formData, 'ofi_latitud')
  const longitud = str(formData, 'ofi_longitud')

  const input: CrearReporteCampoInput = {
    incidenteId: str(formData, 'incidente_id'),
    folioReporteCampo: folio,
    ofiFolioCad: str(formData, 'ofi_folio_cad') ?? 'S/C',
    ofiNombreReportante: str(formData, 'ofi_nombre_reportante'),
    ofiAnonimo: bool(formData, 'ofi_anonimo'),
    ofiTipoIncidente: str(formData, 'ofi_tipo_incidente'),
    ofiTipoEmergencia: str(formData, 'ofi_tipo_emergencia'),
    ofiPrioridad: str(formData, 'ofi_prioridad'),
    ofiDescripcion: str(formData, 'ofi_descripcion'),
    ofiContenidoReporte: str(formData, 'ofi_contenido_reporte'),
    ofiCalle: calle,
    ofiColonia: colonia,
    ofiEntreCalles: str(formData, 'ofi_entre_calles'),
    ofiReferencia: str(formData, 'ofi_referencia'),
    ofiLatitud: num(formData, 'ofi_latitud'),
    ofiLongitud: num(formData, 'ofi_longitud'),
    ofiDatosPn: str(formData, 'ofi_datos_pn'),
    ofiAcciones: str(formData, 'ofi_acciones'),
    ofiHayDetencion: bool(formData, 'ofi_hay_detencion'),
    ofiDetenidos: detenidosArr,
    ofiAutoridadRecibe: str(formData, 'ofi_autoridad_recibe'),
    expedienteCi: str(formData, 'expediente_ci'),
    personalIngresoCi: str(formData, 'personal_ingreso_ci'),
    ofiMontoRobo: num(formData, 'ofi_monto_robo'),
    ofiHayRobo: bool(formData, 'ofi_hay_robo'),
    ofiObjetosRecuperados: str(formData, 'ofi_objetos_recuperados'),
    ofiHayVehiculo: bool(formData, 'ofi_hay_vehiculo'),
    ofiVehiculos: vehiculosArr,
    ofiHayCateo: bool(formData, 'ofi_hay_cateo'),
    ofiCateo: hasCateo ? cateo : null,
    ofiResultadoCateo: str(formData, 'ofi_resultado_cateo'),
    ofiOficialId: oficial.id,
    ofiQuiereDenuncia: quiereDenuncia,
    ofiHayOrdenAprehension: bool(formData, 'ofi_hay_orden_aprehension'),
    ofiOrdenesAprehension: JSON.parse(str(formData, 'ofi_ordenes_aprehension') ?? '[]'),
    ofiHayHidrocarburo: bool(formData, 'ofi_hay_hidrocarburo'),
    ofiHidrocarburos: JSON.parse(str(formData, 'ofi_hidrocarburos') ?? '[]'),
    ofiHayArmaFuego: bool(formData, 'ofi_hay_arma_fuego'),
    ofiArmasFuego: JSON.parse(str(formData, 'ofi_armas_fuego') ?? '[]'),
    ofiHayDroga: bool(formData, 'ofi_hay_droga'),
    ofiDrogas: JSON.parse(str(formData, 'ofi_drogas') ?? '[]'),
    ofiTelefonoReportante: str(formData, 'ofi_telefono_reportante'),
    ofiObservaciones: str(formData, 'ofi_observaciones'),
    ofiApoyoFiestasPatronales: bool(formData, 'ofi_apoyo_fiestas_patronales'),
    ofiOperativosMetropolitano: bool(formData, 'ofi_operativos_metropolitano'),
    ofiEco8: bool(formData, 'ofi_eco8'),
    ofiAlcoholimetria: bool(formData, 'ofi_alcoholimetria'),
    ofiMotocicletas: bool(formData, 'ofi_motocicletas'),
    ofiApoyoActuarios: bool(formData, 'ofi_apoyo_actuarios'),
    ofiApoyoCateosFgr: bool(formData, 'ofi_apoyo_cateos_fgr'),
    ofiApoyoCateosFge: bool(formData, 'ofi_apoyo_cateos_fge'),
  }

  const reporteId = await insertarReporteCampo(input)
  if (detenidosArr.length > 0) {
    await insertarDetallesAsegurados(reporteId, detenidosArr)
  }
  const destino = str(formData, 'ofi_autoridad_recibe')
  return { reporteId, quiereDenuncia, calle, colonia, latitud, longitud, oficialId: oficial.id, hayDetenidos: detenidosArr.length > 0, destino }
}

export async function listarReportesOficial(userId: string): Promise<OfiReporteResumen[]> {
  return obtenerReportesOficial(userId)
}

export async function listarDespachosAsignados(userId: string): Promise<DespachoAsignado[]> {
  return obtenerDespachosAsignados(userId)
}

export async function contarDespachosAsignadosOficial(userId: string): Promise<number> {
  return contarDespachosAsignados(userId)
}

export async function verReporteDetalle(
  id: string,
  userId: string
): Promise<OfiReporteDetalle | null> {
  return obtenerReporteDetalle(id, userId)
}
