/* eslint-disable @typescript-eslint/no-explicit-any */
// services/registroDetenidoService.ts

export const registroDetenidoService = {
  async guardarFichaCompleta(data: any, fotos: any) {
    const fd = new FormData();

    // 1. Metemos todos los campos de texto al FormData
    Object.keys(data).forEach(key => {
      fd.append(key, data[key]);
    });

    // 2. Metemos las fotos si existen
    if (fotos.fotoFrontal) fd.append('fotoFrontal', fotos.fotoFrontal);
    if (fotos.fotoObjetos) fd.append('fotoObjetos', fotos.fotoObjetos);

    const response = await fetch('/api/registro-detenidos/registrar', {
      method: 'POST',
      body: fd, // Al enviar FormData, el navegador pone los headers correctos automáticamente
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al guardar la ficha');
    }

    return response.json();
  }
};