'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, MapPin, User, Tag, AlertTriangle, BookOpen, Building2, Phone, FileText } from 'lucide-react'
import type { IncidenteDetalleCompleto } from '@/lib/incidentes/types'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS, BG_ESTATUS, formatearFechaHora } from './formato'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'

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
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '28px 16px', overflowY: 'auto',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de la incidencia"
        style={{
          background: '#fff', width: '100%', maxWidth: 800,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '18px 24px', flexShrink: 0,
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .kpi-modal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 20px; }
            .kpi-modal-grid.cols-1 { grid-template-columns: minmax(0, 1fr); }
            @media (max-width: 720px) { .kpi-modal-grid { grid-template-columns: minmax(0, 1fr); } }
            .kpi-modal-cerrar { border: 1px solid #e2e8f0; background: #fff; cursor: pointer; color: #64748b; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: var(--radius-lg); transition: all 0.3s ease-out; }
            .kpi-modal-cerrar:hover { background: #f1f5f9; color: #475569; }
            .kpi-modal-cerrar:active { transform: scale(0.97); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
            @media (prefers-reduced-motion: reduce) { .kpi-modal-cerrar:active { transform: none; } }
          `}} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                background: 'rgba(31,53,90,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={20} color="#1f355a" />
              </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12,
                    color: '#64748b', marginBottom: 2,
                  }}>
                    Incidencia
                  </div>
                  <div style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 26, color: '#0f172a' }}>
                    {detalle?.folio ?? '···'}
                  </div>
                  {detalle && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                      <span style={{
                        fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 500,
                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                        color: COLOR_ESTATUS[detalle.estatus] ?? '#64748b',
                        background: BG_ESTATUS[detalle.estatus] ?? '#f1f5f9',
                      }}>
                        {ETIQUETA_ESTATUS[detalle.estatus] ?? detalle.estatus}
                      </span>
                      {detalle.prioridad && (
                        <span style={{
                          fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 500,
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          color: colorPorPrioridad(detalle.prioridad).principal,
                          background: colorPorPrioridad(detalle.prioridad).fondo,
                        }}>
                          Prioridad {detalle.prioridad}
                        </span>
                      )}
                      {detalle.canal && (
                        <span style={{
                          fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 500,
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          color: '#475569', background: '#f1f5f9',
                        }}>
                          Canal {detalle.canal}
                        </span>
                      )}
                    </div>
                  )}
                </div>
            </div>
            <button
              type="button" onClick={onClose} aria-label="Cerrar"
              className="kpi-modal-cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
              borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 13,
            }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {!error && !detalle && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
              <div style={{
                fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8',
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
      border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      background: '#fff', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
      }}>
        <span style={{ color: '#1f355a', display: 'flex' }}>{icono}</span>
        <span style={{
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14, color: '#1f355a',
        }}>
          {titulo}
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  )
}

function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div className={`kpi-modal-grid${cols === 1 ? ' cols-1' : ''}`}>
      {children}
    </div>
  )
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 11,
        color: '#94a3b8', marginBottom: 4,
      }}>
        {etiqueta}
      </div>
      <div style={{
        fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#0f172a',
        whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: 1.5,
      }}>
        {valor?.trim() ? valor : <span style={{ color: '#cbd5e1' }}>—</span>}
      </div>
    </div>
  )
}
