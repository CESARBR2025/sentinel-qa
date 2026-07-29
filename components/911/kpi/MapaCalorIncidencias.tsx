'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap } from '@react-google-maps/api'
import { X } from 'lucide-react'
import simpleheat, { type SimpleHeat, type SimpleHeatPoint } from 'simpleheat'
import type { IncidenteGeo } from '@/lib/incidentes/types'
import { useMapaIncidencias, MAPS_API_KEY, CENTRO_SJR, ESTILOS_MAPA, colorPrioridad } from './useMapaIncidencias'
import { AvisoMapa } from './MapaPuntosIncidencias'
import { formatearFechaHora, ubicacionTexto } from './formato'

const OPCIONES_MAPA: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  styles: ESTILOS_MAPA,
}

// Rampa pensada para basemap claro: arranca transparente y sube a rojo. Las
// paradas van juntas arriba para que los focos reales destaquen del ruido.
const GRADIENTE: Record<number, string> = {
  0.0: 'rgba(37, 99, 235, 0)',
  0.25: 'rgba(37, 99, 235, 0.55)',
  0.45: 'rgba(6, 182, 212, 0.65)',
  0.62: 'rgba(132, 204, 22, 0.75)',
  0.78: 'rgba(234, 179, 8, 0.85)',
  0.9: 'rgba(249, 115, 22, 0.92)',
  1.0: 'rgba(220, 38, 38, 0.98)',
}

// Radio de influencia de cada incidencia sobre el terreno. Al fijarlo en metros
// (y no en píxeles) la mancha representa siempre la misma superficie real, así
// que el mapa dice lo mismo con cualquier zoom. Se acota a un rango angosto y
// con blur corto (ver heat.radius() más abajo): la versión anterior (260 m,
// blur 0.6, tope 85 px) se leía como manchas gigantes que no correspondían al
// área real — más que "puntos calientes" parecían regiones completas.
const RADIO_METROS = 140
const RADIO_PX_MIN = 6
const RADIO_PX_MAX = 46

function metrosPorPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

// Proyección Web Mercator sobre el mosaico base de 256 px, la misma que usa
// Google. Se calcula a mano en vez de pedirle la proyección a un OverlayView
// porque ésta sólo está disponible después de que la API llame a draw() de
// forma asíncrona: si ese callback no llega, la capa nunca se dibuja. Con las
// fronteras y el zoom del mapa el cálculo es determinista y siempre disponible.
function aMundo(lat: number, lng: number): { x: number; y: number } {
  const seno = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999)
  return {
    x: 256 * (0.5 + lng / 360),
    y: 256 * (0.5 - Math.log((1 + seno) / (1 - seno)) / (4 * Math.PI)),
  }
}

// Techo de la escala de color. No se usa el pico absoluto: basta un punto con
// 30 incidencias apiladas para que el resto del mapa quede aplastado contra el
// cero y las ubicaciones con pocos reportes desaparezcan. Se toma el percentil
// 85 de la densidad y se acota, de modo que los focos fuertes saturan en rojo
// (que es lo que se quiere ver) sin borrar del mapa a los demás.
const ESCALA_MIN = 3
const ESCALA_MAX = 12

// Piso de opacidad por punto: una incidencia aislada siempre pinta al menos
// esto, así que ninguna ubicación del periodo queda sin representar.
const OPACIDAD_MINIMA = 0.22

// Densidad por celda a la resolución del radio, sumando el vecindario 2x2
// porque los puntos de celdas contiguas también se solapan al dibujarse.
function calcularDensidad(puntos: SimpleHeatPoint[], radioPx: number): { pico: number; escala: number } {
  if (puntos.length === 0) return { pico: 0, escala: ESCALA_MIN }

  const celda = Math.max(radioPx, 1)
  const conteo = new Map<string, number>()
  for (const [x, y] of puntos) {
    const clave = `${Math.floor(x / celda)}:${Math.floor(y / celda)}`
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1)
  }

  const densidades: number[] = []
  for (const [clave, n] of conteo) {
    const [cx, cy] = clave.split(':').map(Number)
    densidades.push(
      n +
      (conteo.get(`${cx + 1}:${cy}`) ?? 0) +
      (conteo.get(`${cx}:${cy + 1}`) ?? 0) +
      (conteo.get(`${cx + 1}:${cy + 1}`) ?? 0),
    )
  }
  densidades.sort((a, b) => a - b)

  const pico = densidades[densidades.length - 1]
  const p85 = densidades[Math.min(Math.floor(densidades.length * 0.85), densidades.length - 1)]
  return { pico, escala: Math.min(Math.max(p85, ESCALA_MIN), ESCALA_MAX) }
}

