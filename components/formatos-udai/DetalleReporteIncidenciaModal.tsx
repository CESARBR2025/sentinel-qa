'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, FileSpreadsheet, Calendar, User, Car, Shield, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ReporteIncidenciaCompleto } from '@/lib/formatos-udai/types'

function formatFecha(iso: string | null): string {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

function formatHora(time: string | null): string {
  if (!time) return ''
  return time.slice(0, 5)
}

function formatFechaHora(iso: string | null): string {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`
}

function estadoBadge(estado: 'pendiente' | 'completa') {
  if (estado === 'completa') {
    return {
      texto: 'Completa',
      color: '#15803d',
      bg: '#dcfce7',
      icono: <CheckCircle2 size={12} />,
    }
  }
  return {
    texto: 'Pendiente',
    color: '#b45309',
    bg: '#fef3c7',
    icono: <AlertTriangle size={12} />,
  }
}

export function DetalleReporteIncidenciaModal({ row }: { row: ReporteIncidenciaCompleto }) {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const badge = estadoBadge(row.estadoCompletitud)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    const htmlPrevio = document.documentElement.style.overflow
    const bodyPrevio = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.documentElement.style.overflow = htmlPrevio
      document.body.style.overflow = bodyPrevio
    }
  }, [open])

  const contenido = (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) setOpen(false) }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del reporte de incidencia"
        style={{
          background: '#fff', width: '100%', maxWidth: 860,
          boxShadow: '0 25px 60px -16px rgba(15,23,42,0.5)',
          borderRadius: 0, overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div style={{
          background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          padding: '18px 24px', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{
                width: 40, height: 40, background: '#1f355a', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <FileSpreadsheet size={18} color="#fff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b', marginBottom: 2,
                }}>
                  Reportes de Incidencias
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26,
                    fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a',
                  }}>
                    {row.detenido || 'Registro'}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '3px 10px',
                    color: '#1f355a', border: '1px solid #cbd5e1', background: '#f1f5f9',
                  }}>
                    {row.folio911 || '—'}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '3px 10px',
                    color: badge.color, background: badge.bg,
                  }}>
                    {badge.icono} {badge.texto}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
              style={{
                border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
                color: '#64748b', padding: 8, display: 'flex', flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Seccion icono={<Calendar size={14} />} titulo="Identificación y tiempos">
            <Grid>
              <Campo etiqueta="IPH" valor={row.iph} />
              <Campo etiqueta="Folio 911" valor={row.folio911} />
              <Campo etiqueta="Fecha evento" valor={formatFecha(row.fechaEvento) || null} />
              <Campo etiqueta="Día evento" valor={row.diaEvento} />
              <Campo etiqueta="Hora inicio evento" valor={formatHora(row.horaInicioEvento) || null} />
              <Campo etiqueta="Hora final evento" valor={formatHora(row.horaFinalEvento) || null} />
              <Campo etiqueta="Hora promedio" valor={formatHora(row.horaPromedio) || null} />
              <Campo etiqueta="Fecha reporte" valor={formatFecha(row.fechaReporte2) || null} />
              <Campo etiqueta="Hora reporte" valor={formatHora(row.horaReporte) || null} />
              <Campo etiqueta="Fuero" valor={row.fuero} />
            </Grid>
          </Seccion>

          <Seccion icono={<Shield size={14} />} titulo="Hecho">
            <Grid>
              <Campo etiqueta="Delito" valor={row.delito} />
              <Campo etiqueta="Artículos u objetos" valor={row.articulosObjetos} />
              <Campo etiqueta="Otro delito" valor={row.otroDelito} />
              <Campo etiqueta="Modus operandi" valor={row.modus} />
              <Campo etiqueta="Calle" valor={row.calle} />
              <Campo etiqueta="Número o referencia" valor={row.numeroReferencia} />
              <Campo etiqueta="Colonia" valor={row.colonia} />
              <Campo etiqueta="Sector" valor={row.sector} />
              <Campo etiqueta="RT" valor={row.rt} />
              <Campo etiqueta="Turno" valor={row.turno} />
              <Campo etiqueta="CRP" valor={row.crp} />
              <Campo etiqueta="Latitud" valor={row.latitud} />
              <Campo etiqueta="Longitud" valor={row.longitud} />
              <Campo etiqueta="Agente aprehensor" valor={row.agenteAprehensor} />
            </Grid>
          </Seccion>

          <Seccion icono={<User size={14} />} titulo="Afectado">
            <Grid>
              <Campo etiqueta="Afectado" valor={row.afectado} />
              <Campo etiqueta="Calle" valor={row.calleAfec} />
              <Campo etiqueta="Número" valor={row.numeroAfec} />
              <Campo etiqueta="Colonia" valor={row.coloniaAfec} />
              <Campo etiqueta="Teléfono" valor={row.telefonoAfec} />
              <Campo etiqueta="AP/NUC" valor={row.apNuc} />
            </Grid>
          </Seccion>

          <Seccion icono={<Car size={14} />} titulo="Vehículo">
            <Grid>
              <Campo etiqueta="Marca" valor={row.marca} />
              <Campo etiqueta="Submarca" valor={row.submarca} />
              <Campo etiqueta="Tipo" valor={row.tipo} />
              <Campo etiqueta="Color" valor={row.color} />
              <Campo etiqueta="Placas" valor={row.placas} />
              <Campo etiqueta="Estado" valor={row.estadoVehiculo} />
              <Campo etiqueta="NIV" valor={row.niv} />
              <Campo etiqueta="Motor" valor={row.motor} />
              <Campo etiqueta="Modelo" valor={row.modelo} />
            </Grid>
          </Seccion>

          <Seccion icono={<User size={14} />} titulo="Detenido">
            <Grid>
              <Campo etiqueta="Detenido" valor={row.detenido} />
              <Campo etiqueta="Alias" valor={row.alias} />
              <Campo etiqueta="Fecha de nacimiento" valor={formatFecha(row.fechaNacimiento) || null} />
              <Campo etiqueta="Edad" valor={row.edad != null ? String(row.edad) : null} />
              <Campo etiqueta="Sexo" valor={row.sexo} />
              <Campo etiqueta="Calle" valor={row.calleDet} />
              <Campo etiqueta="Número" valor={row.numeroDet} />
              <Campo etiqueta="Colonia" valor={row.coloniaDet} />
            </Grid>
          </Seccion>

          <Seccion icono={<Scale size={14} />} titulo="Administrativo (Puesta a Disposición)">
            <Grid>
              <Campo etiqueta="Agrupamiento" valor={row.agrupamiento} />
              <Campo etiqueta="Municipio" valor={row.municipio} />
              <Campo etiqueta="Originario" valor={row.originario} />
              <Campo etiqueta="NUC / CU" valor={row.nucCu} />
              <Campo etiqueta="Folio RND" valor={row.folioRnd} />
              <Campo etiqueta="Latitud 2" valor={row.latitud2} />
              <Campo etiqueta="Longitud 3" valor={row.longitud3} />
              <Campo etiqueta="Fecha de ingreso" valor={formatFechaHora(row.fechaIngreso) || null} />
              <Campo etiqueta="Fecha de salida" valor={formatFechaHora(row.fechaSalida) || null} />
              <Campo etiqueta="MASC" valor={row.masc} />
              <Campo etiqueta="UMECAS" valor={row.umecas} />
            </Grid>
          </Seccion>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0',
          color: '#1f355a', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <Eye size={13} /> Ver detalle
      </button>
      {open && typeof document !== 'undefined' && createPortal(contenido, document.body)}
    </>
  )
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function Seccion({ icono, titulo, children }: { icono: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', background: '#fafbfc' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        borderBottom: '1px solid #e2e8f0', background: '#fff',
      }}>
        <span style={{ color: '#1f355a', display: 'flex' }}>{icono}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1f355a',
        }}>
          {titulo}
        </span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        {children}
      </div>
    </div>
  )
}

function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: '10px 20px',
    }}>
      {children}
    </div>
  )
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#94a3b8', marginBottom: 3,
      }}>
        {etiqueta}
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#0f172a',
        whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: 1.5,
      }}>
        {valor?.trim() ? valor : <span style={{ color: '#cbd5e1' }}>—</span>}
      </div>
    </div>
  )
}
