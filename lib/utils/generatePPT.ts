/* eslint-disable @typescript-eslint/no-explicit-any */
import pptxgen from "pptxgenjs";

export const generateDetenidoPPT = async (formData: any, fotos: any) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 pulgadas

  const slide = pptx.addSlide();
  const MAGENTA = "B042B4"; 
  const GRAY_BG = "D9D9D9"; 

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // --- 1. ENCABEZADO ---
  // Caja de Nombre
  slide.addShape(pptx.ShapeType.rect, { x: 2.0, y: 0.2, w: 7.0, h: 0.5, fill: { color: GRAY_BG }, line: { color: MAGENTA, width: 1 } });
  slide.addText(formData.nombreDetenido || "NOMBRE NO REGISTRADO", { x: 2.0, y: 0.25, w: 7.0, align: "center", fontSize: 14, bold: true });
  slide.addText("NOMBRE COMPLETO", { x: 2.0, y: 0.55, w: 7.0, align: "center", fontSize: 7 });

  // Apodo
  slide.addText(`APODO: ${formData.alias || ""}`, { x: 7.5, y: 0.35, w: 1.5, fontSize: 8, italic: true });

  // Caja de Folio
  slide.addShape(pptx.ShapeType.rect, { x: 9.2, y: 0.2, w: 1.5, h: 0.5, line: { color: MAGENTA, width: 1 } });
  slide.addText("FOLIO", { x: 9.2, y: 0.22, w: 1.5, align: "center", fontSize: 9, bold: true, fill: { color: GRAY_BG } });
  slide.addText(formData.folio || "000", { x: 9.2, y: 0.45, w: 1.5, align: "center", fontSize: 12, bold: true, color: "FF0000" });

  // Título del Delito
  slide.addText(formData.delito || "DELITO NO ESPECIFICADO", { x: 0, y: 0.75, w: "100%", align: "center", fontSize: 11, bold: true });

  // --- 2. FOTOGRAFÍAS (Ajustadas en tamaño) ---
  if (fotos.fotoFrontal) {
    const imgDetenido = await fileToBase64(fotos.fotoFrontal);
    slide.addImage({ data: imgDetenido, x: 2.1, y: 1.0, w: 2.8, h: 3.5 });
  }

  if (fotos.fotoObjetos) {
    const imgEvidencia = await fileToBase64(fotos.fotoObjetos);
    slide.addImage({ data: imgEvidencia, x: 5.2, y: 1.0, w: 4.5, h: 2.5 });
  }

  // --- 3. TABLA: DATOS GENERALES ---
  slide.addText("DATOS GENERALES DETENIDO", { x: 0.5, y: 4.6, w: 12.3, align: "center", fontSize: 9, bold: true, fill: { color: GRAY_BG } });
  
  slide.addTable([
    [
      { text: `FEC. NAC: ${formData.fechaNacimiento || ""}`, options: { fill: { color: "FFFFFF" } } },
      { text: `GÉNERO: ${formData.genero || ""}`, options: { fill: { color: "FFFFFF" } } }
    ],
    [
      { text: `ORIGINARIO: ${formData.origen || ""}` },
      { text: `ESTADO CIVIL: ${formData.estadoCivil || ""}` }
    ],
    [
      { text: `ESCOLARIDAD: ${formData.escolaridad || ""}` },
      { text: `OCUPACIÓN: ${formData.ocupacion || ""}` }
    ]
  ], { x: 0.5, y: 4.85, w: 12.3, colW: [6.15, 6.15], rowH: 0.25, fontSize: 8, border: { type: "solid", color: MAGENTA, pt: 0.5 } });

  slide.addTable([
    [{ text: `DOMICILIO: ${formData.domicilio || ""}` }],
    [{ text: `RASGOS PARTICULARES: ${formData.rasgosParticulares || ""}` }]
  ], { x: 0.5, y: 5.6, w: 12.3, rowH: 0.25, fontSize: 8, border: { type: "solid", color: MAGENTA, pt: 0.5 } });

  // --- 4. TABLA: EVENTO DELICTIVO ---
  slide.addText("EVENTO DELICTIVO", { x: 0.5, y: 6.15, w: 12.3, align: "center", fontSize: 9, bold: true, fill: { color: GRAY_BG } });

  slide.addTable([
    [
        { text: `FECHA Y HORA: ${formData.fechaHora || ""}` }, 
        { text: `RND: ${formData.rnd || ""}` }, 
        { text: `EXPEDIENTE: ${formData.expediente || ""}` }
    ],
    [
        { text: `LUGAR DEL EVENTO: ${formData.lugarEvento || ""}` }, 
        { text: `LUGAR DE DETENCIÓN: ${formData.lugarDetencion || ""}` }, 
        { text: `IPH: ${formData.iph || ""}` }
    ],
    [
        { text: `NEXOS DELICTIVOS: ${formData.nexosDelictivos || ""}` }, 
        { text: `ZONA DE OPERACIÓN: ${formData.zonaOperacion || ""}` }, 
        { text: `PUESTA A DISPOSICIÓN: ${formData.puestaDisposicion || ""}` }
    ]
  ], { x: 0.5, y: 6.4, w: 12.3, colW: [4.1, 4.1, 4.1], rowH: 0.3, fontSize: 7, border: { type: "solid", color: MAGENTA, pt: 0.5 } });

  // --- 5. ANTECEDENTES (Ajustado para que no se salga de la hoja) ---
  slide.addTable([
    [
      { text: "DELITOS ( ANTECEDENTES )", options: { fill: { color: GRAY_BG }, bold: true, align: "center" } },
      { text: "FALTAS ADMINISTRATIVAS ( ANTECEDENTES )", options: { fill: { color: GRAY_BG }, bold: true, align: "center" } }
    ],
    [
      { text: formData.antecedentes || "Sin antecedentes", options: { valign: "top" } },
      { text: formData.faltasAdmin || "Sin faltas", options: { valign: "top" } }
    ]
  ], { x: 0.5, y: 7.3, w: 12.3, rowH: [0.2, 1.0], fontSize: 7, border: { type: "solid", color: MAGENTA, pt: 0.5 } });

  // Guardar
  pptx.writeFile({ fileName: `FICHA_TACTICA_${formData.folio || "DETENIDO"}.pptx` });
};