'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { usePolling } from '@/hooks/usePolling'

const INTERVALO_MS = 30_000

export function ContadorAsignaciones() {
  const [asignados, setAsignados] = useState<number | null>(null)

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch('/api/oficial/contador', { cache: 'no-store' })
      if (!r.ok) return
      const { asignados: n } = await r.json() as { asignados: number }
      setAsignados(n)
    } catch {
      // Sin red: se reintenta en el siguiente intervalo.
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => void refrescar(), 0)
    return () => clearTimeout(t)
  }, [refrescar])

  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  usePolling(() => { void refrescar() }, INTERVALO_MS, visible)

  if (asignados === null || asignados === 0) return null

  return (
    <div style={{ marginTop: 16 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '3px 10px', background: '#fef3c7', color: '#b45309', borderRadius: 'var(--radius-full)' }}>
        <AlertTriangle size={11} />
        {asignados} asignación{asignados !== 1 ? 'es' : ''} activa{asignados !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
