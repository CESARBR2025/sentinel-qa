/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET() {
  try {
    // Cambiamos 'creado_en' por 'id' para el ordenamiento
    const result = await db.$client.query(`
      SELECT 
        id, 
        folio_iph as "folioIPH", 
        alias, 
        delito, 
        fecha_evento as "fechaEvento", 
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