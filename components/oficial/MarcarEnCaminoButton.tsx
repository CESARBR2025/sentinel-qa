'use client'

import { useTransition } from 'react'
import { marcarEnCaminoOficial } from '@/lib/oficial/actions'
import { useRouter } from 'next/navigation'

interface Props {
  incidenteId: string
  estatusActual: string
  yaSalio: boolean
  onMarcado?: () => void
}

export function MarcarEnCaminoButton({ incidenteId, estatusActual, yaSalio, onMarcado }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (estatusActual !== 'en_despacho') return null

  if (yaSalio) {
    return (
      <span style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
        color: '#0d9488', letterSpacing: '0.05em',
      }}>
        ✓ EN CAMINO
      </span>
    )
  }

  const handleClick = () => {
    startTransition(async () => {
      await marcarEnCaminoOficial(incidenteId)
      onMarcado?.()
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 24px', fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700, fontSize: 14, letterSpacing: '0.06em',
        textTransform: 'uppercase', cursor: pending ? 'wait' : 'pointer',
        border: '1px solid #1f355a', borderRadius: 2,
        background: pending ? '#c3c8d2' : '#eff1f3',
        color: '#1c3051', transition: 'all .15s',
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? 'MARCANDO...' : '🚓 VOY EN CAMINO'}
    </button>
  )
}
