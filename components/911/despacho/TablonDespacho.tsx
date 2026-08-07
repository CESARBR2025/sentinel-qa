'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { DespachoForm } from '@/components/911/despacho/DespachoForm'
import MapaSeguimientoOficial from '@/components/911/despacho/MapaSeguimientoOficial'
import { SegmentPage } from '@/components/partials/SegmentPage'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'
import { labelEstatus } from '@/lib/911/estatus-c4'
import { MapPin, Clock, Phone, MessageSquare, Radio, Shield, CheckCircle2, AlertTriangle, FileText, ChevronDown, ChevronRight, User, ShieldAlert, Users, Car, Navigation, BadgeCheck, RadioTower, UserRound, ClipboardList } from 'lucide-react'
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

function fmtHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function fmtDiaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function iniciales(nombre: string | null): string {
  if (!nombre) return '—'
  const ini = nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
  return ini || '?'
}

const AVATAR_COLORES: { bg: string; fg: string }[] = [
  { bg: '#e0e7ff', fg: '#4338ca' },
  { bg: '#d1fae5', fg: '#047857' },
  { bg: '#fae8ff', fg: '#a21caf' },
  { bg: '#ffe4e6', fg: '#be123c' },
  { bg: '#ccfbf1', fg: '#0f766e' },
  { bg: '#fef3c7', fg: '#b45309' },
  { bg: '#dbeafe', fg: '#1d4ed8' },
  { bg: '#f3e8ff', fg: '#7c3aed' },
]

function colorAvatar(nombre: string | null): { bg: string; fg: string } {
  const semilla = (nombre ?? '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORES[semilla % AVATAR_COLORES.length]
}

function CanalBadge({ canal, origenRondin }: { canal: string; origenRondin?: boolean }) {
  const label = origenRondin ? 'Rondín' : canal
  const icono =
    canal === '911' ? <Phone size={12} /> :
    canal === 'whatsapp' ? <MessageSquare size={12} /> :
    canal === 'radio' ? <Radio size={12} /> : null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
      {icono} {label}
    </span>
  )
}

function BadgeSemantico({ bg, color, icon, children }: { bg: string; color: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: bg, color, borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', textTransform: 'none', letterSpacing: 'normal' }}>
      {icon}
      {children}
    </span>
  )
}

