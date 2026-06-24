'use client'
import { useState, useCallback } from 'react'

export interface EmpleadoResult {
  trabajadorId: string
  nombre:       string
  puesto:       string
  dependencia:  string
  estatus:      string
}

export function useEmpleado() {
  const [empleado, setEmpleado] = useState<EmpleadoResult | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const buscarPorNomina = useCallback(async (nomina: string) => {
    if (!nomina.trim()) return
    setCargando(true); setError(null); setEmpleado(null)
    try {
      const res = await fetch(
        `/api/rol-servicios/externos/rh?trabajadorId=${encodeURIComponent(nomina.trim())}`
      )
      if (res.status === 404) { setError('Empleado no encontrado'); return }
      if (!res.ok) throw new Error('Error al consultar RH')
      const data: EmpleadoResult = await res.json()
      if (data.estatus !== 'A') { setError('El empleado no está activo'); return }
      setEmpleado(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  const buscarPorCurp = useCallback(async (curp: string, apellidoPaterno: string, apellidoMaterno: string) => {
    if (!curp || !apellidoPaterno || !apellidoMaterno) {
      setError('Se requiere CURP, apellido paterno y materno'); return
    }
    setCargando(true); setError(null); setEmpleado(null)
    try {
      const params = new URLSearchParams({ curp, apellidoPaterno, apellidoMaterno })
      const res = await fetch(`/api/rol-servicios/externos/rh?${params}`)
      if (res.status === 404) { setError('Empleado no encontrado'); return }
      if (!res.ok) throw new Error('Error al consultar RH')
      const data: EmpleadoResult = await res.json()
      if (data.estatus !== 'A') { setError('El empleado no está activo'); return }
      setEmpleado(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  const limpiar = useCallback(() => { setEmpleado(null); setError(null) }, [])

  return { empleado, cargando, error, buscarPorNomina, buscarPorCurp, limpiar }
}