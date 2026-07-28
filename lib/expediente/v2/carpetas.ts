function fecha() {
  const now = new Date()
  const YYYY = now.getFullYear().toString()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  return { YYYY, MM }
}

export function carpetaEvidenciaMonitorista(incidenteId: string): string {
  const { YYYY, MM } = fecha()
  return `monitorista/${YYYY}/${MM}/${incidenteId}`
}

export function carpetaFotoDetenido(reporteCampoId: string): string {
  const { YYYY, MM } = fecha()
  return `detenidos/${YYYY}/${MM}/${reporteCampoId}`
}

export function carpetaFotoFiscalia(reporteCampoId: string): string {
  const { YYYY, MM } = fecha()
  return `fiscalia/${YYYY}/${MM}/${reporteCampoId}`
}

export function carpetaInfraccion(idInfraccion: string): string {
  const { YYYY, MM } = fecha()
  return `SSPM_INFRACCIONES/${YYYY}/${MM}/${idInfraccion}`
}

export function carpetaOficios(idInfraccion: string): string {
  return `${carpetaInfraccion(idInfraccion)}/oficios`
}

export function carpetaDocsInfraccion(idInfraccion: string): string {
  return `${carpetaInfraccion(idInfraccion)}/documentos`
}

export function carpetaEvidenciasInfraccion(idInfraccion: string): string {
  return `${carpetaInfraccion(idInfraccion)}/evidencias`
}

export function carpetaLiberacionCiudadana(idInfraccion: string): string {
  return `${carpetaInfraccion(idInfraccion)}/liberacion`
}

export function carpetaCorralon(infraccionId: string): string {
  return `${carpetaInfraccion(infraccionId)}/corralon`
}

export function carpetaOrdenSalida(infraccionId: string): string {
  return `${carpetaInfraccion(infraccionId)}/orden-salida`
}

export function carpetaPrevencion(folio: string): string {
  const { YYYY, MM } = fecha()
  return `prevencion/${YYYY}/${MM}/${folio}`
}

export function carpetaGenerica(subdir: string): string {
  const { YYYY, MM } = fecha()
  return `${subdir}/${YYYY}/${MM}`
}
