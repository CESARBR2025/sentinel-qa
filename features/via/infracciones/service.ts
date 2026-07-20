import { CrearInfraccionDTO } from "./types";
import { InfraccionesRepository } from "./repository";
import { mapCrearInfraccionToDB, mapInfraccionDetalle } from "./mapper";
import { iaDisponible, llmClient, llmModel } from "@/lib/ai/client";
import { ArticulosService } from "@/features/via/legalidad/service";
import { ResultadoBusquedaMotivo } from "@/features/via/legalidad/types";
import { MARCAS, MODELOS_POR_MARCA, COLORES, SERVICIOS, ESTADOS_MEXICO } from "./constants/vehiculo";

export interface DatosExtraidosDeNarrativa {
  ciudadanoPresente: boolean | null;
  esCiudadanoTitular: boolean | null;
  resultadosMotivo: ResultadoBusquedaMotivo[];
  narrativaSugerida: string;
  marca: string | null;
  modelo: string | null;
  anio: string | null;
  color: string | null;
  tipoVehiculo: string | null;
  servicio: string | null;
  estadoOrigen: string | null;
  placa: string | null;
  /** true si se detectó una placa pero no se pudo confirmar (dicha una sola vez, o las dos menciones no coinciden). */
  placaRequiereConfirmacion: boolean;
  /** Mejor candidato de placa aunque no se haya podido confirmar — para ofrecer un "¿es esta tu placa?" en vez de descartarla. */
  placaCandidata: string | null;
  nombreInfractor: string | null;
  apPaternoInfractor: string | null;
  apMaternoInfractor: string | null;
  garantiaSeleccionada: string | null;
  motivoRetencionVehiculo: string | null;
}

const EXTRACCION_SYSTEM_PROMPT = `Eres un asistente que analiza el dictado de un oficial de tránsito al iniciar una boleta de infracción.

Reglas estrictas:
- Extrae SOLO lo que el oficial dijo explícitamente. Si algo no se menciona, usa null — nunca lo infieras ni lo asumas.
- "ciudadanoPresente": true si el oficial indica que el conductor/ciudadano está presente en el lugar, false si indica que está ausente, null si no lo menciona.
- "esCiudadanoTitular": true si indica que el ciudadano es el propietario/titular del vehículo, false si indica que no lo es, null si no lo menciona.
- "motivo": la frase o frases (tal como se dijeron, sin reformular a lenguaje legal) que describen por qué se detiene al conductor. Cadena vacía si no se menciona ningún motivo.
- "marca", "modelo", "color": tal como se escucharon, sin corregir ortografía ni validarlos contra ningún catálogo — eso se hace después. null si no se mencionan.
- "anio": el año del vehículo como texto (ej. "2024"), null si no se menciona. IMPORTANTE: en México es común decir "modelo 2020" para referirse al año del vehículo, no al nombre del modelo — si el oficial dice "[marca] [nombre del modelo], modelo [número de 4 dígitos]" (ej. "Chevrolet Corsa, modelo 2006"), ese número va en "anio", NO en "modelo". El campo "modelo" es el nombre/línea del vehículo (ej. "Corsa", "Aveo", "Versa"), nunca un año.
- "tipoVehiculo": descripción libre de cómo lo describió el oficial (ej. "camioneta", "sedán", "moto"), null si no se menciona.
- "servicio": si menciona que el vehículo es particular, público, federal u otro — tal como se escuchó, null si no se menciona.
- "estadoOrigen": el estado de la república donde está emplacado el vehículo, SOLO si el oficial lo dice explícitamente (ej. "el estado de procedencia del vehículo es Querétaro"). Tal como se escuchó, sin corregir ortografía — eso se hace después. null si no se menciona.
- "placa": si el oficial dicta la placa del vehículo (letra por letra y número por número, ej. "eme, ene, y griega, treinta y dos, treinta y tres"), transcríbela en formato compacto: solo letras y dígitos tal como se identifiquen, sin espacios ni guiones, en mayúsculas (ej. "MNY3233"). Repórtala aunque el oficial NO la repita como confirmación — esa decisión se toma después, no aquí. null si no se menciona ninguna placa.
- "placaConfirmacion": SOLO si el oficial vuelve a decir la placa como confirmación (ej. "confirmo placa..." o la repite una segunda vez). Transcribe esa segunda mención con el mismo formato compacto. null si no la repite.
- "nombreInfractor", "apellidoPaterno", "apellidoMaterno": nombre del conductor si lo dicta, null si no se menciona.
- "garantia": SOLO si el oficial nombra explícitamente el objeto que se retiene — tarjeta de circulación, placa, licencia o el vehículo. Frases como "se retuvo" o "se detuvo" SIN nombrar un objeto casi siempre significan que se hizo la parada del conductor, no que se retuvo algo en garantía — en ese caso usa null, no adivines cuál objeto fue.
- "motivoRetencion": si menciona por qué se retiene el vehículo (delito, accidente, infracción), tal como se escuchó, null si no se menciona.
- Responde ÚNICAMENTE un objeto JSON con esta forma exacta: {"ciudadanoPresente": true|false|null, "esCiudadanoTitular": true|false|null, "motivo": "...", "marca": "..."|null, "modelo": "..."|null, "color": "..."|null, "anio": "..."|null, "tipoVehiculo": "..."|null, "servicio": "..."|null, "estadoOrigen": "..."|null, "placa": "..."|null, "placaConfirmacion": "..."|null, "nombreInfractor": "..."|null, "apellidoPaterno": "..."|null, "apellidoMaterno": "..."|null, "garantia": "..."|null, "motivoRetencion": "..."|null}. Sin texto adicional.`;

