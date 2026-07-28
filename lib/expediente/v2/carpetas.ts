const ROOT = process.env.EXPEDIENTE_FOLDER ?? 'Centinela'

function fecha() {
  const now = new Date()
  const YYYY = now.getFullYear().toString()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  return { YYYY, MM }
}

export function carpetaEvidenciaMonitorista(incidenteId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/monitorista/${YYYY}/${MM}/${incidenteId}`
}

export function carpetaFotoDetenido(reporteCampoId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/detenidos/${YYYY}/${MM}/${reporteCampoId}`
}

export function carpetaFotoFiscalia(reporteCampoId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/fiscalia/${YYYY}/${MM}/${reporteCampoId}`
}

export function carpetaOficios(idInfraccion: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/oficios/${YYYY}/${MM}/${idInfraccion}`
}

export function carpetaDocsInfraccion(idInfraccion: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/via/${YYYY}/${MM}/${idInfraccion}/documentos`
}

export function carpetaEvidenciasInfraccion(idInfraccion: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/via/${YYYY}/${MM}/${idInfraccion}/evidencias`
}

export function carpetaLiberacionCiudadana(solicitudId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/via/${YYYY}/${MM}/${solicitudId}/liberacion`
}

export function carpetaCorralon(infraccionId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/corralon/${YYYY}/${MM}/${infraccionId}`
}

export function carpetaOrdenSalida(infraccionId: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/via/${YYYY}/${MM}/${infraccionId}/orden-salida`
}

export function carpetaPrevencion(folio: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/prevencion/${YYYY}/${MM}/${folio}`
}

export function carpetaGenerica(subdir: string): string {
  const { YYYY, MM } = fecha()
  return `${ROOT}/${subdir}/${YYYY}/${MM}`
}
