'use client'

import { createContext, useContext, useEffect, useRef, useState, useTransition } from 'react'
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
  // Contador para el próximo heartbeat. Se lleva en un ref porque el envío
  // ocurre en el cuerpo del intervalo (no en un functional updater): llamar
  // startTransition dentro de un updater de setState lanza "Cannot call
  // startTransition while rendering" (React ejecuta updaters en fase de render).
  const segundosRef = useRef(HEARTBEAT_SEGUNDOS)
  // SSR-safe: arranca en true (mismo valor en servidor y cliente) y se ajusta
  // tras el hidratado. Evaluar `typeof navigator` en el render inicial rompe
  // la hidratación: en SSR sale false ("No disponible") y en cliente true.
  const [soportado, setSoportado] = useState(true)

  const [posicionActual, setPosicionActual] = useState<{ lat: number; lng: number } | null>(null)
  const [ultimoEnvio, setUltimoEnvio] = useState<UbicacionEnvio | null>(null)
  const [segundosParaProximoEnvio, setSegundosParaProximoEnvio] = useState(HEARTBEAT_SEGUNDOS)
  const [permisoDenegado, setPermisoDenegado] = useState(false)
  const [oculto, setOculto] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const t = setTimeout(() => setSoportado(typeof navigator !== 'undefined' && !!navigator.geolocation), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!soportado) return

    const enviarUbicacion = (lat: number, lng: number) => {
      startTransition(() => { void reportarUbicacionOficial(lat, lng) })
      segundosRef.current = HEARTBEAT_SEGUNDOS
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
      if (segundosRef.current > 1) {
        segundosRef.current -= 1
        setSegundosParaProximoEnvio(segundosRef.current)
        return
      }
      const pos = ultimaPosicionRef.current
      if (pos) enviarUbicacion(pos.lat, pos.lng)
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
          padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)',
          fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#92400e', boxShadow: 'var(--apple-shadow-glass)',
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
