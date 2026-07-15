import { create } from 'zustand'

const ahora = new Date()
const fechaActual = ahora.toISOString().split('T')[0]
const horaActual = ahora.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })

export interface Coord {
  lat: number
  lng: number
}

export interface Dir {
  calle: string
  colonia: string
}

export interface D1FormState {
  step: number
  coordsHecho: Coord
  coordsApoyo: Coord
  dirHecho: Dir
  dirApoyo: Dir
  fechaReporte: string
  horaReporte: string
}

export interface D1FormActions {
  setStep: (s: number) => void
  setCoordsHecho: (c: Coord) => void
  setCoordsApoyo: (c: Coord) => void
  setDirHecho: (d: Dir) => void
  setDirApoyo: (d: Dir) => void
  setFechaReporte: (f: string) => void
  setHoraReporte: (h: string) => void
  reset: () => void
}

export type D1FormStore = D1FormState & D1FormActions

const center = { lat: 20.3889, lng: -99.9961 }

const initialState: D1FormState = {
  step: 1,
  coordsHecho: { ...center },
  coordsApoyo: { ...center },
  dirHecho: { calle: '', colonia: '' },
  dirApoyo: { calle: '', colonia: '' },
  fechaReporte: fechaActual,
  horaReporte: horaActual,
}

export const useD1FormStore = create<D1FormStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setCoordsHecho: (coordsHecho) => set({ coordsHecho }),
  setCoordsApoyo: (coordsApoyo) => set({ coordsApoyo }),
  setDirHecho: (dirHecho) => set({ dirHecho }),
  setDirApoyo: (dirApoyo) => set({ dirApoyo }),
  setFechaReporte: (fechaReporte) => set({ fechaReporte }),
  setHoraReporte: (horaReporte) => set({ horaReporte }),
  reset: () => set(initialState),
}))
