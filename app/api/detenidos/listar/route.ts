import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { listarIphDetenidos } from '@/lib/monitorista/repository';
import { tienePermiso } from '@/lib/analisis/permisos';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const rows = await listarIphDetenidos();

    return NextResponse.json(rows);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("ERROR_SQL_NATIVO:", msg);
    return NextResponse.json({ 
      error: "Error en la base de datos", 
      details: msg 
    }, { status: 500 });
  }
}