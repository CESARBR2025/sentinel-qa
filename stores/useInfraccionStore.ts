import { create } from "zustand";

interface DatosInfraccion {
  dependenciaRemisora: string;
  evidencias: File[];
  archivoINE: File | null;
  archivoInapam: File | null;
  archivoTarjetaCirculacion: File | null;
  esCiudadanoAdultoMayor: boolean;
  presentaInapam: boolean;
  fechaLimiteDescuento: string;
  descuentoAplicado: number;
  estaCiudadanoPresente: boolean | null;
  esCiudadanoTitular: boolean | null;
  latitud: number | null;
  longitud: number | null;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  municipio: string;
  estado: string;
  presentaIne: boolean | null;
  correoInfractor: string;
  curpInfractor: string;
  nombreInfractor: string;
  apMaternoInfractor: string;
  apPaternoInfractor: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  placa: string;
  noSerie: string;
  estadoOrigen: string;
  tipoVehiculo: string;
  servicio: string;
  otroServicio: string;
  articuloId: string;
  articuloDescripcion: string;
  articuloNumero: string;
  fraccionId: string;
  fraccionDescripcion: string;
  fraccionNumero: string;
  fraccionMonto: string;
  fraccionClasificacion: string;
  garantiaSeleccionada: string;
  motivoRetencionVehiculo: string;
  gruaInvolucrada: string;
  agregarEvidencia: boolean;
  pagoAlMomento: boolean;
}

const datosIniciales: DatosInfraccion = {
  dependenciaRemisora: "",
  evidencias: [],
  archivoINE: null,
  archivoInapam: null,
  archivoTarjetaCirculacion: null,
  esCiudadanoAdultoMayor: false,
  presentaInapam: false,
  fechaLimiteDescuento: "",
  descuentoAplicado: 0,
  estaCiudadanoPresente: true,
  esCiudadanoTitular: true,
  latitud: null,
  longitud: null,
  calle: "",
  numero: "",
  colonia: "",
  codigoPostal: "",
  municipio: "",
  estado: "",
  presentaIne: null,
  correoInfractor: "",
  curpInfractor: "",
  nombreInfractor: "",
  apMaternoInfractor: "",
  apPaternoInfractor: "",
  marca: "",
  modelo: "",
  anio: "",
  color: "",
  placa: "",
  noSerie: "",
  estadoOrigen: "",
  tipoVehiculo: "",
  servicio: "",
  otroServicio: "",
  articuloId: "",
  articuloDescripcion: "",
  articuloNumero: "",
  fraccionId: "",
  fraccionDescripcion: "",
  fraccionNumero: "",
  fraccionMonto: "",
  fraccionClasificacion: "",
  garantiaSeleccionada: "",
  motivoRetencionVehiculo: "",
  gruaInvolucrada: "",
  agregarEvidencia: false,
  pagoAlMomento: false,
};

interface InfraccionStore {
  curpStatus: "idle" | "loading" | "found" | "not_found" | "error";
  setCurpStatus: (status: InfraccionStore["curpStatus"]) => void;
  setCurpLoading: (value: boolean) => void;
  datos: DatosInfraccion;
  actualizarDatos: (data: Partial<DatosInfraccion>) => void;
  resetDatos: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  pagado: boolean;
  setPagado: (value: boolean) => void;
  estatusPago: string;
  setEstatusPago: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  curpLoading: boolean;
  pagoAlMomento: boolean;
  setPagoAlMomento: (value: boolean) => void;
  resetAll: () => void;
}

export type { InfraccionStore, DatosInfraccion };

export const useInfraccionStore = create<InfraccionStore>((set) => ({
  curpStatus: "idle",
  setCurpStatus: (status) => set({ curpStatus: status }),
  setCurpLoading: (value) => set({ curpLoading: value }),

  datos: datosIniciales,
  actualizarDatos: (data) =>
    set((state) => ({
      datos: { ...state.datos, ...data },
    })),
  resetDatos: () => set({ datos: datosIniciales }),

  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

  pagado: false,
  setPagado: (value) => set({ pagado: value }),
  estatusPago: "PENDIENTE",
  setEstatusPago: (value) => set({ estatusPago: value }),

  loading: false,
  setLoading: (value) => set({ loading: value }),
  curpLoading: false,

  pagoAlMomento: false,
  setPagoAlMomento: (value) => set({ pagoAlMomento: value }),

  resetAll: () =>
    set({
      datos: datosIniciales,
      currentStep: 0,
      pagado: false,
      estatusPago: "PENDIENTE",
      loading: false,
      curpLoading: false,
      pagoAlMomento: false,
    }),
}));
