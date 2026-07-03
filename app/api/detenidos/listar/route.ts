/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const query = sql`
      SELECT 
        id, 
        folio_iph as "folioIPH", 
        alias, 
        delito, 
        fecha_evento as "fechaEvento", 
        capturado_por as "capturo"
      FROM iph_detenidos
      ORDER BY creado_en DESC
    `;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : (result as any).rows || [];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}