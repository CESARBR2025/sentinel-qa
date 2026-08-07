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

// Toast, no banner: no bloquea el header ni empuja el layout — se acomoda
// como cualquier otro ToastExito del sistema (ver components/oficial/ToastExito.tsx),
// solo que sin auto-dismiss porque es un despacho crítico y no debe
// desaparecer antes de que el operador lo note.
export function AlertaCriticaToast({ critica, onVer, onDescartar }: Props) {
  const router = useRouter()

  function ver() {
    onVer()
    if (critica.href) router.push(critica.href)
  }

  return createPortal(
    <div
      role="alert"
      style={{
        position: 'fixed', top: 'calc(16px + env(safe-area-inset-top))', right: 16, zIndex: 999999,
        width: 360, maxWidth: 'calc(100vw - 32px)',
        background: '#0f172a', color: '#fff',
        padding: '14px 16px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #dc2626',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        boxShadow: 'var(--shadow-modal)',
        animation: 'alerta-critica-in .3s ease',
      }}
    >
      <Siren size={20} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Alerta crítica
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>
          {critica.titulo}
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12.5, fontWeight: 400, opacity: 0.85, marginTop: 2, lineHeight: 1.45 }}>
          {critica.mensaje}
        </div>
        <button type="button" onClick={ver} style={{
          marginTop: 10, background: '#dc2626', color: '#fff', border: 'none',
          padding: '7px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          fontFamily: 'var(--apple-font-display)', fontSize: 12.5, fontWeight: 600,
        }}>
          Ver
        </button>
      </div>
      <button type="button" onClick={onDescartar} aria-label="Descartar" style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, background: 'none', border: 'none', borderRadius: 'var(--radius-md)',
        color: '#94a3b8', opacity: 0.9, cursor: 'pointer', marginTop: -2, marginRight: -4,
      }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes alerta-critica-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [role="alert"] { animation: none !important; }
        }
      `}</style>
    </div>,
    document.body,
  )
}
