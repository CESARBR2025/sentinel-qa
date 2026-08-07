'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import React from 'react'
import { labelEstatus } from '@/lib/911/estatus-c4'

interface CatalogoItem { id: number; nombre: string }

interface Props {
  tiposIncidente: CatalogoItem[]
  prioridades: CatalogoItem[]
}

const CANALES = [
  { value: '911', label: '911' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'radio', label: 'Rondín / Radio' },
]

const ESTATUS = [
  { value: 'sin_despachar', label: labelEstatus('sin_despachar', false) },
  { value: 'en_despacho', label: labelEstatus('en_despacho', false) },
  { value: 'en_sitio', label: labelEstatus('en_sitio', false) },
  { value: 'atendido', label: labelEstatus('atendido', false) },
  { value: 'cerrado_detencion', label: labelEstatus('cerrado_detencion', false) },
]

export function FiltrosIncidentes({ tiposIncidente, prioridades }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [folio, setFolio] = useState(searchParams.get('folio') ?? '')

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const aplicarFolio = () => setParam('folio', folio.trim())

  const limpiar = () => {
    setFolio('')
    router.push(pathname)
  }

  const hayFiltros = ['canal', 'estatus', 'desde', 'hasta', 'folio', 'tipoIncidenteId', 'prioridadId']
    .some(k => searchParams.get(k))

  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Folio</label>
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              value={folio}
              onChange={e => setFolio(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') aplicarFolio() }}
              placeholder="Buscar folio…"
              style={inputStyle}
            />
            <button onClick={aplicarFolio} style={btnBuscarStyle} aria-label="Buscar folio">
              <Search size={13} />
            </button>
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Canal</label>
          <select value={searchParams.get('canal') ?? ''} onChange={e => setParam('canal', e.target.value)} style={inputStyle}>
            <option value="">Todos</option>
            {CANALES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Estatus</label>
          <select value={searchParams.get('estatus') ?? ''} onChange={e => setParam('estatus', e.target.value)} style={inputStyle}>
            <option value="">Todos</option>
            {ESTATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Tipo de incidente</label>
          <select value={searchParams.get('tipoIncidenteId') ?? ''} onChange={e => setParam('tipoIncidenteId', e.target.value)} style={inputStyle}>
            <option value="">Todos</option>
            {tiposIncidente.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Prioridad</label>
          <select value={searchParams.get('prioridadId') ?? ''} onChange={e => setParam('prioridadId', e.target.value)} style={inputStyle}>
            <option value="">Todas</option>
            {prioridades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Desde</label>
          <input type="date" value={searchParams.get('desde') ?? ''} onChange={e => setParam('desde', e.target.value)} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Hasta</label>
          <input type="date" value={searchParams.get('hasta') ?? ''} onChange={e => setParam('hasta', e.target.value)} style={inputStyle} />
        </div>

        {hayFiltros && (
          <button onClick={limpiar} style={btnLimpiarStyle}>
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
    </div>
  )
}

const wrapperStyle: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 24, boxShadow: 'var(--shadow-card)' }
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', fontWeight: 500, letterSpacing: 'normal', textTransform: 'none' }
const inputStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 14, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#ffffff', color: '#1e293b', outline: 'none', width: '100%' }
const btnBuscarStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0 10px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }
const btnLimpiarStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, padding: '8px 14px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }
