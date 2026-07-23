/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { verificarRolOficial } from "@/lib/oficial/service";
import { verificarFolioDenunciaUnico, insertarReporteDenuncia } from "@/lib/d1/repository";
import { query } from "@/lib/db";

function generarFolioDenuncia(): string {
  const hoy = new Date()
  const y = hoy.getFullYear()
  const m = String(hoy.getMonth() + 1).padStart(2, '0')
  const d = String(hoy.getDate()).padStart(2, '0')
  const fecha = `${y}${m}${d}`
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SSPM/D1/${fecha}/${codigo}`
}

async function generarFolioDenunciaUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const folio = generarFolioDenuncia()
    const disponible = await verificarFolioDenunciaUnico(folio)
    if (disponible) return folio
  }
  throw new Error('No se pudo generar un folio único después de 10 intentos')
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!(await verificarRolOficial(session.user.id))) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  try {
    const body = await request.json();

    body.folioDenuncia = await generarFolioDenunciaUnico()

    const clean = (val: any) => (val === "" || val === undefined ? null : val);

    const toBool = (val: any) => {
      if (val === "true" || val === true || val === "on") return true;
      if (val === "false" || val === false) return false;
      return null;
    };

    const reporteId = await insertarReporteDenuncia({
      folioDenuncia: clean(body.folioDenuncia),
      iph: clean(body.iph),
      folioCu: clean(body.folioCu),
      corporacion: clean(body.corporacion),
      sector: clean(body.sector),
      grupoAdscripcion: clean(body.grupoAdscripcion),
      fechaReporte: clean(body.fechaReporte),
      horaReporte: clean(body.horaReporte),
      fechaAvistamiento: clean(body.fechaAvistamiento),
      horaAvistamiento: clean(body.horaAvistamiento),
      fechaDespacho: clean(body.fechaDespacho),
      horaDespacho: clean(body.horaDespacho),
      fechaConfirmacion: clean(body.fechaConfirmacion),
      horaConfirmacion: clean(body.horaConfirmacion),
      fechaLlegada: clean(body.fechaLlegada),
      horaLlegada: clean(body.horaLlegada),
      horaInicioDenuncia: clean(body.horaInicioDenuncia),
      horaFinDenuncia: clean(body.horaFinDenuncia),
      horaTerminoAtencion: clean(body.horaTerminoAtencion),
      horaCuestionario: clean(body.horaCuestionario),
      lugarHecho: clean(body.lugarHecho),
      lugarApoyo: clean(body.lugarApoyo),
      coloniaHecho: clean(body.coloniaHecho),
      coloniaApoyo: clean(body.coloniaApoyo),
      municipio: clean(body.municipio),
      latitudHecho: clean(body.latitudHecho),
      longitudHecho: clean(body.longitudHecho),
      tipoEvento: clean(body.tipoEvento),
      delito: clean(body.delito),
      violencia: toBool(body.violencia),
      crp: clean(body.crp),
      policiaACargo: clean(body.policiaACargo),
      nominaMando: clean(body.nominaMando),
      policiaDenuncia: clean(body.policiaDenuncia),
      policiaFirmaD1: clean(body.policiaFirmaD1),
      policiaIngresaCu: clean(body.policiaIngresaCu),
      requirioTablet: toBool(body.requirioTablet),
      funcionabaTablet: toBool(body.funcionabaTablet),
      ofendidoHombre: Number(body.ofendidoHombre) || 0,
      ofendidoMujer: Number(body.ofendidoMujer) || 0,
      numCuestionarios: Number(body.numCuestionarios) || 0,
      intervinoGs: toBool(body.intervinoGs),
      seGeneroD1: toBool(body.seGeneroD1),
      seVaAGenerarD1: toBool(body.seVaAGenerarD1),
      observaciones: clean(body.observaciones),
      capturadoPor: session.user.id,
      incidenteId: clean(body.incidenteId),
      reporteCampoId: clean(body.reporteCampoId),
      oficialId: clean(body.oficialId),
    })

    // Si hay incidente vinculado, cerrar por detención
    if (body.incidenteId) {
      await query(
        `UPDATE incidentes SET estatus = 'cerrado_detencion', actualizado_en = NOW() WHERE id = $1 AND estatus IN ('en_sitio', 'en_despacho')`,
        [body.incidenteId],
      )
    }

    return NextResponse.json(
      {
        success: true,
        folioDenuncia: body.folioDenuncia,
        id: reporteId,
        message: 'Reporte D1 registrado exitosamente.',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error en API D1 (INSERT):", error);

    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        { error: "El Folio de Denuncia ya existe." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Error interno al procesar el reporte." },
      { status: 500 },
    );
  }
}
