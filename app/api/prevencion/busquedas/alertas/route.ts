import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { query } from "@/lib/db";
import { addHours } from "date-fns";
import { verificarAccesoPrevencionApi } from "@/lib/prevencion/permisos";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const chequeo = await verificarAccesoPrevencionApi(
    session.user.id,
    "busquedas",
    "ver",
  );
  if (chequeo) return chequeo;

  const busquedas = (await query<{ id: string; fechaActivacion: string }>(
    `SELECT id, fecha_activacion AS "fechaActivacion" FROM fichas_busqueda WHERE status = 'activa'`,
  )).rows;

  const ahora = new Date();
  const enProximo = addHours(ahora, 24);

  let pendientes24h = 0;
  let vencidos = 0;

  for (const ficha of busquedas) {
    const seguimientos = (await query<{ tipo: string }>(
      `SELECT tipo FROM seguimientos_busqueda WHERE ficha_id = $1`,
      [ficha.id],
    )).rows;

    const regs = new Set(seguimientos.map(s => s.tipo));

    const hitosPendientes = ["CONTESTACION_INICIAL", "24H", "48H", "72H"];

    for (const hito of hitosPendientes) {
      if (!regs.has(hito)) {
        const fechaEsperada =
          hito === "24H"
            ? addHours(new Date(ficha.fechaActivacion), 24)
            : hito === "48H"
              ? addHours(new Date(ficha.fechaActivacion), 48)
              : hito === "72H"
                ? addHours(new Date(ficha.fechaActivacion), 72)
                : new Date(ficha.fechaActivacion);

        if (fechaEsperada < ahora) {
          vencidos++;
        } else if (fechaEsperada < enProximo) {
          pendientes24h++;
        }
      }
    }
  }

  return NextResponse.json({ pendientes24h, vencidos });
}
