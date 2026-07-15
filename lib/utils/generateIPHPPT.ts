/* eslint-disable @typescript-eslint/no-explicit-any */
import pptxgen from "pptxgenjs";

export const generateIPHPPT = (data: any) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";

  // --- MASTER SLIDE (Estilo Sentinel) ---
  pptx.defineSlideMaster({
    title: "SENTINEL_REPORT",
    background: { color: "F8FAFC" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: "0F172A" } } },
      { text: { text: `INFORME POLICIAL HOMOLOGADO - FOLIO: ${data.folioIPH}`, options: { x: 0.3, y: 0.1, color: "FFFFFF", fontSize: 12, fontFace: "Arial Narrow" } } }
    ]
  });

  // --- SLIDE 1: DATOS DEL DETENIDO Y ARRESTO ---
  const s1 = pptx.addSlide({ masterName: "SENTINEL_REPORT" });
  s1.addText("01. IDENTIFICACIÓN Y DETENCIÓN", { x: 0.5, y: 0.7, fontSize: 20, bold: true, color: "2563EB" });
  
  s1.addTable([
    [{ text: "ALIAS:", options: { bold: true } }, data.alias || "N/A", { text: "GÉNERO:", options: { bold: true } }, data.genero],
    [{ text: "EDAD:", options: { bold: true } }, `${data.edad} AÑOS`, { text: "ORIGEN:", options: { bold: true } }, data.ciudadOrigen],
    [{ text: "DOMICILIO:", options: { bold: true } }, `${data.calleDetenido}, ${data.coloniaDetenido}`, "", ""]
  ], { x: 0.5, y: 1.3, w: 12, fontSize: 12, border: { type: "solid", color: "E2E8F0" } });

  s1.addText("LUGAR DE ARRESTO:", { x: 0.5, y: 3.5, bold: true, fontSize: 12 });
  s1.addText(`${data.calleArresto}, ${data.coloniaArresto} (SECTOR: ${data.sectorArresto})`, { x: 0.5, y: 3.8, fontSize: 11 });

  // --- SLIDE 2: USO DE LA FUERZA Y TIEMPOS ---
  const s2 = pptx.addSlide({ masterName: "SENTINEL_REPORT" });
  s2.addText("02. PROTOCOLO Y CRONOLOGÍA", { x: 0.5, y: 0.7, fontSize: 20, bold: true, color: "2563EB" });

  const fuerza = [
    data.presencia && "PRESENCIA", data.verbalizacion && "VERBALIZACIÓN", 
    data.controlFisico && "CONTROL FÍSICO", data.fuerzaLetal && "FUERZA LETAL"
  ].filter(Boolean).join(" > ");

  s2.addText("NIVELES DE FUERZA APLICADOS:", { x: 0.5, y: 1.3, bold: true });
  s2.addText(fuerza || "SIN REGISTRO", { x: 0.5, y: 1.6, w: 12, color: "DC2626", fontSize: 14, bold: true });

  s2.addTable([
    ["HORA REPORTE", "INICIO EVENTO", "FINAL EVENTO", "PROMEDIO"],
    [data.horaReporte, data.horaInicioEvento, data.horaFinalEvento, data.horaPromedio]
  ], { x: 0.5, y: 2.5, w: 12, fontSize: 12, align: "center" });

  // --- SLIDE 3: DETALLES DEL HECHO ---
  const s3 = pptx.addSlide({ masterName: "SENTINEL_REPORT" });
  s3.addText("03. NARRATIVA DEL DELITO", { x: 0.5, y: 0.7, fontSize: 20, bold: true, color: "2563EB" });
  s3.addText(`DELITO: ${data.delito}`, { x: 0.5, y: 1.3, fontSize: 16, bold: true });
  
  s3.addText("MODUS OPERANDI:", { x: 0.5, y: 2, bold: true });
  s3.addText(data.modusOperandi || "No descrito", { x: 0.5, y: 2.3, w: 12, h: 1, fontSize: 11, italic: true, fill: { color: "F1F5F9" } });

  s3.addText("OBJETOS ASEGURADOS:", { x: 0.5, y: 3.5, bold: true });
  s3.addText(data.articulosObjetos || "Ninguno", { x: 0.5, y: 3.8, w: 12, h: 1, fontSize: 11 });

  // --- SLIDE 4: CIERRE Y VEHÍCULO ---
  const s4 = pptx.addSlide({ masterName: "SENTINEL_REPORT" });
  s4.addText("04. CIERRE Y ASEGURAMIENTOS", { x: 0.5, y: 0.7, fontSize: 20, bold: true, color: "2563EB" });

  if (data.marcaVehiculo) {
    s4.addText("VEHÍCULO INVOLUCRADO:", { x: 0.5, y: 1.3, bold: true });
    s4.addText(`${data.marcaVehiculo} ${data.submarcaVehiculo} - PLACAS: ${data.placasVehiculo}`, { x: 0.5, y: 1.6, fontSize: 12 });
  }

  s4.addTable([
    [{ text: "AFECTADO:", options: { bold: true } }, data.nombreAfectado],
    [{ text: "AP / NUC:", options: { bold: true } }, data.apNuc],
    [{ text: "AGENTE:", options: { bold: true } }, data.agenteAprehensor]
  ], { x: 0.5, y: 3, w: 10, fontSize: 12 });

  pptx.writeFile({ fileName: `IPH_${data.folioIPH}.pptx` });
};