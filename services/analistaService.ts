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
  }
};