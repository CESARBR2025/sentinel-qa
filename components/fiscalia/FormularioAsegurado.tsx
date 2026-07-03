'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Hash, FileText, Fingerprint, Calendar, Clock, BookOpen, User,
  Shield, BadgeCheck, UserCheck, MapPin, Map, Gavel, ScrollText, Save,
} from 'lucide-react'
import GoogleMapPicker from '@/components/maps/GoogleMapPicker'
import { guardarDetallesAseguradosAction } from '@/lib/fiscalia/actions'
import type { DetalleAseguradoCompleto, DetenidoDireccionInput } from '@/lib/fiscalia/types'

interface Props {
  reporteCampoId: string
  data: DetalleAseguradoCompleto
  onGuardar?: (reporteCampoId: string, detenidos: DetenidoDireccionInput[], folio?: string) => Promise<{ success: boolean; folio?: string; error?: string }>
  redirectPath?: string
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

const inputSx: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #e2e8f0',
  borderLeft: '3px solid #059669',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#334155',
  outline: 'none',
  boxSizing: 'border-box',
}

interface Props {
  reporteCampoId: string
  data: DetalleAseguradoCompleto
}

function displayVal(val: string | null | undefined): string {
  return val ?? '—'
}

export function FormularioAsegurado({ reporteCampoId, data, onGuardar, redirectPath }: Props) {
  const router = useRouter()

  const [placesLoaded, setPlacesLoaded] = useState(false)

  const municipioRefs = useRef<(HTMLInputElement | null)[]>([])
  const coloniaRefs = useRef<(HTMLInputElement | null)[]>([])
  const calleRefs = useRef<(HTMLInputElement | null)[]>([])
  const municipioAc = useRef<(google.maps.places.Autocomplete | null)[]>([])
  const coloniaAc = useRef<(google.maps.places.Autocomplete | null)[]>([])
  const calleAc = useRef<(google.maps.places.Autocomplete | null)[]>([])

  const streetViewRefs = useRef<(HTMLDivElement | null)[]>([])
  const streetViewInstances = useRef<(google.maps.StreetViewPanorama | null)[]>([])

  const biasCenters = useRef<({ lat: number; lng: number } | null)[]>([])
  const [callePreds, setCallePreds] = useState<{ placeId: string; desc: string }[][]>([])

  useEffect(() => {
    const check = () => {
      if (window.google?.maps?.places?.Autocomplete && !placesLoaded) {
        setPlacesLoaded(true)
      }
    }
    check()
    const interval = setInterval(check, 500)
    return () => clearInterval(interval)
  }, [placesLoaded])

  useEffect(() => {
    if (!placesLoaded || readOnly) return
    data.detenidos.forEach((_, i) => {
      initAutocomplete(i)
    })
    setCallePreds(data.detenidos.map((_, i) => {
      const guardado = data.detenidosDirecciones[i]
      return guardado?.latitud ? [{ placeId: '', desc: guardado.calle ?? '' }] : []
    }))
    setBuscandoMapa(data.detenidos.map(() => false))
    setUbicacionConfirmada(data.detenidos.map((_, i) => {
      const guardado = data.detenidosDirecciones[i]
      return !!guardado?.latitud
    }))
    setVistaMapa(data.detenidos.map(() => 'map'))
  }, [placesLoaded, data.detenidos.length])

  function initAutocomplete(i: number) {
    if (!window.google?.maps?.places?.Autocomplete) return

    if (!municipioAc.current[i]) {
      const mInput = municipioRefs.current[i]
      if (mInput) {
        const mac = new google.maps.places.Autocomplete(mInput, {
          componentRestrictions: { country: 'mx' } as any,
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          types: ['(cities)'],
        })
        mac.addListener('place_changed', () => {
          const place = mac.getPlace()
          if (!place?.address_components) return
          const comps: Record<string, string> = {}
          for (const c of place.address_components) {
            comps[c.types[0]] = c.long_name ?? c.short_name ?? ''
          }
          const lat = place.geometry?.location?.lat() ?? null
          const lng = place.geometry?.location?.lng() ?? null
          updateDetenido(i, 'colonia', comps['sublocality_level_1'] ?? comps['neighborhood'] ?? '')
          if (lat && lng) {
            biasCenters.current[i] = { lat, lng }
          }
        })
        municipioAc.current[i] = mac
      }
    }

    if (!coloniaAc.current[i]) {
      const cInput = coloniaRefs.current[i]
      if (cInput) {
        const cac = new google.maps.places.Autocomplete(cInput, {
          componentRestrictions: { country: 'mx' } as any,
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          types: ['sublocality', 'neighborhood'],
        })
        cac.addListener('place_changed', () => {
          const place = cac.getPlace()
          if (!place?.address_components) return
          const comps: Record<string, string> = {}
          for (const c of place.address_components) {
            comps[c.types[0]] = c.long_name ?? c.short_name ?? ''
          }
          const name = comps['sublocality_level_1'] ?? comps['neighborhood'] ?? place.name ?? ''
          updateDetenido(i, 'colonia', name)
          const lat = place.geometry?.location?.lat() ?? null
          const lng = place.geometry?.location?.lng() ?? null
          if (lat && lng) {
            biasCenters.current[i] = { lat, lng }
          }
        })
        coloniaAc.current[i] = cac
      }
    }

    if (!calleAc.current[i]) {
      const clInput = calleRefs.current[i]
      if (clInput) {
        calleAc.current[i] = {} as any // mark as initialized
      }
    }
  }

  const debounceTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>([])

  function searchCalle(i: number, query: string) {
    if (debounceTimers.current[i]) clearTimeout(debounceTimers.current[i])
    debounceTimers.current[i] = setTimeout(() => {
      if (!query || query.length < 2 || !window.google?.maps?.places) {
        setCallePreds(prev => { const n = [...prev]; n[i] = []; return n })
        return
      }
      const service = new google.maps.places.AutocompleteService()
      const opts: google.maps.places.AutocompletionRequest = {
        input: query,
        componentRestrictions: { country: 'mx' } as any,
        types: ['route'],
      }
      const bias = biasCenters.current[i]
      if (bias) {
        opts.bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bias.lat - 0.08, bias.lng - 0.08),
          new google.maps.LatLng(bias.lat + 0.08, bias.lng + 0.08),
        )
      }
      service.getPlacePredictions(opts, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setCallePreds(prev => {
            const n = [...prev]
            n[i] = predictions.map(p => ({ placeId: p.place_id, desc: p.description }))
            return n
          })
        } else {
          setCallePreds(prev => { const n = [...prev]; n[i] = []; return n })
        }
      })
    }, 300)
  }

  function selectCalle(i: number, placeId: string) {
    if (!window.google?.maps?.places) return
    const service = new google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails({ placeId, fields: ['address_components', 'geometry'] }, (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.address_components) return
      const comps: Record<string, string> = {}
      for (const c of place.address_components) {
        comps[c.types[0]] = c.long_name ?? c.short_name ?? ''
      }
      const lat = place.geometry?.location?.lat() ?? null
      const lng = place.geometry?.location?.lng() ?? null
      updateDetenido(i, 'calle', comps['route'] ?? '')
      updateDetenido(i, 'colonia', comps['sublocality_level_1'] ?? comps['neighborhood'] ?? comps['locality'] ?? '')
      updateDetenido(i, 'codPostal', comps['postal_code'] ?? '')
      updateDetenido(i, 'latitud', lat)
      updateDetenido(i, 'longitud', lng)
      setCallePreds(prev => { const n = [...prev]; n[i] = []; return n })
      if (calleRefs.current[i]) calleRefs.current[i]!.value = comps['route'] ?? ''
    })
  }

  function buscarEnMapa(i: number) {
    if (!window.google?.maps?.Geocoder) return
    const det = detenidosDir[i]
    const dir = [det.calle, det.numero, det.colonia].filter(Boolean).join(', ')
    if (!dir) return
    setBuscandoMapa(prev => { const n = [...prev]; n[i] = true; return n })
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: dir, componentRestrictions: { country: 'MX' } }, (results, status) => {
      setBuscandoMapa(prev => { const n = [...prev]; n[i] = false; return n })
      if (status === 'OK' && results?.[0]) {
        const loc = results[0].geometry.location
        updateDetenido(i, 'latitud', loc.lat())
        updateDetenido(i, 'longitud', loc.lng())
        setUbicacionConfirmada(prev => { const n = [...prev]; n[i] = false; return n })
      }
    })
  }

  function confirmarUbicacion(i: number) {
    setUbicacionConfirmada(prev => { const n = [...prev]; n[i] = true; return n })
  }

  const [buscandoMapa, setBuscandoMapa] = useState<boolean[]>([])
  const [ubicacionConfirmada, setUbicacionConfirmada] = useState<boolean[]>([])
  const [vistaMapa, setVistaMapa] = useState<('map' | 'street')[]>([])

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)
  const [errorMaps, setErrorMaps] = useState<string | null>(null)

  const nombresIniciales = data.detenidos.map((d, i) => {
    const guardado = data.detenidosDirecciones[i]
    return {
      nombre: d.nombre ?? guardado?.nombreDetenido ?? '',
      apPaterno: guardado?.apPaterno ?? '',
      apMaterno: guardado?.apMaterno ?? '',
      calle: guardado?.calle ?? '',
      colonia: guardado?.colonia ?? '',
      numero: guardado?.numero ?? '',
      codPostal: guardado?.codPostal ?? '',
      latitud: guardado?.latitud ?? null,
      longitud: guardado?.longitud ?? null,
    }
  })

  const [detenidosDir, setDetenidosDir] = useState<typeof nombresIniciales>(nombresIniciales)

  const readOnly = data.detenidosDirecciones.some(d => !!d.calle || d.latitud != null)

  useEffect(() => {
    if (!placesLoaded || !readOnly) return
    data.detenidos.forEach((_, i) => {
      if (vistaMapa[i] === 'street' && streetViewRefs.current[i] && detenidosDir[i].latitud) {
        const el = streetViewRefs.current[i]!
        const pos = { lat: detenidosDir[i].latitud!, lng: detenidosDir[i].longitud! }
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
  }, [placesLoaded, readOnly, vistaMapa, detenidosDir])

  function updateDetenido(i: number, field: string, value: string | number | null) {
    if (readOnly) return
    setDetenidosDir(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d))
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setError(null)
    setExito(null)

    const payload: DetenidoDireccionInput[] = detenidosDir.map(d => ({
      nombreDetenido: d.nombre,
      apPaterno: d.apPaterno,
      apMaterno: d.apMaterno,
      calle: d.calle,
      colonia: d.colonia,
      numero: d.numero,
      codPostal: d.codPostal,
      latitud: d.latitud,
      longitud: d.longitud,
    }))

    const save = onGuardar ?? guardarDetallesAseguradosAction
    const res = await save(reporteCampoId, payload, data.folioReporteAsegurados)

    setGuardando(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setExito(`Folio generado: ${res.folio}`)
      setTimeout(() => router.push(redirectPath ?? '/fiscalia/asegurados'), 1500)
  }

  const oficialNombreCompleto = [
    data.oficialNombre,
    data.oficialApPaterno,
    data.oficialApMaterno,
  ].filter(Boolean).join(' ') || null

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
          SSPM · Fiscalía
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
          Asegurados · <span style={{ color: '#7c3aed' }}>Fiscalía</span>
        </h3>
        <p style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: '#64748b',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Capture las direcciones de los detenidos para el reporte <strong>#{data.folioReporteCampo}</strong>
        </p>
      </div>

      {/* SECCIÓN 1: Datos generales prellenados */}
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
          Datos Generales
          <span style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 8,
            color: '#94a3b8',
            letterSpacing: '0.1em',
            fontWeight: 400,
            marginLeft: 8,
          }}>
            (AUTO-CARGADOS)
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
            <div style={disabledSx}>{displayVal(oficialNombreCompleto)}</div>
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
      {data.detenidos.map((det, i) => (
        <div key={i} style={{
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          borderLeft: '3px solid #7c3aed',
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
            <User size={16} color="#7c3aed" />
            Detenido #{i + 1}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelSx}>Nombre <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                value={detenidosDir[i].nombre}
                onChange={e => updateDetenido(i, 'nombre', e.target.value)}
                style={inputSx}
                placeholder="Nombre del detenido"
                readOnly={readOnly}
              />
            </div>
            <div>
              <label style={labelSx}>Apellido Paterno</label>
              <input
                value={detenidosDir[i].apPaterno}
                onChange={e => updateDetenido(i, 'apPaterno', e.target.value)}
                style={inputSx}
                placeholder="Apellido paterno"
                readOnly={readOnly}
              />
            </div>
            <div>
              <label style={labelSx}>Apellido Materno</label>
              <input
                value={detenidosDir[i].apMaterno}
                onChange={e => updateDetenido(i, 'apMaterno', e.target.value)}
                style={inputSx}
                placeholder="Apellido materno"
                readOnly={readOnly}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...labelSx, color: '#7c3aed' }}>Código Postal</label>
            <input
              value={detenidosDir[i].codPostal}
              onChange={e => updateDetenido(i, 'codPostal', e.target.value)}
              style={{ ...inputSx, borderLeft: '3px solid #7c3aed' }}
              placeholder="Ej. 76800"
              maxLength={5}
              readOnly={readOnly}
            />
          </div>

          {readOnly ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelSx}>Colonia</label>
                <div style={disabledSx}>{detenidosDir[i].colonia || '—'}</div>
              </div>
              <div>
                <label style={labelSx}>Calle</label>
                <div style={disabledSx}>{detenidosDir[i].calle || '—'}</div>
              </div>
              <div>
                <label style={labelSx}>Número</label>
                <div style={disabledSx}>{detenidosDir[i].numero || '—'}</div>
              </div>
            </div>
          ) : (
            <>
              {/* Paso 1: Municipio */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...labelSx, color: '#7c3aed' }}>1. Municipio</label>
                <input
                  ref={el => { municipioRefs.current[i] = el }}
                  placeholder="Ej. San Juan del Río"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderLeft: '3px solid #7c3aed',
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 13,
                    color: '#334155',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Paso 2: Colonia */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...labelSx, color: '#7c3aed' }}>2. Colonia / Fraccionamiento</label>
                <input
                  ref={el => { coloniaRefs.current[i] = el }}
                  placeholder="Ej. Centro, Indeco..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderLeft: '3px solid #7c3aed',
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 13,
                    color: '#334155',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Paso 3: Calle */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelSx, color: '#7c3aed' }}>3. Calle</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      ref={el => { calleRefs.current[i] = el }}
                      placeholder="Buscar calle..."
                      onChange={e => searchCalle(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderLeft: '3px solid #7c3aed',
                        fontFamily: 'Inter,sans-serif',
                        fontSize: 13,
                        color: '#334155',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: 6,
                      }}
                    />
                    {callePreds[i]?.length > 0 && (
                      <select
                        size={Math.min(callePreds[i].length, 5)}
                        onChange={e => selectCalle(i, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #e2e8f0',
                          borderLeft: '3px solid #7c3aed',
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 12,
                          color: '#334155',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#fff',
                        }}
                      >
                        {callePreds[i].map(p => (
                          <option key={p.placeId} value={p.placeId}>{p.desc}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div style={{ width: 160 }}>
                    <label style={{ ...labelSx, color: '#7c3aed' }}>Número</label>
                    <input
                      value={detenidosDir[i].numero}
                      onChange={e => updateDetenido(i, 'numero', e.target.value)}
                      placeholder="Número"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderLeft: '3px solid #7c3aed',
                        fontFamily: 'Inter,sans-serif',
                        fontSize: 13,
                        color: '#334155',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: 6,
                      }}
                    />
                    {detenidosDir[i].numero && !ubicacionConfirmada[i] && (
                      <button
                        type="button"
                        onClick={() => buscarEnMapa(i)}
                        disabled={buscandoMapa[i]}
                        style={{
                          width: '100%',
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 11,
                          padding: '6px 10px',
                          border: '1px solid #7c3aed',
                          background: buscandoMapa[i] ? '#f1f5f9' : '#7c3aed',
                          color: buscandoMapa[i] ? '#94a3b8' : '#fff',
                          cursor: buscandoMapa[i] ? 'default' : 'pointer',
                        }}
                      >
                        {buscandoMapa[i] ? 'Buscando...' : 'Buscar en mapa'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: 8 }}>
            <label style={labelSx}>
              <Map size={10} style={{ marginRight: 4 }} /> Ubicación en Mapa
            </label>
            {readOnly && detenidosDir[i].latitud !== null && (
              <div style={{ display: 'flex', gap: 0, marginBottom: 8, background: '#f1f5f9', borderRadius: 4, padding: 2, width: 'fit-content' }}>
                <button
                  type="button"
                  onClick={() => { if (streetViewInstances.current[i]) { streetViewInstances.current[i] = null }; setVistaMapa(prev => { const n = [...prev]; n[i] = 'map'; return n }) }}
                  style={{
                    fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 600,
                    padding: '4px 14px', border: 'none', borderRadius: 3,
                    background: vistaMapa[i] === 'map' ? '#fff' : 'transparent',
                    color: vistaMapa[i] === 'map' ? '#7c3aed' : '#64748b',
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
                    color: vistaMapa[i] === 'street' ? '#7c3aed' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: vistaMapa[i] === 'street' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >Street View</button>
              </div>
            )}
            {readOnly && vistaMapa[i] === 'street' ? (
              <div
                ref={el => { streetViewRefs.current[i] = el }}
                style={{ width: '100%', height: 250, border: '1px solid #e2e8f0' }}
              />
            ) : (
              <GoogleMapPicker
                libraries={['places']}
                readOnly={readOnly}
                markerPosition={detenidosDir[i].latitud ? { lat: detenidosDir[i].latitud!, lng: detenidosDir[i].longitud! } : null}
                onLocationSelect={(loc) => {
                  if (readOnly) return
                  updateDetenido(i, 'latitud', loc.lat)
                  updateDetenido(i, 'longitud', loc.lng)
                  updateDetenido(i, 'calle', loc.calle)
                  updateDetenido(i, 'colonia', loc.colonia)
                  updateDetenido(i, 'numero', loc.numero)
                  setUbicacionConfirmada(prev => { const n = [...prev]; n[i] = false; return n })
                }}
                onError={setErrorMaps}
              />
            )}
            {detenidosDir[i].latitud !== null && !ubicacionConfirmada[i] && !readOnly && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginTop: 8, padding: '8px 12px',
                background: '#fefce8', border: '1px solid #fde68a',
                fontFamily: 'Inter,sans-serif', fontSize: 12,
              }}>
                <span style={{ flex: 1, color: '#92400e' }}>¿Es correcta la ubicación?</span>
                <button
                  type="button"
                  onClick={() => confirmarUbicacion(i)}
                  style={{
                    fontFamily: 'Inter,sans-serif', fontSize: 11,
                    padding: '4px 16px', border: 'none',
                    background: '#16a34a', color: '#fff', cursor: 'pointer',
                  }}
                >Sí</button>
              </div>
            )}
            {ubicacionConfirmada[i] && detenidosDir[i].latitud !== null && (
              <div style={{
                marginTop: 8, padding: '6px 12px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#166534',
              }}>
                Ubicación confirmada
              </div>
            )}
          </div>

          {detenidosDir[i].latitud && (
            <div style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 9,
              color: '#64748b',
              display: 'flex',
              gap: 16,
            }}>
              <span>Lat: {detenidosDir[i].latitud?.toFixed(6)}</span>
              <span>Lng: {detenidosDir[i].longitud?.toFixed(6)}</span>
            </div>
          )}

        </div>
      ))}

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

      {error && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626',
          padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca',
          marginBottom: 12,
        }}>
          {error}
        </div>
      )}

      {exito && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#059669',
          padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0',
          marginBottom: 12,
        }}>
          {exito}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push(redirectPath ?? '/fiscalia/asegurados')}
          disabled={guardando}
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            padding: '8px 20px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.5 : 1,
          }}
        >
          Regresar
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Inter,sans-serif',
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 20px',
              border: 'none',
              background: guardando ? '#a78bfa' : '#7c3aed',
              color: '#ffffff',
              cursor: guardando ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={14} />
            {guardando ? 'Guardando...' : 'Guardar Detalles'}
          </button>
        )}
      </div>
    </>
  )
}
