'use client'

import { useState, useCallback, useRef } from 'react'

export interface VehiculoOption {
  id:    number
  placa: string
  label: string
}

export function useFlota() {
  const [resultados, setResultados] = useState<VehiculoOption[]>([])
  const [cargando,   setCargando]   = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback((placa: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!placa || placa.length < 2) { setResultados([]); return }

    debounceRef.current = setTimeout(async () => {
      setCargando(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/rol-servicios/externos/flota?placa=${encodeURIComponent(placa)}`
        )
        if (res.status === 404) { setResultados([]); return }
        if (!res.ok) throw new Error('Error al buscar unidad')
        const data: VehiculoOption[] = await res.json()
        setResultados(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
        setResultados([])
      } finally {
        setCargando(false)
      }
    }, 350)
  }, [])

  const limpiar = useCallback(() => {
    setResultados([])
    setError(null)
  }, [])

  return { resultados, cargando, error, buscar, limpiar }
}