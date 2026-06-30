/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export function useDetenidoForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  // ===========================
  // PASO 1 - DATOS DEL DETENIDO
  // ===========================
  fechaNacimiento: '',
  edad: '',
  genero: '',
  alias: '',
  ciudadOrigen: '',
  calleDetenido: '',
  numeroDetenido: '',
  coloniaDetenido: '',

  // ===========================
  // PASO 2 - ARRESTO
  // ===========================
  articulo: '',
  tipoFalta: '',
  rnd: '',
  calleArresto: '',
  coloniaArresto: '',
  sectorArresto: '',
  agrupamientoArresto: '',
  latitudArresto: '',
  longitudArresto: '',

  // ===========================
  // PASO 3 - USO DE LA FUERZA
  // ===========================
  presencia: false,
  verbalizacion: false,
  controlContacto: false,
  controlFisico: false,
  tecnicasNoLetales: false,
  fuerzaLetal: false,

  // ===========================
  // PASO 4 - FOLIOS Y TIEMPOS
  // ===========================
  folioIPH: '',
  folio911: '',
  diaEvento: '',
  fechaEvento: '',
  fechaReporte: '',
  horaReporte: '',
  horaInicioEvento: '',
  horaFinalEvento: '',
  horaPromedio: '',

  // ===========================
  // PASO 5 - HECHO
  // ===========================
  delito: '',
  modusOperandi: '',
  articulosObjetos: '',
  calleHecho: '',
  numeroHecho: '',
  coloniaHecho: '',
  latitudHecho:'',
  longitudHecho:'',
  sectorHecho: '',
  rtResponsable: '',
  turnoResponsable: '',
  crpUnidad: '',

  // ===========================
  // PASO 6 - AFECTADO
  // ===========================
  nombreAfectado: '',
  telefonoAfectado: '',
  calleAfectado: '',
  numeroAfectado: '',
  coloniaAfectado: '',
  marcaVehiculo: '',
  submarcaVehiculo: '',
  tipoVehiculo: '',
  colorVehiculo:'',
  placasVehiculo: '',
  estadoVehiculo:'',
  nivVehiculo:'',
  motorVehiculo:'',
  modeloVehiculo: '',
  apNuc: '',
  fuero: '',
  agenteAprehensor: '',
});

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  return { step, formData, setFormData, handleChange, handleNext, handleBack, loading, setLoading };
}