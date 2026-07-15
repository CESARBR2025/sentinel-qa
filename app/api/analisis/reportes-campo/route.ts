import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { listarReportesCampo } from '@/lib/oficial/repository';
import { verificarAccesoAnalisisApi } from '@/lib/analisis/permisos';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    const chequeo = await verificarAccesoAnalisisApi(session.user.id, 'ver');
    if (chequeo) return chequeo;

    const rows = await listarReportesCampo();

    return NextResponse.json(rows);

  } catch (error: any) {
    // IMPORTANTE: Mira este log en tu terminal de VS Code si sale error 500
    console.error("========== ERROR ==========");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("DETAIL:", error?.detail);

    return NextResponse.json(
      { message: "Error en la base de datos", details: error.message }, 
      { status: 500 }
    );
  }
}