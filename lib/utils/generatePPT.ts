/* eslint-disable @typescript-eslint/no-explicit-any */
import pptxgen from "pptxgenjs";

export const generateDetenidoPPT = async (formData: any, fotos: any) => {
  const pptx = new pptxgen();

  // 1. Configuración de la Presentación
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineSlideMaster({
    title: "SENTINEL_MASTER",
    background: { color: "F8FAFC" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.6, fill: { color: "0F172A" } } },
      { text: { text: "SISTEMA SENTINEL - INFORME TÁCTICO", options: { x: 0.4, y: 0.15, color: "FFFFFF", fontSize: 14, fontFace: "Arial" } } },
    ],
  });

  // Función para convertir File a Base64 (necesario para PPTX)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // --- DIAPOSITIVA 1: FICHA DE IDENTIFICACIÓN ---
  const slide1 = pptx.addSlide({ masterName: "SENTINEL_MASTER" });
  
  // Foto Frontal
  if (fotos.fotoFrontal) {
    const imgBase64 = await fileToBase64(fotos.fotoFrontal);
    slide1.addImage({ data: imgBase64, x: 0.5, y: 0.8, w: 3.5, h: 4.5 });
  }

  // Datos Personales
  slide1.addText("DATOS DEL DETENIDO", { x: 4.2, y: 0.8, fontSize: 20, bold: true, color: "2563EB" });
  slide1.addTable([
    [{ text: "NOMBRE:", options: { bold: true } }, formData.nombreDetenido],
    [{ text: "FOLIO:", options: { bold: true } }, formData.folio],
    [{ text: "FECHA NAC:", options: { bold: true } }, formData.fechaNacimiento],
    [{ text: "GÉNERO:", options: { bold: true } }, formData.genero],
    [{ text: "OCUPACIÓN:", options: { bold: true } }, formData.ocupacion],
    [{ text: "DOMICILIO:", options: { bold: true } }, formData.domicilio],
  ], { x: 4.2, y: 1.3, w: 8, fontSize: 12, border: { type: "none" }, fill: { color: "FFFFFF" } });

  // --- DIAPOSITIVA 2: EVIDENCIA Y OPERATIVOS ---
  const slide2 = pptx.addSlide({ masterName: "SENTINEL_MASTER" });
  
  slide2.addText("EVIDENCIA Y DATOS OPERATIVOS", { x: 0.5, y: 0.8, fontSize: 20, bold: true, color: "2563EB" });

  // Foto de Objetos/Armas
  if (fotos.fotoObjetos) {
    const imgObjBase64 = await fileToBase64(fotos.fotoObjetos);
    slide2.addImage({ data: imgObjBase64, x: 0.5, y: 1.3, w: 5, h: 3.5 });
  }

  // Tabla Operativa
  slide2.addTable([
    [{ text: "FOLIO RND:", options: { bold: true } }, formData.rnd],
    [{ text: "FOLIO IPH:", options: { bold: true } }, formData.iph],
    [{ text: "UBICACIÓN EVENTO:", options: { bold: true } }, formData.lugarEvento],
    [{ text: "PUESTA A DISPOSICIÓN:", options: { bold: true } }, formData.puestaDisposicion],
  ], { x: 6, y: 1.3, w: 6, fontSize: 11 });

  // Modus Operandi
  slide2.addText("MODUS OPERANDI:", { x: 0.5, y: 5, fontSize: 12, bold: true });
  slide2.addText(formData.modusOperandi || "No registrado", { x: 0.5, y: 5.3, w: 12, fontSize: 11, italic: true });

  // --- DIAPOSITIVA 3: INTELIGENCIA ---
  const slide3 = pptx.addSlide({ masterName: "SENTINEL_MASTER" });
  slide3.addText("ANTECEDENTES Y NEXOS", { x: 0.5, y: 0.8, fontSize: 20, bold: true, color: "2563EB" });
  
  slide3.addText("ANTECEDENTES DELICTIVOS:", { x: 0.5, y: 1.5, bold: true });
  slide3.addText(formData.antecedentes || "Sin antecedentes registrados", { x: 0.5, y: 1.8, w: 12, h: 1.5, fontSize: 11, fill: { color: "F1F5F9" } });

  slide3.addText("NEXOS Y BANDAS:", { x: 0.5, y: 3.5, bold: true });
  slide3.addText(formData.nexosDelictivos || "No se identifican nexos", { x: 0.5, y: 3.8, w: 12, h: 1.5, fontSize: 11, fill: { color: "F1F5F9" } });

  // 4. Guardar el archivo
  pptx.writeFile({ fileName: `INFORME_${formData.folio || "DETENIDO"}.pptx` });
};