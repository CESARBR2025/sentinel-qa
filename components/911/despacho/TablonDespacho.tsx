'use client'

import { useEffect, useState, useCallback } from 'react'
import { DespachoForm } from '@/components/911/despacho/DespachoForm'
import { MapPin, Clock, Phone, MessageSquare, Radio, Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const INTERVALO_MS = 20_000
const SLA_MINUTOS: Record<string, number> = { ALTA: 10, MEDIA: 20, BAJA: 40 }

interface UnidadRow {
  id?: string; placa: string | null; esRefuerzo?: boolean
  horaSalida?: string | null; horaLlegada?: string | null
}
interface ElementoRow {
  nombre: string | null; nomina: string | null
  esPrioritario?: boolean; esRefuerzo?: boolean
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

const PRIO_COLORS: Record<string, { bar: string; dot: string; text: string }> = {
  ALTA:  { bar: '#dc2626', dot: '#dc2626', text: '#991b1b' },
  MEDIA: { bar: '#d97706', dot: '#d97706', text: '#92400e' },
  BAJA:  { bar: '#64748b', dot: '#64748b', text: '#475569' },
}

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
  const label = origenRondin ? 'RONDÍN' : canal.toUpperCase()
  const config: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
    '911':      { icon: <Phone size={11} />,         color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    'whatsapp': { icon: <MessageSquare size={11} />, color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
    'radio':    { icon: <Radio size={11} />,         color: '#1f355a', bg: '#eff1f3', border: '#c3c8d2' },
  }
  const c = origenRondin
    ? { icon: config[canal]?.icon ?? null, color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' }
    : config[canal] ?? { icon: null, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '2px 8px', background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 2 }}>
      {c.icon} {label}
    </span>
  )
}

const TABS: { key: TabKey; label: string; icon: React.ReactNode; accent: string }[] = [
  { key: 'pendientes',  label: 'Pendientes',  icon: <AlertTriangle size={13} />, accent: '#b45309' },
  { key: 'en_despacho', label: 'En despacho', icon: <Shield size={13} />,        accent: '#1c3051' },
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
  const [segundosRestantes, setSegundosRestantes] = useState(INTERVALO_MS / 1000)
  const [refrescando, setRefrescando] = useState(false)

  const cargarLista = useCallback(async (url: string): Promise<CardData[]> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
    return res.json()
  }, [])

  const cargarTodo = useCallback(async () => {
    setCargando(true); setError(null)
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
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [cargarLista])

  const cargarSoloPendientes = useCallback(async () => {
    try {
      const p = await cargarLista('/api/incidentes/pendientes-despacho')
      setPendientes(p as unknown as CardData[])
    } catch { /* silent */ }
  }, [cargarLista])

  useEffect(() => { cargarTodo() }, [cargarTodo])

  useEffect(() => {
    const id = setInterval(() => {
      setSegundosRestantes(s => s === 0 ? s : s - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (segundosRestantes === 0 && !refrescando) {
      setRefrescando(true)
      cargarSoloPendientes().finally(() => {
        setSegundosRestantes(INTERVALO_MS / 1000)
        setRefrescando(false)
      })
    }
  }, [segundosRestantes, cargarSoloPendientes, refrescando])

  const listaActual = tab === 'pendientes' ? pendientes : tab === 'en_despacho' ? enDespacho : atendidos

  const cambiarTab = (t: TabKey) => { setTab(t); setExpandido(null) }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: 24 }}>
        <div>
          <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>CENTRO DE MANDO Y COMUNICACIONES</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 36, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase' }}>MÓDULO DE <span style={{ color: '#1f355a' }}>DESPACHO</span></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {refrescando ? (
            <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#1f355a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1f355a', animation: 'refrescarPulso .8s ease-in-out infinite' }} />
              REFRESCANDO…
            </span>
          ) : (
            <>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: segundosRestantes <= 5 ? '#fef2f2' : '#f1f5f9', border: `2px solid ${segundosRestantes <= 5 ? '#dc2626' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: segundosRestantes <= 5 ? '#dc2626' : '#64748b', transition: 'color .3s' }}>{segundosRestantes}</span>
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 9, color: '#94a3b8' }}>PRÓXIMA ACTUALIZACIÓN</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, fontFamily: 'Inter', fontSize: 11, color: '#dc2626', marginBottom: 16 }}>
          Error: {error}
          <button onClick={cargarTodo} style={{ marginLeft: 16, fontFamily: 'Inter', fontSize: 10, background: 'none', border: '1px solid #fecaca', borderRadius: 2, padding: '2px 10px', color: '#dc2626', cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Segment control */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {TABS.map(t => {
          const activo = tab === t.key
          const conteo = t.key === 'pendientes' ? pendientes.length : t.key === 'en_despacho' ? enDespacho.length : atendidos.length
          return (
            <button key={t.key} onClick={() => cambiarTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
                fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
                border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all .15s',
                background: activo ? t.accent : '#ffffff',
                color: activo ? '#ffffff' : '#64748b',
                borderBottom: activo ? `2px solid ${t.accent}` : '2px solid transparent',
              }}>
              {t.icon}
              {t.label}
              <span style={{
                fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                background: activo ? 'rgba(255,255,255,.2)' : '#f1f5f9',
                color: activo ? '#ffffff' : '#64748b',
                padding: '0 7px', borderRadius: 8, lineHeight: '18px',
              }}>
                {conteo}
              </span>
            </button>
          )
        })}
      </div>

      {/* Estado vacío */}
      {!cargando && listaActual.length === 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Sin registros</div>
          <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em' }}>NO HAY INCIDENTES EN ESTE ESTADO</p>
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
            onCambio={() => { cargarSoloPendientes(); cargarTodo() }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes refrescarPulso { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
      `}</style>
    </div>
  )
}

