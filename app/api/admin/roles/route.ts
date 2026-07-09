import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserWithRole } from "@/lib/auth/helpers";
import { existeRolPorNombre, crearRol } from "@/lib/admin/repository";

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

  const user = await getUserWithRole(session.user.id);
  if (user?.rolNombre !== "Administrador") {
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

    const existe = await existeRolPorNombre(body.nombre);

    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un rol con ese nombre." },
        { status: 400 }
      );
    }

    const id = await crearRol(body.nombre, body.descripcion ?? "", body.activo ?? true);

    return NextResponse.json({
      success: true,
      id,
      message: "Rol creado correctamente.",
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error interno";
    console.error(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}