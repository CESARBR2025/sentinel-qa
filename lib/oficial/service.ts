import {
  obtenerOficialPorUserId,
  insertarReporteCampo,
  verificarFolioExiste,
  obtenerRolUsuario,
  obtenerCatalogoIncidentes,
  obtenerCatalogoEmergencias,
  obtenerCatalogoPrioridades,
  obtenerCatalogoCanalizaciones,
  contarDenunciasPendientes,
  obtenerReportesOficial,
  obtenerReporteDetalle,
} from './repository'
import type {
  CrearReporteCampoInput,
  OfiReporteResumen,
  OfiReporteDetalle,
  CatalogoItem,
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

export async function verificarRolOficial(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'Oficial de Campo'
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
}> {
  const oficial = await obtenerOficialPorUserId(userId)
  if (!oficial) throw new Error('Usuario no registrado como oficial de campo')

  const folio = await generarFolioUnico()

  const detenidosRaw = str(formData, 'ofi_detenidos')
  const detenidosArr = detenidosRaw
    ? detenidosRaw.split(',').map(n => ({ nombre: n.trim() })).filter(d => d.nombre)
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
    calle:   str(formData, 'ofi_cateo_calle'),
    colonia: str(formData, 'ofi_cateo_colonia'),
    numero:  str(formData, 'ofi_cateo_numero'),
    lat:     num(formData, 'ofi_cateo_latitud'),
    lng:     num(formData, 'ofi_cateo_longitud'),
  }
  const hasCateo = !!(cateo.calle || cateo.colonia || cateo.numero)
  const quiereDenuncia = bool(formData, 'ofi_quiere_denuncia')
  const calle   = str(formData, 'ofi_calle')
  const colonia = str(formData, 'ofi_colonia')
  const latitud  = str(formData, 'ofi_latitud')
  const longitud = str(formData, 'ofi_longitud')

  const input: CrearReporteCampoInput = {
    folioReporteCampo:    folio,
    ofiFolioCad:          str(formData, 'ofi_folio_cad') ?? 'S/C',
    ofiNombreReportante:  str(formData, 'ofi_nombre_reportante'),
    ofiAnonimo:           bool(formData, 'ofi_anonimo'),
    ofiTipoIncidente:     str(formData, 'ofi_tipo_incidente'),
    ofiTipoEmergencia:    str(formData, 'ofi_tipo_emergencia'),
    ofiPrioridad:         str(formData, 'ofi_prioridad'),
    ofiDescripcion:       str(formData, 'ofi_descripcion'),
    ofiContenidoReporte:  str(formData, 'ofi_contenido_reporte'),
    ofiCalle:             calle,
    ofiColonia:           colonia,
    ofiLatitud:           num(formData, 'ofi_latitud'),
    ofiLongitud:          num(formData, 'ofi_longitud'),
    ofiDatosPn:           str(formData, 'ofi_datos_pn'),
    ofiAcciones:          str(formData, 'ofi_acciones'),
    ofiHayDetencion:      bool(formData, 'ofi_hay_detencion'),
    ofiDetenidos:         detenidosArr,
    ofiAutoridadRecibe:   str(formData, 'ofi_autoridad_recibe'),
    ofiMontoRobo:         num(formData, 'ofi_monto_robo'),
    ofiObjetosRecuperados: str(formData, 'ofi_objetos_recuperados'),
    ofiHayVehiculo:       bool(formData, 'ofi_hay_vehiculo'),
    ofiVehiculos:         vehiculosArr,
    ofiHayCateo:          bool(formData, 'ofi_hay_cateo'),
    ofiCateo:             hasCateo ? cateo : null,
    ofiResultadoCateo:    str(formData, 'ofi_resultado_cateo'),
    ofiOficialId:         oficial.id,
    ofiOficialNombre:     `${oficial.ofiNombre} ${oficial.ofiApPaterno}`.trim(),
    ofiQuiereDenuncia:    quiereDenuncia,
  }

  const reporteId = await insertarReporteCampo(input)
  return { reporteId, quiereDenuncia, calle, colonia, latitud, longitud }
}

export async function listarReportesOficial(userId: string): Promise<OfiReporteResumen[]> {
  return obtenerReportesOficial(userId)
}

export async function verReporteDetalle(
  id: string,
  userId: string
): Promise<OfiReporteDetalle | null> {
  return obtenerReporteDetalle(id, userId)
}
