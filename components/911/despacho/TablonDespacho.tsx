'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { DespachoForm } from '@/components/911/despacho/DespachoForm'
import MapaSeguimientoOficial from '@/components/911/despacho/MapaSeguimientoOficial'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'
import { labelEstatus } from '@/lib/911/estatus-c4'
import { MapPin, Clock, Phone, MessageSquare, Radio, Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const INTERVALO_MS = 20_000
const SLA_MINUTOS: Record<string, number> = { ALTA: 10, MEDIA: 20, BAJA: 40 }

interface UnidadRow {
  id?: string; placa: string | null; esRefuerzo?: boolean
  horaSalida?: string | null; horaLlegada?: string | null
  patrullaId?: string | null; ultimaLat?: number | null; ultimaLng?: number | null; ultimaUbicacionEn?: string | null
}
interface ElementoRow {
  nombre: string | null; nomina: string | null
  esPrioritario?: boolean; esRefuerzo?: boolean
  oficialId?: string | null; ultimaLat?: number | null; ultimaLng?: number | null; ultimaUbicacionEn?: string | null
}

interface CardData {
  id: string; folio: string; canal: string
  estatus: string
  fechaHoraInicio: string; calle: string | null; colonia: string | null
  descripcion: string | null; tipoIncidente: string | null
  prioridad: string | null; capturadoPor: string | null
  origenRondin: boolean
  despachoId: string | null; fechaHoraDespacho: string | null
  unidades: UnidadRow[]; elementos: ElementoRow[]
  accionesRealizadas: string | null; hayDetencion: boolean | null
  ofiAutoridadRecibe: string | null; d1Pendiente: boolean
  prioritarioNombre: string | null; prioritarioNomina: string | null; prioritarioPatrullaId?: string | null
  latitud?: number | null; longitud?: number | null
}

type TabKey = 'pendientes' | 'en_despacho' | 'atendidos'

function tiempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `${Math.floor(h / 24)}d`
}

function slaPorcentaje(iso: string, prioridad: string | null): number {
  const umbral = SLA_MINUTOS[(prioridad ?? '').toUpperCase()] ?? SLA_MINUTOS.MEDIA
  const minutos = (Date.now() - new Date(iso).getTime()) / 60_000
  return Math.min(100, Math.round((minutos / umbral) * 100))
}

function esHoy(iso: string): boolean {
  const d = new Date(iso); const h = new Date()
  return d.getDate() === h.getDate() && d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear()
}

function CanalBadge({ canal, origenRondin }: { canal: string; origenRondin?: boolean }) {
  const label = origenRondin ? 'Rondín' : canal
  const config: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    '911':      { icon: <Phone size={11} />,         color: '#dc2626', bg: '#fef2f2' },
    'whatsapp': { icon: <MessageSquare size={11} />, color: '#059669', bg: '#f0fdf4' },
    'radio':    { icon: <Radio size={11} />,         color: '#1f355a', bg: '#eff1f3' },
  }
  const c = origenRondin
    ? { icon: config[canal]?.icon ?? null, color: '#1e40af', bg: '#eff6ff' }
    : config[canal] ?? { icon: null, color: '#64748b', bg: '#f8fafc' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: c.bg, color: c.color, borderRadius: 'var(--radius-full)' }}>
      {c.icon} {label}
    </span>
  )
}

const TABS: { key: TabKey; label: string; icon: React.ReactNode; accent: string }[] = [
  { key: 'pendientes',  label: 'Pendientes',  icon: <AlertTriangle size={13} />, accent: '#b45309' },
  { key: 'en_despacho', label: labelEstatus('en_despacho'), icon: <Shield size={13} />, accent: '#1f355a' },
  { key: 'atendidos',   label: 'Atendidos',   icon: <CheckCircle2 size={13} />,  accent: '#15803d' },
]

// ─── Componente principal ───────────────────────────────────────────────────

