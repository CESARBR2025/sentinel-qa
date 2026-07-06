'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import React from 'react'
import { Toast } from '@/components/ui/Toast'

export function EditarCampoDetenido({
  reporteId,
  campo,
  label,
  valor,
}: {
  reporteId: string
  campo: string
  label: string
  valor: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState(valor || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  const handleSave = async () => {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/monitorista/detenidos/${reporteId}/editar-campo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campo, valor: texto }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      setOpen(false)
      setToast(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally { setPending(false) }
  }

  return (
    <div>
      <Toast show={toast} mensaje={`${label} actualizado`} onClose={() => setToast(false)} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b', minHeight: 18 }}>
            {valor || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin dato</span>}
          </div>
        </div>
        <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, marginTop: 16 }}>
          <Pencil size={14} />
        </button>
      </div>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 32, maxWidth: 500, width: '90%', borderRadius: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 16 }}>Editar {label}</div>
            {campo === 'delito' && (
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748b', marginBottom: 12, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, lineHeight: 1.5 }}>
                Delito tipificado cometido durante el evento (si aplica).
              </div>
            )}
            {campo === 'falta_administrativa' && (
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748b', marginBottom: 12, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, lineHeight: 1.5 }}>
                Falta al Bando de Policía y Gobierno u otros reglamentos municipales.
              </div>
            )}
            {campo === 'marco_legal' && (
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748b', marginBottom: 12, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, lineHeight: 1.5 }}>
                Artículos y fundamentos legales en los que se sustenta la falta o detención.
              </div>
            )}
            {campo === 'modus_operandi' && (
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748b', marginBottom: 12, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, lineHeight: 1.5 }}>
                Forma en que se cometió la falta o delito.
              </div>
            )}
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', resize: 'vertical' }}
              placeholder={campo === 'delito' ? 'Describe el delito...' : campo === 'marco_legal' ? 'Artículos y fundamentos legales...' : campo === 'falta_administrativa' ? 'Describe la falta administrativa...' : 'Describe el modus operandi...'}
            />
            {error && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626', marginTop: 8 }}>⚠ {error}</div>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setOpen(false)} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} disabled={pending} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending ? 'not-allowed' : 'pointer' }}>
                {pending ? 'GUARDANDO...' : 'GUARDAR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
