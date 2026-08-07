'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

interface Props {
  href: string
  nombreArchivo?: string
}

export function BotonExportarExcel({ href, nombreArchivo }: Props) {
  const [pending, setPending] = useState(false)

  const handleExport = async () => {
    setPending(true)
    try {
      const res = await fetch(href, { method: 'GET' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Error al exportar Excel')
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombreArchivo ?? `reporte_numeros_telefonicos_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al exportar Excel')
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={pending}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14,
        padding: '10px 20px', background: pending ? '#94a3b8' : '#16a34a', color: '#fff',
        borderRadius: 'var(--radius-lg)', border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      <Download size={16} /> {pending ? 'Exportando…' : 'Exportar a Excel'}
    </button>
  )
}