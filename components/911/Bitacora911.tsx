'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Eye, MapPin, Hash, AlertTriangle, Clock, Layers, Shield, CheckCircle2 } from 'lucide-react'
import type { IncidenteDetalle } from '@/lib/911/types'
import { labelEstatus, tooltipEstatus } from '@/lib/911/estatus-c4'
import { Pagination } from '@/components/911/Pagination'

// Mismo intervalo y guard de refresco que TablonDespacho (polling silencioso).
const INTERVALO_MS = 20_000
const PAGE_SIZE = 10

interface Bitacora911Props {
  canal: string
  estatus: string
  page: number
  rows: IncidenteDetalle[]
  total: number
  totalPages: number
  conteos: Record<string, number>
  totalGeneral: number
}

const thStyle: CSSProperties = {
  padding: '16px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '10px',
  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
}

const headerInnerStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px' }

const tdStyle: CSSProperties = {
  padding: '16px 12px', fontFamily: 'Inter', fontSize: '13px', color: '#475569',
}

const btnViewStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1f355a',
  fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600,
  textDecoration: 'none', textTransform: 'uppercase',
}

function getStatusBadgeStyle(estatus: string): CSSProperties {
  const base: CSSProperties = {
    padding: '4px 10px', borderRadius: '2px', fontSize: '9px',
    fontWeight: 700, fontFamily: 'JetBrains Mono', display: 'inline-block',
    border: '1px solid',
  }
  switch (estatus) {
    case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }
    case 'en_despacho':   return { ...base, background: '#eff1f3', color: '#1c3051', borderColor: '#dbdfe5' }
    case 'en_sitio':      return { ...base, background: '#f0fdfa', color: '#0f766e', borderColor: '#ccfbf1' }
    case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }
    case 'cerrado_detencion': return { ...base, background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }
    default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }
  }
}

