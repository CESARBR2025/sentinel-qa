'use client'

import Link from 'next/link'
import { Hash, FileText, Fingerprint, Calendar, Clock, BookOpen, User, Shield, BadgeCheck, UserCheck, ScrollText, Gavel, MapPin, Map, Image, File } from 'lucide-react'
import { abrirDocumento } from '@/lib/shared/abrirDocumento'
import type { DetalleAsegurado, EvidenciaMonitorista } from '@/lib/fiscalia/types'

const labelSx: React.CSSProperties = {
  display: 'block',
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 9,
  color: '#64748b',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 4,
}

const disabledSx: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #f1f5f9',
  borderLeft: '3px solid #059669',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#64748b',
  background: '#f8fafc',
  boxSizing: 'border-box',
}

interface Props {
  solicitudId: string
  data: DetalleAsegurado
  evidencias?: EvidenciaMonitorista[]
}

function esImagen(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
}

export function DetallesAseguradoView({ solicitudId, data, evidencias }: Props) {
  const displayVal = (val: string | null | undefined): string => val ?? '—'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#7c3aed',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          OL DE: Fiscalía
        </div>
        <h3 style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 24,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          margin: '0 0 4px 0',
          color: '#0f172a',
        }}>
          Detalles del Expediente · <span style={{ color: '#7c3aed' }}>Fiscalía</span>
        </h3>
        <p style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: '#64748b',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Expediente completo de la solicitud <strong>#{solicitudId}</strong>
        </p>
      </div>

      {/* SECCIÓN 1: Datos de la Solicitud (readonly) */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #7c3aed',
        background: '#fafafa',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <FileText size={16} color="#7c3aed" />
          Datos de la Solicitud
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}><Hash size={10} style={{ marginRight: 4 }} /> Folio del Incidente</label>
            <div style={disabledSx}>{displayVal(data.folioDenuncia)}</div>
          </div>
          <div>
            <label style={labelSx}><FileText size={10} style={{ marginRight: 4 }} /> Folio del Reporte</label>
            <div style={disabledSx}>{displayVal(data.folioReporteCampo)}</div>
          </div>
          <div>
            <label style={labelSx}><Fingerprint size={10} style={{ marginRight: 4 }} /> IPH</label>
            <div style={disabledSx}>{displayVal(data.iph)}</div>
          </div>
          <div>
            <label style={labelSx}><Calendar size={10} style={{ marginRight: 4 }} /> Fecha</label>
            <div style={disabledSx}>{displayVal(data.fechaReporte)}</div>
          </div>
          <div>
            <label style={labelSx}><Clock size={10} style={{ marginRight: 4 }} /> Hora</label>
            <div style={disabledSx}>{displayVal(data.horaReporte)}</div>
          </div>
          <div>
            <label style={labelSx}><User size={10} style={{ marginRight: 4 }} /> Nombre del Detenido</label>
            <div style={disabledSx}>{displayVal(data.nombreDetenido)}</div>
          </div>
          <div>
            <label style={labelSx}><Shield size={10} style={{ marginRight: 4 }} /> Placa Unidad Policial</label>
            <div style={disabledSx}>{displayVal(data.placaUnidad)}</div>
          </div>
          <div>
            <label style={labelSx}><BadgeCheck size={10} style={{ marginRight: 4 }} /> Nombre del Policía</label>
            <div style={disabledSx}>{displayVal(data.nombrePolicia)}</div>
          </div>
          <div>
            <label style={labelSx}><UserCheck size={10} style={{ marginRight: 4 }} /> Nómina del Policía</label>
            <div style={disabledSx}>{displayVal(data.nominaPolicia)}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelSx}><MapPin size={10} style={{ marginRight: 4 }} /> Lugar de la Detención</label>
            <div style={disabledSx}>{displayVal(data.lugarDetencion)}</div>
          </div>
          <div>
            <label style={labelSx}><User size={10} style={{ marginRight: 4 }} /> Quien ingresó el registro</label>
            <div style={disabledSx}>{displayVal(data.capturadoPorNombre)}</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Datos Capturados (readonly) */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #059669',
        background: '#fafafa',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <BookOpen size={16} color="#059669" />
          Datos Capturados
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}><BookOpen size={10} style={{ marginRight: 4 }} /> Folio SIJA</label>
            <div style={disabledSx}>{displayVal(data.folioSija)}</div>
          </div>
          <div>
            <label style={labelSx}><MapPin size={10} style={{ marginRight: 4 }} /> Domicilio</label>
            <div style={disabledSx}>
              {[data.domicilioCalle, data.domicilioNumero ? `#${data.domicilioNumero}` : '', data.domicilioColonia, data.domicilioMunicipio].filter(Boolean).join(', ') || '—'}
            </div>
          </div>
          <div>
            <label style={labelSx}><ScrollText size={10} style={{ marginRight: 4 }} /> Folio Remisión</label>
            <div style={disabledSx}>{displayVal(data.folioRemision)}</div>
          </div>
          <div>
            <label style={labelSx}><Gavel size={10} style={{ marginRight: 4 }} /> Marco Legal</label>
            <div style={disabledSx}>{displayVal(data.marcoLegal)}</div>
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Calle</label>
            <div style={disabledSx}>{displayVal(data.domicilioCalle)}</div>
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Número</label>
            <div style={disabledSx}>{displayVal(data.domicilioNumero)}</div>
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Colonia</label>
            <div style={disabledSx}>{displayVal(data.domicilioColonia)}</div>
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Municipio</label>
            <div style={disabledSx}>{displayVal(data.domicilioMunicipio)}</div>
          </div>
        </div>
      </div>

      {evidencias && evidencias.length > 0 && (
        <div style={{
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          borderLeft: '3px solid #0891b2',
          background: '#fafafa',
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#1e293b',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Image size={16} color="#0891b2" />
            Evidencias Fotográficas ({evidencias.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {evidencias.map(ev => (
              <div
                key={ev.id}
                onClick={() => abrirDocumento(ev.urlArchivo)}
                style={{
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                {esImagen(ev.urlArchivo) ? (
                  <div style={{ width: '100%', height: 140, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img
                      src={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`}
                      alt={ev.nombreArchivo ?? 'Evidencia'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: 140, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <File size={40} color="#94a3b8" />
                  </div>
                )}
                <div style={{ padding: '8px 10px', fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.nombreArchivo ?? `Evidencia ${ev.id}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Link href="/agente_juzgado/solicitudes" style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          padding: '8px 20px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#64748b',
          cursor: 'pointer',
          textDecoration: 'none',
        }}>
          Regresar
        </Link>
      </div>
    </>
  )
}
