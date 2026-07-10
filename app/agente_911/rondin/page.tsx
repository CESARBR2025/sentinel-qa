import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReporteRecorridoZen from "@/components/911/radio/FormSection"; 

import { getCatalogos } from "@/lib/911/service";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function ReporteRecorridoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  if (!(await tieneAccesoSeccion(session.user.id, "911_rondin"))) {
    redirect("/dashboard");
  }

   const catalogos = await getCatalogos();


  return  <ReporteRecorridoZen 
      user={session.user} 
      catalogos={{ emergencias: catalogos.emergencias, incidentes: catalogos.incidentes, prioridades: catalogos.prioridades, canalizaciones: catalogos.canalizaciones }} 
    />
}