export function Bitacora911({
  canal, estatus, page,
  rows: rowsInicial, total: totalInicial, totalPages: totalPagesInicial,
  conteos: conteosInicial, totalGeneral: totalGeneralInicial,
}: Bitacora911Props) {
  const [rows, setRows] = useState<IncidenteDetalle[]>(rowsInicial)
  const [total, setTotal] = useState(totalInicial)
  const [totalPages, setTotalPages] = useState(totalPagesInicial)
  const [conteos, setConteos] = useState(conteosInicial)
  const [totalGeneral, setTotalGeneral] = useState(totalGeneralInicial)
  const refrescandoRef = useRef(false)

  const cargar = useCallback(async () => {
    try {
      const params = new URLSearchParams({ canal })
      if (estatus) params.set('estatus', estatus)
      if (page > 1) params.set('page', String(page))
      const res = await fetch(`/api/incidentes/bitacora-911?${params.toString()}`)
      if (!res.ok) return
      const data = await res.json()
      setRows(data.rows)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setConteos(data.conteos)
      setTotalGeneral(data.totalGeneral)
    } catch {
      // Refresco silencioso: no romper la vista si falla
    }
  }, [canal, estatus, page])

  // Sincronización con props del servidor se maneja remontando el componente
  // vía `key` (${estatus}-${page}) en la página → aquí no hace falta sync effect.

  // Carga inicial (tras hidratación) y cada vez que cambia estatus/página
  useEffect(() => {
    const timer = setTimeout(() => { cargar() }, 0)
    return () => clearTimeout(timer)
  }, [cargar])

  // Polling cada 20s (sin sobreponer requests en curso)
  useEffect(() => {
    const id = setInterval(() => {
      if (refrescandoRef.current) return
      refrescandoRef.current = true
      cargar().finally(() => { refrescandoRef.current = false })
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [cargar])

  const TABS = [
    { key: '', label: 'TODOS', count: totalGeneral, icon: <Layers size={13} />, accent: '#64748b' },
    { key: 'en_despacho', label: labelEstatus('en_despacho'), count: conteos.en_despacho || 0, icon: <Shield size={13} />, accent: '#1c3051' },
    { key: 'cerrado', label: 'ATENDIDOS', count: (conteos.atendido || 0) + (conteos.cerrado_detencion || 0), icon: <CheckCircle2 size={13} />, accent: '#15803d' },
  ]

  const etiquetaVacio = estatus ? (TABS.find(t => t.key === estatus)?.label ?? '') : ''

  return (
    <>
      <style>{`
        .fila-incidente { transition: background 0.15s ease; }
        .fila-incidente:hover { background: #f8fafc; }
        .fila-incidente:hover .btn-ver-ficha { color: #1c3051; }
      `}</style>

      {/* Segment control por estatus (estilo tablón de despacho) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 24 }}>
        {TABS.map(t => {
          const activo = estatus === t.key
          return (
            <Link
              key={t.key}
              href={t.key ? `/agente_911/ciudadano/incidentes?estatus=${t.key}` : '/agente_911/ciudadano/incidentes'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
                fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
                border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all .15s', textDecoration: 'none',
                background: activo ? t.accent : '#ffffff',
                color: activo ? '#ffffff' : '#64748b',
                borderBottom: activo ? `2px solid ${t.accent}` : '2px solid transparent',
              }}
            >
              {t.icon}
              {t.label}
              <span style={{
                fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                background: activo ? 'rgba(255,255,255,.2)' : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 8, lineHeight: '18px',
              }}>
                {t.count}
              </span>
            </Link>
          )
        })}
      </div>

      <div style={{ overflowX: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={thStyle}><div style={headerInnerStyle}><Hash size={12} /> FOLIO</div></th>
              <th style={{ ...thStyle, fontFamily: 'JetBrains Mono', fontSize: '9px' }}>FOLIO CAD</th>
              <th style={{ ...thStyle, fontFamily: 'JetBrains Mono', fontSize: '9px' }}>CÓDIGO</th>
              <th style={thStyle}><div style={headerInnerStyle}><Clock size={12} /> HORA</div></th>
              <th style={thStyle}><div style={headerInnerStyle}><AlertTriangle size={12} /> INCIDENTE</div></th>
              <th style={thStyle}><div style={headerInnerStyle}><MapPin size={12} /> COLONIA</div></th>
              <th style={thStyle}>PRIORIDAD</th>
              <th style={thStyle}>ESTATUS</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                  {estatus
                    ? `NO HAY REPORTES EN ESTADO "${etiquetaVacio}"`
                    : 'SIN REPORTES 911 REGISTRADOS'}
                </td>
              </tr>
            ) : (
              rows.map((item, index) => {
                const isNewest = page === 1 && index === 0
                const fecha = new Date(item.fechaHoraInicio)
                const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
                const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                return (
                  <tr key={item.id} className="fila-incidente" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#0f172a', position: 'relative' }}>
                      <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} style={{
                        position: 'absolute', inset: 0, display: 'block', zIndex: 1,
                      }} aria-label={`Ver detalle de ${item.folio}`} />
                      {item.folio}
                      {isNewest && (
                        <span style={{
                          marginLeft: 8, padding: '2px 6px', borderRadius: 2, fontSize: 8,
                          fontWeight: 700, background: '#16a34a', color: '#fff',
                          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                          verticalAlign: 'middle',
                        }}>NUEVO</span>
                      )}
                      {item.svvNotificado && (
                        <span style={{
                          marginLeft: 6, padding: '2px 6px', borderRadius: 2, fontSize: 8,
                          fontWeight: 700, background: '#eff1f3', color: '#1c3051',
                          border: '1px solid #c3c8d2',
                          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                          verticalAlign: 'middle',
                        }}>SVV</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8' }}>
                      {item.folioCad || '—'}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', letterSpacing: '0.02em' }}>
                      {item.codigoCatalogo || '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{fechaStr}</span>
                      {' · '}
                      <span>{horaStr}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {item.tipoNombre?.toUpperCase() || 'NO ESPECIFICADO'}
                    </td>
                    <td style={tdStyle}>
                      {item.colonia?.toUpperCase() || 'UBICACIÓN EN CURSO'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '10px', fontWeight: 800,
                        color: item.prioridadNombre?.toUpperCase() === 'ALTA' ? '#ef4444' : '#64748b',
                      }}>
                        {item.prioridadNombre || 'MEDIA'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={getStatusBadgeStyle(item.estatus)} title={tooltipEstatus(item.estatus)}>
                        {labelEstatus(item.estatus)}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} className="btn-ver-ficha" style={btnViewStyle}>
                        <Eye size={14} />
                        VER FICHA
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={total}
        pageSize={PAGE_SIZE}
        baseUrl={estatus ? `/agente_911/ciudadano/incidentes?estatus=${estatus}` : '/agente_911/ciudadano/incidentes'}
      />
    </>
  )
}
