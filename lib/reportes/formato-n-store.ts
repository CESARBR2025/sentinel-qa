import { create } from 'zustand'

// ─────────────────────────────────────────────────────────────────────────────
// Store Zustand del formulario Formato N (stepper de 8 pasos).
//
// REGLA DE DISEÑO: todo formulario institucional nuevo debe controlarse con un
// store Zustand (ver `boveda/🛠 Stack/Convenciones.md` → "Formularios con
// Zustand"). Centraliza: navegación de pasos, consolidado cargado, drafts de
// cada sección y toda la lógica de fetch/guardado — los componentes de UI
// quedan presentacionales y los drafts persisten entre pasos (sin remount).
// ─────────────────────────────────────────────────────────────────────────────

export const SECCIONES = [
  { key: 'eventos', titulo: 'Eventos Informados', corto: 'Eventos' },
  { key: 'fge', titulo: 'Fiscalía General del Estado (FGE)', corto: 'FGE' },
  { key: 'fgr', titulo: 'Fiscalía General de la República (FGR)', corto: 'FGR' },
  { key: 'rnd', titulo: 'Registro Nacional de Detenciones (RND)', corto: 'RND' },
  { key: 'medios', titulo: 'Medios Alternativos de Solución de Conflictos', corto: 'MASC' },
  { key: 'victimas', titulo: 'Atención a Víctimas', corto: 'Víctimas' },
  { key: 'armas', titulo: 'Armas de Fuego Aseguradas', corto: 'Armas' },
  { key: 'observaciones', titulo: 'Observaciones', corto: 'Observaciones' },
] as const

export type SeccionKey = typeof SECCIONES[number]['key']

export interface EstatusDia {
  fecha: string
  eventos_confirmado: boolean
  fge_confirmado: boolean
  fgr_confirmado: boolean
  rnd_confirmado: boolean
  medios_confirmado: boolean
  victimas_confirmado: boolean
  armas_confirmado: boolean
  observaciones_confirmado: boolean
  completado_en: string | null
}

export interface Consolidado {
  fecha: string
  eventos: Record<string, unknown>[]
  fge: Record<string, unknown>[]
  fgr: Record<string, unknown>[]
  rnd: Record<string, unknown>[]
  medios: Record<string, unknown>[]
  victimas: Record<string, unknown>[]
  armas: Record<string, unknown>[]
  estatus: EstatusDia | null
}

export const FIELD_LABELS: Record<string, { label: string; name: string }[]> = {
  fge: [
    { label: 'Carpetas Iniciadas', name: 'carpetas_iniciadas' },
    { label: 'Número de Cateos', name: 'numero_cateos' },
    { label: 'Vehículos Asegurados', name: 'vehiculos_asegurados' },
    { label: 'Domicilios Cateados', name: 'domicilios_cateados' },
    { label: 'Personas Aseguradas', name: 'personas_aseguradas' },
    { label: 'Aprehensiones', name: 'aprehensiones' },
    { label: 'Audiencias Iniciales', name: 'audiencias_iniciales' },
    { label: 'Abreviados', name: 'abreviados' },
    { label: 'Audiencias Intermedias', name: 'audiencias_intermedias' },
  ],
  fgr: [
    { label: 'Carpetas Iniciadas', name: 'carpetas_iniciadas' },
    { label: 'Número de Cateos', name: 'numero_cateos' },
    { label: 'Vehículos Asegurados', name: 'vehiculos_asegurados' },
    { label: 'Domicilios Cateados', name: 'domicilios_cateados' },
    { label: 'Personas Aseguradas', name: 'personas_aseguradas' },
    { label: 'Aprehensiones', name: 'aprehensiones' },
    { label: 'Audiencias Iniciales', name: 'audiencias_iniciales' },
    { label: 'Abreviados', name: 'abreviados' },
    { label: 'Audiencias Intermedias', name: 'audiencias_intermedias' },
  ],
  medios: [
    { label: 'Asuntos Canalizados por Fiscalía', name: 'asuntos_canalizados_por_fiscalia' },
    { label: 'Acuerdos', name: 'acuerdos' },
    { label: 'Monto Reparación de Daños', name: 'monto_reparacion_danos' },
  ],
  victimas: [
    { label: 'Número de Atenciones', name: 'numero_atenciones' },
    { label: 'Atenciones Médicas', name: 'atenciones_medicas' },
    { label: 'Atenciones Psicológicas', name: 'atenciones_psicologicas' },
    { label: 'Asesorías Jurídicas', name: 'asesorias_juridicas' },
  ],
}

export interface RndForm { hora_detencion: string; delito: string; autoridad_que_realizo_detencion: string; folio: string }
export interface ArmasForm { carpeta_investigacion: string; tipo_arma: string; matricula: string; calibre: string; observaciones: string }

interface FormatoNState {
  fecha: string
  consolidado: Consolidado | null
  paso: number
  loading: boolean
  guardando: boolean
  error: string
  msg: string

  fgeVals: Record<string, string>
  fgrVals: Record<string, string>

  mediosVals: Record<string, string>
  victimasVals: Record<string, string>
  victimasObs: string

