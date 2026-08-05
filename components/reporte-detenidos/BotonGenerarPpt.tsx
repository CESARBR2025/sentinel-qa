'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

export function BotonGenerarPpt() {
  const [pending, setPending] = useState(false)

  const handleGenerate = async () => {
    setPending(true)
    try {
      const res = await fetch('/api/reporte-detenidos/generar-ppt', { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_detenidos_${new Date().toISOString().split('T')[0]}.pptx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al generar PPT')
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={pending}
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em', padding: '10px 20px',
        background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2,
        cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      <FileText size={14} /> {pending ? 'GENERANDO...' : 'GENERAR PPT'}
    </button>
  )
}
