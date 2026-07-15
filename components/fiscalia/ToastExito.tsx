'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

export function ToastExito({ show: initialShow }: { show: boolean }) {
  const [visible, setVisible] = useState(initialShow)

  useEffect(() => {
    if (!initialShow) return
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [initialShow])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#0f172a', color: '#ffffff', padding: '16px 24px',
      borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      borderLeft: '4px solid #22c55e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.3s ease',
    }}>
      <CheckCircle size={20} color="#22c55e" />
      <span>Reporte registrado exitosamente</span>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
