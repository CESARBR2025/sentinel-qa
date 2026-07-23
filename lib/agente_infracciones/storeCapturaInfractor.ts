'use client'

import { create } from 'zustand'

export interface CapturaInfractorState {
  paso: number
  infrNombre: string
  infrAppaterno: string
  infrApmaterno: string
  infrCurp: string
  infrCorreo: string
}

export interface CapturaInfractorActions {
  setPaso: (s: number) => void
  setInfrNombre: (v: string) => void
  setInfrAppaterno: (v: string) => void
  setInfrApmaterno: (v: string) => void
  setInfrCurp: (v: string) => void
  setInfrCorreo: (v: string) => void
  reset: () => void
}

export type CapturaInfractorStore = CapturaInfractorState & CapturaInfractorActions

const initialState: CapturaInfractorState = {
  paso: 1,
  infrNombre: '',
  infrAppaterno: '',
  infrApmaterno: '',
  infrCurp: '',
  infrCorreo: '',
}

export const useCapturaInfractorStore = create<CapturaInfractorStore>((set) => ({
  ...initialState,
  setPaso: (paso) => set({ paso }),
  setInfrNombre: (infrNombre) => set({ infrNombre }),
  setInfrAppaterno: (infrAppaterno) => set({ infrAppaterno }),
  setInfrApmaterno: (infrApmaterno) => set({ infrApmaterno }),
  setInfrCurp: (infrCurp) => set({ infrCurp }),
  setInfrCorreo: (infrCorreo) => set({ infrCorreo }),
  reset: () => set(initialState),
}))