/**
 * Ejemplos few-shot: enseñan por demostración los dos casos que más fallan en
 * dictados reales de campo — el modismo "modelo AÑO" y la garantía sin objeto
 * nombrado. Las reglas en prosa del prompt no bastaron para esto (ver caso real
 * "Chevrolet Corsa blanco modelo 2006" confundiendo modelo/año); un ejemplo
 * concreto sí lo resuelve de forma consistente.
 */
const EJEMPLOS_EXTRACCION: Array<{ role: "user" | "assistant"; content: string }> = [
  {
    role: "user",
    content:
      "El conductor está presente y es titular. Es un Chevrolet Corsa blanco, año 2006, tipo sedán, de servicio particular. La placa es eme, ene, y griega, treinta y dos, treinta y tres. Confirmo placa eme, ene, y griega, treinta y dos, treinta y tres. El estado de procedencia del vehículo es Querétaro. El motivo fue que se pasó el semáforo en rojo. Se retiene la tarjeta de circulación.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      ciudadanoPresente: true,
      esCiudadanoTitular: true,
      motivo: "se pasó el semáforo en rojo",
      marca: "Chevrolet",
      modelo: "Corsa",
      color: "blanco",
      anio: "2006",
      tipoVehiculo: "sedán",
      servicio: "particular",
      estadoOrigen: "Querétaro",
      placa: "MNY3233",
      placaConfirmacion: "MNY3233",
      nombreInfractor: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      garantia: "tarjeta de circulación",
      motivoRetencion: null,
    }),
  },
  {
    role: "user",
    content:
      "El conductor está ausente. Se retiene la tarjeta de circulación porque cometió una infracción. El vehículo es una Nissan Versa gris, año dos mil veintidós, de servicio particular.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      ciudadanoPresente: false,
      esCiudadanoTitular: null,
      motivo: "",
      marca: "Nissan",
      modelo: "Versa",
      color: "gris",
      anio: "2022",
      tipoVehiculo: null,
      servicio: "particular",
      estadoOrigen: null,
      placa: null,
      placaConfirmacion: null,
      nombreInfractor: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      garantia: "tarjeta de circulación",
      motivoRetencion: "infracción",
    }),
  },
  {
    role: "user",
    content: "La placa del vehículo es eme, ene, y griega, treinta y dos, treinta y tres.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      ciudadanoPresente: null,
      esCiudadanoTitular: null,
      motivo: "",
      marca: null,
      modelo: null,
      color: null,
      anio: null,
      tipoVehiculo: null,
      servicio: null,
      estadoOrigen: null,
      placa: "MNY3233",
      placaConfirmacion: null,
      nombreInfractor: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      garantia: null,
      motivoRetencion: null,
    }),
  },
];

