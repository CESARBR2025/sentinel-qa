export async function abrirDocumento(urlArchivo: string) {
  const proxyUrl = `/api/expediente/proxy?url=${encodeURIComponent(urlArchivo)}`

  try {
    const res = await fetch(proxyUrl)
    if (!res.ok) throw new Error('Error al obtener documento')
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 30000)
  } catch {
    window.open(proxyUrl, '_blank', 'noopener,noreferrer')
  }
}
