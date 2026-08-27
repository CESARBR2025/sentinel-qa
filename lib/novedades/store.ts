import { create } from 'zustand'

// ─────────────────────────────────────────────────────────────────────────────
// Store Zustand del Parte de Novedades C-4 (stepper de 11 pasos).
//
// REGLA DE DISEÑO: todo formulario institucional nuevo debe controlarse con un
// store Zustand (ver `boveda/🛠 Stack/Convenciones.md` → "Formularios con
// Zustand"). Centraliza: navegación de pasos, día completo cargado, drafts de
// cada sección y toda la lógica de fetch/guardado.
//
// Diferencia deliberada con el store de Formato N: este no declara un campo por
// sección (fgeVals, fgrVals, ...) sino dos maps generales — `secciones`
// (matrices de contadores por sección) y `filas` (listados por clave sufijada,
// ej. transito.hechos). `cargar` hace UNA sola llamada a /api/novedades/dia que
// devuelve el día completo calculado + capturado + estatus.
// ─────────────────────────────────────────────────────────────────────────────

import type { EstatusNovedadesDia, FilaNovedad, SeccionKey } from './types'

export const SECCIONES_STEPPER: { key: SeccionKey; titulo: string; corto: string }[] = [
  { key: 'periodo', titulo: 'Periodo y encabezado', corto: 'Periodo' },
  { key: 'resumen', titulo: 'Resumen general', corto: 'Resumen' },
  { key: 'subsecretaria', titulo: 'Subsecretaría', corto: 'Subsecretaría' },
  { key: 'analisis', titulo: 'Unidad de Análisis', corto: 'Análisis' },
  { key: 'c4', titulo: 'C-4 (911 y cámaras)', corto: 'C-4' },
  { key: 'transito', titulo: 'Dirección de Tránsito', corto: 'Tránsito' },
  { key: 'prevencion', titulo: 'Prevención del Delito', corto: 'Prevención' },
  { key: 'delictivos', titulo: 'Hechos delictivos', corto: 'Delictivos' },
  { key: 'operativos', titulo: 'Supervisión y Operativos', corto: 'Operativos' },
  { key: 'resumen_nov', titulo: 'Resumen de novedades', corto: 'Resumen novedades' },
  { key: 'fuerza', titulo: 'Estado de fuerza', corto: 'Estado de fuerza' },
] as const

interface NovedadesState {
  fecha: string
  paso: number
  loading: boolean
  guardando: boolean
  error: string
  msg: string

  estatus: EstatusNovedadesDia | null
  /** Draft por sección: matrices de contadores. */
  secciones: Partial<Record<SeccionKey, Record<string, unknown>>>
  /** Draft por sección: listados. */
  filas: Record<string, FilaNovedad[]>
  /** Lo calculado desde BD, para mostrar el "antes" junto al editable. */
  calculado: Partial<Record<SeccionKey, Record<string, unknown>>>
}

interface NovedadesActions {
  cargar: (fecha: string) => Promise<void>
  reset: () => void
  setPaso: (paso: number) => void
  setError: (e: string) => void
  setMsg: (m: string) => void

  setCampo: (seccion: SeccionKey, campo: string, valor: string | number) => void
  setSeccion: (seccion: SeccionKey, datos: Record<string, unknown>) => void

  agregarFila: (clave: string, datos: Record<string, unknown>) => void
  editarFila: (clave: string, id: string, datos: Record<string, unknown>) => void
  eliminarFila: (clave: string, id: string) => void

  confirmada: (s: SeccionKey) => boolean
  /** Guarda el draft de la sección sin confirmarla. */
  guardarSeccion: (seccion: SeccionKey) => Promise<void>
  /** Guarda → confirma → siguiente paso. */
  avanzar: (seccion: SeccionKey) => Promise<void>
}

export type NovedadesStore = NovedadesState & NovedadesActions

const COLUMNA_ESTATUS: Record<SeccionKey, keyof EstatusNovedadesDia> = {
  periodo: 'periodo_confirmado',
  resumen: 'resumen_confirmado',
  subsecretaria: 'subsecretaria_confirmado',
  analisis: 'analisis_confirmado',
  c4: 'c4_confirmado',
  transito: 'transito_confirmado',
  prevencion: 'prevencion_confirmado',
  delictivos: 'delictivos_confirmado',
  operativos: 'operativos_confirmado',
  resumen_nov: 'resumen_nov_confirmado',
  fuerza: 'fuerza_confirmado',
}

