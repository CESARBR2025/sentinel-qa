'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, FileSpreadsheet, Calendar, User, MapPin, Shield, Scale } from 'lucide-react'
import type { FaltaAdministrativaRow } from '@/lib/formatos-udai/types'

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

function nombreCompleto(r: FaltaAdministrativaRow): string {
  return [r.nombre, r.apellidoPaterno, r.apellidoMaterno].filter(Boolean).join(' ')
}

export function DetalleFaltaAdministrativaModal({ row }: { row: FaltaAdministrativaRow }) {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

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
        aria-label="Detalle de la falta administrativa"
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
                  Faltas Administrativas
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26,
                    fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a',
                  }}>
                    {nombreCompleto(row) || 'Registro'}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '3px 10px',
                    color: '#1f355a', border: '1px solid #cbd5e1', background: '#f1f5f9',
                  }}>
                    IPH {row.iph || '—'}
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
              <Campo etiqueta="Fecha" valor={formatFecha(row.fecha) || null} />
              <Campo etiqueta="Hora" valor={formatHora(row.hora) || null} />
              <Campo etiqueta="Responsable de turno" valor={row.responsableTurno} />
              <Campo etiqueta="Hora de salida" valor={row.horaSalida} />
              <Campo etiqueta="IPH" valor={row.iph} />
              <Campo etiqueta="Folio tablet" valor={row.folioTablet} />
            </Grid>
          </Seccion>

          <Seccion icono={<User size={14} />} titulo="Datos del detenido">
            <Grid>
              <Campo etiqueta="Nombre" valor={row.nombre} />
              <Campo etiqueta="Apellido paterno" valor={row.apellidoPaterno} />
              <Campo etiqueta="Apellido materno" valor={row.apellidoMaterno} />
              <Campo etiqueta="Fecha de nacimiento" valor={formatFecha(row.fechaNacimiento) || null} />
              <Campo etiqueta="Edad" valor={row.edad != null ? String(row.edad) : null} />
              <Campo etiqueta="Género" valor={row.genero} />
              <Campo etiqueta="Alias" valor={row.alias} />
              <Campo etiqueta="Ciudad de origen" valor={row.ciudadOrigen} />
              <Campo etiqueta="Calle" valor={row.calleDet} />
              <Campo etiqueta="Número" valor={row.numero} />
              <Campo etiqueta="Colonia" valor={row.coloniaDet} />
            </Grid>
          </Seccion>

          <Seccion icono={<Scale size={14} />} titulo="Falta administrativa">
            <Grid>
              <Campo etiqueta="Artículo" valor={row.articulo} />
              <Campo etiqueta="Tipo de falta administrativa" valor={row.tipoFalta} />
              <Campo etiqueta="Registro Nacional de Detenidos" valor={row.rnd} />
            </Grid>
          </Seccion>

          <Seccion icono={<MapPin size={14} />} titulo="Lugar de arresto">
            <Grid>
              <Campo etiqueta="Calle y/o avenida" valor={row.lugarArresto} />
              <Campo etiqueta="Colonia" valor={row.colonia} />
              <Campo etiqueta="Sector" valor={row.sector} />
              <Campo etiqueta="Agrupamiento" valor={row.agrupamiento} />
              <Campo etiqueta="Coordenadas latitud" valor={row.latitud != null ? String(row.latitud) : null} />
              <Campo etiqueta="Coordenadas longitud" valor={row.longitud != null ? String(row.longitud) : null} />
            </Grid>
          </Seccion>

          <Seccion icono={<Shield size={14} />} titulo="Oficial y uso de la fuerza">
            <Grid>
              <Campo etiqueta="Oficial que remite" valor={row.oficialQueRemite} />
              <Campo etiqueta="Oficial que remite (2)" valor={row.oficialQueRemite2} />
              <Campo etiqueta="Presencia" valor={row.presencia ? 'Sí' : 'No'} />
              <Campo etiqueta="Verbalización" valor={row.verbalizacion ? 'Sí' : 'No'} />
              <Campo etiqueta="Control de contacto" valor={row.controlContacto ? 'Sí' : 'No'} />
              <Campo etiqueta="Control físico" valor={row.controlFisico ? 'Sí' : 'No'} />
              <Campo etiqueta="Técnicas defensivas no letales" valor={row.tecnicasNoLetales ? 'Sí' : 'No'} />
              <Campo etiqueta="Fuerza potencial letal" valor={row.fuerzaLetal ? 'Sí' : 'No'} />
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
