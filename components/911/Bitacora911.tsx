'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import {
  Eye, MapPin, Hash, AlertTriangle, Clock, Layers, Shield, Inbox,
  RefreshCw, Navigation, CheckCircle2, ShieldAlert, FileSearch,
  TriangleAlert, ChevronRight,
} from 'lucide-react'
import type { IncidenteDetalle } from '@/lib/911/types'
import { labelEstatus, tooltipEstatus } from '@/lib/911/estatus-c4'
import { Pagination } from '@/components/911/Pagination'

// Mismo intervalo y guard de refresco que TablonDespacho (polling silencioso).
const INTERVALO_MS = 20_000
const PAGE_SIZE = 10

interface Bitacora911Props {
  canal: string
  canalizacion: string
  page: number
  rows: IncidenteDetalle[]
  total: number
  totalPages: number
  conteos: Record<string, number>
  totalGeneral: number
}

const thStyle: CSSProperties = {
  padding: '14px 12px', textAlign: 'left', fontFamily: 'var(--apple-font-display)', fontSize: '12px',
  color: '#64748b', textTransform: 'none', letterSpacing: 'normal', fontWeight: 600,
  background: '#f8fafc', whiteSpace: 'nowrap',
}

const headerInnerStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px' }

const tdStyle: CSSProperties = {
  padding: '14px 12px', fontFamily: 'var(--apple-font-display)', fontSize: '13px', color: '#475569',
}

const ETIQUETA_CANAL: Record<string, string> = {
  '911': 'Reportes 911',
  'whatsapp': 'Reportes WhatsApp',
  'radio': 'Reportes Radio',
}

const ETIQUETA_TIPO: Record<string, string> = {
  'normal': 'Normal',
  'extorsion': 'Extorsión',
  'alarma_escolar': 'Alarma Escolar',
}

const TIPO_COLOR: Record<string, { strong: string; bg: string }> = {
  'normal':         { strong: '#475569', bg: '#f1f5f9' },
  'extorsion':      { strong: '#b91c1c', bg: '#fee2e2' },
  'alarma_escolar': { strong: '#15803d', bg: '#dcfce7' },
}

function getTipoBadgeStyle(tipo: string): CSSProperties {
  const base: CSSProperties = {
    padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px',
    fontWeight: 600, fontFamily: 'var(--apple-font-display)', display: 'inline-flex',
    alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
  }
  const c = TIPO_COLOR[tipo]
  if (!c) return { ...base, background: '#f8fafc', color: '#64748b' }
  return { ...base, background: c.bg, color: c.strong }
}

// Paleta semántica de estado (DESIGN.md §2 — pareja bg + color fuerte).
const ESTATUS_COLOR: Record<string, { strong: string; bg: string }> = {
  sin_despachar:     { strong: '#b45309', bg: '#fef3c7' },
  en_despacho:       { strong: '#1f355a', bg: '#f1f5f9' },
  en_sitio:          { strong: '#0f766e', bg: '#ccfbf1' },
  atendido:          { strong: '#16a34a', bg: '#dcfce7' },
  cerrado_detencion: { strong: '#7c3aed', bg: '#f5f3ff' },
}

const ESTATUS_ICON: Record<string, ReactNode> = {
  sin_despachar:     <Clock size={12} />,
  en_despacho:       <Navigation size={12} />,
  en_sitio:          <MapPin size={12} />,
  atendido:          <CheckCircle2 size={12} />,
  cerrado_detencion: <ShieldAlert size={12} />,
}

function getStatusBadgeStyle(estatus: string): CSSProperties {
  const base: CSSProperties = {
    padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px',
    fontWeight: 600, fontFamily: 'var(--apple-font-display)', display: 'inline-flex',
    alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
  }
  const c = ESTATUS_COLOR[estatus]
  if (!c) return { ...base, background: '#f8fafc', color: '#64748b' }
  return { ...base, background: c.bg, color: c.strong }
}

const COLOR_PRIORIDAD: Record<string, string> = {
  'ALTA': '#dc2626',
  'MEDIA': '#b45309',
  'BAJA': '#64748b',
}

