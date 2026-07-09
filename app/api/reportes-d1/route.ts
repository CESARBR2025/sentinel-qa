/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { verificarRolOficial } from "@/lib/oficial/service";

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
  return `SSPM/${fecha}/${codigo}`
}

async function generarFolioDenunciaUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const folio = generarFolioDenuncia()
    const result = await query<{ count: number }>(`SELECT COUNT(*)::int AS count FROM ofi_reporte_denuncia WHERE folio_denuncia = $1`, [folio])
    if (Number(result.rows[0]?.count ?? 1) === 0) return folio
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

    const result = await query<any>(
      `INSERT INTO ofi_reporte_denuncia (
        folio_denuncia, iph, folio_cu, corporacion, sector, grupo_adscripcion,
        fecha_reporte, hora_reporte,
        fecha_avistamiento, hora_avistamiento,
        fecha_despacho, hora_despacho,
        fecha_confirmacion, hora_confirmacion,
        fecha_llegada, hora_llegada,
        hora_inicio_denuncia, hora_fin_denuncia,
        hora_termino_atencion, hora_cuestionario,
        lugar_hecho, lugar_apoyo,
        colonia_hecho, colonia_apoyo,
        municipio,
        latitud, longitud,
        nomina_mando, policia_a_cargo,
        tipo_evento, delito, violencia, crp,
        policia_denuncia, policia_firma_d1, policia_ingresa_cu,
        requirio_tablet, funcionaba_tablet,
        ofendido_hombre, ofendido_mujer, num_cuestionarios,
        intervino_gs, se_genero_d1, se_va_a_generar_d1,
        observaciones, capturado_por, incidente_id, reporte_campo_id,
        oficial_id, estado_tramite, estado_evidencia
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7::date, $8::time,
        $9::date, $10::time,
        $11::date, $12::time,
        $13::date, $14::time,
        $15::date, $16::time,
        $17::time, $18::time,
        $19::time, $20::time,
        $21, $22,
        $23, $24,
        $25,
        $26, $27,
        NULL,
        NULL,
        $28, $29, $30, $31,
        NULL,
        NULL,
        NULL,
        $32, $33,
        $34, $35, $36,
        $37, $38, $39,
        $40, $41, $42::uuid, $43::uuid,
        $44::uuid,
        'EN_REVISION_JUZGADO',
        'SIN_SOLICITUD'
      )
      RETURNING id`,
      [
        clean(body.folioDenuncia),
        clean(body.iph),
        clean(body.folioCu),
        clean(body.corporacion),
        clean(body.sector),
        clean(body.grupoAdscripcion),
        clean(body.fechaReporte),
        clean(body.horaReporte),
        clean(body.fechaAvistamiento),
        clean(body.horaAvistamiento),
        clean(body.fechaDespacho),
        clean(body.horaDespacho),
        clean(body.fechaConfirmacion),
        clean(body.horaConfirmacion),
        clean(body.fechaLlegada),
        clean(body.horaLlegada),
        clean(body.horaInicioDenuncia),
        clean(body.horaFinDenuncia),
        clean(body.horaTerminoAtencion),
        clean(body.horaCuestionario),
        clean(body.lugarHecho),
        clean(body.lugarApoyo),
        clean(body.coloniaHecho),
        clean(body.coloniaApoyo),
        clean(body.municipio),
        clean(body.latitudHecho),
        clean(body.longitudHecho),
        clean(body.tipoEvento),
        clean(body.delito),
        toBool(body.violencia),
        clean(body.crp),
        toBool(body.requirioTablet),
        toBool(body.funcionabaTablet),
        Number(body.ofendidoHombre) || 0,
        Number(body.ofendidoMujer) || 0,
        Number(body.numCuestionarios) || 0,
        toBool(body.intervinoGs),
        toBool(body.seGeneroD1),
        toBool(body.seVaAGenerarD1),
        clean(body.observaciones),
        session.user.id,
        clean(body.incidenteId),
        clean(body.reporteCampoId),
        clean(body.oficialId),
      ]
    )

    const reporteId = result.rows[0]?.id

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
