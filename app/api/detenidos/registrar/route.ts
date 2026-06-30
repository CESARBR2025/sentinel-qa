import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Aquí procesarías el body (Validaciones, guardar en archivo, log, o tu DB externa)
    console.log("DATOS RECIBIDOS PARA IPH:", body);

    // Simulamos un guardado exitoso
    return NextResponse.json({ 
      message: "Registro IPH procesado correctamente",
      folio: body.folioIPH 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Error al procesar el JSON" }, { status: 400 });
  }
}