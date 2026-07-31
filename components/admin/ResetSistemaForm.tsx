'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { resetearSistema } from '@/lib/admin/sistema-actions'
import { FRASE_CONFIRMACION_RESET } from '@/lib/admin/sistema-constants'
import { labelStyle, inputStyle } from '@/app/admin/admin-styles'

interface Props {
  totalTablas: number
}

export function ResetSistemaForm({ totalTablas }: Props) {
  const [frase, setFrase] = useState('')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const router = useRouter()

  const habilitado = frase.trim() === FRASE_CONFIRMACION_RESET

  const handleClick = () => {
    setError(null)
    const fd = new FormData()
    fd.set('frase', frase)
    startTransition(async () => {
      try {
        await resetearSistema(fd)
        setExito(true)
        setFrase('')
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo ejecutar el reset.')
      }
    })
  }

  return (
    <div style={{
      border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 2, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#991b1b' }}>
        <AlertTriangle size={18} />
        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '0.03em' }}>
          ZONA DE PELIGRO — REINICIO TOTAL
        </span>
      </div>

      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#7f1d1d', lineHeight: 1.6, margin: 0 }}>
        Esta acción vacía permanentemente <strong>{totalTablas} tablas</strong> de registros operativos —
        incidentes, despachos, reportes de campo, D1, notificaciones, formato N, fichas, evidencias,
        solicitudes y la bitácora de auditoría. <strong>No se puede deshacer.</strong> Se conservan intactos:
        usuarios, cuentas, sesiones, roles, permisos, perfiles de oficial y todos los catálogos del sistema.
      </p>

      <div>
        <label style={labelStyle} htmlFor="frase-reset">
          Escribe exactamente «{FRASE_CONFIRMACION_RESET}» para habilitar el botón
        </label>
        <input
          id="frase-reset"
          type="text"
          value={frase}
          onChange={e => setFrase(e.target.value)}
          placeholder={FRASE_CONFIRMACION_RESET}
          autoComplete="off"
          style={{ ...inputStyle, borderColor: habilitado ? '#dc2626' : '#e2e8f0' }}
          disabled={pending}
        />
      </div>

      {error && (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626' }}>{error}</div>
      )}

      {exito && (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#15803d', fontWeight: 600 }}>
          ✓ Sistema reiniciado. Los registros operativos fueron eliminados.
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!habilitado || pending}
        style={{
          padding: '12px 24px', fontFamily: 'Barlow Condensed,sans-serif',
          fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
          border: 'none', borderRadius: 2,
          background: !habilitado || pending ? '#fca5a5' : '#dc2626',
          color: '#fff', cursor: !habilitado || pending ? 'not-allowed' : 'pointer',
          opacity: !habilitado || pending ? 0.7 : 1,
        }}
      >
        {pending ? 'REINICIANDO…' : '🗑 REINICIAR SISTEMA AHORA'}
      </button>
    </div>
  )
}