const initialState: NovedadesState = {
  fecha: '',
  paso: 0,
  loading: true,
  guardando: false,
  error: '',
  msg: '',
  estatus: null,
  secciones: {},
  filas: {},
  calculado: {},
}

export const useNovedadesStore = create<NovedadesStore>((set, get) => ({
  ...initialState,

  cargar: async (fecha) => {
    set({ fecha, loading: true, error: '', msg: '', paso: 0 })
    try {
      const res = await fetch(`/api/novedades/dia?fecha=${fecha}`)
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'No se pudo cargar el día') }
      const data = await res.json()
      set({
        loading: false,
        estatus: data.estatus ?? null,
        secciones: data.secciones ?? {},
        filas: data.filas ?? {},
        calculado: data.calculado ?? {},
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cargar', loading: false })
    }
  },

  reset: () => set({ ...initialState, loading: false }),

  setPaso: (paso) => set({ paso, msg: '' }),
  setError: (error) => set({ error }),
  setMsg: (msg) => set({ msg }),

  setCampo: (seccion, campo, valor) => {
    set(state => ({
      secciones: {
        ...state.secciones,
        [seccion]: { ...(state.secciones[seccion] ?? {}), [campo]: valor },
      },
    }))
  },

  setSeccion: (seccion, datos) => {
    set(state => ({ secciones: { ...state.secciones, [seccion]: datos } }))
  },

  agregarFila: (clave, datos) => {
    set(state => {
      const actuales = state.filas[clave] ?? []
      const nueva: FilaNovedad = {
        id: `temp-${Date.now()}`,
        fecha: state.fecha,
        seccion: clave,
        orden: actuales.length,
        datos,
      }
      return { filas: { ...state.filas, [clave]: [...actuales, nueva] } }
    })
  },

  editarFila: (clave, id, datos) => {
    set(state => ({
      filas: {
        ...state.filas,
        [clave]: (state.filas[clave] ?? []).map(f => f.id === id ? { ...f, datos } : f),
      },
    }))
  },

  eliminarFila: (clave, id) => {
    set(state => ({
      filas: { ...state.filas, [clave]: (state.filas[clave] ?? []).filter(f => f.id !== id) },
    }))
  },

  confirmada: (s) => {
    const estatus = get().estatus
    return estatus ? Boolean(estatus[COLUMNA_ESTATUS[s]]) : false
  },

  guardarSeccion: async (seccion) => {
    const { fecha, secciones, filas } = get()
    const datos = { ...(secciones[seccion] ?? {}) }

    // Adjuntar los listados de la sección (claves prefijadas) al payload.
    const listados: Record<string, { datos: Record<string, unknown> }[]> = {}
    for (const [clave, lista] of Object.entries(filas)) {
      if (clave === seccion || clave.startsWith(`${seccion}.`)) {
        listados[clave] = lista.map(f => ({ datos: f.datos }))
      }
    }
    if (Object.keys(listados).length > 0) datos.filas = listados

    const res = await fetch('/api/novedades/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha, seccion, datos }),
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'No se pudo guardar') }
    set({ msg: 'Sección guardada.' })
  },

  avanzar: async (seccion) => {
    if (get().guardando) return
    set({ guardando: true })
    try {
      const { fecha, secciones, filas } = get()
      const datos = { ...(secciones[seccion] ?? {}) }
      const listados: Record<string, { datos: Record<string, unknown> }[]> = {}
      for (const [clave, lista] of Object.entries(filas)) {
        if (clave === seccion || clave.startsWith(`${seccion}.`)) {
          listados[clave] = lista.map(f => ({ datos: f.datos }))
        }
      }
      if (Object.keys(listados).length > 0) datos.filas = listados

      const res = await fetch('/api/novedades/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, seccion, datos }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'No se pudo confirmar') }
      const estatus: EstatusNovedadesDia = await res.json()
      set({ estatus, msg: 'Sección confirmada.' })
      const { paso } = get()
      if (paso < SECCIONES_STEPPER.length - 1) set({ paso: paso + 1, msg: '' })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      set({ guardando: false })
    }
  },
}))