export function TablonDespacho() {
  const [pendientes, setPendientes] = useState<CardData[]>([])
  const [enDespacho, setEnDespacho] = useState<CardData[]>([])
  const [atendidos,  setAtendidos]  = useState<CardData[]>([])
  const [cargando,   setCargando]   = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [tab,        setTab]        = useState<TabKey>('pendientes')
  const [expandido,  setExpandido]  = useState<string | null>(null)
  const refrescandoRef = useRef(false)

  const cargarLista = useCallback(async (url: string): Promise<CardData[]> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
    return res.json()
  }, [])

  const cargarTodo = useCallback(async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    if (!silencioso) setError(null)
    try {
      const [p, e, a] = await Promise.all([
        cargarLista('/api/incidentes/pendientes-despacho'),
        cargarLista('/api/incidentes/en-despacho'),
        cargarLista('/api/incidentes/atendidos'),
      ])
      setPendientes(p as unknown as CardData[])
      setEnDespacho(e as unknown as CardData[])
      setAtendidos(a as unknown as CardData[])
    } catch (e) {
      if (!silencioso) setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      if (!silencioso) setCargando(false)
    }
  }, [cargarLista])

  useEffect(() => {
    const timer = setTimeout(() => { cargarTodo() }, 0)
    return () => clearTimeout(timer)
  }, [cargarTodo])

  useEffect(() => {
    const id = setInterval(() => {
      if (refrescandoRef.current) return
      refrescandoRef.current = true
      cargarTodo(true).finally(() => { refrescandoRef.current = false })
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [cargarTodo])

  const listaActual = tab === 'pendientes' ? pendientes : tab === 'en_despacho' ? enDespacho : atendidos

  const cambiarTab = (t: TabKey) => { setTab(t); setExpandido(null) }

  return (
    <div>
      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
          Error: {error}
          <button onClick={() => cargarTodo()} style={{ marginLeft: 16, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, background: 'none', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', padding: '2px 10px', color: '#dc2626', cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Segment control */}
      <div className="scrollbar-hide" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 6, marginBottom: 24 }}>
        {TABS.map(t => {
          const activo = tab === t.key
          const conteo = t.key === 'pendientes' ? pendientes.length : t.key === 'en_despacho' ? enDespacho.length : atendidos.length
          return (
            <button key={t.key} onClick={() => cambiarTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px clamp(14px, 4vw, 20px)',
                fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14, textTransform: 'none', letterSpacing: 'normal',
                border: 'none', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0,
                background: activo ? t.accent : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
                borderRadius: 'var(--radius-full)',
              }}>
              {t.icon}
              {t.label}
              <span style={{
                fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600,
                background: activo ? 'rgba(255,255,255,.22)' : '#e2e8f0',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 'var(--radius-full)', lineHeight: '18px',
              }}>
                {conteo}
              </span>
            </button>
          )
        })}
      </div>

      {/* Estado vacío */}
      {!cargando && listaActual.length === 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, color: '#64748b', textTransform: 'none', letterSpacing: 'normal', marginBottom: 8 }}>Sin registros</div>
          <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay incidentes en este estado</p>
        </div>
      )}

      {/* Lista plana */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {listaActual.map(card => (
          <CardRow
            key={card.id}
            card={card}
            abierto={expandido === card.id}
            tab={tab}
            onToggle={() => setExpandido(expandido === card.id ? null : card.id)}
            onCambio={() => { cargarTodo() }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ─── Fila de incidente ──────────────────────────────────────────────────────

function CardRow({ card, abierto, tab, onToggle, onCambio }: {
  card: CardData; abierto: boolean; tab: TabKey
  onToggle: () => void; onCambio: () => void
}) {
  const pc = colorPorPrioridad(card.prioridad)
  const urgente = slaPorcentaje(card.fechaHoraInicio, card.prioridad) >= 75

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid #e2e8f0' }}>
      <div
        onClick={onToggle}
        style={{
          borderLeft: `4px solid ${pc.principal}`,
          padding: '16px 20px', cursor: 'pointer',
          transition: 'background .1s',
          background: abierto ? '#f8fafc' : '#ffffff',
        }}>
        {/* Línea 1: folio + badges + tiempo */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>{card.folio}</span>
          <CanalBadge canal={card.canal} origenRondin={card.origenRondin} />
          <span style={{
            fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px',
            background: pc.fondo, color: pc.oscuro, border: `1px solid ${pc.principal}`,
            borderRadius: 'var(--radius-full)', textTransform: 'none', letterSpacing: 'normal',
          }}>
            {card.prioridad ?? 'Sin prioridad'}
          </span>
          {urgente && tab === 'pendientes' && (
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-full)' }}>
              <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> SLA
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {esHoy(card.fechaHoraInicio) && (
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#eff6ff', color: '#1e40af', borderRadius: 'var(--radius-full)' }}>
                Hoy
              </span>
            )}
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <Clock size={11} /> {tiempoRelativo(card.fechaHoraInicio)}
            </span>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8', transition: 'transform .2s', display: 'inline-block', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </div>
        </div>

        {/* Línea 2: tipo incidente */}
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6, lineHeight: 1.4 }}>
          {card.tipoIncidente || 'Sin clasificar'}
        </div>

        {/* Línea 3: ubicación */}
        {card.calle && (
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <MapPin size={12} color="#94a3b8" />
            {card.calle}{card.colonia ? `, ${card.colonia}` : ''}
          </div>
        )}

        {/* Línea 4: ficha completa */}
        <div style={{ marginTop: 4 }}>
          <Link href={card.canal === 'whatsapp' ? `/agente_911/whatsapp/incidentes/${card.id}` : card.canal === 'radio' ? `/agente_911/rondin/incidentes/${card.id}` : `/agente_911/ciudadano/incidentes/${card.id}`}
            onClick={e => e.stopPropagation()}
            style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)', padding: '4px 12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: 'normal', textTransform: 'none' }}>
            <FileText size={11} /> Más detalles del reporte →
          </Link>
        </div>
      </div>

      {/* Expandido */}
      {abierto && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ─── PERSONAL ASIGNADO ─── */}
          {(card.unidades?.length > 0 || card.elementos?.length > 0) && (
            <div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', marginBottom: 8 }}>
                Personal asignado
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {card.unidades.map((u, i) => (
                  <div key={u.id || i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600,
                    padding: '5px 10px',
                    background: u.horaSalida ? '#f0fdf4' : u.esRefuerzo ? '#fff7ed' : '#f1f5f9',
                    border: `1px solid ${u.horaSalida ? '#bbf7d0' : u.esRefuerzo ? '#fed7aa' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-full)',
                  }}>
                    <span style={{ color: u.horaSalida ? '#16a34a' : u.esRefuerzo ? '#c2410c' : '#1f355a' }}>
                      {u.placa || '—'}
                    </span>
                    {u.esRefuerzo && <span style={{ fontSize: 11, opacity: .7 }}>Ref</span>}
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginLeft: 4 }}>
                      {u.horaSalida
                        ? `Salió ${new Date(u.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Pendiente'}
                    </span>
                    {u.horaLlegada && (
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
                        · Llegó {new Date(u.horaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
                {card.elementos.map((e, i) => (
                  <div key={`e-${i}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--apple-font-display)', fontSize: 13,
                    padding: '5px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-full)',
                  }}>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{e.nombre || '—'}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>({e.nomina || 's/n'})</span>
                    {e.esPrioritario && <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 5px', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-full)' }}>P</span>}
                    {e.esRefuerzo && <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 5px', background: '#fed7aa', color: '#c2410c', borderRadius: 'var(--radius-full)' }}>R</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── UBICACIÓN EN VIVO DEL OFICIAL (solo en_despacho) ─── */}
          {tab === 'en_despacho' && card.latitud != null && card.longitud != null && (
            <div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', marginBottom: 8 }}>
                Ubicación en vivo del oficial
              </div>
              <MapaSeguimientoOficial
                incidenteLat={card.latitud}
                incidenteLng={card.longitud}
                prioridad={card.prioridad}
                puntos={[
                  ...card.unidades.map(u => ({
                    id: u.id ?? `u-${u.placa ?? ''}`,
                    etiqueta: u.placa || 'Unidad',
                    esRefuerzo: !!u.esRefuerzo,
                    esPrioritario: false,
                    ultimaLat: u.ultimaLat ?? null,
                    ultimaLng: u.ultimaLng ?? null,
                    ultimaUbicacionEn: u.ultimaUbicacionEn ?? null,
                  })),
                  ...card.elementos.map((e, i) => ({
                    id: e.oficialId ?? `e-${i}`,
                    etiqueta: e.nombre || 'Elemento',
                    esRefuerzo: !!e.esRefuerzo,
                    esPrioritario: !!e.esPrioritario,
                    ultimaLat: e.ultimaLat ?? null,
                    ultimaLng: e.ultimaLng ?? null,
                    ultimaUbicacionEn: e.ultimaUbicacionEn ?? null,
                  })),
                ]}
              />
            </div>
          )}

          {/* ─── ASIGNAR NUEVAS UNIDADES / REFUERZOS ─── */}
          {tab === 'pendientes' && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none', marginBottom: 12 }}>
                {card.origenRondin ? 'Asignar unidades' : 'Asignar unidades y elementos'}
              </div>
              <DespachoForm
                incidenteId={card.id}
                incidenteLat={card.latitud ?? null}
                incidenteLng={card.longitud ?? null}
                onDespachado={onCambio}
                prioritario={card.origenRondin ? {
                  nombre: card.prioritarioNombre || card.elementos?.find(e => e.esPrioritario)?.nombre || '',
                  nomina: card.prioritarioNomina || card.elementos?.find(e => e.esPrioritario)?.nomina || '',
                } : undefined}
                prioritarioPatrullaId={card.prioritarioPatrullaId ?? null}
                incidentePrioridad={card.prioridad}
              />
            </div>
          )}

          {/* ─── REFUERZOS (solo en_despacho) ─── */}
          {tab === 'en_despacho' && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#c2410c', letterSpacing: 'normal', textTransform: 'none', marginBottom: 12 }}>
                Enviar refuerzos
              </div>
              <DespachoForm incidenteId={card.id} incidenteLat={card.latitud ?? null} incidenteLng={card.longitud ?? null} modo="refuerzo" onDespachado={onCambio} incidentePrioridad={card.prioridad} />
            </div>
          )}

          {/* ─── ATENDIDOS: badges de cierre ─── */}
          {tab === 'atendidos' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {card.estatus === 'atendido' && !card.hayDetencion && (
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#f0fdf4', color: '#15803d', borderRadius: 'var(--radius-full)' }}>
                  {labelEstatus('atendido')}
                </span>
              )}
              {card.hayDetencion && (
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-full)' }}>
                  Con detención
                </span>
              )}
              {card.ofiAutoridadRecibe && (
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#f5f3ff', color: '#7c3aed', borderRadius: 'var(--radius-full)' }}>
                  {card.ofiAutoridadRecibe === 'JUZGADO_CIVICO' ? 'Juzgado Cívico' : card.ofiAutoridadRecibe}
                </span>
              )}
              {card.d1Pendiente && (
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#fff7ed', color: '#c2410c', borderRadius: 'var(--radius-full)' }}>
                  D1 pendiente
                </span>
              )}
              {card.accionesRealizadas && (
                <div style={{ width: '100%', marginTop: 4 }}>
                  <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', marginBottom: 2 }}>Acciones</div>
                  <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{card.accionesRealizadas}</div>
                </div>
              )}
            </div>
          )}

          {/* ─── DETALLE DEL INCIDENTE (colapsable) ─── */}
          {tab !== 'atendidos' && (card.descripcion || card.capturadoPor || card.origenRondin || card.fechaHoraDespacho) && (
            <DetalleIncidente card={card} tab={tab} />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Detalle del incidente (colapsable) ────────────────────────────────────

function DetalleIncidente({ card }: { card: CardData; tab: TabKey }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
      <div
        onClick={() => setAbierto(!abierto)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none', fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none' }}>
        <span style={{ transition: 'transform .2s', display: 'inline-block', transform: abierto ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        Detalle del incidente
      </div>
      {abierto && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          {card.descripcion && (
            <div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', marginBottom: 4 }}>Descripción</div>
              <div style={{ fontFamily: 'var(--apple-font-display)', color: '#334155', lineHeight: 1.5 }}>{card.descripcion}</div>
            </div>
          )}

          {card.capturadoPor && (
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8' }}>
              Capturado por: {card.capturadoPor}
            </div>
          )}

          {card.origenRondin && (card.prioritarioNombre || card.elementos?.find(e => e.esPrioritario)?.nombre) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)' }}>
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                {card.prioritarioNombre || card.elementos?.find(e => e.esPrioritario)?.nombre}
              </span>
              {(card.prioritarioNomina || card.elementos?.find(e => e.esPrioritario)?.nomina) && (
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#16a34a' }}>
                  ({card.prioritarioNomina || card.elementos?.find(e => e.esPrioritario)?.nomina})
                </span>
              )}
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '1px 8px', background: '#f1f5f9', color: '#1f355a', borderRadius: 'var(--radius-full)' }}>
                Prioritario
              </span>
            </div>
          )}

          {card.fechaHoraDespacho && (
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> Despachado: {new Date(card.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {card.fechaHoraDespacho && (
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> Despachado: {new Date(card.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Fin ────────────────────────────────────────────────────────────────────