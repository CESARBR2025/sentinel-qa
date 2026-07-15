/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export function useRegistroDetenido() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- ESTADO PARA CAMPOS DE TEXTO Y SELECTS ---
  const [formData, setFormData] = useState({
    // PASO 1 - IDENTIFICACIÓN
    nombreDetenido: '',
    folio: '',
    fechaNacimiento: '',
    origen: '',
    genero: '',
    escolaridad: '',
    estadoCivil: '',
    ocupacion: '',
    domicilio: '',
    rasgosParticulares: '',
    eventosDelictivos: '',

    // PASO 2 - OPERATIVOS Y LEGALES
    fechaHora: '',
    rnd: '',
    expediente: '',
    lugarEvento: '',
    lugarDetencion: '',
    iph: '',
    nexosDelictivos: '',
    zonaOperacion: '',
    puestaDisposicion: '',
    modusOperandi: '',
    infoAdicional: '',
    antecedentes: '',
    faltasAdmin: '',
  });

  // --- ESTADO PARA ARCHIVOS (FOTOS) ---
  const [fotos, setFotos] = useState({
    fotoFrontal: null as File | null,
    fotoObjetos: null as File | null,
  });

  // --- MANEJADOR DE CAMBIOS EN TEXTO / SELECTS ---
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- MANEJADOR DE CAMBIOS EN ARCHIVOS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFotos((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- NAVEGACIÓN DEL STEPPER ---
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return {
    step,
    setStep,
    formData,
    setFormData,
    fotos,
    setFotos,
    handleTextChange,
    handleChange,
    handleFileChange,
    handleNext,
    handleBack,
    loading,
    setLoading,
  };
}