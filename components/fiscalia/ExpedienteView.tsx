'use client'

import {
  FileText, Fingerprint, Shield, MapPin, Clock, AlertTriangle,
  Radio, Phone, MessageSquare, CheckCircle, X, Camera, Image,
  Gavel, ScrollText, BookOpen, User, BadgeCheck, UserCheck, Hash,
  Calendar, ArrowLeft, Printer
} from 'lucide-react'
import Link from 'next/link'
import type { ExpedienteExp } from '@/lib/fiscalia/types'

const labelSx: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
  color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
}

const valueSx: React.CSSProperties = {
  fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', fontWeight: 500,
}

const sectionSx: React.CSSProperties = {
  padding: '20px 24px', border: '1px solid #e2e8f0', borderLeft: '4px solid #7c3aed',
  background: '#ffffff', borderRadius: 2,
}

const sectionTitleSx: React.CSSProperties = {
  fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 800,
  textTransform: 'uppercase', color: '#0f172a', marginBottom: 16,
  display: 'flex', alignItems: 'center', gap: 8,
}

function dsp(v: unknown): string {
  if (v === null || v === undefined) return '—'
  return String(v)
}

function fmtFecha(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function parseDetenidos(raw: unknown): { nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string }[] {
  if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
  if (Array.isArray(raw)) return raw
  return []
}

export function ExpedienteView({ data }: { data: ExpedienteExp }) {
  const { raw, detenidosDirecciones, fotos, evidencias } = data
  const r = raw

  const detenidos = parseDetenidos(r.rc_detenidos)
  const tieneDatosCapturados = !!(r as any).d1_folio_sija || !!(r as any).d1_folio_remision || !!(r as any).d1_marco_legal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Timeline */}
      <div style={{
        ...sectionSx, borderLeftColor: '#2563eb',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Línea de tiempo:
        </span>
        {[
          { label: 'Incidente', time: String(r.inc_fecha_hora_inicio ?? ''), icon: <AlertTriangle size={10} />, color: '#2563eb' },
          { label: 'Reporte Campo', time: String(r.rc_folio ?? ''), icon: <FileText size={10} />, color: '#7c3aed' },
          { label: 'D1', time: String(r.d1_folio_denuncia ?? ''), icon: <FileText size={10} />, color: '#059669' },
          { label: 'Captura', time: String(r.d1_folio_sija ?? ''), icon: <BookOpen size={10} />, color: '#0891b2' },
          { label: 'Asegurados', time: String(r.rc_folio_asegurados ?? ''), icon: <Shield size={10} />, color: '#d97706' },
          { label: 'Puesta Disp.', time: r.pd_id ? '✓' : '—', icon: <Gavel size={10} />, color: r.pd_id ? '#16a34a' : '#94a3b8' },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: '#cbd5e1', fontSize: 10 }}>→</span>}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '3px 8px', background: '#f8fafc', border: '1px solid #e2e8f0',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: step.color,
            }}>
              {step.icon}
              {step.label}
              {step.time !== '—' && step.time !== '' && (
                <span style={{ color: '#94a3b8' }}>·</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* 1. Incidente */}
      <div style={sectionSx}>
        <h3 style={sectionTitleSx}><AlertTriangle size={16} /> Datos del Incidente</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div><label style={labelSx}>Folio</label><div style={valueSx}>{dsp(r.inc_folio)}</div></div>
          <div><label style={labelSx}>Canal</label><div style={valueSx}>{dsp(r.inc_canal)}</div></div>
          <div><label style={labelSx}>Estatus</label><div style={valueSx}>{dsp(r.inc_estatus)}</div></div>
          <div><label style={labelSx}>Fecha/Hora Inicio</label><div style={valueSx}>{fmtFecha(r.inc_fecha_hora_inicio as string)}</div></div>
          <div><label style={labelSx}>Tipo</label><div style={valueSx}>{dsp(r.inc_tipo)}</div></div>
          <div><label style={labelSx}>Prioridad</label><div style={valueSx}>{dsp(r.inc_prioridad)}</div></div>
          <div style={{ gridColumn: 'span 2' }}><label style={labelSx}>Descripción</label><div style={valueSx}>{dsp(r.inc_descripcion)}</div></div>
          <div><label style={labelSx}>Origen Rondín</label><div style={valueSx}>{r.inc_origen_rondin ? 'SÍ' : 'NO'}</div></div>
          <div><label style={labelSx}>Calle</label><div style={valueSx}>{dsp(r.inc_calle)}</div></div>
          <div><label style={labelSx}>Colonia</label><div style={valueSx}>{dsp(r.inc_colonia)}</div></div>
          <div><label style={labelSx}>Municipio</label><div style={valueSx}>{dsp(r.inc_municipio)}</div></div>
        </div>
      </div>

      {/* 2. Reporte Campo */}
      <div style={{ ...sectionSx, borderLeftColor: '#7c3aed' }}>
        <h3 style={{ ...sectionTitleSx, color: '#7c3aed' }}><FileText size={16} /> Reporte de Campo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div><label style={labelSx}>Folio Reporte</label><div style={valueSx}>{dsp(r.rc_folio)}</div></div>
          <div><label style={labelSx}>Autoridad Recibe</label><div style={valueSx}>{dsp(r.rc_autoridad_recibe)}</div></div>
          <div><label style={labelSx}>Folio Asegurados</label><div style={valueSx}>{dsp(r.rc_folio_asegurados)}</div></div>
          <div style={{ gridColumn: 'span 3' }}><label style={labelSx}>Descripción</label><div style={valueSx}>{dsp(r.rc_descripcion)}</div></div>
        </div>
        {detenidos.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label style={labelSx}>Detenidos ({detenidos.length})</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {detenidos.map((d, i) => (
                <div key={i} style={{
                  padding: '6px 10px', background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#991b1b',
                }}>
                  {[d.nombre, d.apellidoPaterno, d.apellidoMaterno].filter(Boolean).join(' ') || 'Sin nombre'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. D1 */}
      <div style={{ ...sectionSx, borderLeftColor: '#059669' }}>
        <h3 style={{ ...sectionTitleSx, color: '#059669' }}><FileText size={16} /> Denuncia D1</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div><label style={labelSx}>Folio Denuncia</label><div style={valueSx}>{dsp(r.d1_folio_denuncia)}</div></div>
          <div><label style={labelSx}>IPH</label><div style={valueSx}>{dsp(r.d1_iph)}</div></div>
          <div><label style={labelSx}>Folio CU</label><div style={valueSx}>{dsp(r.d1_folio_cu)}</div></div>
          <div><label style={labelSx}>Corporación</label><div style={valueSx}>{dsp(r.d1_corporacion)}</div></div>
          <div><label style={labelSx}>Sector</label><div style={valueSx}>{dsp(r.d1_sector)}</div></div>
          <div><label style={labelSx}>Grupo Adscripción</label><div style={valueSx}>{dsp(r.d1_grupo_adscripcion)}</div></div>
          <div><label style={labelSx}>Fecha Reporte</label><div style={valueSx}>{dsp(r.d1_fecha_reporte)}</div></div>
          <div><label style={labelSx}>Hora Reporte</label><div style={valueSx}>{dsp(r.d1_hora_reporte)}</div></div>
          <div><label style={labelSx}>Delito</label><div style={valueSx}>{dsp(r.d1_delito)}</div></div>
          <div><label style={labelSx}>Violencia</label><div style={valueSx}>{r.d1_violencia ? 'SÍ' : 'NO'}</div></div>
          <div><label style={labelSx}>Lugar Hecho</label><div style={valueSx}>{dsp(r.d1_lugar_hecho)}</div></div>
          <div><label style={labelSx}>Colonia Hecho</label><div style={valueSx}>{dsp(r.d1_colonia_hecho)}</div></div>
          <div style={{ gridColumn: 'span 3' }}><label style={labelSx}>Observaciones</label><div style={valueSx}>{dsp(r.d1_observaciones)}</div></div>
        </div>
      </div>

      {tieneDatosCapturados && (

        <div style={{ ...sectionSx, borderLeftColor: '#0891b2' }}>
          <h3 style={{ ...sectionTitleSx, color: '#0891b2' }}><BookOpen size={16} /> Datos Capturados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div><label style={labelSx}>Folio SIJA</label><div style={valueSx}>{dsp(r.d1_folio_sija)}</div></div>
            <div><label style={labelSx}>Folio Remisión</label><div style={valueSx}>{dsp(r.d1_folio_remision)}</div></div>
            <div><label style={labelSx}>Marco Legal</label><div style={valueSx}>{dsp(r.d1_marco_legal)}</div></div>
          </div>
        </div>
      )}

      {/* 5. Direcciones Detenidos */}
      {detenidosDirecciones.length > 0 && (
        <div style={{ ...sectionSx, borderLeftColor: '#d97706' }}>
          <h3 style={{ ...sectionTitleSx, color: '#d97706' }}><MapPin size={16} /> Direcciones de Detenidos</h3>
          {detenidosDirecciones.map((dd, i) => (
            <div key={dd.id} style={{
              padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: 2, marginBottom: 8,
            }}>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {i + 1}. {[dd.nombreDetenido, dd.apPaterno, dd.apMaterno].filter(Boolean).join(' ')}
              </div>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#64748b' }}>
                {[dd.calle, dd.numero ? `#${dd.numero}` : '', dd.colonia, dd.codPostal].filter(Boolean).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Fotos de Detenidos */}
      {fotos.length > 0 && (
        <div style={{ ...sectionSx, borderLeftColor: '#dc2626' }}>
          <h3 style={{ ...sectionTitleSx, color: '#dc2626' }}><Camera size={16} /> Fotos de Detenidos ({fotos.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {fotos.map(f => (
              <div key={f.id} style={{ border: '1px solid #e2e8f0', overflow: 'hidden', background: '#f8fafc' }}>
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', overflow: 'hidden' }}>
                  <img
                    src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(f.url)}`}
                    alt={f.tipoFoto}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>
                  Detenido {f.detenidoIndex ?? '?'} · {f.tipoFoto}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Evidencias */}
      {evidencias.length > 0 && (
        <div style={{ ...sectionSx, borderLeftColor: '#0891b2' }}>
          <h3 style={{ ...sectionTitleSx, color: '#0891b2' }}><Image size={16} /> Evidencias ({evidencias.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {evidencias.map(ev => {
              const esImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.urlArchivo)
              return (
                <div key={ev.id} style={{ border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => window.open(`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`, '_blank')}>
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                    {esImg ? (
                      <img src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`} alt={dsp(ev.nombreArchivo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FileText size={32} color="#94a3b8" />
                    )}
                  </div>
                  <div style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b' }}>
                    {dsp(ev.nombreArchivo)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 8. Puesta a Disposición / Traslado */}
      {(r as any).pd_id && (
        <div style={{ ...sectionSx, borderLeftColor: '#d97706' }}>
          <h3 style={{ ...sectionTitleSx, color: '#d97706' }}><Gavel size={16} /> Puesta a Disposición / Traslado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div><label style={labelSx}>Gestión Interna</label><div style={valueSx}>{r.pd_gestion_interna ? 'SÍ' : 'NO'}</div></div>
            <div><label style={labelSx}>Dependencia Externa (Destino)</label><div style={valueSx}>{dsp(r.pd_dependencia_externa)}</div></div>
            <div><label style={labelSx}>Hora Inicio Traslado</label><div style={valueSx}>{dsp(r.pd_hora_inicio_traslado)}</div></div>
            <div><label style={labelSx}>Hora Llegada Sede</label><div style={valueSx}>{dsp(r.pd_hora_llegada_sede)}</div></div>
            <div><label style={labelSx}>Hora Puesta Disposición</label><div style={valueSx}>{dsp(r.pd_hora_puesta_disposicion)}</div></div>
            <div><label style={labelSx}>Tiempo Traslado Total</label><div style={valueSx}>{dsp(r.pd_tiempo_traslado_total)} min</div></div>
            <div><label style={labelSx}>Otros Actos</label><div style={valueSx}>{dsp(r.pd_otros_actos)}</div></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelSx}>Actas</label><div style={valueSx}>{dsp(r.pd_actas)}</div></div>
          </div>
        </div>
      )}

      {/* Estado actual */}
      <div style={{
        padding: '16px 24px', background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <CheckCircle size={18} color="#16a34a" />
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#15803d' }}>
          Estado de trámite: <strong>{dsp(r.d1_estado_tramite)}</strong>
          {' · '}
          Evidencia: <strong>{dsp(r.d1_estado_evidencia)}</strong>
          {(r as any).pd_id && (
            <span> · <strong>Traslado registrado</strong> a {dsp(r.pd_dependencia_externa)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
