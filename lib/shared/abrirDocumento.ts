export async function abrirDocumento(urlArchivo: string) {
  try {
    const tokenRes = await fetch('/api/expediente/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: urlArchivo }),
    })
    if (!tokenRes.ok) throw new Error('No autorizado')
    const { token } = await tokenRes.json()
    window.open(`/api/expediente/vista/${encodeURIComponent(token)}`, '_blank')
  } catch {
    window.open(`/api/expediente/proxy?ref=${encodeURIComponent(urlArchivo)}`, '_blank', 'noopener,noreferrer')
  }
}
