import { unstable_cache } from "next/cache";
import { ArticulosMapper } from "./mapper";
import { ArticulosRepository } from "./repository";
import { ArticuloLey, FraccionLey, ResultadoBusquedaMotivo } from "./types";
import { iaDisponible, llmClient, llmModel } from "@/lib/ai/client";

const SYSTEM_PROMPT = `Eres un asistente que ayuda a un oficial de tránsito a encontrar el artículo y fracción del reglamento de tránsito que corresponden a lo que describe en voz alta.

Reglas estrictas:
- Solo puedes señalar "fraccionId" que existan literalmente en el catálogo que se te entrega. Nunca inventes un id, número de artículo o fracción.
- Una descripción puede mencionar varias infracciones distintas (ej. "exceso de velocidad y se pasó el alto" son 2 motivos) — devuelve una entrada por cada una.
- Si no encuentras ninguna coincidencia razonable, devuelve una lista vacía.
- Responde ÚNICAMENTE un objeto JSON con la forma: {"resultados": [{"fraccionId": "...", "relevancia": 0-100, "motivoDetectado": "texto breve"}]}. No agregues texto fuera del JSON.`;

interface LlmResultadoCrudo {
  fraccionId: string;
  relevancia?: number;
  motivoDetectado?: string;
}

export class ArticulosService {
  static obtenerArticulos = unstable_cache(
    async () => {
      const rows = await ArticulosRepository.obtenerArticulos();
      return ArticulosMapper.toDomain(rows as any);
    },
    ["via-legalidad-articulos"],
    { revalidate: 60 * 60 * 24, tags: ["via", "legalidad", "articulos"] },
  );

  static async obtenerFraccionesPorArticulo(articuloId: string): Promise<FraccionLey[]> {
    const rows = await ArticulosRepository.obtenerFraccionesPorArticulo(articuloId);
    return rows.map((r: any) => ({
      id: r.id,
      articulo_id: r.articulo_id,
      numero: r.numero,
      descripcion: r.descripcion,
      monto_umas: Number(r.monto_umas),
      clasificacion: r.clasificacion as FraccionLey["clasificacion"],
      activo: r.activo,
    }));
  }

  /**
   * Interpreta una descripción libre (transcrita por voz) y sugiere fracciones
   * del catálogo real. El LLM solo puede señalar ids existentes; el resultado
   * siempre se revalida contra el catálogo cargado de BD antes de devolverse.
   */
  static async buscarPorDescripcion(texto: string): Promise<ResultadoBusquedaMotivo[]> {
    const textoLimpio = texto.trim();
    if (!textoLimpio || !iaDisponible || !llmClient) return [];

    const articulos = await ArticulosService.obtenerArticulos();

    const catalogoPorFraccionId = new Map<
      string,
      { articulo: ArticuloLey; fraccion: FraccionLey }
    >();
    for (const articulo of articulos) {
      for (const fraccion of articulo.fracciones) {
        catalogoPorFraccionId.set(fraccion.id, { articulo, fraccion });
      }
    }

    const catalogoTexto = articulos
      .flatMap((articulo) =>
        articulo.fracciones.map(
          (fraccion) =>
            `id=${fraccion.id} | ART.${articulo.numero} FRACC.${fraccion.numero} | ${fraccion.descripcion} | clasificacion=${fraccion.clasificacion} | monto_umas=${fraccion.monto_umas}`,
        ),
      )
      .join("\n");

    let crudos: LlmResultadoCrudo[] = [];
    try {
      const respuesta = await llmClient.chat.completions.create(
        {
          model: llmModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Catálogo de fracciones:\n${catalogoTexto}\n\nDescripción del oficial: "${textoLimpio}"`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0,
        },
        { signal: AbortSignal.timeout(8000) },
      );

      const contenido = respuesta.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(contenido);
      if (Array.isArray(parsed?.resultados)) {
        crudos = parsed.resultados;
      }
    } catch (error) {
      console.error("❌ Error en búsqueda de motivo por IA:", error instanceof Error ? error.message : error);
      return [];
    }

    const conRelevancia: Array<{ relevancia: number; resultado: ResultadoBusquedaMotivo }> = [];
    for (const crudo of crudos) {
      const encontrado = catalogoPorFraccionId.get(crudo.fraccionId);
      if (!encontrado) continue; // ids inexistentes se descartan silenciosamente

      conRelevancia.push({
        relevancia: crudo.relevancia ?? 0,
        resultado: {
          articuloId: encontrado.articulo.id,
          articuloNumero: encontrado.articulo.numero,
          articuloDescripcion: encontrado.articulo.descripcion,
          fraccionId: encontrado.fraccion.id,
          fraccionNumero: encontrado.fraccion.numero,
          fraccionDescripcion: encontrado.fraccion.descripcion,
          fraccionMonto: encontrado.fraccion.monto_umas,
          fraccionClasificacion: encontrado.fraccion.clasificacion,
          motivoDetectado: crudo.motivoDetectado ?? "",
        },
      });
    }

    return conRelevancia
      .sort((a, b) => b.relevancia - a.relevancia)
      .slice(0, 8)
      .map((item) => item.resultado);
  }
}
