'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarRange, Search, RotateCcw, CalendarDays, Phone } from 'lucide-react'

const chip = (activo: boolean): React.CSSProperties => ({
  fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
  padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid #e2e8f0',
  background: activo ? '#1f355a' : '#fff', color: activo ? '#fff' : '#64748b',
  cursor: 'pointer', transition: 'all .2s ease', whiteSpace: 'nowrap',
})

export function FiltroRangoFechas({ basePath = '/agente_911/reportes/numeros' }: { basePath?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [from, setFrom] = useState(params.get('from') ?? '')
  const [to, setTo] = useState(params.get('to') ?? '')

  const aplicar = (f = from, t = to) => {
    const p = new URLSearchParams()
    if (f) p.set('from', f)
    if (t) p.set('to', t)
    router.push(`${basePath}?${p.toString()}`)
  }

  const limpiar = () => {
    setFrom('')
    setTo('')
    router.push(basePath)
  }

  const setRango = (dias: number) => {
    const hoy = new Date()
    const f = new Date(hoy)
    f.setDate(hoy.getDate() - (dias - 1))
    const fmt = (d: Date) => d.toISOString().split('T')[0]
    setFrom(fmt(f))
    setTo(fmt(hoy))
    aplicar(fmt(f), fmt(hoy))
  }

  const inputWrap: React.CSSProperties = {
    position: 'relative', display: 'flex', alignItems: 'center',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 13px 11px 40px', background: '#f8fafc',
    border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
    fontFamily: 'var(--apple-font-display)', fontSize: 14, color: '#1e293b',
    outline: 'none', transition: 'border-color .2s ease, box-shadow .2s ease, background .2s ease',
  }
  const label: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12,
    color: '#64748b', margin: '0 0 7px', display: 'flex', alignItems: 'center', gap: 6,
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #eef2f7', background: 'linear-gradient(180deg,#f8fafc,#f1f5f9)' }}>
        <span style={{ width: 3, height: 18, background: '#1f355a', borderRadius: 'var(--radius-full)' }} />
        <CalendarRange size={16} color="#1f355a" />
        <h3 style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16, color: '#0f172a', margin: 0 }}>Rango de fechas</h3>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 400, fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>Filtra los números reportados por periodo</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', padding: 20 }}>
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <label style={label}><CalendarDays size={13} color="#64748b" /> Fecha inicial</label>
          <div style={inputWrap}>
            <input type="date" style={inputStyle} value={from} onChange={e => setFrom(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 12 }}>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8' }}>—</span>
        </div>

        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <label style={label}><Phone size={13} color="#64748b" /> Fecha final</label>
          <div style={inputWrap}>
            <input type="date" style={inputStyle} value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          <button
            onClick={() => aplicar()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14,
              padding: '11px 22px', background: '#1f355a', color: '#fff',
              borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(31,53,90,0.28)',
            }}
          >
            <Search size={16} /> Generar reporte
          </button>
          <button
            onClick={limpiar}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
              fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 14,
              padding: '11px 18px', background: '#fff', color: '#64748b',
              borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} /> Limpiar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '12px 20px', borderTop: '1px solid #eef2f7', background: '#f8fafc' }}>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12, color: '#64748b' }}>Accesos rápidos:</span>
        <button onClick={() => setRango(1)} style={chip(from === new Date().toISOString().split('T')[0] && to === from)}>Hoy</button>
        <button onClick={() => setRango(7)} style={chip(false)}>Últimos 7 días</button>
        <button onClick={() => setRango(30)} style={chip(false)}>Últimos 30 días</button>
      </div>
    </div>
  )
}