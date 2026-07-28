import { NextRequest, NextResponse } from "next/server";
import { InfraccionesRepository } from "@/features/via/infracciones/repository";
import { InfraccionesService } from "@/features/via/infracciones/service";
import { verificarAccesoCiudadano } from "@/lib/via/auth-ciudadano";

/**
 * Espejo en JSON de lo que hace InfraccionCiudadanoPage (app/infracciones/[id]/page.tsx)
 * para clientes que no renderizan el Server Component (app Flutter): sin
 * token válido regresa solo folio + nombre (para la pantalla de PIN); con
 * token válido (cookie o Bearer) regresa el detalle completo.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const autenticado = await verificarAccesoCiudadano(req, id);

  if (!autenticado) {
    const folioData = await InfraccionesRepository.obtenerFolio(id);
    if (!folioData) {
      return NextResponse.json({ error: "Infracción no encontrada" }, { status: 404 });
    }

    const nombreInfractor = [
      folioData.nombre_infractor,
      folioData.apellido_paterno_infractor,
      folioData.apellido_materno_infractor,
    ].filter(Boolean).join(" ") || null;

    return NextResponse.json({
      autenticado: false,
      folio: folioData.folio,
      nombreInfractor,
    });
  }

  try {
    const infraccion = await InfraccionesService.obtenerPorId(id);
    return NextResponse.json({ autenticado: true, infraccion });
  } catch (error) {
    console.error("[API][VIA][INFRACCIONES][GET-ID]", error);
    return NextResponse.json({ error: "Infracción no encontrada" }, { status: 404 });
  }
}
