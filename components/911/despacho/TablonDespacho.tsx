'use client'

import { useEffect, useState } from 'react'
import { useDespacho }  from '@/hooks/useDespacho'
import { usePolling }   from '@/hooks/usePolling'
import { DespachoForm } from '@/components/911/despacho/DespachoForm'
import { marcarHoraUnidadDespacho } from '@/lib/incidentes/actions'
import { MapPin, Clock, Phone, MessageSquare, AlertTriangle, Radio, RefreshCw, ChevronDown, ChevronUp, Shield, CheckCircle2, LogOut, Flag } from 'lucide-react'
import Link  from 'next/link'
import React from 'react'

const INTERVALO_MS = 20_000

// SLA por prioridad (minutos) — valores genéricos iniciales, ajustables con operación.
const SLA_MINUTOS: Record<string, number> = { ALTA: 10, MEDIA: 20, BAJA: 40 }

function slaVencido(fechaISO: string | null, prioridad: string | null): boolean {
  if (!fechaISO) return false
  const umbral = SLA_MINUTOS[(prioridad ?? '').toUpperCase()] ?? SLA_MINUTOS.MEDIA
  const minutosTranscurridos = (Date.now() - new Date(fechaISO).getTime()) / 60_000
  return minutosTranscurridos > umbral
}

type Tab = 'pendientes' | 'en_despacho' | 'atendidos'

interface IncRow {
  id: string; folio: string; canal: string; estatus: string
  fechaHoraInicio: string; calle: string | null; colonia: string | null
  descripcion: string | null; tipoIncidente: string | null
  prioridad: string | null; capturadoPor: string | null
  despachoId: string | null; fechaHoraDespacho: string | null
  unidades: { id?: string; placa: string | null; esRefuerzo?: boolean; horaSalida?: string | null; horaLlegada?: string | null }[]
  elementos: { nombre: string | null; nomina: string | null; esPrioritario?: boolean; esRefuerzo?: boolean }[]
  accionesRealizadas?: string | null
  hayDetencion?: boolean | null
  ofiAutoridadRecibe?: string | null
  d1Pendiente?: boolean
  origenRondin?: boolean
  prioritarioNombre?: string | null
  prioritarioNomina?: string | null
}

