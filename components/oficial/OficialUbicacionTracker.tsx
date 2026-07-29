'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MapPinOff, X } from 'lucide-react'
import { reportarUbicacionOficial } from '@/lib/oficial/actions'

const HEARTBEAT_SEGUNDOS = 30

interface UbicacionEnvio { lat: number; lng: number; en: Date }

interface UbicacionOficialState {
  posicionActual: { lat: number; lng: number } | null
  ultimoEnvio: UbicacionEnvio | null
  segundosParaProximoEnvio: number
  permisoDenegado: boolean
  soportado: boolean
}

const UbicacionOficialContext = createContext<UbicacionOficialState>({
  posicionActual: null,
  ultimoEnvio: null,
  segundosParaProximoEnvio: HEARTBEAT_SEGUNDOS,
  permisoDenegado: false,
  soportado: true,
})

// Consumido por MiUbicacionSection (configuración) para confirmar visualmente
// que el tracking sí está tomando la posición del oficial.
export function useUbicacionOficial() {
  return useContext(UbicacionOficialContext)
}

// Reporta la ubicación del oficial mientras tenga la sesión abierta en el
// navegador (foreground). No hay tracking en background: si cierra la
// pestaña o bloquea el teléfono, el reporte se detiene — el despachador verá
// la última posición conocida con su antigüedad, no una posición en vivo.
export function OficialUbicacionProvider({ children }: { children: React.ReactNode }) {
  const ultimaPosicionRef = useRef<{ lat: number; lng: number } | null>(null)
  const primerEnvioRef = useRef(false)
  const soportado = typeof navigator !== 'undefined' && !!navigator.geolocation

  const [posicionActual, setPosicionActual] = useState<{ lat: number; lng: number } | null>(null)
  const [ultimoEnvio, setUltimoEnvio] = useState<UbicacionEnvio | null>(null)
  const [segundosParaProximoEnvio, setSegundosParaProximoEnvio] = useState(HEARTBEAT_SEGUNDOS)
  const [permisoDenegado, setPermisoDenegado] = useState(false)
  const [oculto, setOculto] = useState(false)

  useEffect(() => {
    if (!soportado) return

    const enviarUbicacion = (lat: number, lng: number) => {
      reportarUbicacionOficial(lat, lng)
      setUltimoEnvio({ lat, lng, en: new Date() })
      setSegundosParaProximoEnvio(HEARTBEAT_SEGUNDOS)
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        ultimaPosicionRef.current = coords
        if (!primerEnvioRef.current) {
          primerEnvioRef.current = true
          enviarUbicacion(coords.lat, coords.lng)
        }
      },
      err => {
        if (err.code === err.PERMISSION_DENIED) setPermisoDenegado(true)
      },
      { enableHighAccuracy: false, maximumAge: 20_000, timeout: 15_000 },
    )

    const tick = setInterval(() => {
      setPosicionActual(ultimaPosicionRef.current)
      setSegundosParaProximoEnvio(s => {
        if (s > 1) return s - 1

        const pos = ultimaPosicionRef.current
        if (pos) enviarUbicacion(pos.lat, pos.lng)
        return HEARTBEAT_SEGUNDOS
      })
    }, 1000)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearInterval(tick)
    }
  }, [soportado])

  return (
    <UbicacionOficialContext.Provider value={{ posicionActual, ultimoEnvio, segundosParaProximoEnvio, permisoDenegado, soportado }}>
      {children}
      {permisoDenegado && !oculto && (
        <div style={{
          position: 'fixed', top: 12, right: 12, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4,
          fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#92400e', boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          maxWidth: 320,
        }}>
          <MapPinOff size={14} />
          <span>Ubicación no disponible — el despachador no podrá verte en el mapa de cercanía.</span>
          <button onClick={() => setOculto(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', display: 'flex', flexShrink: 0 }}>
            <X size={12} />
          </button>
        </div>
      )}
    </UbicacionOficialContext.Provider>
  )
}
