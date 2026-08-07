'use client'

import { useEffect, useRef, useTransition } from 'react'
import { reportarActividadDespachador } from '@/lib/911/actions'

const HEARTBEAT_SEGUNDOS = 60

// Reporta presencia del despachador mientras tenga abierta esta pantalla
// (foreground). No hay tracking en background: si cierra la pestaña o pierde
// conexión, el heartbeat se detiene y a los 5 minutos sin señal (ver
// obtenerDespachadores en lib/911/repository.ts) deja de figurar "en línea".
export function DespachadorActividadTracker() {
  const [, startTransition] = useTransition()
  const enviadoInicialRef = useRef(false)

  useEffect(() => {
    const enviar = () => startTransition(() => { void reportarActividadDespachador() })

    if (!enviadoInicialRef.current) {
      enviadoInicialRef.current = true
      enviar()
    }

    const tick = setInterval(enviar, HEARTBEAT_SEGUNDOS * 1000)
    return () => clearInterval(tick)
  }, [])

  return null
}
