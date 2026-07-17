import { CrearInfraccionDTO } from "./types";
import { InfraccionesRepository } from "./repository";
import { mapCrearInfraccionToDB, mapInfraccionDetalle } from "./mapper";
import { iaDisponible, llmClient, llmModel } from "@/lib/ai/client";
import { ArticulosService } from "@/features/via/legalidad/service";
import { ResultadoBusquedaMotivo } from "@/features/via/legalidad/types";

export interface DatosExtraidosDeNarrativa {
  ciudadanoPresente: boolean | null;
  esCiudadanoTitular: boolean | null;
  resultadosMotivo: ResultadoBusquedaMotivo[];
  narrativaSugerida: string;
}

const EXTRACCION_SYSTEM_PROMPT = `Eres un asistente que analiza el dictado de un oficial de tránsito al iniciar una boleta de infracción.

Reglas estrictas:
- Extrae SOLO lo que el oficial dijo explícitamente. Si algo no se menciona, usa null — nunca lo infieras ni lo asumas.
- "ciudadanoPresente": true si el oficial indica que el conductor/ciudadano está presente en el lugar, false si indica que está ausente, null si no lo menciona.
- "esCiudadanoTitular": true si indica que el ciudadano es el propietario/titular del vehículo, false si indica que no lo es, null si no lo menciona.
- "motivo": la frase o frases (tal como se dijeron, sin reformular a lenguaje legal) que describen por qué se detiene al conductor. Cadena vacía si no se menciona ningún motivo.
- Responde ÚNICAMENTE un objeto JSON: {"ciudadanoPresente": true|false|null, "esCiudadanoTitular": true|false|null, "motivo": "..."}. Sin texto adicional.`;

const capitalizar = (texto: string) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

export interface DatosParaNarrativa {
  motivoDetectado?: string | null;
  articuloNumero?: string | null;
  articuloDescripcion?: string | null;
  fraccionNumero?: string | null;
  fraccionDescripcion?: string | null;
  marca?: string | null;
  modelo?: string | null;
  color?: string | null;
  placa?: string | null;
  anio?: string | null;
  calle?: string | null;
  numero?: string | null;
  colonia?: string | null;
  municipio?: string | null;
  estado?: string | null;
}

const NARRATIVA_SYSTEM_PROMPT = `Eres un asistente que redacta el párrafo de hechos de una boleta de infracción de tránsito, para uso de un oficial de policía.

Reglas estrictas:
- Usa ÚNICAMENTE los datos que se te proporcionan. Nunca inventes hora exacta, clima, comportamiento del conductor u otro dato que no esté explícitamente en la información recibida.
- Redacta en español, tercera persona, tono neutro y objetivo (lenguaje de acta administrativa, no narrativo/literario).
- Un solo párrafo, entre 3 y 5 oraciones.
- Si falta algún dato (ej. no hay ubicación), simplemente omítelo — no lo sustituyas ni lo inventes.
- Responde ÚNICAMENTE el párrafo de texto, sin comillas, sin JSON, sin encabezados.`;

const BASE36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomBase36Char = () => {
  const index = Math.floor(Math.random() * BASE36_CHARS.length);
  return BASE36_CHARS[index];
};

const rellenarBase36 = (value: string, totalLength: number) => {
  if (value.length >= totalLength) return value;
  const faltantes = totalLength - value.length;
  let prefix = "";
  for (let i = 0; i < faltantes; i++) {
    prefix += randomBase36Char();
  }
  return prefix + value;
};

export const generarFolioInfraccion = (seq: number) => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const base36 = seq.toString(36).toUpperCase();
  const secuencia = rellenarBase36(base36, 6);
  return `SSPM/INF/${year}${month}${day}/${secuencia}`;
};

export class InfraccionesService {
  static async registrarNuevaInfraccionSV(payload: CrearInfraccionDTO) {
    console.log("entro");
    try {
      const seqValor = await InfraccionesRepository.obtenerSiguienteSecuencia();
      console.log(seqValor);
      const folio = generarFolioInfraccion(seqValor);
      console.log(folio);
      const data = mapCrearInfraccionToDB(payload, folio, seqValor);
      console.log(data);
      const infraccion =
        await InfraccionesRepository.registarNuevaInfraccionRP(data);
      return {
        id: infraccion.id,
        folio: infraccion.folio,
        clasificacion: infraccion.clasificacion,
        concepto: infraccion.concept_id,
        pin_acceso: infraccion.pin_acceso,
      };
    } catch (error) {
      console.error("[SERVICE][INFRACCIONES][CREAR]", error);
      if (error && typeof error === "object") {
        console.error("DETAIL:", (error as any).detail);
        console.error("MESSAGE:", (error as any).message);
        console.error("CODE:", (error as any).code);
      }
      throw error;
    }
  }