// Radio de búsqueda al hacer clic en una mancha, en metros. Coincide con el
// radio de influencia para que lo que se lista sea justo lo que forma el foco.
const RADIO_CLICK_M = RADIO_METROS

function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function MapaCalorIncidencias({ incidentes, previewId, onPreviewChange, onVerDetalle, altura = 460 }: {
  incidentes: IncidenteGeo[]
  previewId: string | null
  onPreviewChange: (id: string | null) => void
  onVerDetalle: (id: string) => void
  altura?: number
}) {
  const { isLoaded } = useMapaIncidencias()
  const [pico, setPico] = useState(0)
  const [zona, setZona] = useState<{ lat: number; lng: number } | null>(null)
  // Posición en pantalla (px CSS, relativa al panel) de la ficha/lista abierta.
  // Reemplaza a InfoWindow de Google: ese componente se monta en el floatPane
  // interno del mapa, y como nuestro <canvas> es un hermano posterior en el
  // DOM, terminaba tapándolo. Con una tarjeta propia controlamos el z-index
  // directamente sin depender del sistema de panes de Google.
  const [posOverlay, setPosOverlay] = useState<{ x: number; y: number } | null>(null)
  // El mapa vive en un ref y `generacion` sólo sirve para relanzar los efectos
  // cuando llega una instancia nueva. Guardarlo en estado lo hacía frágil bajo
  // StrictMode: el unmount del primer montaje pisaba al onLoad del segundo.
  const mapaRef = useRef<google.maps.Map | null>(null)
  const [generacion, setGeneracion] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const heatRef = useRef<SimpleHeat | null>(null)
  const frameRef = useRef<number | null>(null)

  const conCoordenadas = useMemo(
    () => incidentes.filter(i => i.latitud != null && i.longitud != null),
    [incidentes],
  )

  const ajustarVista = useCallback((m: google.maps.Map | null) => {
    if (!m || conCoordenadas.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    conCoordenadas.forEach(i => bounds.extend({ lat: i.latitud as number, lng: i.longitud as number }))
    m.fitBounds(bounds, 48)
    if (conCoordenadas.length === 1) m.setZoom(15)
  }, [conCoordenadas])

  useEffect(() => { ajustarVista(mapaRef.current) }, [ajustarVista, generacion])

  // Posición en píxeles CSS (sin dpr: es para colocar un elemento del DOM, no
  // para dibujar en el canvas) de un punto dado, usando los mismos límites y
  // zoom vigentes del mapa. Misma proyección Mercator que usa dibujar(), así
  // que la tarjeta no se desincroniza de la mancha durante un pan o zoom.
  const calcularPosPantalla = useCallback((lat: number, lng: number): { x: number; y: number } | null => {
    const mapa = mapaRef.current
    const canvas = canvasRef.current
    if (!mapa || !canvas) return null
    const limites = mapa.getBounds()
    const zoom = mapa.getZoom()
    if (!limites || zoom == null) return null

    const escalaMundo = Math.pow(2, zoom)
    const noroeste = aMundo(limites.getNorthEast().lat(), limites.getSouthWest().lng())
    const punto = aMundo(lat, lng)
    return {
      x: (punto.x - noroeste.x) * escalaMundo,
      y: (punto.y - noroeste.y) * escalaMundo,
    }
  }, [])

  const dibujar = useCallback(() => {
    const canvas = canvasRef.current
    const mapa = mapaRef.current
    if (!canvas || !mapa) return

    const limites = mapa.getBounds()
    const zoom = mapa.getZoom()
    if (!limites || zoom == null) return

    // El canvas se dimensiona en píxeles físicos (CSS * dpr) para que no se vea
    // borroso en pantallas retina; las coordenadas se escalan igual.
    const dpr = window.devicePixelRatio || 1
    const anchoCss = canvas.clientWidth
    const altoCss = canvas.clientHeight
    if (anchoCss === 0 || altoCss === 0) return

    const ancho = Math.round(anchoCss * dpr)
    const alto = Math.round(altoCss * dpr)

    if (!heatRef.current) heatRef.current = simpleheat(canvas)
    const heat = heatRef.current

    if (canvas.width !== ancho || canvas.height !== alto) {
      canvas.width = ancho
      canvas.height = alto
      // simpleheat cachea las dimensiones al construirse: sin resize() seguiría
      // limpiando y coloreando con el tamaño viejo.
      heat.resize()
    }

    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, ancho, alto)

    if (conCoordenadas.length === 0) { setPico(0); return }

    const centro = mapa.getCenter()
    const mpp = metrosPorPixel(centro?.lat() ?? CENTRO_SJR.lat, zoom)
    const radioPx = Math.min(Math.max(RADIO_METROS / mpp, RADIO_PX_MIN), RADIO_PX_MAX) * dpr

    // Esquina noroeste del viewport como origen de coordenadas de pantalla.
    const escalaMundo = Math.pow(2, zoom) * dpr
    const noroeste = aMundo(limites.getNorthEast().lat(), limites.getSouthWest().lng())

    const margen = radioPx + 40
    const puntos: SimpleHeatPoint[] = []
    for (const inc of conCoordenadas) {
      const m = aMundo(inc.latitud as number, inc.longitud as number)
      const x = (m.x - noroeste.x) * escalaMundo
      const y = (m.y - noroeste.y) * escalaMundo
      // Se descartan los que no pueden influir en el viewport, pero se conserva
      // un margen para que las manchas del borde no se corten al hacer pan.
      if (x < -margen || x > ancho + margen || y < -margen || y > alto + margen) continue
      puntos.push([x, y, 1])
    }

    if (puntos.length === 0) { setPico(0); return }

    const { pico: picoReal, escala } = calcularDensidad(puntos, radioPx)
    setPico(picoReal)

    heat.data(puntos)
    // El segundo argumento es el blur adicional más allá del radio: bajo (0.35)
    // para que la mancha se lea nítida y no se infle muy por fuera del área real.
    heat.radius(radioPx, radioPx * 0.35)
    heat.gradient(GRADIENTE)
    heat.max(escala)
    // draw() sólo acepta minOpacity — el gradiente va por gradient(), no aquí.
    // El piso de opacidad garantiza que toda ubicación con al menos un reporte
    // deje huella visible, aunque esté aislada frente a los focos grandes.
    heat.draw(OPACIDAD_MINIMA)
  }, [conCoordenadas])

  // La tarjeta siempre se abre arriba del punto, centrada, con el puntero
  // apuntando exactamente a él — sin voltear de lado ni reubicarse: eso se
  // veía inconsistente. Si no cabe cerca de un borde, se recorta contra el
  // panel (ver overflow:hidden en el contenedor) en vez de cambiar de forma.
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa) return
    const actualizar = () => {
      let lat: number | null | undefined
      let lng: number | null | undefined
      if (previewId) {
        const inc = incidentes.find(i => i.id === previewId)
        lat = inc?.latitud
        lng = inc?.longitud
      } else if (zona) {
        lat = zona.lat
        lng = zona.lng
      }
      if (lat == null || lng == null) { setPosOverlay(null); return }
      setPosOverlay(calcularPosPantalla(lat, lng))
    }
    actualizar()
    const escuchas = (['bounds_changed', 'idle'] as const).map(evento => mapa.addListener(evento, actualizar))
    return () => escuchas.forEach(l => l.remove())
  }, [generacion, previewId, zona, incidentes, calcularPosPantalla])

  // Se coalescen los redibujos en un frame: durante un pan, draw() del overlay
  // dispara muchas veces por segundo y repintar 90 gaussianas en cada una
  // tiraría los fps.
  const programarDibujo = useCallback(() => {
    if (frameRef.current != null) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      dibujar()
    })
  }, [dibujar])

  // Los listeners del mapa se registran una sola vez y llaman siempre a la
  // versión vigente a través del ref, que se refresca aquí (no en render).
  const programarDibujoRef = useRef(programarDibujo)
  useEffect(() => { programarDibujoRef.current = programarDibujo }, [programarDibujo])

  // bounds_changed dispara de forma continua durante el arrastre y el zoom, así
  // que la capa sigue al terreno en vez de saltar al soltar; idle cierra al
  // final por si algún frame intermedio se perdió.
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa) return
    const escuchas = (['bounds_changed', 'idle', 'resize'] as const).map(evento =>
      mapa.addListener(evento, () => programarDibujoRef.current()),
    )
    programarDibujoRef.current()
    return () => escuchas.forEach(l => l.remove())
  }, [generacion])

  useEffect(() => { programarDibujo() }, [programarDibujo])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => programarDibujoRef.current())
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [generacion])

  // El id se limpia además de cancelarse: un frame cancelado nunca ejecuta su
  // callback, así que si el ref se quedara con el id viejo, programarDibujo lo
  // leería como "ya hay uno en vuelo" y no volvería a agendar nunca más.
  useEffect(() => () => {
    if (frameRef.current != null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  // Al seleccionar desde la tabla, centrar el punto: en un mapa de calor no hay
  // marcador que buscar a ojo.
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || !previewId) return
    const inc = incidentes.find(i => i.id === previewId)
    if (!inc || inc.latitud == null || inc.longitud == null) return
    mapa.panTo({ lat: inc.latitud, lng: inc.longitud })
  }, [generacion, previewId, incidentes])

  if (!MAPS_API_KEY) return <AvisoMapa altura={altura} texto="Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" />
  if (!isLoaded) return <AvisoMapa altura={altura} texto="Cargando mapa…" />

  // Derivados, no estado espejo: si cambia el rango y el incidente desaparece,
  // los InfoWindow se cierran solos.
  const preview = conCoordenadas.find(i => i.id === previewId) ?? null
  const enZona = zona
    ? conCoordenadas.filter(i => distanciaMetros(i.latitud!, i.longitud!, zona.lat, zona.lng) <= RADIO_CLICK_M)
    : []

  return (
    <div style={{ position: 'relative', height: altura, overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={CENTRO_SJR}
        zoom={12}
        options={OPCIONES_MAPA}
        onLoad={m => { mapaRef.current = m; ajustarVista(m); setGeneracion(g => g + 1) }}
        onClick={e => {
          const ll = e.latLng
          if (!ll) return
          onPreviewChange(null)
          setZona({ lat: ll.lat(), lng: ll.lng() })
        }}
      />

      {/* Encima del mapa y sin capturar el ratón: el pan, el zoom y el clic
          siguen llegando al mapa a través de la capa. */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Tarjeta propia en vez de InfoWindow de Google: así el z-index queda
          bajo nuestro control y no termina detrás del canvas de calor. */}
      {preview && posOverlay && (
        <Callout x={posOverlay.x} y={posOverlay.y} onCerrar={() => onPreviewChange(null)}>
          <FichaIncidente inc={preview} onVerDetalle={onVerDetalle} />
        </Callout>
      )}
      {/* La ficha del incidente seleccionado manda sobre la lista de zona. */}
      {!preview && zona && posOverlay && enZona.length > 0 && (
        <Callout x={posOverlay.x} y={posOverlay.y} onCerrar={() => setZona(null)}>
          <ListaZona incidentes={enZona} onVerDetalle={onVerDetalle} />
        </Callout>
      )}

      <Leyenda pico={pico} total={conCoordenadas.length} />
    </div>
  )
}

// Siempre la misma forma: centrada y arriba del punto exacto, puntero fijo
// apuntando hacia abajo. Nada de voltear de lado ni recortar contra bordes —
// eso se veía inconsistente. Si no cabe cerca de un borde del panel, se deja
// que el propio `overflow: hidden` del contenedor la recorte, en vez de
// cambiarle la forma.
function Callout({ x, y, onCerrar, children }: { x: number; y: number; onCerrar: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: 'translate(-50%, calc(-100% - 14px))', zIndex: 5,
    }}>
      <div style={{
        position: 'relative', background: '#fff',
        border: '1px solid #e2e8f0', boxShadow: '0 10px 28px -8px rgba(15,23,42,0.35)',
        padding: '14px 16px',
      }}>
        <button
          type="button" onClick={onCerrar} aria-label="Cerrar"
          style={{
            position: 'absolute', top: 8, right: 8, border: 'none', background: 'transparent',
            cursor: 'pointer', color: '#94a3b8', padding: 2, lineHeight: 0,
          }}
        >
          <X size={14} />
        </button>
        {children}
        {/* Puntero triangular hacia el punto exacto en el terreno. */}
        <div style={{
          position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
          borderTop: '7px solid #fff', filter: 'drop-shadow(0 2px 1px rgba(15,23,42,0.08))',
        }} />
      </div>
    </div>
  )
}

