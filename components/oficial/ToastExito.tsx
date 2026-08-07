'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

export function ToastExito({ show: initialShow, folio, ocupado = false }: { show: boolean; folio?: string; ocupado?: boolean }) {
  const [visible, setVisible] = useState(initialShow)

  useEffect(() => {
    if (!initialShow) return
    const timer = setTimeout(() => setVisible(false), ocupado ? 8000 : 5000)
    return () => clearTimeout(timer)
  }, [initialShow, ocupado])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#0f172a', color: '#ffffff', padding: '16px 24px',
      borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: 12,
      fontFamily: 'var(--apple-font-display)', fontSize: 13,
      borderLeft: '4px solid #22c55e', boxShadow: 'var(--shadow-modal)',
      animation: 'slideIn 0.3s ease', maxWidth: 360,
    }}>
      <CheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>{folio ? `Reporte registrado: ${folio}` : 'Reporte registrado exitosamente'}</span>
        {ocupado && (
          <span style={{ color: '#fbbf24', fontSize: 12, lineHeight: 1.4 }}>
            Como ya tienes un despacho activo, no se te preasignó — despacho enviará a otro personal disponible.
          </span>
        )}
      </span>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 8, flexShrink: 0 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
