export async function abrirDocumento(urlArchivo: string) {
  const proxyUrl = `/api/monitorista/expediente-proxy?url=${encodeURIComponent(urlArchivo)}`
  window.open(proxyUrl, '_blank', 'noopener,noreferrer')
}
