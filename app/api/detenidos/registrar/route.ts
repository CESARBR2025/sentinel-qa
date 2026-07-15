import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { registrarIphDetenido } from "@/lib/monitorista/repository";
import { tienePermiso } from "@/lib/monitorista/permisos";

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (!(await tienePermiso(session.user.id, "detenidos", "crear"))) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {

        const body = await req.json();

        const cleanData = Object.fromEntries(
            Object.entries(body).map(([key, value]) => {
                if (value === "" || value === undefined || value === null) {
                    return [key, null];
                }
                if (value === "true") return [key, true];
                if (value === "false") return [key, false];
                return [key, value];
            })
        );

        const result = await registrarIphDetenido(cleanData);

        return NextResponse.json(result);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Error al registrar IPH" },
            { status: 500 }
        );

    }
}