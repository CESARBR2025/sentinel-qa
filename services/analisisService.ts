// services/analisisService.ts
export const analisisService = {
  async getReportesRondin() {
    const response = await fetch("/api/analisis/reportes-campo", {
      cache: "no-store", // Para que siempre traiga datos frescos
    });

    if (!response.ok) {
  const error = await response.json();
  console.error("ERROR API:", error);
  throw new Error(error.error || error.message || JSON.stringify(error));
}

    const data = await response.json();
    return data; // Esto debe ser el array directo
  },
  async getPrellenado(id: string) {
    const response = await fetch(`/api/analisis/prellenado/${id}`);
    return await response.json();
  }
};
