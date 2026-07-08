import jsPDF from 'jspdf'

function formatearFecha(): string {
  const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
  const hoy = new Date()
  return `${hoy.getDate()} DE ${meses[hoy.getMonth()]} DE ${hoy.getFullYear()}`
}

function formatearOficio(noOficio: string, anio: number): string {
  return `${noOficio}/${anio}`
}

async function loadImageAsBase64(path: string): Promise<string> {
  const response = await fetch(path)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function drawWatermark(doc: jsPDF, base64: string): void {
  try {
    doc.addImage(base64, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), undefined, 'NONE', 0)
  } catch {
    console.warn('Error al dibujar marca de agua')
  }
}

function parrafoMixtoConWrap(
  doc: jsPDF,
  parts: { text: string; bold: boolean }[],
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  lineHeight: number,
): void {
  let currentX = x
  let currentY = y
  doc.setFontSize(fontSize)

  for (const part of parts) {
    doc.setFont('helvetica', part.bold ? 'bold' : 'normal')
    const words = part.text.split(' ')
    for (const word of words) {
      const wordWidth = doc.getTextWidth(word + ' ')
      if (currentX + wordWidth > x + maxWidth) {
        currentX = x
        currentY += lineHeight
      }
      doc.text(word + ' ', currentX, currentY)
      currentX += doc.getTextWidth(word + ' ')
    }
  }
}

export async function generarOrdenSalidaVehiculo({ data }: any) {
  console.log("entro");
  console.log(data);
  console.log(generarOrdenSalidaVehiculo);
  const no_externo = data.noExterno ?? " ";

  const motivo = data.motivoRetencion;
  const estadoOrigen = data.estadoOrigen;
  const noSerie = data.noSerie;

  const anio = new Date().getFullYear();
  const fecha = formatearFecha();
  const ciudad = "SAN JUAN DEL RIO, QRO";
  const oficio = formatearOficio(data.noOficio ?? "0000", anio);

  const marca = (data.marca ?? "—").toUpperCase();
  const tipo = (data.tipoVehiculo ?? "—").toUpperCase();
  const modelo = (data.modelo ?? "—").toUpperCase();
  const color = (data.color ?? "—").toUpperCase();
  const placa = (data.placa ?? "—").toUpperCase();

  const director = "CMTE. FRANCISCO JAVIER VERTIZ VELAZQUEZ".toUpperCase();
  const nombreRecibe = `C. ${data.nombreTitular}`.toUpperCase();
  console.log(nombreRecibe);

  const empresaFiscal = data.rfc ? data.empresaFiscal : "TITULAR";

  console.log(empresaFiscal);

  const grua = (
    data.garantiaRetenida === "VEHICULO" ? data.grua! : "Sin Grua"
  ).toUpperCase();

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pw = doc.internal.pageSize.getWidth();

  const mgL = 30.0;
  const mgR = 25.9;
  const anchoUtil = pw - mgL - mgR;

  const FS = 12;
  const FS_SMALL = 10;
  const LH = 6.35;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pw, doc.internal.pageSize.getHeight(), "F");

  try {
    const wmBase64 = await loadImageAsBase64("/marca_agua/header.png");
    await drawWatermark(doc, wmBase64);
  } catch {
    console.warn("Marca de agua no disponible.");
  }

  const lineaMixta = (label: string, valor: string, y: number): void => {
    doc.setFontSize(FS);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(label, mgL, y);
    const lw = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.text(valor, mgL + lw, y);
  };

  const lineaBold = (texto: string, y: number, x = mgL): void => {
    doc.setFontSize(FS);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(texto, x, y);
  };

  lineaMixta("SECCIÓN", ": DIRECCION DE TRANSITO MUNICIPAL", 43.2);
  lineaMixta("DEPARTAMENTO: ", "DE HECHOS DE TRÁNSITO", 49.8);
  lineaMixta("No. OFICIO", `: ${oficio}.`, 55.9);
  lineaMixta("ASUNTO", ": SALIDA DE VEHICULO", 62.5);

  doc.setFontSize(FS);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`${ciudad}, ${fecha}.`, pw - mgR, 72.4, { align: "right" });

  lineaBold("C. ENCARGADO DE GRÚAS", 82.5);
  lineaBold("P R E S E N T E", 100.3);

  doc.setFontSize(FS);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("ORDEN DE SALIDA DE VEHICULO", mgL + anchoUtil / 2, 108.6, {
    align: "center",
  });

  lineaBold(`MARCA: ${marca}`, 119.4);
  lineaBold(`TIPO ${tipo}`, 132.1);
  lineaBold(`MODELO: ${modelo}`, 144.8);
  lineaBold(`COLOR: ${color}`, 157.5);
  lineaBold(
    `PLACA: ${placa} PARA EL ESTADO DE ${estadoOrigen!.toUpperCase()}`,
    170.2,
  );
  lineaBold(`NUMERO DE SERIE: ${noSerie}`, 182.9);

  doc.setTextColor(0, 0, 0);
  parrafoMixtoConWrap(
    doc,
    [
      { text: "EL VEHÍCULO REMITIDO Y DEPOSITADO POR ", bold: false },
      { text: `${motivo} ${no_externo} `, bold: true },
      { text: " .LOCAL DE ENCIERRO GRUAS ", bold: false },
      { text: `${grua}`, bold: true },
    ],
    20,
    195.6,
    180,
    FS,
    LH,
  );

  doc.setFontSize(FS_SMALL);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("RECIBE", mgL + anchoUtil * 0.22, 210.8, { align: "center" });
  doc.text("ENTREGA", mgL + anchoUtil * 0.77, 210.8, { align: "center" });

  doc.setFontSize(FS_SMALL);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const recibeX = mgL + anchoUtil * 0.22;
  doc.text(nombreRecibe, recibeX, 226.1, { align: "center" });
  doc.text(empresaFiscal, recibeX, 232.4, { align: "center" });

  doc.text(director, mgL + anchoUtil * 0.52, 226.1);

  const directorX = mgL + anchoUtil * 0.52;
  const directorW = doc.getTextWidth(director);
  const cargoText = "DIRECTOR DE TRANSITO MUNICIPAL";
  doc.setFontSize(FS_SMALL);
  doc.text(cargoText, directorX + directorW / 2, 232.4, { align: "center" });

  const pdfArrayBuffer = doc.output("arraybuffer");

  return Buffer.from(pdfArrayBuffer);
}
