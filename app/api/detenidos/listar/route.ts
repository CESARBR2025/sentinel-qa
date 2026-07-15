import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { listarIphDetenidos } from '@/lib/monitorista/repository';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const rows = await listarIphDetenidos();

    return NextResponse.json(rows);

  } catch (error: any) {
    console.error("ERROR_SQL_NATIVO:", error.message);
    return NextResponse.json({ 
      error: "Error en la base de datos", 
      details: error.message 
    }, { status: 500 });
  }
}