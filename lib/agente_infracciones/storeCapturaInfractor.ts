'use client'

import { create } from 'zustand'

export interface CapturaInfractorState {
  paso: number
  esTitular: boolean
  infrNombre: string
  infrAppaterno: string
  infrApmaterno: string
  infrCurp: string
  infrCorreo: string
  nombre: string
  appaterno: string
  apmaterno: string
  curp: string
  correo: string
}

export interface CapturaInfractorActions {
  setPaso: (s: number) => void
  setEsTitular: (v: boolean) => void
  setInfrNombre: (v: string) => void
  setInfrAppaterno: (v: string) => void
  setInfrApmaterno: (v: string) => void
  setInfrCurp: (v: string) => void
  setInfrCorreo: (v: string) => void
  setNombre: (v: string) => void
  setAppaterno: (v: string) => void
  setApmaterno: (v: string) => void
  setCurp: (v: string) => void
  setCorreo: (v: string) => void
  reset: () => void
}

export type CapturaInfractorStore = CapturaInfractorState & CapturaInfractorActions

const initialState: CapturaInfractorState = {
  paso: 1,
  esTitular: true,
  infrNombre: '',
  infrAppaterno: '',
  infrApmaterno: '',
  infrCurp: '',
  infrCorreo: '',
  nombre: '',
  appaterno: '',
  apmaterno: '',
  curp: '',
  correo: '',
}

export const useCapturaInfractorStore = create<CapturaInfractorStore>((set) => ({
  ...initialState,
  setPaso: (paso) => set({ paso }),
  setEsTitular: (esTitular) => set({ esTitular }),
  setInfrNombre: (infrNombre) => set({ infrNombre }),
  setInfrAppaterno: (infrAppaterno) => set({ infrAppaterno }),
  setInfrApmaterno: (infrApmaterno) => set({ infrApmaterno }),
  setInfrCurp: (infrCurp) => set({ infrCurp }),
  setInfrCorreo: (infrCorreo) => set({ infrCorreo }),
  setNombre: (nombre) => set({ nombre }),
  setAppaterno: (appaterno) => set({ appaterno }),
  setApmaterno: (apmaterno) => set({ apmaterno }),
  setCurp: (curp) => set({ curp }),
  setCorreo: (correo) => set({ correo }),
  reset: () => set(initialState),
}))
