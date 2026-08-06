'use client'
import { useEffect, useEffectEvent, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  // useEffectEvent mantiene siempre la última versión de fn sin violar
  // react-hooks/refs (no se puede asignar un ref durante el render), y sin
  // re-ejecutar el efecto cuando fn cambia por identidad en cada render.
  const onTick = useEffectEvent(fn)
  // false en el primer render: el consumidor ya hace su propio fetch
  // inmediato al montar (patrón repetido en CampanillaNotificaciones y
  // ContadorAsignaciones), así que aquí NO se dispara fn() la primera vez
  // que activo es true, para no duplicar esa llamada inicial.
  const yaActivadoAntesRef = useRef(false)

  useEffect(() => {
    if (!activo) return
    // A partir de la segunda vez que activo pasa a true (ej. la pestaña
    // recupera visibilidad tras estar oculta/bloqueada), refresca de
    // inmediato en vez de esperar a que corra el próximo tick del
    // intervalo — sin esto, volver a la pestaña puede esperar hasta
    // intervalMs completos aunque haya algo nuevo esperando.
    if (yaActivadoAntesRef.current) onTick()
    yaActivadoAntesRef.current = true

    const id = setInterval(() => onTick(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
