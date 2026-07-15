'use client'

import { useTransition } from 'react'
import { marcarEnSitioOficial } from '@/lib/oficial/actions'
import { useRouter } from 'next/navigation'

interface Props {
  incidenteId: string
  estatusActual: string
  onMarcado?: () => void
}

export function MarcarEnSitioButton({ incidenteId, estatusActual, onMarcado }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (estatusActual !== 'en_despacho') return null

  const handleClick = () => {
    startTransition(async () => {
      await marcarEnSitioOficial(incidenteId)
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
        border: '1px solid #0d9488', borderRadius: 2,
        background: pending ? '#ccfbf1' : '#14b8a6',
        color: '#ffffff', transition: 'all .15s',
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? 'MARCANDO...' : '✓ MARCAR EN SITIO'}
    </button>
  )
}
