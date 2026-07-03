/* eslint-disable @typescript-eslint/no-explicit-any */
export const analistaService = {
  async registrarIPH(data: any) {
    const response = await fetch('/api/detenidos/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al guardar el registro IPH');
    return response.json();
  },
     async getListaIPH() {
    const response = await fetch('/api/detenidos/listar', { cache: 'no-store' });
    if (!response.ok) throw new Error('Error en el servidor');
    return response.json();
  },
  // Obtener uno solo con todos los campos para el PPT
  async getDetalleIPH(id: string) {
    const res = await fetch(`/api/detenidos/detalle/${id}`);
    return res.json();
  }
};