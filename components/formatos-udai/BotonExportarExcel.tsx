'use client'

import { useState } from 'react'
import { FileSpreadsheet } from 'lucide-react'

interface BotonExportarExcelProps {
  href?: string
  nombreArchivo?: string
}

export function BotonExportarExcel({
  href = '/api/formatos-udai/faltas-administrativas/exportar',
  nombreArchivo,
}: BotonExportarExcelProps) {
  const [pending, setPending] = useState(false)

  const handleExport = async () => {
    setPending(true)
    try {
      const res = await fetch(href, { method: 'GET' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombreArchivo ?? `formato_faltas_administrativas_${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
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
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em', padding: '10px 20px',
        background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2,
        cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      <FileSpreadsheet size={14} /> {pending ? 'EXPORTANDO...' : 'EXPORTAR XLSX'}
    </button>
  )
}
