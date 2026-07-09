/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const result = await query(`
      SELECT 
        id, 
        folio_iph AS "folioIPH", 
        alias, 
        delito, 
        fecha_evento AS "fechaEvento", 
        genero
      FROM iph_detenidos
      ORDER BY id DESC 
      LIMIT 100
    `);

    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error("ERROR_SQL_NATIVO:", error.message);
    return NextResponse.json({ 
      error: "Error en la base de datos", 
      details: error.message 
    }, { status: 500 });
  }
}