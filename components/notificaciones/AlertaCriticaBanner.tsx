'use client'

import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Siren, X } from 'lucide-react'

interface CriticaVisible {
  id: string
  titulo: string
  mensaje: string
  href: string | null
}

interface Props {
  critica: CriticaVisible
  onVer: () => void
  onDescartar: () => void
}

export function AlertaCriticaBanner({ critica, onVer, onDescartar }: Props) {
  const router = useRouter()

  function ver() {
    onVer()
    if (critica.href) router.push(critica.href)
  }

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2147483000,
      background: '#dc2626', color: '#fff',
      padding: '12px 16px', paddingTop: 'calc(12px + env(safe-area-inset-top))',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    }}>
      <Siren size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, opacity: 0.85 }}>
          Alerta crítica
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13.5, fontWeight: 600 }}>
          {critica.titulo}
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 400, opacity: 0.9 }}>
          {critica.mensaje}
        </div>
      </div>
      <button type="button" onClick={ver} style={{
        flexShrink: 0, background: '#fff', color: '#dc2626', border: 'none',
        padding: '9px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600,
      }}>
        Ver
      </button>
      <button type="button" onClick={onDescartar} aria-label="Descartar" style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32, background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)',
        color: '#fff', opacity: 0.85, cursor: 'pointer',
      }}>
        <X size={18} />
      </button>
    </div>,
    document.body,
  )
}
