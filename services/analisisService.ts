// services/analisisService.ts
export const analisisService = {
  async getReportesRondin() {
    const response = await fetch("/api/analisis/reportes-campo", {
      cache: "no-store", // Para que siempre traiga datos frescos
    });

    if (!response.ok) {
      throw new Error("Error en el servidor");
    }

    const data = await response.json();
    return data; // Esto debe ser el array directo
  },
  async getPrellenado(id: string) {
    const response = await fetch(`/api/analisis/prellenado/${id}`);
    return await response.json();
  }
};
