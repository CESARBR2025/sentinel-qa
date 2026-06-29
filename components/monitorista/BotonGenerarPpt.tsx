'use client'

import { useState } from 'react'
import { FileText, ChevronDown } from 'lucide-react'
import React from 'react'

const PERIODOS = [
  { value: 'diario', label: 'Diario (hoy)' },
  { value: 'semanal', label: 'Semanal (esta semana)' },
  { value: 'mensual', label: 'Mensual (este mes)' },
]

export function BotonGenerarPpt({
  pendientes = 0,
  completados = 0,
}: {
  pendientes?: number
  completados?: number
}) {
  const [periodo, setPeriodo] = useState('diario')
  const [filtro, setFiltro] = useState('todos')
  const [pending, setPending] = useState(false)
  const [open, setOpen] = useState(false)

  const labelFiltro =
    filtro === 'todos' ? `Todos (${pendientes + completados})` :
    filtro === 'pendientes' ? `Pendientes (${pendientes})` :
    `Completados (${completados})`

  const handleGenerate = async () => {
    setPending(true)
    try {
      const res = await fetch('/api/monitorista/detenidos/generar-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodo, filtro }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `detenidos_${periodo}_${filtro}_${new Date().toISOString().split('T')[0]}.pptx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al generar PPT')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.1em', padding: '10px 20px',
          background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <FileText size={14} /> GENERAR PPT <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 1000,
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: 340, padding: 20,
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Generar Reporte PPT
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>Período</Label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
                style={inputStyle}>
                {PERIODOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>Incluir</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(['todos', 'pendientes', 'completados'] as const).map((f) => (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 8px', borderRadius: 2, background: filtro === f ? '#f1f5f9' : 'transparent' }}>
                    <input type="radio" name="filtro" value={f} checked={filtro === f} onChange={() => setFiltro(f)} style={{ accentColor: '#0f172a' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>
                      {f === 'todos' ? `Todos (${pendientes + completados})` : f === 'pendientes' ? `Pendientes (${pendientes})` : `Completados (${completados})`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              Se incluirán <strong>{filtro === 'todos' ? pendientes + completados : filtro === 'pendientes' ? pendientes : completados}</strong> detenido{filtro === 'todos' && pendientes + completados !== 1 ? 's' : filtro === 'pendientes' && pendientes !== 1 ? 's' : filtro === 'completados' && completados !== 1 ? 's' : ''} del período <strong>{PERIODOS.find(p => p.value === periodo)?.label}</strong>.
            </div>

            <button onClick={handleGenerate} disabled={pending}
              style={{ width: '100%', fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px', background: pending ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <FileText size={14} /> {pending ? 'GENERANDO...' : 'GENERAR PPT'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{children}</div>
)

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2,
  fontFamily: 'Inter', fontSize: 13, color: '#1e293b', outline: 'none',
}
