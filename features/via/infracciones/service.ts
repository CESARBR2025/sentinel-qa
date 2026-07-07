import { CrearInfraccionDTO } from "./types";
import { InfraccionesRepository } from "./repository";
import { mapCrearInfraccionToDB, mapInfraccionDetalle } from "./mapper";

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
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const base36 = seq.toString(36).toUpperCase();
  const secuencia = rellenarBase36(base36, 6);
  return `SSPM-${year}-${month}-${day}-${secuencia}`;
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
  };

  if (body.garantiaSeleccionada === "VEHICULO") {
    payload.estatus = "REGISTRADA";
    payload.estatusDependencia = "VEHICULO_EN_CORRALON";
  }

  return payload;
};
