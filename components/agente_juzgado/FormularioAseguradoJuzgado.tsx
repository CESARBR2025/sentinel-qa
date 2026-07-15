'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Hash, FileText, Fingerprint, Calendar, Clock, BookOpen, User,
  Shield, BadgeCheck, UserCheck, MapPin, Map, Gavel, ScrollText, ArrowLeft,
} from 'lucide-react'
import GoogleMapPicker from '@/components/maps/GoogleMapPicker'
import type { DetalleAseguradoCompleto } from '@/lib/fiscalia/types'
import { ACTAS_CHECKLIST } from '@/lib/fiscalia/types'

interface Props {
  reporteCampoId: string
  data: DetalleAseguradoCompleto
  puestaDisposicion?: {
    id: string
    gestionInterna: boolean
    dependenciaExterna: string | null
    actas: Record<string, boolean>
    otrosActos: string | null
    horaInicioTraslado: string
    horaLlegadaSede: string
    tiempoTrasladoTotal: number
    horaPuestaDisposicion: string
  } | null
}

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

function displayVal(val: string | null | undefined): string {
  return val ?? '—'
}

function concatNombre(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ') || '—'
}

export function FormularioAseguradoJuzgado({ reporteCampoId, data, puestaDisposicion: pad }: Props) {
  const router = useRouter()

  const [placesLoaded, setPlacesLoaded] = useState(false)
  const [vistaMapa, setVistaMapa] = useState<('map' | 'street')[]>([])
  const [errorMaps, setErrorMaps] = useState<string | null>(null)
  const streetViewRefs = useRef<(HTMLDivElement | null)[]>([])
  const streetViewInstances = useRef<(google.maps.StreetViewPanorama | null)[]>([])

  useEffect(() => {
    const check = () => {
      if (window.google?.maps && !placesLoaded) {
        setPlacesLoaded(true)
      }
    }
    check()
    const interval = setInterval(check, 500)
    return () => clearInterval(interval)
  }, [placesLoaded])

  useEffect(() => {
    if (!placesLoaded) return
    setVistaMapa(data.detenidos.map(() => 'map'))
  }, [placesLoaded, data.detenidos.length])

  useEffect(() => {
    if (!placesLoaded) return
    data.detenidos.forEach((_, i) => {
      if (vistaMapa[i] === 'street' && streetViewRefs.current[i] && data.detenidosDirecciones[i]?.latitud) {
        const el = streetViewRefs.current[i]!
        const pos = { lat: data.detenidosDirecciones[i].latitud!, lng: data.detenidosDirecciones[i].longitud! }
        if (streetViewInstances.current[i]) {
          streetViewInstances.current[i]!.setPosition(pos)
        } else {
          streetViewInstances.current[i] = new google.maps.StreetViewPanorama(el, {
            position: pos,
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
          })
        }
      } else if (vistaMapa[i] !== 'street' && streetViewInstances.current[i]) {
        streetViewInstances.current[i] = null
      }
    })
  }, [placesLoaded, vistaMapa, data.detenidosDirecciones])

  const oficialNombreCompleto = concatNombre(data.oficialNombre, data.oficialApPaterno, data.oficialApMaterno)

  return (
    <>
      {/* SECCIÓN 1: Datos generales */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #059669',
        background: '#fafafa',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15, fontWeight: 700,
          textTransform: 'uppercase', color: '#1e293b',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FileText size={16} color="#059669" />
          Datos Generales
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 8,
            color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 400,
            marginLeft: 8,
          }}>
            (SOLO VISUALIZACIÓN)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}><Hash size={10} /> Folio del Incidente</label>
            <div style={disabledSx}>{data.folioReporteAsegurados}</div>
          </div>
          <div>
            <label style={labelSx}><FileText size={10} /> Folio del Reporte</label>
            <div style={disabledSx}>{displayVal(data.folioReporteCampo)}</div>
          </div>
          <div>
            <label style={labelSx}><Fingerprint size={10} /> IPH</label>
            <div style={disabledSx}>{displayVal(data.iph)}</div>
          </div>
          <div>
            <label style={labelSx}><Calendar size={10} /> Fecha</label>
            <div style={disabledSx}>{data.fechaHoy}</div>
          </div>
          <div>
            <label style={labelSx}><Clock size={10} /> Hora</label>
            <div style={disabledSx}>{data.horaAhora}</div>
          </div>
          <div>
            <label style={labelSx}><BookOpen size={10} /> Folio SIJA</label>
            <div style={disabledSx}>{displayVal(data.folioSija)}</div>
          </div>
          <div>
            <label style={labelSx}><Shield size={10} /> Placa Unidad Policial</label>
            <div style={disabledSx}>{displayVal(data.oficialPlaca)}</div>
          </div>
          <div>
            <label style={labelSx}><BadgeCheck size={10} /> Nombre del Policía</label>
            <div style={disabledSx}>{oficialNombreCompleto}</div>
          </div>
          <div>
            <label style={labelSx}><UserCheck size={10} /> Nómina del Policía</label>
            <div style={disabledSx}>{displayVal(data.oficialNomina)}</div>
          </div>
          <div>
            <label style={labelSx}><ScrollText size={10} /> Folio Remisión</label>
            <div style={disabledSx}>{displayVal(data.folioRemision)}</div>
          </div>
          <div>
            <label style={labelSx}><Gavel size={10} /> Marco Legal</label>
            <div style={disabledSx}>{displayVal(data.marcoLegal)}</div>
          </div>
          <div>
            <label style={labelSx}><Map size={10} /> Registro Tableta</label>
            <div style={disabledSx}>{displayVal(data.registroTableta)}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelSx}><MapPin size={10} /> Lugar de la Detención</label>
            <div style={disabledSx}>
              {[data.lugarDetencionCalle, data.lugarDetencionColonia].filter(Boolean).join(', ') || '—'}
            </div>
          </div>
          <div>
            <label style={labelSx}><User size={10} /> Quien ingresó el registro</label>
            <div style={disabledSx}>{displayVal(data.capturadoPorNombre)}</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Detenidos con direcciones */}
      {data.detenidos.map((det, i) => {
        const dir = data.detenidosDirecciones[i]
        const tieneUbicacion = dir?.latitud != null

        return (
          <div key={i} style={{
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            borderLeft: '3px solid #059669',
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 15, fontWeight: 700,
              textTransform: 'uppercase', color: '#1e293b',
              marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <User size={16} color="#059669" />
              Detenido #{i + 1}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelSx}>Nombre</label>
                <div style={disabledSx}>{dir?.nombreDetenido ?? det.nombre ?? '—'}</div>
              </div>
              <div>
                <label style={labelSx}>Apellido Paterno</label>
                <div style={disabledSx}>{displayVal(dir?.apPaterno)}</div>
              </div>
              <div>
                <label style={labelSx}>Apellido Materno</label>
                <div style={disabledSx}>{displayVal(dir?.apMaterno)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ ...labelSx, color: '#059669' }}>Código Postal</label>
                <div style={disabledSx}>{displayVal(dir?.codPostal)}</div>
              </div>
              <div>
                <label style={labelSx}>Colonia</label>
                <div style={disabledSx}>{displayVal(dir?.colonia)}</div>
              </div>
              <div>
                <label style={labelSx}>Calle</label>
                <div style={disabledSx}>{displayVal(dir?.calle)}</div>
              </div>
              <div>
                <label style={labelSx}>Número</label>
                <div style={disabledSx}>{displayVal(dir?.numero)}</div>
              </div>
            </div>

            {tieneUbicacion && (
              <div style={{ marginBottom: 8 }}>
                <label style={labelSx}>
                  <Map size={10} style={{ marginRight: 4 }} /> Ubicación en Mapa
                </label>
                <div style={{ display: 'flex', gap: 0, marginBottom: 8, background: '#f1f5f9', borderRadius: 4, padding: 2, width: 'fit-content' }}>
                  <button
                    type="button"
                    onClick={() => { if (streetViewInstances.current[i]) { streetViewInstances.current[i] = null }; setVistaMapa(prev => { const n = [...prev]; n[i] = 'map'; return n }) }}
                    style={{
                      fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 600,
                      padding: '4px 14px', border: 'none', borderRadius: 3,
                      background: vistaMapa[i] === 'map' ? '#fff' : 'transparent',
                      color: vistaMapa[i] === 'map' ? '#059669' : '#64748b',
                      cursor: 'pointer',
                      boxShadow: vistaMapa[i] === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >Mapa</button>
                  <button
                    type="button"
                    onClick={() => setVistaMapa(prev => { const n = [...prev]; n[i] = 'street'; return n })}
                    style={{
                      fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 600,
                      padding: '4px 14px', border: 'none', borderRadius: 3,
                      background: vistaMapa[i] === 'street' ? '#fff' : 'transparent',
                      color: vistaMapa[i] === 'street' ? '#059669' : '#64748b',
                      cursor: 'pointer',
                      boxShadow: vistaMapa[i] === 'street' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >Street View</button>
                </div>
                {vistaMapa[i] === 'street' ? (
                  <div
                    ref={el => { streetViewRefs.current[i] = el }}
                    style={{ width: '100%', height: 250, border: '1px solid #e2e8f0' }}
                  />
                ) : (
                  <GoogleMapPicker
                    libraries={['places']}
                    readOnly
                    markerPosition={{ lat: dir!.latitud!, lng: dir!.longitud! }}
                    onLocationSelect={() => {}}
                    onError={setErrorMaps}
                  />
                )}
                <div style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
                  color: '#64748b', display: 'flex', gap: 16, marginTop: 6,
                }}>
                  <span>Lat: {dir!.latitud!.toFixed(6)}</span>
                  <span>Lng: {dir!.longitud!.toFixed(6)}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* SECCIÓN 3: Puesta a Disposición */}
      {pad && (
        <div style={{
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          borderLeft: '3px solid #d97706',
          background: '#fafafa',
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 15, fontWeight: 700,
            textTransform: 'uppercase', color: '#1e293b',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Clock size={16} color="#d97706" />
            Puesta a Disposición
            <span style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 8,
              color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 400,
              marginLeft: 8,
            }}>
              (FINALIZADO)
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...labelSx, color: '#d97706' }}>Gestión</label>
            <div style={disabledSx}>
              {pad.gestionInterna ? 'Interna (Fiscalía)' : `Externa — ${pad.dependenciaExterna === 'fiscalia' ? 'Fiscalía' : 'Juzgado'}`}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...labelSx, color: '#d97706' }}>Actos de Investigación</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {ACTAS_CHECKLIST.map(a => (
                <div key={a.key} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'Inter,sans-serif', fontSize: 12,
                  padding: '4px 8px',
                  background: pad.actas[a.key] ? '#fefce8' : '#f8fafc',
                  color: pad.actas[a.key] ? '#92400e' : '#94a3b8',
                }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: pad.actas[a.key] ? '#d97706' : '#d1d5db',
                    display: 'inline-block',
                  }} />
                  {a.label}
                </div>
              ))}
            </div>
            {pad.otrosActos && (
              <div style={{ marginTop: 8 }}>
                <label style={labelSx}>Otros actos</label>
                <div style={disabledSx}>{pad.otrosActos}</div>
              </div>
            )}
          </div>

          <div>
            <label style={{ ...labelSx, color: '#d97706' }}>Tiempos de Traslado</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div>
                <label style={labelSx}>Inicio de traslado</label>
                <div style={disabledSx}>{pad.horaInicioTraslado}</div>
              </div>
              <div>
                <label style={labelSx}>Llegada a sede</label>
                <div style={disabledSx}>{pad.horaLlegadaSede}</div>
              </div>
              <div>
                <label style={labelSx}>Puesta a disposición</label>
                <div style={disabledSx}>{pad.horaPuestaDisposicion}</div>
              </div>
              <div>
                <label style={labelSx}>Tiempo total</label>
                <div style={{ ...disabledSx, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, color: '#d97706' }}>
                  {pad.tiempoTrasladoTotal} min
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMaps && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626',
          padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca',
          marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <strong>Error de Google Maps</strong>
            <br />
            {errorMaps}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/agente_juzgado/asegurados')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Inter,sans-serif', fontSize: 12,
            padding: '8px 20px', border: '1px solid #e2e8f0',
            background: '#ffffff', color: '#64748b', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          Regresar
        </button>
      </div>
    </>
  )
}