  static async obtenerPorId(id: string) {
    const data =
      await InfraccionesRepository.obtenerDatosInfraccionCiudadanoRP(id);
    if (!data) throw new Error("Infracción no encontrada");
    return mapInfraccionDetalle(data);
  }

  /**
   * Redacta el párrafo de hechos de la boleta a partir de los datos ya
   * capturados en el wizard. Nunca lanza: cualquier error retorna "" para
   * que el paso de confirmación degrade a un textarea vacío/editable.
   */
  static async generarNarrativa(datos: DatosParaNarrativa): Promise<string> {
    if (!iaDisponible || !llmClient) return "";

    const hechos: string[] = [];
    if (datos.motivoDetectado) hechos.push(`Motivo detectado: ${datos.motivoDetectado}`);
    if (datos.articuloNumero || datos.fraccionNumero) {
      hechos.push(
        `Fundamento legal: Art. ${datos.articuloNumero ?? "?"}, Fracc. ${datos.fraccionNumero ?? "?"} — ${datos.fraccionDescripcion ?? datos.articuloDescripcion ?? ""}`,
      );
    }
    if (datos.marca || datos.modelo || datos.color || datos.placa) {
      hechos.push(
        `Vehículo: ${[datos.marca, datos.modelo, datos.anio, datos.color].filter(Boolean).join(" ")}${datos.placa ? `, placa ${datos.placa}` : ""}`,
      );
    }
    const direccion = [datos.calle && `${datos.calle} ${datos.numero ?? ""}`.trim(), datos.colonia, datos.municipio, datos.estado]
      .filter(Boolean)
      .join(", ");
    if (direccion) hechos.push(`Ubicación: ${direccion}`);

    if (hechos.length === 0) return "";

    try {
      const respuesta = await llmClient.chat.completions.create(
        {
          model: llmModel,
          messages: [
            { role: "system", content: NARRATIVA_SYSTEM_PROMPT },
            { role: "user", content: hechos.join("\n") },
          ],
          temperature: 0.2,
        },
        { signal: AbortSignal.timeout(8000) },
      );

      return respuesta.choices[0]?.message?.content?.trim() ?? "";
    } catch (error) {
      console.error("❌ Error generando narrativa de hechos:", error instanceof Error ? error.message : error);
      return "";
    }
  }

  /**
   * Analiza un dictado único del oficial (modo "Dictar todo") y separa
   * presencia/titularidad del ciudadano de la frase-motivo. El fundamento
   * legal se resuelve reusando ArticulosService.buscarPorDescripcion —
   * la misma búsqueda anclada al catálogo real de Fase 1, sin duplicar
   * lógica de validación. Nunca lanza: cualquier error retorna un
   * resultado vacío/editable a mano.
   */
  static async extraerDeNarrativa(transcripcion: string): Promise<DatosExtraidosDeNarrativa> {
    const texto = transcripcion.trim();
    const vacio: DatosExtraidosDeNarrativa = {
      ciudadanoPresente: null,
      esCiudadanoTitular: null,
      resultadosMotivo: [],
      narrativaSugerida: capitalizar(texto),
    };

    if (!texto || !iaDisponible || !llmClient) return vacio;

    try {
      const respuesta = await llmClient.chat.completions.create(
        {
          model: llmModel,
          messages: [
            { role: "system", content: EXTRACCION_SYSTEM_PROMPT },
            { role: "user", content: texto },
          ],
          response_format: { type: "json_object" },
          temperature: 0,
        },
        { signal: AbortSignal.timeout(10000) },
      );

      const contenido = respuesta.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(contenido);

      const motivo = typeof parsed.motivo === "string" ? parsed.motivo.trim() : "";
      const resultadosMotivo = motivo
        ? await ArticulosService.buscarPorDescripcion(motivo)
        : [];

      return {
        ciudadanoPresente: typeof parsed.ciudadanoPresente === "boolean" ? parsed.ciudadanoPresente : null,
        esCiudadanoTitular: typeof parsed.esCiudadanoTitular === "boolean" ? parsed.esCiudadanoTitular : null,
        resultadosMotivo,
        narrativaSugerida: vacio.narrativaSugerida,
      };
    } catch (error) {
      console.error("❌ Error extrayendo datos del dictado:", error instanceof Error ? error.message : error);
      return vacio;
    }
  }
}

