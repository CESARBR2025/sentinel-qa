/* eslint-disable @typescript-eslint/no-explicit-any */
import pptxgen from "pptxgenjs";

export const generateDetenidoPPT = async (formData: any, fotos: any) => {
  const pptx = new pptxgen();

  // 1. DEFINIR Y CONFIGURAR LAYOUT VERTICAL
  pptx.defineLayout({ name: 'CARTA_VERTICAL', width: 8.5, height: 11 });
  pptx.layout = 'CARTA_VERTICAL';

  const slide = pptx.addSlide();

  // COLORES
  const MAGENTA = "800080"; 
  const GREY_BG = "E2E8F0";
  const RED = "FF0000";
  const BLACK = "000000";
  const WHITE = "FFFFFF";

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // --- ENCABEZADO ---
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.8, y: 0.4, w: 4.5, h: 0.6,
    fill: { color: GREY_BG },
    line: { color: MAGENTA, width: 1.5 }
  });
  slide.addText(formData.nombreDetenido?.toUpperCase() || "NOMBRE NO REGISTRADO", {
    x: 1.8, y: 0.45, w: 4.5, align: "center", fontSize: 14, bold: true, color: BLACK
  });
  slide.addText("NOMBRE COMPLETO", {
    x: 1.8, y: 0.8, w: 4.5, align: "center", fontSize: 7, color: BLACK
  });

  if (formData.alias) {
    slide.addText(`APODO: ${formData.alias.toUpperCase()}`, {
      x: 5.3, y: 0.45, w: 1.5, fontSize: 8, italic: true, color: BLACK
    });
  }

  slide.addText(formData.delito?.toUpperCase() || "DELITO NO ESPECIFICADO", {
    x: 0, y: 1.1, w: "100%", align: "center", fontSize: 12, bold: true, color: BLACK
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 6.8, y: 0.4, w: 1.2, h: 0.6,
    line: { color: MAGENTA, width: 1.5 }
  });
  slide.addText("FOLIO", {
    x: 6.8, y: 0.42, w: 1.2, align: "center", fontSize: 9, bold: true
  });
  slide.addText(formData.folio || "000", {
    x: 6.8, y: 0.6, w: 1.2, align: "center", fontSize: 14, bold: true, color: RED
  });

  // --- FOTOGRAFÍAS ---
  if (fotos.fotoFrontal) {
    const imgBase64 = await fileToBase64(fotos.fotoFrontal);
    slide.addImage({ 
        data: imgBase64, x: 0.8, y: 1.5, w: 3.2, h: 3.2, 
        sizing: { type: 'contain', w: 3.2, h: 3.2 } 
    });
  }

  if (fotos.fotoObjetos) {
    const imgObjBase64 = await fileToBase64(fotos.fotoObjetos);
    slide.addImage({ 
        data: imgObjBase64, x: 4.5, y: 1.5, w: 3.2, h: 3.2, 
        sizing: { type: 'contain', w: 3.2, h: 3.2 } 
    });
  }

  // --- SECCIÓN 1: DATOS GENERALES (Cambiado size por pt) ---
  slide.addText("DATOS GENERALES DETENIDO", { x: 0, y: 4.9, w: "100%", align: "center", fontSize: 10, bold: true, color: BLACK });

  slide.addTable([
    [
      { text: `FEC. NAC: ${formData.fechaNacimiento || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `GÉNERO: ${formData.genero || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `ORIGINARIO: ${formData.origen || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `ESTADO CIVIL: ${formData.estadoCivil || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `ESCOLARIDAD: ${formData.escolaridad || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `OCUPACIÓN: ${formData.ocupacion || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `DOMICILIO: ${formData.domicilio || ""}`, options: { colspan: 2, border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `RASGOS PARTICULARES: ${formData.rasgosParticulares || ""}`, options: { colspan: 2, border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ]
  ], { x: 0.8, y: 5.2, w: 6.9, fontSize: 9, color: BLACK });

  // --- SECCIÓN 2: EVENTO DELICTIVO (Cambiado size por pt) ---
  slide.addText("EVENTO DELICTIVO", { x: 0, y: 6.9, w: "100%", align: "center", fontSize: 10, bold: true, color: BLACK });

  slide.addTable([
    [
      { text: `FECHA Y HORA: ${formData.fechaHora || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `RND: ${formData.rnd || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `EXPEDIENTE: ${formData.expediente || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `LUGAR DEL EVENTO: ${formData.lugarEvento || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `LUGAR DE DETENCIÓN: ${formData.lugarDetencion || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `IPH: ${formData.iph || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ],
    [
      { text: `NEXOS DELICTIVOS: ${formData.nexosDelictivos || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `ZONA DE OPERACIÓN: ${formData.zonaOperacion || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: `PUESTA A DISPOSICIÓN: ${formData.puestaDisposicion || ""}`, options: { border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ]
  ], { x: 0.8, y: 7.2, w: 6.9, fontSize: 8, color: BLACK });

  // --- SECCIÓN 3: ANTECEDENTES ---
  slide.addTable([
    [
      { text: "DELITOS ( ANTECEDENTES )", options: { fill: { color: GREY_BG }, align: "center", bold: true, border: { type: 'solid', color: MAGENTA, pt: 1 } } },
      { text: "FALTAS ADMINISTRATIVAS ( ANTECEDENTES )", options: { fill: { color: GREY_BG }, align: "center", bold: true, border: { type: 'solid', color: MAGENTA, pt: 1 } } }
    ]
  ], { x: 0.8, y: 8.5, w: 6.9, fontSize: 9 });

  slide.addTable([
    [
      { 
        text: formData.antecedentes || "Sin antecedentes registrados", 
        options: { align: "left", valign: "top", border: { type: 'solid', color: MAGENTA, pt: 1 }, fill: { color: "555555" }, color: WHITE } 
      },
      { 
        text: formData.faltasAdmin || "Sin faltas administrativas", 
        options: { align: "left", valign: "top", border: { type: 'solid', color: MAGENTA, pt: 1 }, fill: { color: "555555" }, color: WHITE } 
      }
    ]
  ], { x: 0.8, y: 8.76, w: 6.9, fontSize: 8, rowH: 1.3 });

  pptx.writeFile({ fileName: `FICHA_TACTICA_${formData.folio || "DETENIDO"}.pptx` });
};