function FichaIncidente({ inc, onVerDetalle }: { inc: IncidenteGeo; onVerDetalle: (id: string) => void }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', width: 240, paddingRight: 16, color: '#0f172a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>{inc.folio}</span>
        <span style={{
          fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 7px',
          background: colorPrioridad(inc.prioridadOrden), color: '#fff',
        }}>
          {inc.prioridad ?? 'S/P'}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{inc.tipoIncidente ?? 'Sin tipificar'}</div>
      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
        <div>{formatearFechaHora(inc.fechaHoraInicio)}</div>
        <div>{ubicacionTexto(inc)}</div>
      </div>
      <button
        type="button"
        onClick={() => onVerDetalle(inc.id)}
        style={{
          marginTop: 10, width: '100%', padding: '7px 10px', border: 'none', cursor: 'pointer',
          background: '#1f355a', color: '#fff', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}
      >
        Detalles
      </button>
    </div>
  )
}

function ListaZona({ incidentes, onVerDetalle }: { incidentes: IncidenteGeo[]; onVerDetalle: (id: string) => void }) {
  const visibles = incidentes.slice(0, 6)
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', width: 260, paddingRight: 16, color: '#0f172a' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 24, fontWeight: 800, lineHeight: 1 }}>
          {incidentes.length}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#64748b',
        }}>
          Incidencia{incidentes.length === 1 ? '' : 's'} en {RADIO_CLICK_M} m
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #e2e8f0' }}>
        {visibles.map(inc => (
          <button
            key={inc.id}
            type="button"
            onClick={() => onVerDetalle(inc.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '7px 0', border: 'none', borderBottom: '1px solid #f1f5f9',
              background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
          >
            <span style={{ minWidth: 0 }}>
              <span style={{
                display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                fontWeight: 600, color: '#0f172a',
              }}>
                {inc.folio}
              </span>
              <span style={{
                display: 'block', fontSize: 11, color: '#64748b', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {inc.tipoIncidente ?? 'Sin tipo'}
              </span>
            </span>
            <span style={{
              flexShrink: 0, width: 8, height: 8, borderRadius: '50%',
              background: colorPrioridad(inc.prioridadOrden),
            }} />
          </button>
        ))}
      </div>
      {incidentes.length > visibles.length && (
        <div style={{ fontSize: 11, color: '#94a3b8', paddingTop: 7 }}>
          Y {incidentes.length - visibles.length} más en esta zona
        </div>
      )}
    </div>
  )
}

function Leyenda({ pico, total }: { pico: number; total: number }) {
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 14, zIndex: 2,
      background: 'rgba(255,255,255,0.94)', border: '1px solid #e2e8f0',
      padding: '9px 12px', backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#64748b', marginBottom: 6,
      }}>
        Densidad de incidencias
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={etiquetaLeyenda}>Baja</span>
        <span style={{
          width: 120, height: 8, borderRadius: 2,
          background: 'linear-gradient(90deg,#2563eb,#06b6d4,#84cc16,#eab308,#f97316,#dc2626)',
        }} />
        <span style={etiquetaLeyenda}>Alta</span>
      </div>
      {pico > 0 && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8',
          marginTop: 6, letterSpacing: '0.06em',
        }}>
          {total} PUNTOS · PICO ≈ {pico} EN {RADIO_METROS} M
        </div>
      )}
    </div>
  )
}

const etiquetaLeyenda: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8',
}