const TABS: { key: TabKey; label: string; icon: React.ReactNode; accent: string }[] = [
  { key: 'pendientes',  label: 'Pendientes', icon: <AlertTriangle size={13} />, accent: '#b45309' },
  { key: 'en_despacho', label: labelEstatus('en_despacho', false), icon: <Shield size={13} />, accent: '#1f355a' },
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

      <SegmentPage
        tabs={TABS.map(t => ({
          ...t,
          count: t.key === 'pendientes' ? pendientes.length : t.key === 'en_despacho' ? enDespacho.length : atendidos.length,
        }))}
        activeKey={tab}
        onChange={(k) => cambiarTab(k as TabKey)}
        marginBottom={24}
      />

      {/* Estado vacío */}
      {!cargando && listaActual.length === 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '64px 32px', textAlign: 'center' }}>
          <CheckCircle2 size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 18, fontWeight: 600, color: '#64748b', textTransform: 'none', letterSpacing: 'normal', marginBottom: 6 }}>Sin registros</div>
          <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay incidentes en este estado</p>
        </div>
      )}

      {/* Lista plana */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

        .card-despacho {
          transition: box-shadow .3s ease-out, transform .3s ease-out, border-color .3s ease-out;
        }
        .card-despacho:hover {
          transform: translateY(-2px);
          box-shadow: var(--apple-shadow-glass-hover);
          border-color: rgba(31,53,90,0.25);
        }
        .card-despacho:active {
          transform: scale(0.97);
          box-shadow: var(--shadow-card);
          transition: transform .12s ease-out, box-shadow .12s ease-out;
        }
        .card-despacho-titulo { text-transform: none; letter-spacing: normal; }
        @media (prefers-reduced-motion: reduce) {
          .card-despacho, .card-despacho:hover, .card-despacho:active {
            transform: none;
            transition: box-shadow .15s ease, border-color .15s ease;
          }
        }
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
  const esAtendido = tab === 'atendidos'
  const conDetencion = !!card.hayDetencion

  const primeraSalida = card.unidades?.find(u => u.horaSalida)?.horaSalida ?? null
  const primeraLlegada = card.unidades?.find(u => u.horaLlegada)?.horaLlegada ?? null

  const hrefDetalle = card.canal === 'whatsapp' ? `/agente_911/whatsapp/incidentes/${card.id}` : card.canal === 'radio' ? `/agente_911/rondin/incidentes/${card.id}` : `/agente_911/ciudadano/incidentes/${card.id}`

  return (
    <div className="card-despacho" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid #e2e8f0', background: '#ffffff' }}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={abierto}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        style={{
          padding: '18px 20px', cursor: 'pointer',
          background: abierto ? '#f8fafc' : '#ffffff',
          transition: 'background .15s',
          outline: 'none',
        }}
      >
        {/* Línea 1: folio + canal + prioridad + estado + tiempo */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>{card.folio}</span>
          <CanalBadge canal={card.canal} origenRondin={card.origenRondin} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '2px 10px', background: pc.fondo, color: pc.oscuro, borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', textTransform: 'none', letterSpacing: 'normal' }}>
            <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: pc.principal, display: 'inline-block', flexShrink: 0 }} />
            {card.prioridad ?? 'Sin prioridad'}
          </span>
          {urgente && tab === 'pendientes' && (
            <BadgeSemantico bg="#fef2f2" color="#dc2626" icon={<Clock size={11} />}>SLA</BadgeSemantico>
          )}
          {esAtendido && (
            conDetencion
              ? <BadgeSemantico bg="#fef2f2" color="#dc2626" icon={<ShieldAlert size={11} />}>Cerrado · Detención</BadgeSemantico>
              : <BadgeSemantico bg="#f0fdf4" color="#15803d" icon={<CheckCircle2 size={11} />}>Cerrado</BadgeSemantico>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {esHoy(card.fechaHoraInicio) && (
              <BadgeSemantico bg="#eff6ff" color="#1e40af">Hoy</BadgeSemantico>
            )}
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <Clock size={12} /> {tiempoRelativo(card.fechaHoraInicio)}
            </span>
            <ChevronDown size={16} color="#94a3b8" style={{ transition: 'transform .2s', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
          </div>
        </div>

        {/* Línea 2: tipo incidente */}
        <div className="card-despacho-titulo" style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 6, lineHeight: 1.4 }}>
          {card.tipoIncidente || 'Sin clasificar'}
        </div>

        {/* Línea 3: ubicación */}
        {card.calle && (
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, minWidth: 0 }}>
            <MapPin size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.calle}{card.colonia ? `, ${card.colonia}` : ''}</span>
          </div>
        )}

        {/* Línea 4 (Atendidos): meta de servicio */}
        {esAtendido && (card.fechaHoraDespacho || primeraSalida || primeraLlegada) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', marginBottom: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} color="#94a3b8" />
              {card.fechaHoraDespacho ? `Despachado ${fmtDiaHora(card.fechaHoraDespacho)}` : 'Sin despacho'}
            </span>
            {primeraSalida && <span>· Salió {fmtHora(primeraSalida)}</span>}
            {primeraLlegada && <span>· Llegó {fmtHora(primeraLlegada)}</span>}
          </div>
        )}

        {/* Línea 5: CTA */}
        <div style={{ marginTop: 4 }}>
          <Link href={hrefDetalle}
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '7px 14px', textDecoration: 'none', letterSpacing: 'normal', textTransform: 'none', transition: 'all .2s' }}>
            <FileText size={12} /> Ver reporte
            <ChevronRight size={13} color="#94a3b8" />
          </Link>
        </div>
      </div>

      {/* Expandido */}
      {abierto && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ─── ATENDIDOS: resumen de cierre ─── */}
          {esAtendido && (
            <ResumenCierre card={card} />
          )}

          {/* ─── PERSONAL ASIGNADO ─── */}
          {(card.unidades?.length > 0 || card.elementos?.length > 0) && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(180deg,#f8fafc,#f1f5f9)' }}>
                <Users size={15} color="#1f355a" />
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>Personal asignado</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, background: '#e2e8f0', color: '#475569', padding: '0 8px', borderRadius: 'var(--radius-full)', lineHeight: '18px' }}>
                  {card.unidades.length + card.elementos.length}
                </span>
              </div>

              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {card.unidades.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: 'normal', textTransform: 'none' }}>Unidades</div>
                    {card.unidades.map((u, i) => (
                      <div key={u.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(31,53,90,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Car size={17} color="#1f355a" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{u.placa || '—'}</span>
                            {u.esRefuerzo && <BadgeSemantico bg="#fff7ed" color="#c2410c" icon={<RadioTower size={11} />}>Ref</BadgeSemantico>}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 3 }}>
                            {u.horaLlegada
                              ? <BadgeSemantico bg="#f0fdf4" color="#15803d" icon={<CheckCircle2 size={11} />}>En sitio</BadgeSemantico>
                              : u.horaSalida
                                ? <BadgeSemantico bg="#eff6ff" color="#1e40af" icon={<Navigation size={11} />}>En ruta</BadgeSemantico>
                                : <BadgeSemantico bg="#f1f5f9" color="#64748b" icon={<Clock size={11} />}>Pendiente</BadgeSemantico>}
                            {u.horaSalida && (
                              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} color="#94a3b8" /> Salió {fmtHora(u.horaSalida)}
                              </span>
                            )}
                            {u.horaLlegada && (
                              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={11} color="#94a3b8" /> Llegó {fmtHora(u.horaLlegada)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {card.elementos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: 'normal', textTransform: 'none' }}>Elementos</div>
                    {card.elementos.map((e, i) => (
                      <div key={`e-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)' }}>
                        {(() => {
                          const av = e.esPrioritario ? { bg: '#dcfce7', fg: '#15803d' } : colorAvatar(e.nombre)
                          return (
                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, color: av.fg }}>
                              {iniciales(e.nombre)}
                            </div>
                          )
                        })()}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 500, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.nombre || '—'}</span>
                          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#94a3b8' }}>Nómina {e.nomina || 's/n'}</span>
                        </div>
                        {e.esPrioritario && <BadgeSemantico bg="#dcfce7" color="#16a34a" icon={<BadgeCheck size={11} />}>Prioritario</BadgeSemantico>}
                        {e.esRefuerzo && <BadgeSemantico bg="#fff7ed" color="#c2410c" icon={<RadioTower size={11} />}>Refuerzo</BadgeSemantico>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── UBICACIÓN EN VIVO DEL OFICIAL (solo en_despacho) ─── */}
          {tab === 'en_despacho' && card.latitud != null && card.longitud != null && (
            <div>
              <SectionTitle>Ubicación en vivo del oficial</SectionTitle>
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
              <SectionTitle>{card.origenRondin ? 'Asignar unidades' : 'Asignar unidades y elementos'}</SectionTitle>
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
              <SectionTitle color="#c2410c">Enviar refuerzos</SectionTitle>
              <DespachoForm incidenteId={card.id} incidenteLat={card.latitud ?? null} incidenteLng={card.longitud ?? null} modo="refuerzo" onDespachado={onCambio} incidentePrioridad={card.prioridad} />
            </div>
          )}

          {/* ─── DETALLE DEL INCIDENTE (colapsable, no en Atendidos) ─── */}
          {tab !== 'atendidos' && (card.descripcion || card.capturadoPor || card.origenRondin || card.fechaHoraDespacho) && (
            <DetalleIncidente card={card} />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Resumen de cierre (tab Atendidos) ──────────────────────────────────────

function ResumenCierre({ card }: { card: CardData }) {
  const conDetencion = !!card.hayDetencion
  const autoridad = card.ofiAutoridadRecibe === 'JUZGADO_CIVICO' ? 'Juzgado Cívico' : card.ofiAutoridadRecibe

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(180deg,#f8fafc,#f1f5f9)' }}>
          <ClipboardList size={14} color="#1f355a" />
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>Datos complementarios</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="grid-2">
            <CeldaResumen
              icono={<CheckCircle2 size={14} color="#15803d" />}
              etiqueta="Estatus"
              valor={conDetencion
                ? <BadgeSemantico bg="#fef2f2" color="#dc2626" icon={<ShieldAlert size={12} />}>Cerrado · Detención</BadgeSemantico>
                : <BadgeSemantico bg="#f0fdf4" color="#15803d" icon={<CheckCircle2 size={12} />}>Cerrado</BadgeSemantico>}
            />
            <CeldaResumen
              icono={<User size={14} color="#7c3aed" />}
              etiqueta="Autoridad que recibe"
              valor={autoridad ?? '—'}
            />
            <CeldaResumen
              icono={<ShieldAlert size={14} color={conDetencion ? '#dc2626' : '#94a3b8'} />}
              etiqueta="Detención"
              valor={conDetencion
                ? <BadgeSemantico bg="#fef2f2" color="#dc2626">Sí</BadgeSemantico>
                : <BadgeSemantico bg="#f1f5f9" color="#64748b">No</BadgeSemantico>}
            />
            <CeldaResumen
              icono={<FileText size={14} color={card.d1Pendiente ? '#c2410c' : '#16a34a'} />}
              etiqueta="Reporte D1"
              valor={card.d1Pendiente
                ? <BadgeSemantico bg="#fff7ed" color="#c2410c">Pendiente</BadgeSemantico>
                : <BadgeSemantico bg="#f0fdf4" color="#15803d">Completado</BadgeSemantico>}
            />
          </div>

          {card.accionesRealizadas && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
              <SectionTitle>Acciones realizadas</SectionTitle>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{card.accionesRealizadas}</div>
            </div>
          )}
        </div>
      </div>

      <DetalleReporte card={card} />
    </div>
  )
}

function DetalleReporte({ card }: { card: CardData }) {
  if (!card.descripcion && !card.capturadoPor) return null
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(180deg,#f8fafc,#f1f5f9)' }}>
        <FileText size={14} color="#1f355a" />
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>Detalle del reporte</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {card.descripcion && (
          <div>
            <SectionTitle>Descripción</SectionTitle>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{card.descripcion}</div>
          </div>
        )}
        {card.capturadoPor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b' }}>
            <UserRound size={12} color="#94a3b8" /> Capturado por: {card.capturadoPor}
          </div>
        )}
      </div>
    </div>
  )
}

function CeldaResumen({ icono, etiqueta, valor }: { icono: React.ReactNode; etiqueta: string; valor: React.ReactNode }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'none', letterSpacing: 'normal' }}>
        {icono}
        {etiqueta}
      </div>
      <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 500, color: '#0f172a', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {valor}
      </div>
    </div>
  )
}

function SectionTitle({ children, color = '#64748b' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color, letterSpacing: 'normal', textTransform: 'none', marginBottom: 8 }}>
      {children}
    </div>
  )
}

// ─── Detalle del incidente (colapsable) ────────────────────────────────────

function DetalleIncidente({ card, omitirDespachado, omitirDetalleReporte }: { card: CardData; omitirDespachado?: boolean; omitirDetalleReporte?: boolean }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none', fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', background: 'none', border: 'none', padding: 0 }}>
        <ChevronRight size={16} color="#94a3b8" style={{ transition: 'transform .2s', display: 'inline-block', transform: abierto ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        Detalle del incidente
      </button>
      {abierto && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          {!omitirDetalleReporte && <DetalleReporte card={card} />}

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

          {!omitirDespachado && card.fechaHoraDespacho && (
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> Despachado: {fmtDiaHora(card.fechaHoraDespacho)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Fin ────────────────────────────────────────────────────────────────────
