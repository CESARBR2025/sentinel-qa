/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 }
      );
    }

    const existe = await db.execute(sql`
      SELECT id
      FROM roles
      WHERE LOWER(nombre)=LOWER(${body.nombre})
      LIMIT 1
    `);

    if ((existe as any).rows.length > 0) {
      return NextResponse.json(
        { error: "Ya existe un rol con ese nombre." },
        { status: 400 }
      );
    }

    const nuevo = await db.execute(sql`
      INSERT INTO roles (
        nombre,
        descripcion,
        activo
      )
      VALUES (
        ${body.nombre},
        ${body.descripcion ?? ""},
        ${body.activo ?? true}
      )
      RETURNING id
    `);

    return NextResponse.json({
      success: true,
      id: (nuevo as any).rows[0].id,
      message: "Rol creado correctamente.",
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message ?? "Error interno."
      },
      {
        status: 500
      }
    );
  }
}