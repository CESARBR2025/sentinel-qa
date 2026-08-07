// app/agente_911/ciudadano/page.tsx
// La captura de un nuevo reporte vive ahora en /agente_911/ciudadano/nuevoreporte.
// Este índice se conserva como redirect para no romper links existentes.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function Ciudadano911Index() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) {
    redirect("/dashboard");
  }

  redirect("/agente_911/ciudadano/nuevoreporte");
}