export function Bitacora911({
  canal, canalizacion, page,
  rows: rowsInicial, total: totalInicial, totalPages: totalPagesInicial,
  conteos: conteosInicial, totalGeneral: totalGeneralInicial,
}: Bitacora911Props) {
  const [rows, setRows] = useState<IncidenteDetalle[]>(rowsInicial)
  const [total, setTotal] = useState(totalInicial)
  const [totalPages, setTotalPages] = useState(totalPagesInicial)
  const [conteos, setConteos] = useState(conteosInicial)
  const [totalGeneral, setTotalGeneral] = useState(totalGeneralInicial)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)
  const refrescandoRef = useRef(false)

  const cargar = useCallback(async () => {
    try {
      const params = new URLSearchParams({ canal })
      if (canalizacion) params.set('canalizacion', canalizacion)
      if (page > 1) params.set('page', String(page))
      const res = await fetch(`/api/incidentes/bitacora-911?${params.toString()}`)
      if (!res.ok) return
      const data = await res.json()
      setRows(data.rows)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setConteos(data.conteos)
      setTotalGeneral(data.totalGeneral)
      setUltimaActualizacion(new Date())
    } catch {
      // Refresco silencioso: no romper la vista si falla
    }
  }, [canal, canalizacion, page])

  // Sincronización con props del servidor se maneja remontando el componente
  // vía `key` (${canalizacion}-${page}) en la página → aquí no hace falta sync effect.

  // Carga inicial (tras hidratación) y cada vez que cambia canalización/página
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
    { key: '', label: 'Todos', count: totalGeneral, icon: <Layers size={13} />, accent: '#1f355a' },
    { key: 'canalizados', label: 'Canalizados', count: conteos.canalizados || 0, icon: <Shield size={13} />, accent: '#1f355a' },
    { key: 'sin_canalizacion', label: 'Sin canalización', count: conteos.sin_canalizacion || 0, icon: <Inbox size={13} />, accent: '#15803d' },
  ]

  const etiquetaVacio = canalizacion ? (TABS.find(t => t.key === canalizacion)?.label ?? '') : ''

  const ahora = ultimaActualizacion?.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <>
      <style>{`
        @keyframes bitacora-fila-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
        }
        .fila-incidente { transition: background 0.15s ease; animation: bitacora-fila-in .3s ease-out both; }
        .fila-incidente:hover { background: #f8fafc; }
        .fila-incidente:hover .btn-ver-ficha { background: rgba(31,53,90,0.1); color: #1f355a; }
        .fila-incidente:active { background: #f1f5f9; }
        .btn-ver-ficha { transition: background .15s ease, color .15s ease, transform .12s ease; }
        .btn-ver-ficha:active { transform: scale(0.94); }
        .seg-pill { transition: all .15s ease; }
        .seg-pill:active { transform: scale(0.96); }
        @media (prefers-reduced-motion: reduce) {
          .fila-incidente { animation: none; }
          .btn-ver-ficha:active, .seg-pill:active { transform: none; }
        }
      `}</style>

      {/* Segment control por canalización */}
      <div className="scrollbar-hide" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 6, marginBottom: 24 }}>
        {TABS.map(t => {
          const activo = canalizacion === t.key
          return (
            <Link
              key={t.key}
              className="seg-pill"
              href={t.key ? `/agente_911/ciudadano/incidentes?canalizacion=${t.key}` : '/agente_911/ciudadano/incidentes'}
              aria-current={activo ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px clamp(14px, 4vw, 20px)',
                fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14, textTransform: 'none', letterSpacing: 'normal',
                border: 'none', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                background: activo ? t.accent : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {t.icon}
              {t.label}
              <span style={{
                fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600,
                background: activo ? 'rgba(255,255,255,.22)' : '#e2e8f0',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 'var(--radius-full)', lineHeight: '18px',
              }}>
                {t.count}
              </span>
            </Link>
          )
        })}
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {/* Cabecera de la tarjeta */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          padding: '14px 22px', borderBottom: '1px solid #eef2f7',
          fontFamily: 'var(--apple-font-display)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: '#0f172a' }}>
            <Layers size={15} color="#1f355a" />
            {ETIQUETA_CANAL[canal] ?? 'Reportes'}
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#64748b', background: '#f1f5f9',
              padding: '1px 8px', borderRadius: 'var(--radius-full)', fontVariantNumeric: 'tabular-nums',
            }}>
              {total}
            </span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>
            <RefreshCw size={13} style={{ opacity: ahora ? 1 : 0.5 }} />
            {ahora ? `Actualizado · ${ahora}` : 'Sincronizando…'}
          </span>
        </div>

        <div className="tabla-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}><div style={headerInnerStyle}><Hash size={12} /> Folio</div></th>
              <th style={thStyle}>Folio CAD</th>
              <th style={thStyle}><div style={headerInnerStyle}><Layers size={12} /> Tipo</div></th>
              <th style={thStyle}><div style={headerInnerStyle}><Clock size={12} /> Hora</div></th>
              <th style={thStyle}><div style={headerInnerStyle}><AlertTriangle size={12} /> Incidente</div></th>
              <th style={thStyle}><div style={headerInnerStyle}><MapPin size={12} /> Colonia</div></th>
              <th style={thStyle}>Prioridad</th>
              <th style={thStyle}>Estatus</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '64px 24px', textAlign: 'center', color: '#94a3b8', fontFamily: 'var(--apple-font-display)' }}>
                  <FileSearch size={30} strokeWidth={1.5} style={{ margin: '0 auto 14px', opacity: 0.5, display: 'block' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>
                    {canalizacion
                      ? `No hay reportes en la categoría "${etiquetaVacio}"`
                      : 'Sin reportes 911 registrados'}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4, color: '#94a3b8' }}>
                    Los reportes nuevos aparecerán aquí al registrarse
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((item, index) => {
                const isNewest = page === 1 && index === 0
                const fecha = new Date(item.fechaHoraInicio)
                const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
                const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                const prio = (item.prioridadNombre || 'MEDIA').toUpperCase()
                const prioColor = COLOR_PRIORIDAD[prio] ?? '#64748b'
                return (
                  <tr key={item.id} className="fila-incidente" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'var(--apple-font-display)', color: '#0f172a', position: 'relative' }}>
                      <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} style={{
                        position: 'absolute', inset: 0, display: 'block', zIndex: 1,
                      }} aria-label={`Ver detalle de ${item.folio}`} />
                      {item.folio}
                      {isNewest && (
                        <span style={{
                          marginLeft: 8, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11,
                          fontWeight: 600, background: '#16a34a', color: '#fff',
                          fontFamily: 'var(--apple-font-display)',
                          verticalAlign: 'middle', letterSpacing: 'normal',
                        }}>Nuevo</span>
                      )}
                      {item.svvNotificado && (
                        <span style={{
                          marginLeft: 6, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11,
                          fontWeight: 600, background: '#f1f5f9', color: '#1f355a',
                          border: '1px solid #e2e8f0',
                          fontFamily: 'var(--apple-font-display)',
                          verticalAlign: 'middle', letterSpacing: 'normal',
                        }}>SVV</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#94a3b8' }}>
                      {item.folioCad || '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={getTipoBadgeStyle(item.tipoReporte)}>
                        {ETIQUETA_TIPO[item.tipoReporte] ?? (item.tipoReporte || '—')}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{fechaStr}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{horaStr}</span>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#334155' }}>
                      {item.tipoNombre || 'No especificado'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                        <MapPin size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        {item.colonia || 'Ubicación en curso'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: '13px', fontWeight: 600, color: prioColor,
                      }}>
                        {prio === 'ALTA' && <TriangleAlert size={13} />}
                        {prio}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={getStatusBadgeStyle(item.estatus)} title={tooltipEstatus(item.estatus)}>
                        {ESTATUS_ICON[item.estatus]}
                        {labelEstatus(item.estatus)}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} className="btn-ver-ficha" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                        background: '#f1f5f9', color: '#1f355a', borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600,
                        textDecoration: 'none', textTransform: 'none',
                      }}>
                        <Eye size={13} />
                        Ficha
                        <ChevronRight size={12} style={{ opacity: 0.6 }} />
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
          baseUrl={canalizacion ? `/agente_911/ciudadano/incidentes?canalizacion=${canalizacion}` : '/agente_911/ciudadano/incidentes'}
        />
      </div>
    </>
  )
}
