import { create } from 'zustand'
import type { OfiOrdenAprehension, OfiHidrocarburo, OfiArmaFuego, OfiDroga } from './types'

export interface VehiculoState {
  placas: string
  serie: string
  color: string
  tipo: string
  destino: string
}

export interface OficialFormState {
  step: number
  isAnonimo: boolean
  quiereDenuncia: boolean
  tipoIncidente: string
  tipoEmergenciaId: string
  prioridadId: string
  descripcion: string
  contenidoReporte: string
  datosPositivosNegativos: string
  accionesRealizadas: string
  objetosRecuperados: string
  resultadoCateo: string
  tieneDetencion: string
  autoridadRecibe: string
  tieneCateo: string
  domicilioCateado: string
  detenidos: string[]
  numVehiculos: number
  vehiculos: VehiculoState[]
  tieneVehiculo: string
  folioCad: string
  nombreReportante: string
  montoRobo: string
  hayRobo: string
  calle: string
  colonia: string
  latitud: string
  longitud: string
  cateoCalle: string
  cateoColonia: string
  cateoNumero: string
  cateoLat: string
  cateoLng: string
  hayOrdenAprehension: boolean
  ordenesAprehension: OfiOrdenAprehension[]
  hayHidrocarburo: boolean
  hidrocarburos: OfiHidrocarburo[]
  hayArmaFuego: boolean
  armasFuego: OfiArmaFuego[]
  hayDroga: boolean
  drogas: OfiDroga[]
}

export interface OficialFormActions {
  setStep: (s: number) => void
  setField: <K extends keyof OficialFormState>(key: K, value: OficialFormState[K]) => void
  setDetenidos: (d: string[]) => void
  setVehiculos: (v: VehiculoState[]) => void
  setNumVehiculos: (n: number) => void
  setLocation: (data: { calle: string; colonia: string; lat: string; lng: string }) => void
  setCateoLocation: (data: { calle: string; colonia: string; numero: string; lat: string; lng: string }) => void
  setOrdenesAprehension: (v: OfiOrdenAprehension[]) => void
  setHidrocarburos: (v: OfiHidrocarburo[]) => void
  setArmasFuego: (v: OfiArmaFuego[]) => void
  setDrogas: (v: OfiDroga[]) => void
  reset: () => void
}

export type OficialFormStore = OficialFormState & OficialFormActions

const initialState: OficialFormState = {
  step: 0,
  isAnonimo: false,
  quiereDenuncia: false,
  tipoIncidente: '',
  tipoEmergenciaId: '',
  prioridadId: '',
  descripcion: '',
  contenidoReporte: '',
  datosPositivosNegativos: '',
  accionesRealizadas: '',
  objetosRecuperados: '',
  resultadoCateo: '',
  tieneDetencion: 'false',
  autoridadRecibe: 'FISCALIA',
  tieneCateo: 'false',
  domicilioCateado: '',
  detenidos: [''],
  numVehiculos: 0,
  vehiculos: [],
  tieneVehiculo: 'false',
  folioCad: 'S/C',
  nombreReportante: '',
  montoRobo: '0',
  hayRobo: 'false',
  calle: '',
  colonia: '',
  latitud: '',
  longitud: '',
  cateoCalle: '',
  cateoColonia: '',
  cateoNumero: '',
  cateoLat: '',
  cateoLng: '',
  hayOrdenAprehension: false,
  ordenesAprehension: [],
  hayHidrocarburo: false,
  hidrocarburos: [],
  hayArmaFuego: false,
  armasFuego: [],
  hayDroga: false,
  drogas: [],
}

export const useOficialFormStore = create<OficialFormStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setField: (key, value) => set({ [key]: value } as Partial<OficialFormState>),
  setDetenidos: (detenidos) => set({ detenidos }),
  setVehiculos: (vehiculos) => set({ vehiculos }),
  setNumVehiculos: (numVehiculos) => set({ numVehiculos }),
  setLocation: (data) => set({
    calle: data.calle,
    colonia: data.colonia,
    latitud: data.lat,
    longitud: data.lng,
  }),
  setCateoLocation: (data) => set({
    cateoCalle: data.calle,
    cateoColonia: data.colonia,
    cateoNumero: data.numero,
    cateoLat: data.lat,
    cateoLng: data.lng,
  }),
  setOrdenesAprehension: (v: OfiOrdenAprehension[]) => set({ ordenesAprehension: v }),
  setHidrocarburos: (v: OfiHidrocarburo[]) => set({ hidrocarburos: v }),
  setArmasFuego: (v: OfiArmaFuego[]) => set({ armasFuego: v }),
  setDrogas: (v: OfiDroga[]) => set({ drogas: v }),
  reset: () => set(initialState),
}))
