'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api'
import type { IncidenteGeo } from '@/lib/incidentes/types'
import { useMapaIncidencias, MAPS_API_KEY, CENTRO_SJR, colorPrioridad, ESTILOS_MAPA } from './useMapaIncidencias'
import { ETIQUETA_ESTATUS, formatearFechaHora, ubicacionTexto } from './formato'

const OPCIONES_MAPA: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  // Mismo basemap que el mapa de calor: alternar Puntos/Calor no debe cambiar
  // el aspecto del panel, sólo la representación de los datos.
  styles: ESTILOS_MAPA,
}

export function MapaPuntosIncidencias({ incidentes, previewId, onPreviewChange, onVerDetalle, altura = 460 }: {
  incidentes: IncidenteGeo[]
  previewId: string | null
  onPreviewChange: (id: string | null) => void
  onVerDetalle: (id: string) => void
  altura?: number
}) {
  const { isLoaded } = useMapaIncidencias()
  const mapRef = useRef<google.maps.Map | null>(null)

  const conCoordenadas = useMemo(
    () => incidentes.filter(i => i.latitud != null && i.longitud != null),
    [incidentes],
  )

  const ajustarVista = useCallback((mapa: google.maps.Map | null) => {
    if (!mapa || conCoordenadas.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    conCoordenadas.forEach(i => bounds.extend({ lat: i.latitud as number, lng: i.longitud as number }))
    mapa.fitBounds(bounds, 48)
    // Con un solo punto fitBounds hace un zoom exagerado; se acota.
    if (conCoordenadas.length === 1) mapa.setZoom(16)
  }, [conCoordenadas])

  useEffect(() => { ajustarVista(mapRef.current) }, [ajustarVista])

  if (!MAPS_API_KEY) {
    return <AvisoMapa altura={altura} texto="Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" />
  }
  if (!isLoaded) return <AvisoMapa altura={altura} texto="Cargando mapa…" />

  // Derivado, no estado espejo: si el incidente del preview desaparece tras
  // recargar el rango, el InfoWindow se apaga solo.
  const preview = conCoordenadas.find(i => i.id === previewId) ?? null

  return (
    <div style={{ position: 'relative', height: altura }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={CENTRO_SJR}
        zoom={12}
        options={OPCIONES_MAPA}
        onLoad={mapa => { mapRef.current = mapa; ajustarVista(mapa) }}
        // Igual que en el mapa de calor: no se anula la referencia en unmount
        // porque en el doble montaje de StrictMode corre después del onLoad del
        // segundo montaje y dejaría el ref muerto (fitBounds sin efecto).
      >
      {conCoordenadas.map(inc => {
        const exacta = inc.origenCoordenada === 'reporte_campo'
        const activo = inc.id === previewId
        const color = colorPrioridad(inc.prioridadOrden)
        return (
          <MarkerF
            key={inc.id}
            position={{ lat: inc.latitud as number, lng: inc.longitud as number }}
            onClick={() => onPreviewChange(inc.id)}
            title={`${inc.folio} · ${inc.tipoIncidente ?? 'Sin tipo'}`}
            // El seleccionado se dibuja encima para que no quede tapado en zonas densas.
            zIndex={activo ? 1000 : undefined}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              // La ubicación del reporte de campo es la más exacta al suceso: se
              // pinta sólida. La del incidente (capturada por teléfono) va hueca.
              fillColor: exacta ? color : '#ffffff',
              fillOpacity: exacta ? 0.9 : 0.95,
              // El aro blanco separa los puntos entre sí donde se amontonan.
              strokeColor: exacta ? '#ffffff' : color,
              strokeWeight: exacta ? 1.5 : 2.5,
              scale: activo ? 11 : 7,
            }}
          />
        )
      })}

      {preview && (
        <InfoWindowF
          position={{ lat: preview.latitud as number, lng: preview.longitud as number }}
          onCloseClick={() => onPreviewChange(null)}
        >
          <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 280, color: '#0f172a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>{preview.folio}</span>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
                {ETIQUETA_ESTATUS[preview.estatus] ?? preview.estatus}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{preview.tipoIncidente ?? 'Sin tipificar'}</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              <div>{formatearFechaHora(preview.fechaHoraInicio)}</div>
              <div>{ubicacionTexto(preview)}</div>
              <div>
                Prioridad: <strong style={{ color: colorPrioridad(preview.prioridadOrden) }}>{preview.prioridad ?? 'S/D'}</strong>
                {' · '}Canal: {preview.canal}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                Ubicación {preview.origenCoordenada === 'reporte_campo' ? 'del reporte de campo' : 'capturada en el incidente'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onVerDetalle(preview.id)}
              style={{
                marginTop: 10, width: '100%', padding: '7px 10px', border: 'none', cursor: 'pointer',
                background: '#1f355a', color: '#fff', fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              Detalles
            </button>
          </div>
        </InfoWindowF>
      )}
      </GoogleMap>

      <LeyendaPuntos />
    </div>
  )
}

const PRIORIDADES_LEYENDA = [
  { orden: 4, nombre: 'Crítica' },
  { orden: 3, nombre: 'Alta' },
  { orden: 2, nombre: 'Media' },
  { orden: 1, nombre: 'Baja' },
]

function LeyendaPuntos() {
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 14, zIndex: 2,
      background: 'rgba(255,255,255,0.94)', border: '1px solid #e2e8f0',
      padding: '9px 12px', backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#64748b', marginBottom: 7,
      }}>
        Prioridad
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        {PRIORIDADES_LEYENDA.map(p => (
          <span key={p.orden} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: colorPrioridad(p.orden) }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#475569' }}>{p.nombre}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, paddingTop: 7, borderTop: '1px solid #e2e8f0' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#64748b', border: '1.5px solid #fff' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#475569' }}>Reporte de campo</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', border: '2px solid #64748b' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#475569' }}>Captura 911</span>
        </span>
      </div>
    </div>
  )
}

export function AvisoMapa({ altura, texto }: { altura: number; texto: string }) {
  return (
    <div style={{
      height: altura, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#64748b',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {texto}
    </div>
  )
}