  armasForm: ArmasForm
  observacionesTexto: string
}

interface FormatoNActions {
  cargar: (fecha: string) => Promise<void>
  reset: () => void

  setPaso: (paso: number) => void
  setError: (e: string) => void
  setMsg: (m: string) => void

  confirmada: (s: SeccionKey) => boolean
  confirmarSeccion: (s: SeccionKey) => Promise<void>
  avanzar: (s: SeccionKey, guardar?: () => Promise<void>) => Promise<void>

  guardarFiscalia: (tipo: 'fge' | 'fgr') => Promise<void>
  guardarMetricas: (seccion: 'medios' | 'victimas') => Promise<void>
  guardarArmas: () => Promise<void>
  guardarObservaciones: () => Promise<void>

  setFgeVals: (v: Record<string, string>) => void
  setFgrVals: (v: Record<string, string>) => void
  setMediosVals: (v: Record<string, string>) => void
  setVictimasVals: (v: Record<string, string>) => void
  setVictimasObs: (v: string) => void
  setArmasForm: (patch: Partial<ArmasForm>) => void
  setObservacionesTexto: (t: string) => void
}

export type FormatoNStore = FormatoNState & FormatoNActions

const COLUMNA_ESTATUS: Record<SeccionKey, keyof EstatusDia> = {
  eventos: 'eventos_confirmado',
  fge: 'fge_confirmado',
  fgr: 'fgr_confirmado',
  rnd: 'rnd_confirmado',
  medios: 'medios_confirmado',
  victimas: 'victimas_confirmado',
  armas: 'armas_confirmado',
  observaciones: 'observaciones_confirmado',
}

function valsDesdeExistentes(existente: Record<string, unknown> | undefined, campos: { label: string; name: string }[]): Record<string, string> {
  const init: Record<string, string> = {}
  for (const c of campos) init[c.name] = String(Number(existente?.[c.name] ?? 0))
  return init
}

const initialState: FormatoNState = {
  fecha: '',
  consolidado: null,
  paso: 0,
  loading: true,
  guardando: false,
  error: '',
  msg: '',
  fgeVals: {},
  fgrVals: {},
  mediosVals: {},
  victimasVals: {},
  victimasObs: '',
  armasForm: { carpeta_investigacion: '', tipo_arma: '', matricula: '', calibre: '', observaciones: '' },
  observacionesTexto: '',
}

