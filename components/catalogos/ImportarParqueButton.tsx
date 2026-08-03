'use client'

import { useState, useTransition } from 'react'
import { Upload, CheckCircle, Loader2 } from 'lucide-react'
import { importarParqueVehicularAction } from '@/lib/catalogos/actions'

// Botón que dispara la importación del Excel del parque vehicular desde la vista
// de patrullas. Muestra el resumen (importadas/omitidas/sin placa) en línea.
export function ImportarParqueButton() {
  const [resultado, setResultado] = useState<{ importadas: number; omitidas: number; sinPlaca: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    setError(null)
    setResultado(null)
    startTransition(async () => {
      try {
        const r = await importarParqueVehicularAction()
        setResultado(r)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al importar el parque vehicular')
      }
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onClick}
        disabled={isPending}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          background: '#1f355a',
          color: '#fff',
          fontFamily: 'Barlow Condensed,sans-serif',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: isPending ? 'default' : 'pointer',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
        {isPending ? 'Importando...' : 'Importar desde Excel'}
      </button>

      {resultado && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#059669',
            letterSpacing: '0.08em',
          }}
        >
          <CheckCircle size={13} />
          {resultado.importadas} importadas · {resultado.omitidas} omitidas · {resultado.sinPlaca} sin placa
        </span>
      )}
      {error && (
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#dc2626', letterSpacing: '0.08em' }}>
          ✕ {error}
        </span>
      )}
    </div>
  )
}
