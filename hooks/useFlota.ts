'use client'
import { useState, useCallback, useRef } from 'react'

export interface VehiculoOption {
  id: number; placa: string; marca: string
  modelo: string; color: string; tipo: string; label: string
}

interface FiltrosFlota {
  placa?: string; marca?: string; modelo?: string; color?: string
}

export function useFlota() {
  const [resultados, setResultados] = useState<VehiculoOption[]>([])
  const [cargando,   setCargando]   = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback((filtros: FiltrosFlota = {}) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setCargando(true); setError(null)
      try {
        const params = new URLSearchParams()
        if (filtros.placa)  params.set('placa',  filtros.placa)
        if (filtros.marca)  params.set('marca',  filtros.marca)
        if (filtros.modelo) params.set('modelo', filtros.modelo)
        if (filtros.color)  params.set('color',  filtros.color)

        const url = params.size > 0
          ? `/api/rol-servicios/externos/flota?${params}`
          : `/api/rol-servicios/externos/flota`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Error al buscar unidad')
        setResultados(await res.json())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
        setResultados([])
      } finally {
        setCargando(false)
      }
    }, 350)
  }, [])

  const limpiar = useCallback(() => { setResultados([]); setError(null) }, [])

  return { resultados, cargando, error, buscar, limpiar }
}