export function TablonDespacho() {
  const { pendientes, cargando, error, cargarPendientes } = useDespacho()
  const [tab,        setTab]        = useState<Tab>('pendientes')
  const [enDespacho, setEnDespacho] = useState<IncRow[]>([])
  const [atendidos,  setAtendidos]  = useState<IncRow[]>([])
  const [cargandoTab, setCargandoTab] = useState(false)
  const [expandido,  setExpandido]  = useState<string | null>(null)
  const [marcando,   setMarcando]   = useState<string | null>(null)

  useEffect(() => { cargarPendientes() }, [cargarPendientes])
  usePolling(cargarPendientes, INTERVALO_MS, tab === 'pendientes')

  const cargarTab = async (t: Tab) => {
    if (t === 'pendientes') { cargarPendientes(); return }
    setCargandoTab(true)
    try {
      const url = t === 'en_despacho' ? '/api/incidentes/en-despacho' : '/api/incidentes/atendidos'
      const res = await fetch(url)
      const data = await res.json()
      if (t === 'en_despacho') setEnDespacho(data)
      else setAtendidos(data)
    } finally { setCargandoTab(false) }
  }

  const cambiarTab = (t: Tab) => { setTab(t); setExpandido(null); cargarTab(t) }

  const marcarHora = async (unidadId: string, campo: 'salida' | 'llegada') => {
    const key = unidadId + campo
    setMarcando(key)
    try {
      await marcarHoraUnidadDespacho(unidadId, campo)
      await cargarTab('en_despacho')
    } finally {
      setMarcando(null)
    }
  }

  const lista: IncRow[] = tab === 'pendientes'
    ? (pendientes as unknown as IncRow[])
    : tab === 'en_despacho' ? enDespacho : atendidos

  return (
    <div>
      {/* ENCABEZADO */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: 24 }}>
        <div>
          <span style={labelTopStyle}>CENTRO DE MANDO Y COMUNICACIONES</span>
          <h1 style={titleStyle}>MÓDULO DE <span style={{ color: '#1f355a' }}>DESPACHO</span></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {tab === 'pendientes' && (
            <>
              <div style={{ background: pendientes.length > 0 ? '#fef3c7' : '#f0fdf4', border: `1px solid ${pendientes.length > 0 ? '#fde68a' : '#bbf7d0'}`, borderRadius: 4, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: pendientes.length > 0 ? '#d97706' : '#16a34a' }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: pendientes.length > 0 ? '#b45309' : '#15803d' }}>
                  {pendientes.length} PENDIENTE{pendientes.length !== 1 ? 'S' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>
                <RefreshCw size={11} style={{ animation: cargando ? 'spin 1s linear infinite' : 'none' }} />
                ACTUALIZA CADA 20s
              </div>
            </>
          )}
          <Link href="/incidentes" style={btnBackStyle}>← BITÁCORA GENERAL</Link>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {([
          { key: 'pendientes',  label: 'Pendientes',   icon: <AlertTriangle size={13} />, color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
          { key: 'en_despacho', label: 'En despacho',  icon: <Shield size={13} />,        color: '#1c3051', bg: '#eff1f3', border: '#c3c8d2' },
          { key: 'atendidos',   label: 'Atendidos',    icon: <CheckCircle2 size={13} />,  color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => cambiarTab(t.key as Tab)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid', cursor: 'pointer', borderRadius: 2, transition: 'all .15s',
              background: tab === t.key ? t.bg    : '#ffffff',
              color:      tab === t.key ? t.color : '#64748b',
              borderColor: tab === t.key ? t.border : '#e2e8f0',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626', marginBottom: 16 }}>Error: {error}</div>}

      {/* ESTADO VACÍO */}
      {!cargando && !cargandoTab && lista.length === 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Sin registros</div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em' }}>NO HAY INCIDENTES EN ESTE ESTADO</p>
        </div>
      )}

      {/* LISTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lista.map(inc => {
          const abierto = expandido === inc.id
          return (
            <div key={inc.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' }}>

              {/* FILA PRINCIPAL — clickeable */}
              <div onClick={() => setExpandido(abierto ? null : inc.id)}
                style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: abierto ? '#f8fafc' : '#ffffff', borderBottom: abierto ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{inc.folio}</span>
                  <CanalBadge canal={inc.canal} />
                  {inc.origenRondin && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                      RONDÍN
                    </span>
                  )}
                  {inc.prioridad && (
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 2,
                      background: inc.prioridad.toUpperCase() === 'ALTA' ? '#fef2f2' : inc.prioridad.toUpperCase() === 'MEDIA' ? '#fffbeb' : '#f8fafc',
                      color: inc.prioridad.toUpperCase() === 'ALTA' ? '#dc2626' : inc.prioridad.toUpperCase() === 'MEDIA' ? '#b45309' : '#64748b',
                      border: `1px solid ${inc.prioridad.toUpperCase() === 'ALTA' ? '#fecaca' : inc.prioridad.toUpperCase() === 'MEDIA' ? '#fde68a' : '#e2e8f0'}`,
                    }}>
                      {inc.prioridad.toUpperCase()}
                    </span>
                  )}
                  {(tab === 'pendientes' || tab === 'en_despacho') && slaVencido(tab === 'pendientes' ? inc.fechaHoraInicio : inc.fechaHoraDespacho, inc.prioridad) && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: '#450a0a', color: '#fff', border: '1px solid #7f1d1d' }}>
                      ⏱ SLA VENCIDO
                    </span>
                  )}
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b' }}>{inc.tipoIncidente || 'Sin clasificar'}</span>
                  {inc.calle && <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{inc.calle}{inc.colonia ? `, ${inc.colonia}` : ''}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} />
                    {new Date(inc.fechaHoraInicio).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {abierto ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
              </div>

              {/* DETALLE EXPANDIBLE */}
              {abierto && (
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Descripción */}
                  {inc.descripcion && (
                    <div>
                      <label style={labelStyle}>DESCRIPCIÓN</label>
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#334155', lineHeight: 1.6, padding: '10px 14px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 2 }}>
                        {inc.descripcion}
                      </div>
                    </div>
                  )}

                  {/* Oficial prioritario (rondín) */}
                  {inc.origenRondin && (inc.prioritarioNombre || (inc.elementos?.find(e => e.esPrioritario)?.nombre)) && (
                    <div>
                      <label style={labelStyle}>OFICIAL PRIORITARIO (RONDÍN)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                          {inc.prioritarioNombre || inc.elementos?.find(e => e.esPrioritario)?.nombre}
                        </span>
                        {(inc.prioritarioNomina || inc.elementos?.find(e => e.esPrioritario)?.nomina) && (
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#16a34a' }}>
                            ({inc.prioritarioNomina || inc.elementos?.find(e => e.esPrioritario)?.nomina})
                          </span>
                        )}
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '1px 6px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                          PRIORITARIO
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Unidades y Elementos */}
                  {(inc.unidades?.length > 0 || inc.elementos?.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={labelStyle}>UNIDADES ASIGNADAS</label>
                        {tab === 'en_despacho' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {inc.unidades.map((u, i) => (
                              <div key={u.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'JetBrains Mono', fontSize: 11, padding: '6px 10px', background: u.esRefuerzo ? '#fff7ed' : '#eff1f3', border: `1px solid ${u.esRefuerzo ? '#fed7aa' : '#c3c8d2'}`, borderRadius: 2 }}>
                                <span style={{ color: u.esRefuerzo ? '#c2410c' : '#1c3051', fontWeight: 700 }}>{u.placa || '—'}</span>
                                {u.esRefuerzo && <b style={{ fontSize: 9, letterSpacing: '0.05em' }}>REFUERZO</b>}
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {u.horaSalida ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 10 }}>
                                      <LogOut size={10} /> SALIÓ {new Date(u.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  ) : u.id ? (
                                    <button type="button" onClick={() => marcarHora(u.id!, 'salida')} disabled={marcando === u.id + 'salida'} style={btnHoraStyle}>
                                      {marcando === u.id + 'salida' ? '...' : 'MARCAR SALIDA'}
                                    </button>
                                  ) : null}
                                  {u.horaLlegada ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 10 }}>
                                      <Flag size={10} /> LLEGÓ {new Date(u.horaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  ) : u.id && u.horaSalida ? (
                                    <button type="button" onClick={() => marcarHora(u.id!, 'llegada')} disabled={marcando === u.id + 'llegada'} style={btnHoraStyle}>
                                      {marcando === u.id + 'llegada' ? '...' : 'MARCAR LLEGADA'}
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {inc.unidades.map((u, i) => (
                              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', fontSize: 11, padding: '3px 10px', background: u.esRefuerzo ? '#fff7ed' : '#eff1f3', border: `1px solid ${u.esRefuerzo ? '#fed7aa' : '#c3c8d2'}`, color: u.esRefuerzo ? '#c2410c' : '#1c3051', borderRadius: 2 }}>
                                {u.placa || '—'}{u.esRefuerzo && <b style={{ fontSize: 9, letterSpacing: '0.05em' }}>REFUERZO</b>}
                                {tab === 'atendidos' && u.horaSalida && (
                                  <span style={{ fontSize: 9, opacity: 0.7 }}>
                                    · {new Date(u.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                    {u.horaLlegada && `–${new Date(u.horaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>ELEMENTOS ASIGNADOS</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {inc.elementos.map((e, i) => (
                            <div key={i} style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{e.nombre || '—'} <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b' }}>({e.nomina || 's/n'})</span></span>
                              {e.esPrioritario && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '1px 6px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>PRIORITARIO</span>}
                              {e.esRefuerzo && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '1px 6px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: 2 }}>REFUERZO</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Despacho info */}
                  {inc.fechaHoraDespacho && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b' }}>
                      <Clock size={11} /> DESPACHADO: {new Date(inc.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}

                  {/* Reporte de campo (solo atendidos) */}
                  {tab === 'atendidos' && (
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {inc.estatus === 'atendido' && !inc.hayDetencion && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                          CERRADO / ATENDIDO
                        </span>
                      )}
                      {inc.ofiAutoridadRecibe === 'FISCALIA' && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                          DERIVADO A FGE
                        </span>
                      )}
                      {inc.ofiAutoridadRecibe === 'FGR' && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: 2 }}>
                          DERIVADO A FGR
                        </span>
                      )}
                      {inc.ofiAutoridadRecibe === 'JUZGADO_CIVICO' && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fefce8', color: '#a16207', border: '1px solid #fef08a', borderRadius: 2 }}>
                          DERIVADO A JUZGADO CÍVICO
                        </span>
                      )}
                      {inc.d1Pendiente && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: 2 }}>
                          D1 PENDIENTE
                        </span>
                      )}
                      {inc.accionesRealizadas && (
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>ACCIONES REALIZADAS</label>
                          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#334155' }}>{inc.accionesRealizadas}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Link a ficha completa */}
                  <div>
                    <Link href={inc.canal === 'whatsapp' ? `/agente_911/whatsapp/incidentes/${inc.id}` : inc.canal === 'radio' ? `/agente_911/rondin/incidentes/${inc.id}` : `/agente_911/ciudadano/incidentes/${inc.id}`}
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.1em' }}>
                      VER FICHA COMPLETA →
                    </Link>
                  </div>

                  {/* Formulario de despacho solo en pestaña pendientes */}
                  {tab === 'pendientes' && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                      <label style={{ ...labelStyle, marginBottom: 12 }}>
                        {inc.origenRondin ? 'ASIGNAR UNIDADES Y REFUERZOS' : 'ASIGNAR UNIDADES Y ELEMENTOS'}
                      </label>
                      <DespachoForm
                        incidenteId={inc.id}
                        onDespachado={cargarPendientes}
                        prioritario={inc.origenRondin ? {
                          nombre: inc.prioritarioNombre || inc.elementos?.find(e => e.esPrioritario)?.nombre || '',
                          nomina: inc.prioritarioNomina || inc.elementos?.find(e => e.esPrioritario)?.nomina || '',
                        } : undefined}
                      />
                    </div>
                  )}

                  {/* Refuerzos: agregar elementos/unidades a un folio ya activo */}
                  {tab === 'en_despacho' && (
                    <div style={{ borderTop: '1px solid #fed7aa', paddingTop: 16 }}>
                      <label style={{ ...labelStyle, marginBottom: 12, color: '#c2410c' }}>ENVIAR REFUERZOS</label>
                      <DespachoForm incidenteId={inc.id} modo="refuerzo" onDespachado={() => cargarTab('en_despacho')} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CanalBadge({ canal }: { canal: string }) {
  const config: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
    '911':      { icon: <Phone size={11} />,         color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    'whatsapp': { icon: <MessageSquare size={11} />, color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
    'radio':    { icon: <Radio size={11} />,         color: '#1f355a', bg: '#eff1f3', border: '#c3c8d2' },
  }
  const c = config[canal] ?? { icon: null, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 2 }}>
      {c.icon} {canal.toUpperCase()}
    </span>
  )
}

const labelTopStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }
const titleStyle: React.CSSProperties    = { fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 36, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase' }
const btnBackStyle: React.CSSProperties  = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textDecoration: 'none', letterSpacing: '0.1em' }
const labelStyle: React.CSSProperties   = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }
const btnHoraStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', padding: '4px 10px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: 'pointer' }