// ─── Fila de incidente ──────────────────────────────────────────────────────

function CardRow({ card, abierto, tab, onToggle, onCambio }: {
  card: CardData; abierto: boolean; tab: TabKey
  onToggle: () => void; onCambio: () => void
}) {
  const prio = card.prioridad?.toUpperCase() ?? 'SIN PRIORIDAD'
  const pc = PRIO_COLORS[prio] ?? PRIO_COLORS.BAJA
  const urgente = slaPorcentaje(card.fechaHoraInicio, card.prioridad) >= 75

  return (
    <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div
        onClick={onToggle}
        style={{
          borderLeft: `4px solid ${pc.bar}`,
          borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
          padding: '16px 20px', cursor: 'pointer',
          transition: 'background .1s',
          background: abierto ? '#f8fafc' : '#ffffff',
        }}>
        {/* Línea 1: folio + badges + tiempo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{card.folio}</span>
          <CanalBadge canal={card.canal} origenRondin={card.origenRondin} />
          {urgente && tab === 'pendientes' && (
            <span style={{ fontFamily: 'Inter', fontSize: 8, fontWeight: 700, padding: '1px 6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 2 }}>
              ⏱ SLA
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {esHoy(card.fechaHoraInicio) && (
              <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 600, padding: '1px 7px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 2 }}>
                HOY
              </span>
            )}
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <Clock size={11} /> {tiempoRelativo(card.fechaHoraInicio)}
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#94a3b8', transition: 'transform .2s', display: 'inline-block', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </div>
        </div>

        {/* Línea 2: tipo incidente */}
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 6, lineHeight: 1.4 }}>
          {card.tipoIncidente || 'Sin clasificar'}
        </div>

        {/* Línea 3: ubicación */}
        {card.calle && (
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <MapPin size={12} color="#94a3b8" />
            {card.calle}{card.colonia ? `, ${card.colonia}` : ''}
          </div>
        )}

        {/* Línea 4: ficha completa */}
        <div style={{ marginTop: 4 }}>
          <Link href={card.canal === 'whatsapp' ? `/agente_911/whatsapp/incidentes/${card.id}` : card.canal === 'radio' ? `/agente_911/rondin/incidentes/${card.id}` : `/agente_911/ciudadano/incidentes/${card.id}`}
            onClick={e => e.stopPropagation()}
            style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 3, padding: '2px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: '0.04em' }}>
            <FileText size={11} /> MÁS DETALLES DEL REPORTE →
          </Link>
        </div>
      </div>

      {/* Expandido */}
      {abierto && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ─── PERSONAL ASIGNADO ─── */}
          {(card.unidades?.length > 0 || card.elementos?.length > 0) && (
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Personal asignado
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {card.unidades.map((u, i) => (
                  <div key={u.id || i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                    padding: '5px 10px',
                    background: u.horaSalida ? '#f0fdf4' : u.esRefuerzo ? '#fff7ed' : '#f1f5f9',
                    border: `1px solid ${u.horaSalida ? '#bbf7d0' : u.esRefuerzo ? '#fed7aa' : '#e2e8f0'}`,
                    borderRadius: 4,
                  }}>
                    <span style={{ color: u.horaSalida ? '#16a34a' : u.esRefuerzo ? '#c2410c' : '#1c3051' }}>
                      {u.placa || '—'}
                    </span>
                    {u.esRefuerzo && <span style={{ fontSize: 9, opacity: .7 }}>REF</span>}
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 400, marginLeft: 4 }}>
                      {u.horaSalida
                        ? `Salió ${new Date(u.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Pendiente'}
                    </span>
                    {u.horaLlegada && (
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 400 }}>
                        · Llegó {new Date(u.horaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
                {card.elementos.map((e, i) => (
                  <div key={`e-${i}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: 11,
                    padding: '5px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4,
                  }}>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{e.nombre || '—'}</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>({e.nomina || 's/n'})</span>
                    {e.esPrioritario && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', background: '#dcfce7', color: '#16a34a', borderRadius: 2 }}>P</span>}
                    {e.esRefuerzo && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', background: '#fed7aa', color: '#c2410c', borderRadius: 2 }}>R</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── ASIGNAR NUEVAS UNIDADES / REFUERZOS ─── */}
          {tab === 'pendientes' && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '16px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#0f172a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
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
              />
            </div>
          )}

          {/* ─── REFUERZOS (solo en_despacho) ─── */}
          {tab === 'en_despacho' && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, padding: '16px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#c2410c', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                Enviar refuerzos
              </div>
              <DespachoForm incidenteId={card.id} incidenteLat={card.latitud ?? null} incidenteLng={card.longitud ?? null} modo="refuerzo" onDespachado={onCambio} />
            </div>
          )}

          {/* ─── ATENDIDOS: badges de cierre ─── */}
          {tab === 'atendidos' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {card.estatus === 'atendido' && !card.hayDetencion && (
                <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '2px 8px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                  CERRADO / ATENDIDO
                </span>
              )}
              {card.hayDetencion && (
                <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '2px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 2 }}>
                  CON DETENCIÓN
                </span>
              )}
              {card.ofiAutoridadRecibe && (
                <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '2px 8px', background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: 2 }}>
                  {card.ofiAutoridadRecibe === 'JUZGADO_CIVICO' ? 'JUZGADO CÍVICO' : card.ofiAutoridadRecibe}
                </span>
              )}
              {card.d1Pendiente && (
                <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '2px 8px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: 2 }}>
                  D1 PENDIENTE
                </span>
              )}
              {card.accionesRealizadas && (
                <div style={{ width: '100%', marginTop: 4 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Acciones</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#334155', lineHeight: 1.5 }}>{card.accionesRealizadas}</div>
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
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none', fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span style={{ transition: 'transform .2s', display: 'inline-block', transform: abierto ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        Detalle del incidente
      </div>
      {abierto && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
          {card.descripcion && (
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Descripción</div>
              <div style={{ fontFamily: 'Inter', color: '#334155', lineHeight: 1.5 }}>{card.descripcion}</div>
            </div>
          )}

          {card.capturadoPor && (
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#94a3b8' }}>
              Capturado por: {card.capturadoPor}
            </div>
          )}

          {card.origenRondin && (card.prioritarioNombre || card.elementos?.find(e => e.esPrioritario)?.nombre) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 3 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                {card.prioritarioNombre || card.elementos?.find(e => e.esPrioritario)?.nombre}
              </span>
              {(card.prioritarioNomina || card.elementos?.find(e => e.esPrioritario)?.nomina) && (
                <span style={{ fontFamily: 'Inter', fontSize: 9, color: '#16a34a' }}>
                  ({card.prioritarioNomina || card.elementos?.find(e => e.esPrioritario)?.nomina})
                </span>
              )}
              <span style={{ fontFamily: 'Inter', fontSize: 8, fontWeight: 700, padding: '1px 6px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                PRIORITARIO
              </span>
            </div>
          )}

          {card.fechaHoraDespacho && (
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> Despachado: {new Date(card.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {card.fechaHoraDespacho && (
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> Despachado: {new Date(card.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Fin ────────────────────────────────────────────────────────────────────