export const sanitizeCrearInfraccionPayload = (
  body: any,
  oficialId: string,
): CrearInfraccionDTO => {
  const payload: CrearInfraccionDTO = {
    dependenciaRemisora: body.dependenciaRemisora,
    correoInfractor: body.correoInfractor,
    oficialId,
    articuloId: body.articuloId,
    fraccionId: body.fraccionId,
    ciudadanoPresente: body.estaCiudadanoPresente,
    esTitular: body.esCiudadanoTitular,
    presentaIne: body.presentaIne,
    curpInfractor: body.curpInfractor?.trim()?.toUpperCase() || null,
    nombreInfractor: body.nombreInfractor?.trim()?.toUpperCase() || null,
    apellidoPaternoInfractor:
      body.apPaternoInfractor?.trim()?.toUpperCase() || null,
    apellidoMaternoInfractor:
      body.apMaternoInfractor?.trim()?.toUpperCase() || null,
    marca: body.marca?.trim()?.toUpperCase() || null,
    modelo: body.modelo?.trim()?.toUpperCase() || null,
    color: (body.otroColor || body.color)?.trim()?.toUpperCase() || null,
    placa: body.placa?.trim()?.toUpperCase(),
    noSerieVehiculo: body.noSerie?.trim()?.toUpperCase() || null,
    tipoVehiculo: body.tipoVehiculo.trim().toUpperCase(),
    anioVehiculo: body.anio.trim().toUpperCase(),
    latitud: body.latitud ?? null,
    longitud: body.longitud ?? null,
    codigoPostal: body.codigoPostal?.trim() || null,
    colonia: body.colonia?.trim()?.toUpperCase() || null,
    calle: body.calle?.trim()?.toUpperCase() || null,
    numero: body.numero?.trim()?.toUpperCase() || null,
    municipio: body.municipio?.trim()?.toUpperCase() || null,
    estado: body.estado?.trim()?.toUpperCase() || null,
    tipoGarantia: body.garantiaSeleccionada || null,
    garantiaEntregada: !!body.garantiaSeleccionada,
    motivoRetencion: body.motivoRetencionVehiculo || null,
    montoTotal: Number(body.fraccionMonto || 0),
    aplicaDescuentoInapam: !!(
      body.esCiudadanoAdultoMayor === true && body.presentaInapam === true
    ),
    descuentoAplicado: body.descuentoAplicado,
    fechaLimiteDescuento: body.fechaLimiteDescuento,
    pagoAlMomento: body.pagoAlMomento ?? false,
    montoFinal:
      Math.round(
        Number(body.fraccionMonto || 0) *
          (1 - Number(body.descuentoAplicado || 0) / 100) *
          100,
      ) / 100,
    estatus:
      body.estaCiudadanoPresente === false ? "REGISTRADA" : "PENDIENTE_PAGO",
    estatusDependencia:
      body.estaCiudadanoPresente === false
        ? "PENDIENTE_DATOS_INFRACTOR"
        : "PENDIENTE_PAGO_INSTANTE",
    gruaId: body.gruaInvolucrada || null,
    patrullaId: null,
    placaPatrulla: null,
    narrativaHechos: body.narrativaHechos?.trim() || null,
  };

  if (body.garantiaSeleccionada === "VEHICULO") {
    payload.estatus = "REGISTRADA";
    if (body.motivoRetencionVehiculo === "ACCIDENTE") {
      payload.estatusDependencia = "RETENIDO_POR_ACCIDENTE_PENDIENTE_OFICIO";
    } else if (body.motivoRetencionVehiculo === "DELITO") {
      payload.estatusDependencia = "RETENIDO_POR_DELITO_PENDIENTE_OFICIO";
    } else {
      payload.estatusDependencia = "VEHICULO_EN_CORRALON";
    }
  }

  return payload;
};
