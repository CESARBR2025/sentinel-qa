'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, MapPin, User, Tag, AlertTriangle, BookOpen, Building2, Phone, FileText } from 'lucide-react'
import type { IncidenteDetalleCompleto } from '@/lib/incidentes/types'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS, formatearFechaHora } from './formato'

export function ModalDetalleIncidencia({ incidenteId, onClose }: {
  incidenteId: string
  onClose: () => void
}) {
  const [detalle, setDetalle] = useState<IncidenteDetalleCompleto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let vigente = true
    fetch(`/api/incidentes/${incidenteId}`)
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 403 ? 'Sin permiso para ver el detalle' : 'No se pudo cargar el incidente')
        return r.json() as Promise<IncidenteDetalleCompleto>
      })
      .then(d => { if (vigente) setDetalle(d) })
      .catch((e: Error) => { if (vigente) setError(e.message) })
    return () => { vigente = false }
  }, [incidenteId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
  }, [onClose])

  if (typeof document === 'undefined') return null

  const contenido = (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de la incidencia"
        style={{
          background: '#fff', width: '100%', maxWidth: 800,
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
                <AlertTriangle size={18} color="#fff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b', marginBottom: 2,
                }}>
                  Incidencia
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26,
                    fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a',
                  }}>
                    {detalle?.folio ?? '···'}
                  </span>
                  {detalle && (
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
                      textTransform: 'uppercase', padding: '3px 10px',
                      color: COLOR_ESTATUS[detalle.estatus] ?? '#64748b',
                      border: `1px solid ${COLOR_ESTATUS[detalle.estatus] ?? '#cbd5e1'}`,
                      background: `${COLOR_ESTATUS[detalle.estatus] ?? '#f1f5f9'}15`,
                    }}>
                      {ETIQUETA_ESTATUS[detalle.estatus] ?? detalle.estatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button" onClick={onClose} aria-label="Cerrar"
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
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
              fontFamily: 'Inter, sans-serif', fontSize: 13,
            }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {!error && !detalle && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                Cargando detalle…
              </div>
            </div>
          )}

          {detalle && (
            <>
              {/* Clasificación */}
              <Seccion icono={<Tag size={14} />} titulo="Clasificación">
                <Grid>
                  <Campo etiqueta="Tipo de incidente" valor={detalle.tipoIncidente} />
                  <Campo etiqueta="Tipo de emergencia" valor={detalle.tipoEmergencia} />
                  <Campo etiqueta="Prioridad" valor={detalle.prioridad} />
                  <Campo etiqueta="Canal" valor={detalle.canal} />
                  <Campo etiqueta="Tipo de reporte" valor={detalle.tipoReporte} />
                  <Campo etiqueta="Origen rondín" valor={detalle.origenRondin ? 'Sí' : 'No'} />
                </Grid>
              </Seccion>

              {/* Reportante */}
              <Seccion icono={<User size={14} />} titulo="Reportante">
                <Grid>
                  <Campo etiqueta="Nombre" valor={detalle.anonimo ? 'Anónimo' : detalle.nombreReportante} />
                  <Campo etiqueta="Sexo" valor={detalle.sexo} />
                  <Campo etiqueta="Edad" valor={detalle.edad != null ? String(detalle.edad) : null} />
                  <Campo etiqueta="Usuario frecuente" valor={detalle.esUsuarioFrecuente ? 'Sí' : 'No'} />
                  <Campo etiqueta="Persona afectada" valor={detalle.esPersonaAfectada ? 'Sí' : 'No'} />
                  <Campo etiqueta="Migrante" valor={detalle.esMigrante ? 'Sí' : 'No'} />
                </Grid>
              </Seccion>

              {/* Ubicación y tiempos */}
              <Seccion icono={<MapPin size={14} />} titulo="Ubicación y tiempos">
                <Grid>
                  <Campo etiqueta="Calle" valor={detalle.calle} />
                  <Campo etiqueta="Colonia" valor={detalle.colonia} />
                  <Campo etiqueta="Entre calles" valor={detalle.entreCalles} />
                  <Campo etiqueta="Referencia" valor={detalle.referenciaUbicacion} />
                  <Campo etiqueta="Municipio" valor={detalle.municipio} />
                  <Campo etiqueta="Inicio" valor={formatearFechaHora(detalle.fechaHoraInicio)} />
                  <Campo etiqueta="Fin" valor={detalle.fechaHoraFin ? formatearFechaHora(detalle.fechaHoraFin) : null} />
                  <Campo etiqueta="Capturó" valor={detalle.capturadoPorNombre} />
                </Grid>
              </Seccion>

              {/* Narrativa */}
              <Seccion icono={<BookOpen size={14} />} titulo="Narrativa">
                <Grid cols={1}>
                  <Campo etiqueta="Descripción" valor={detalle.descripcion} />
                  <Campo etiqueta="Observaciones" valor={detalle.observaciones} />
                </Grid>
              </Seccion>

              {/* Despacho */}
              {detalle.despacho && (
                <Seccion icono={<Clock size={14} />} titulo="Despacho">
                  <Grid>
                    <Campo etiqueta="Fecha y hora" valor={detalle.despacho.fechaHoraDespacho ? formatearFechaHora(detalle.despacho.fechaHoraDespacho) : null} />
                  </Grid>
                </Seccion>
              )}

              {/* Personas afectadas */}
              {detalle.personasAfectadas.length > 0 && (
                <Seccion icono={<User size={14} />} titulo="Personas afectadas">
                  <Grid cols={1}>
                    {detalle.personasAfectadas.map(p => (
                      <Campo
                        key={p.id}
                        etiqueta={p.nombre ?? 'Sin nombre'}
                        valor={[p.sexo, p.edad != null ? `${p.edad} años` : null].filter(Boolean).join(' · ') || '—'}
                      />
                    ))}
                  </Grid>
                </Seccion>
              )}

              {/* Extorsión */}
              {detalle.extorsion && (
                <Seccion icono={<Phone size={14} />} titulo="Extorsión">
                  <Grid>
                    <Campo etiqueta="Teléfono" valor={detalle.extorsion.telefonoExtorsion} />
                    <Campo etiqueta="Grupo delictivo" valor={detalle.extorsion.grupoDelictivo} />
                    <Campo etiqueta="Modus operandi" valor={detalle.extorsion.modusOperandi} />
                    <Campo etiqueta="Resultado" valor={detalle.extorsion.resultado} />
                  </Grid>
                </Seccion>
              )}

              {/* Alarma escolar */}
              {detalle.alarmaEscolar && (
                <Seccion icono={<Building2 size={14} />} titulo="Alarma escolar">
                  <Grid>
                    <Campo etiqueta="Establecimiento" valor={detalle.alarmaEscolar.establecimiento} />
                    <Campo etiqueta="Dirección" valor={detalle.alarmaEscolar.direccion} />
                    <Campo etiqueta="Responsable" valor={detalle.alarmaEscolar.responsable} />
                    <Campo etiqueta="Unidad de arribo" valor={detalle.alarmaEscolar.unidadArribo} />
                  </Grid>
                </Seccion>
              )}

              {/* Reporte de campo */}
              {detalle.reporteCampo && (
                <Seccion icono={<FileText size={14} />} titulo="Reporte de campo">
                  <Grid cols={1}>
                    <Campo etiqueta="Acciones realizadas" valor={detalle.reporteCampo.accionesRealizadas} />
                    <Campo etiqueta="Hubo detención" valor={detalle.reporteCampo.hayDetencion ? 'Sí' : 'No'} />
                    <Campo etiqueta="Autoridad que recibe" valor={detalle.reporteCampo.autoridadRecibe} />
                  </Grid>
                </Seccion>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(contenido, document.body)
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function Seccion({ icono, titulo, children }: { icono: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0', background: '#fafbfc',
    }}>
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
