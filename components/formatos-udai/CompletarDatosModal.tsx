'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, PenLine, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ReporteIncidenciaCompleto } from '@/lib/formatos-udai/types'
import { guardarComplementoIncidencia } from '@/lib/formatos-udai/actions'

function aDateTimeLocal(v: string | null | undefined): string {
  if (!v) return ''
  const m = v.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/)
  return m ? `${m[1]}T${m[2]}:${m[3]}` : v
}

function aDate(v: string | null | undefined): string {
  if (!v) return ''
  const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : ''
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

interface CampoForm {
  label: string
  nombre: string
  valor: string
  tipo?: 'text' | 'number' | 'date' | 'datetime-local'
  textarea?: boolean
  ayuda?: string
  placeholder?: string
}

function normalizeToInput(v: string | null | undefined, tipo?: 'number' | 'date' | 'datetime-local'): string {
  if (tipo === 'datetime-local') return aDateTimeLocal(v)
  if (tipo === 'date') return aDate(v)
  return v ?? ''
}

export function CompletarDatosModal({ row }: { row: ReporteIncidenciaCompleto }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<'guardar' | 'completar' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const badge = estadoBadge(row.estadoCompletitud)
  // Proxy para saber si el incidente tuvo detención: si el reporte ya resolvió
  // el nombre del detenido, la sección de Puesta a Disposición aplica.
  const conDetencion = Boolean(row.detenido)

  const camposIncidencia: CampoForm[] = [
    { label: 'RT', nombre: 'rt', valor: row.rt ?? '' },
    { label: 'Turno', nombre: 'turno', valor: row.turno ?? '' },
    {
      label: 'Artículos u objetos', nombre: 'articulosObjetos', valor: row.articulosObjetos ?? '',
      textarea: true,
    },
    { label: 'AP/NUC', nombre: 'apNuc', valor: row.apNuc ?? '' },
    { label: 'Calle afectado', nombre: 'calleAfec', valor: row.calleAfec ?? '' },
    { label: 'Número afectado', nombre: 'numeroAfec', valor: row.numeroAfec ?? '' },
    { label: 'Colonia afectado', nombre: 'coloniaAfec', valor: row.coloniaAfec ?? '' },
    {
      label: 'Fuero (override)', nombre: 'fueroOverride', valor: '',
      ayuda: `El FUERO ya se calcula automático (${row.fuero || '—'}) a partir del grupo de adscripción; solo llenar si está mal.`,
    },
  ]

  const camposPuesta: CampoForm[] = [
    { label: 'Agrupamiento', nombre: 'agrupamiento', valor: row.agrupamiento ?? '' },
    { label: 'Folio RND', nombre: 'folioRnd', valor: row.folioRnd ?? '' },
    { label: 'Originario', nombre: 'originario', valor: row.originario ?? '' },
    {
      label: 'NUC / CU', nombre: 'nucCu', valor: row.nucCu ?? '',
      ayuda: 'Sugerido desde el CURP capturado por Análisis si existe — verificar antes de guardar.',
    },
    { label: 'Edad', nombre: 'edad', valor: row.edad != null ? String(row.edad) : '', tipo: 'number' },
    { label: 'Fecha de nacimiento', nombre: 'fechaNacimiento', valor: normalizeToInput(row.fechaNacimiento, 'date'), tipo: 'date' },
    { label: 'Sexo', nombre: 'sexo', valor: row.sexo ?? '' },
    { label: 'Calle detenido', nombre: 'calleDet', valor: row.calleDet ?? '' },
    { label: 'Número detenido', nombre: 'numeroDet', valor: row.numeroDet ?? '' },
    { label: 'Colonia detenido', nombre: 'coloniaDet', valor: row.coloniaDet ?? '' },
    { label: 'Marca', nombre: 'marca', valor: row.marca ?? '' },
    { label: 'Submarca', nombre: 'submarca', valor: row.submarca ?? '' },
    { label: 'Tipo vehículo', nombre: 'tipoVehiculo', valor: row.tipo ?? '' },
    { label: 'Color', nombre: 'color', valor: row.color ?? '' },
    { label: 'Placas', nombre: 'placas', valor: row.placas ?? '' },
    { label: 'Estado', nombre: 'estadoVehiculo', valor: row.estadoVehiculo ?? '' },
    { label: 'NIV', nombre: 'niv', valor: row.niv ?? '' },
    { label: 'Motor', nombre: 'motor', valor: row.motor ?? '' },
    { label: 'Modelo', nombre: 'modelo', valor: row.modelo ?? '' },
    { label: 'Fecha de ingreso', nombre: 'fechaIngreso', valor: normalizeToInput(row.fechaIngreso, 'datetime-local'), tipo: 'datetime-local' },
    { label: 'Fecha de salida', nombre: 'fechaSalida', valor: normalizeToInput(row.fechaSalida, 'datetime-local'), tipo: 'datetime-local' },
    { label: 'Otro delito', nombre: 'otroDelito', valor: row.otroDelito ?? '', textarea: true },
    { label: 'MASC', nombre: 'masc', valor: row.masc ?? '', ayuda: 'Texto libre.' },
    { label: 'UMECAS', nombre: 'umecas', valor: row.umecas ?? '', ayuda: 'Texto libre.' },
  ]

  const [valores, setValores] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {}
    for (const c of [...camposIncidencia, ...camposPuesta]) inicial[c.nombre] = c.valor
    return inicial
  })

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

  async function handleGuardar(marcarCompleto: boolean) {
    setPending(marcarCompleto ? 'completar' : 'guardar')
    setError(null)
    try {
      await guardarComplementoIncidencia({
        incidenteId: row.id,
        rt: valores.rt || null,
        turno: valores.turno || null,
        articulosObjetos: valores.articulosObjetos || null,
        apNuc: valores.apNuc || null,
        calleAfec: valores.calleAfec || null,
        numeroAfec: valores.numeroAfec || null,
        coloniaAfec: valores.coloniaAfec || null,
        fueroOverride: valores.fueroOverride || null,
        agrupamiento: valores.agrupamiento || null,
        folioRnd: valores.folioRnd || null,
        originario: valores.originario || null,
        nucCu: valores.nucCu || null,
        edad: valores.edad ? Number(valores.edad) : null,
        fechaNacimiento: valores.fechaNacimiento || null,
        sexo: valores.sexo || null,
        calleDet: valores.calleDet || null,
        numeroDet: valores.numeroDet || null,
        coloniaDet: valores.coloniaDet || null,
        marca: valores.marca || null,
        submarca: valores.submarca || null,
        tipoVehiculo: valores.tipoVehiculo || null,
        color: valores.color || null,
        placas: valores.placas || null,
        estadoVehiculo: valores.estadoVehiculo || null,
        niv: valores.niv || null,
        motor: valores.motor || null,
        modelo: valores.modelo || null,
        fechaIngreso: valores.fechaIngreso || null,
        fechaSalida: valores.fechaSalida || null,
        otroDelito: valores.otroDelito || null,
        masc: valores.masc || null,
        umecas: valores.umecas || null,
        marcarCompleto,
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setPending(null)
    }
  }

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
        aria-label="Completar datos del reporte de incidencia"
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
                <PenLine size={18} color="#fff" />
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
                    Completar datos
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
        <form
          onSubmit={e => { e.preventDefault(); handleGuardar(true) }}
          style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <SeccionForm titulo="Hoja Incidencia" descripcion="Datos sin fuente automática en la cadena 911 → reporte de campo → denuncia">
            <GridForm campos={camposIncidencia} valores={valores} setValores={setValores} />
          </SeccionForm>

          {conDetencion && (
            <SeccionForm titulo="Hoja Puestas a Disposición" descripcion="Solo aplica si hubo detención — complemento del incidente">
              <GridForm campos={camposPuesta} valores={valores} setValores={setValores} />
            </SeccionForm>
          )}

          {error && (
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#b91c1c',
              background: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleGuardar(false)}
              disabled={pending !== null}
              style={{
                fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.1em', padding: '12px 22px', background: '#fff', color: '#64748b',
                border: '1px solid #e2e8f0', borderRadius: 2, cursor: pending ? 'not-allowed' : 'pointer',
              }}
            >
              {pending === 'guardar' ? 'Guardando...' : 'Guardar progreso'}
            </button>
            <button
              type="submit"
              disabled={pending !== null}
              style={{
                fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.1em', padding: '12px 22px', background: pending === 'completar' ? '#16a34a' : '#15803d',
                color: '#ffffff', border: 'none', borderRadius: 2,
                cursor: pending ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <CheckCircle2 size={14} />
              {pending === 'completar' ? 'Guardando...' : 'Guardar y marcar como completa'}
            </button>
          </div>
        </form>
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
          padding: '5px 12px', background: '#15803d', border: 'none',
          color: '#ffffff', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <PenLine size={13} /> Completar datos
      </button>
      {open && typeof document !== 'undefined' && createPortal(contenido, document.body)}
    </>
  )
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function SeccionForm({ titulo, descripcion, children }: { titulo: string; descripcion: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', background: '#fafbfc' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 14px',
        borderBottom: '1px solid #e2e8f0', background: '#fff',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1f355a', fontWeight: 600,
        }}>
          {titulo}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b' }}>
          {descripcion}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        {children}
      </div>
    </div>
  )
}

function GridForm({ campos, valores, setValores }: {
  campos: CampoForm[]
  valores: Record<string, string>
  setValores: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
      gap: '10px 20px',
    }}>
      {campos.map(c => (
        <div key={c.nombre} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label htmlFor={`c-${c.nombre}`} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#64748b',
          }}>
            {c.label}
          </label>
          {c.textarea ? (
            <textarea
              id={`c-${c.nombre}`}
              value={valores[c.nombre]}
              onChange={e => setValores(prev => ({ ...prev, [c.nombre]: e.target.value }))}
              rows={2}
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '8px 10px',
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3,
                color: '#0f172a', resize: 'vertical',
              }}
            />
          ) : (
            <input
              id={`c-${c.nombre}`}
              type={c.tipo ?? 'text'}
              value={valores[c.nombre]}
              onChange={e => setValores(prev => ({ ...prev, [c.nombre]: e.target.value }))}
              placeholder={c.placeholder}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '8px 10px',
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3,
                color: '#0f172a',
              }}
            />
          )}
          {c.ayuda && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>
              {c.ayuda}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
