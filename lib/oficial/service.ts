import { obtenerOficialPorUserId, insertarReporteCampo } from './repository'
import { CrearReporteCampoInput } from './types'

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

export async function crearReporte(userId: string, formData: FormData): Promise<string> {
  const oficial = await obtenerOficialPorUserId(userId)
  if (!oficial) throw new Error('Usuario no registrado como oficial de campo')

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
        return {
          tipo: partes.tipo ?? '',
          placas: partes.placas ?? '',
          serie: partes.serie ?? '',
          color: partes.color ?? '',
          destino: partes.destino ?? '',
        }
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

  const input: CrearReporteCampoInput = {
    ofiFolioCad:          str(formData, 'ofi_folio_cad') ?? 'S/C',
    ofiNombreReportante:  str(formData, 'ofi_nombre_reportante'),
    ofiAnonimo:           bool(formData, 'ofi_anonimo'),
    ofiTipoIncidente:     str(formData, 'ofi_tipo_incidente'),
    ofiTipoEmergencia:    str(formData, 'ofi_tipo_emergencia'),
    ofiPrioridad:         str(formData, 'ofi_prioridad'),
    ofiDescripcion:       str(formData, 'ofi_descripcion'),
    ofiContenidoReporte:  str(formData, 'ofi_contenido_reporte'),
    ofiCalle:             str(formData, 'ofi_calle'),
    ofiColonia:           str(formData, 'ofi_colonia'),
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
  }

  return await insertarReporteCampo(input)
}
