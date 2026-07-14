"use client";

import { create } from "zustand";

interface RondinFormState {
  anonimo: boolean;
  obteniendoUbicacion: boolean;
  errorUbicacion: string | null;
  mapsReady: boolean;

  setAnonimo: (v: boolean) => void;
  setObteniendoUbicacion: (v: boolean) => void;
  setErrorUbicacion: (v: string | null) => void;
  setMapsReady: (v: boolean) => void;
}

export const useRondinFormStore = create<RondinFormState>((set) => ({
  anonimo: true,
  obteniendoUbicacion: false,
  errorUbicacion: null,
  mapsReady: false,

  setAnonimo: (v) => set({ anonimo: v }),
  setObteniendoUbicacion: (v) => set({ obteniendoUbicacion: v }),
  setErrorUbicacion: (v) => set({ errorUbicacion: v }),
  setMapsReady: (v) => set({ mapsReady: v }),
}));