async function guardarUpsert(url: string, payload: Record<string, unknown>) {
  let res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (res.status === 409) {
    const err = await res.json()
    if (err.existenteId) {
      res = await fetch(`${url}/${err.existenteId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
  }
  if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
}

export const useFormatoNStore = create<FormatoNStore>((set, get) => ({
  ...initialState,

  cargar: async (fecha) => {
    set({
      fecha, loading: true, error: '', msg: '',
      paso: 0, armasForm: initialState.armasForm,
    })
    try {
      await Promise.all([
        fetch('/api/reportes/formato-n-eventos/sincronizar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha }),
        }),
        fetch('/api/reportes/formato-n-rnd/sincronizar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha }),
        }),
        fetch('/api/reportes/formato-n-armas-aseguradas/sincronizar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha }),
        }),
      ])
      const [res, obsRes, fgeRes, fgrRes] = await Promise.all([
        fetch('/api/reportes/formato-n-consolidado', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha_inicio: fecha, fecha_fin: fecha }),
        }),
        fetch(`/api/reportes/formato-n-observaciones?fecha=${fecha}`),
        fetch(`/api/reportes/formato-n-fge/calcular?fecha=${fecha}`),
        fetch(`/api/reportes/formato-n-fgr/calcular?fecha=${fecha}`),
      ])
      if (!res.ok) { set({ error: 'No se pudo cargar el reporte', loading: false }); return }
      const data = await res.json()
      const consolidado: Consolidado = data[0]
      const obs = await obsRes.json()
      const fgeVals = valsDesdeExistentes(consolidado.fge[0] as Record<string, unknown> | undefined, FIELD_LABELS.fge)
      const fgrVals = valsDesdeExistentes(consolidado.fgr[0] as Record<string, unknown> | undefined, FIELD_LABELS.fgr)
      const FGE_MAP: Record<string, string> = { carpetas_iniciadas: 'carpetas_iniciadas', numero_cateos: 'numero_cateos', vehiculos_asegurados: 'vehiculos_asegurados', domicilios_cateados: 'domicilios_cateados', personas_aseguradas: 'personas_aseguradas', aprehensiones: 'aprehensiones' }
      const FGR_MAP: Record<string, string> = { carpetas_iniciadas: 'carpetas_iniciadas', numero_cateos: 'numero_cateos', vehiculos_asegurados: 'vehiculos_asegurados', domicilios_cateados: 'domicilios_cateados', personas_aseguradas: 'personas_aseguradas', aprehensiones: 'aprehensiones' }
      if (fgeRes.ok) {
        const conteos = await fgeRes.json()
        for (const [api, campo] of Object.entries(FGE_MAP)) fgeVals[campo] = String(conteos[api] ?? 0)
      }
      if (fgrRes.ok) {
        const conteos = await fgrRes.json()
        for (const [api, campo] of Object.entries(FGR_MAP)) fgrVals[campo] = String(conteos[api] ?? 0)
      }
      set({
        consolidado,
        loading: false,
        fgeVals,
        fgrVals,
        mediosVals: valsDesdeExistentes(consolidado.medios[0] as Record<string, unknown> | undefined, FIELD_LABELS.medios),
        victimasVals: valsDesdeExistentes(consolidado.victimas[0] as Record<string, unknown> | undefined, FIELD_LABELS.victimas),
        victimasObs: String((consolidado.victimas[0] as Record<string, unknown> | undefined)?.observaciones ?? ''),
        observacionesTexto: obs?.observaciones ? String(obs.observaciones) : '',
        msg: '',
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cargar', loading: false })
    }
  },

  reset: () => set({ ...initialState, loading: false }),

  setPaso: (paso) => set({ paso, msg: '' }),
  setError: (error) => set({ error }),
  setMsg: (msg) => set({ msg }),

  confirmada: (s) => {
    const estatus = get().consolidado?.estatus
    return estatus ? Boolean(estatus[COLUMNA_ESTATUS[s]]) : false
  },

  confirmarSeccion: async (s) => {
    const res = await fetch('/api/reportes/formato-n-estatus', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha: get().fecha, seccion: s }),
    })
    if (!res.ok) throw new Error('No se pudo confirmar la sección')
    const estatus: EstatusDia = await res.json()
    set(state => ({ consolidado: state.consolidado ? { ...state.consolidado, estatus } : state.consolidado }))
  },

  avanzar: async (s, guardar) => {
    if (get().guardando) return
    set({ guardando: true })
    try {
      if (guardar) await guardar()
      await get().confirmarSeccion(s)
      const { paso } = get()
      if (paso < SECCIONES.length - 1) set({ paso: paso + 1, msg: '' })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      set({ guardando: false })
    }
  },

  guardarFiscalia: async (tipo) => {
    const { fecha, fgeVals, fgrVals } = get()
    const campos = FIELD_LABELS[tipo]
    const vals = tipo === 'fge' ? fgeVals : fgrVals
    const payload: Record<string, string | number> = { fecha, periodo: 'diario' }
    for (const c of campos) payload[c.name] = Number(vals[c.name] ?? 0)
    const url = tipo === 'fge' ? '/api/reportes/formato-n-fge' : '/api/reportes/formato-n-fgr'
    await guardarUpsert(url, payload)
    set({ msg: tipo === 'fge' ? 'FGE guardado. Confirma para continuar.' : 'FGR guardado. Confirma para continuar.' })
  },

  guardarMetricas: async (seccion) => {
    const { fecha, mediosVals, victimasVals, victimasObs } = get()
    const campos = FIELD_LABELS[seccion]
    const vals = seccion === 'medios' ? mediosVals : victimasVals
    const payload: Record<string, string | number | null> = { fecha, periodo: 'diario' }
    for (const c of campos) payload[c.name] = Number(vals[c.name] ?? 0)
    if (seccion === 'victimas') payload.observaciones = victimasObs || null
    const url = seccion === 'medios' ? '/api/reportes/formato-n-medios-alternativos' : '/api/reportes/formato-n-atencion-victimas'
    await guardarUpsert(url, payload)
    set({ msg: seccion === 'medios' ? 'Medios Alternativos guardados. Confirma para continuar.' : 'Atención a Víctimas guardada. Confirma para continuar.' })
  },

  guardarArmas: async () => {
    const { fecha, armasForm } = get()
    if (!armasForm.tipo_arma.trim()) {
      // Sin arma nueva capturada en este paso: no reenviar el último registro guardado.
      set({ msg: '' })
      return
    }
    const payload = { fecha, carpeta_investigacion: armasForm.carpeta_investigacion || null, tipo_arma: armasForm.tipo_arma, matricula: armasForm.matricula || null, calibre: armasForm.calibre || null, observaciones: armasForm.observaciones || null }
    const res = await fetch('/api/reportes/formato-n-armas-aseguradas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    set({ msg: 'Arma registrada. Confirma para continuar.', armasForm: initialState.armasForm })
  },

  guardarObservaciones: async () => {
    const { fecha, observacionesTexto } = get()
    const res = await fetch('/api/reportes/formato-n-observaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha, observaciones: observacionesTexto }) })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    set({ msg: 'Observaciones guardadas. Confirma para terminar.' })
  },

  setFgeVals: (fgeVals) => set({ fgeVals }),
  setFgrVals: (fgrVals) => set({ fgrVals }),
  setMediosVals: (mediosVals) => set({ mediosVals }),
  setVictimasVals: (victimasVals) => set({ victimasVals }),
  setVictimasObs: (victimasObs) => set({ victimasObs }),
  setArmasForm: (patch) => set(state => ({ armasForm: { ...state.armasForm, ...patch } })),
  setObservacionesTexto: (observacionesTexto) => set({ observacionesTexto }),
}))
