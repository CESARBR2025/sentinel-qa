/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

  const rolCheck = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`,
    [session.user.id],
  );
  if (rolCheck.rows[0]?.nombre !== "Administrador") {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 }
      );
    }

    const existe = await query<any>(
      `SELECT id FROM roles WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
      [body.nombre],
    );

    if (existe.rows.length > 0) {
      return NextResponse.json(
        { error: "Ya existe un rol con ese nombre." },
        { status: 400 }
      );
    }
    const nuevo = await query<any>(
      `INSERT INTO roles (nombre, descripcion, activo)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [body.nombre, body.descripcion ?? "", body.activo ?? true],
    );

    return NextResponse.json({
      success: true,
      id: nuevo.rows[0].id,
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