const normalizar = (valor: string) =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const distanciaLevenshtein = (a: string, b: string): number => {
  const filas = a.length + 1;
  const columnas = b.length + 1;
  const dp: number[][] = Array.from({ length: filas }, () => new Array(columnas).fill(0));
  for (let i = 0; i < filas; i++) dp[i][0] = i;
  for (let j = 0; j < columnas; j++) dp[0][j] = j;
  for (let i = 1; i < filas; i++) {
    for (let j = 1; j < columnas; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[filas - 1][columnas - 1];
};

/**
 * Ancla un valor libre (dictado por voz) a la opción más cercana de un catálogo
 * cerrado, igual que ArticulosService.buscarPorDescripcion ancla el motivo al
 * catálogo legal real. Si ninguna opción es razonablemente cercana, se conserva
 * el texto crudo para que el oficial lo corrija a mano en la revisión.
 */
const snapACatalogo = (valorCrudo: string | null, catalogo: string[]): string | null => {
  if (!valorCrudo?.trim() || catalogo.length === 0) return valorCrudo?.trim().toUpperCase() || null;

  const objetivo = normalizar(valorCrudo);
  let mejor: { valor: string; distancia: number } | null = null;
  for (const opcion of catalogo) {
    const distancia = distanciaLevenshtein(objetivo, normalizar(opcion));
    if (!mejor || distancia < mejor.distancia) mejor = { valor: opcion, distancia };
  }
  if (!mejor) return valorCrudo.trim().toUpperCase();

  const umbral = Math.max(2, Math.floor(mejor.valor.length * 0.3));
  return mejor.distancia <= umbral ? mejor.valor : valorCrudo.trim().toUpperCase();
};

const detectarPorPalabraClave = (
  valorCrudo: string | null,
  mapa: Array<[palabrasClave: string[], resultado: string]>,
): string | null => {
  if (!valorCrudo?.trim()) return null;
  const objetivo = normalizar(valorCrudo);
  for (const [palabrasClave, resultado] of mapa) {
    if (palabrasClave.some((palabra) => objetivo.includes(palabra))) return resultado;
  }
  return null;
};

const snapATipoVehiculo = (valorCrudo: string | null) =>
  detectarPorPalabraClave(valorCrudo, [
    [["MOTO"], "MOTOCICLETA"],
    [["CAMIONETA", "PICKUP", "SUV"], "CAMIONETA"],
    [["CARGA", "TRAILER", "CAMION"], "VEH. CARGA"],
    [["TAXI", "TRANSPORTE", "PUBLICO"], "TRANS. PUBLICO"],
    [["AUTO", "SEDAN", "CARRO", "COCHE"], "AUTOMOVIL"],
  ]);

const snapAServicio = (valorCrudo: string | null): string | null =>
  detectarPorPalabraClave(
    valorCrudo,
    SERVICIOS.filter((s) => s.value !== "otro").map(
      (s): [string[], string] => [[normalizar(s.label)], s.value],
    ),
  );

const snapAGarantia = (valorCrudo: string | null) =>
  detectarPorPalabraClave(valorCrudo, [
    [["TARJETA", "CIRCULACION"], "TRJ_CIRCULACION"],
    [["PLACA"], "PLACA"],
    [["LICENCIA"], "LICENCIA"],
    [["VEHICULO", "CORRALON", "GRUA"], "VEHICULO"],
  ]);

const snapAMotivoRetencion = (valorCrudo: string | null) =>
  detectarPorPalabraClave(valorCrudo, [
    [["DELITO"], "DELITO"],
    [["ACCIDENTE"], "ACCIDENTE"],
    [["INFRACCION"], "INFRACCION"],
  ]);

const normalizarPlaca = (valorCrudo: string | null): string | null => {
  if (!valorCrudo) return null;
  const limpio = valorCrudo.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return limpio || null;
};

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
      marca: null,
      modelo: null,
      anio: null,
      color: null,
      tipoVehiculo: null,
      servicio: null,
      estadoOrigen: null,
      placa: null,
      placaRequiereConfirmacion: false,
      placaCandidata: null,
      nombreInfractor: null,
      apPaternoInfractor: null,
      apMaternoInfractor: null,
      garantiaSeleccionada: null,
      motivoRetencionVehiculo: null,
    };

    if (!texto || !iaDisponible || !llmClient) return vacio;

    try {
      const respuesta = await llmClient.chat.completions.create(
        {
          model: llmModel,
          messages: [
            { role: "system", content: EXTRACCION_SYSTEM_PROMPT },
            ...EJEMPLOS_EXTRACCION,
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

      const marcaCruda = typeof parsed.marca === "string" ? parsed.marca : null;
      const marca = snapACatalogo(marcaCruda, MARCAS);
      const modelosDisponibles = marca ? MODELOS_POR_MARCA[marca] ?? [] : [];

      let modeloCrudo = typeof parsed.modelo === "string" ? parsed.modelo.trim() : null;
      let anioCrudo = typeof parsed.anio === "string" ? parsed.anio.trim() : null;

      // Salvaguarda: en México "modelo 2006" suele referirse al año-modelo, no al
      // nombre del modelo. Si el LLM confundió el campo (ej. dejó "2006" en modelo
      // y anio vacío), reubicamos el año antes de intentar anclar el modelo real.
      if (!anioCrudo && modeloCrudo && /^\d{4}$/.test(modeloCrudo)) {
        anioCrudo = modeloCrudo;
        modeloCrudo = null;
      }

      const modelo = snapACatalogo(modeloCrudo, modelosDisponibles);
      const color = snapACatalogo(typeof parsed.color === "string" ? parsed.color : null, COLORES);
      const anio = anioCrudo ? anioCrudo.replace(/\D/g, "").slice(0, 4) || null : null;

      // La placa solo se acepta si el oficial la confirmó y las dos menciones
      // coinciden tras normalizar — es alfanumérica y sin catálogo contra el cual
      // anclarla, así que una sola mención no es suficientemente confiable.
      const placaCruda = normalizarPlaca(typeof parsed.placa === "string" ? parsed.placa : null);
      const placaConfirmacionCruda = normalizarPlaca(
        typeof parsed.placaConfirmacion === "string" ? parsed.placaConfirmacion : null,
      );
      const placaConfirmada = placaCruda && placaConfirmacionCruda && placaCruda === placaConfirmacionCruda;
      const placa = placaConfirmada ? placaCruda : null;
      const placaRequiereConfirmacion = Boolean(placaCruda) && !placaConfirmada;

      return {
        ciudadanoPresente: typeof parsed.ciudadanoPresente === "boolean" ? parsed.ciudadanoPresente : null,
        esCiudadanoTitular: typeof parsed.esCiudadanoTitular === "boolean" ? parsed.esCiudadanoTitular : null,
        resultadosMotivo,
        narrativaSugerida: vacio.narrativaSugerida,
        marca,
        modelo,
        anio,
        color,
        tipoVehiculo: snapATipoVehiculo(typeof parsed.tipoVehiculo === "string" ? parsed.tipoVehiculo : null),
        servicio: snapAServicio(typeof parsed.servicio === "string" ? parsed.servicio : null),
        estadoOrigen: snapACatalogo(typeof parsed.estadoOrigen === "string" ? parsed.estadoOrigen : null, ESTADOS_MEXICO),
        placa,
        placaRequiereConfirmacion,
        placaCandidata: placaCruda,
        nombreInfractor: typeof parsed.nombreInfractor === "string" ? parsed.nombreInfractor.trim().toUpperCase() || null : null,
        apPaternoInfractor: typeof parsed.apellidoPaterno === "string" ? parsed.apellidoPaterno.trim().toUpperCase() || null : null,
        apMaternoInfractor: typeof parsed.apellidoMaterno === "string" ? parsed.apellidoMaterno.trim().toUpperCase() || null : null,
        garantiaSeleccionada: snapAGarantia(typeof parsed.garantia === "string" ? parsed.garantia : null),
        motivoRetencionVehiculo: snapAMotivoRetencion(typeof parsed.motivoRetencion === "string" ? parsed.motivoRetencion : null),
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
