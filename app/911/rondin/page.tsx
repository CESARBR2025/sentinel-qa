import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReporteRecorridoZen from "@/components/911/radio/FormSection"; 

import { query } from "@/lib/db";
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

   const [emergencias, incidentes, prioridades, canalizaciones] = await Promise.all([
    query('SELECT * FROM cat_tipos_emergencia WHERE activo = $1', [true]),
    query('SELECT * FROM cat_tipos_incidente WHERE activo = $1', [true]),
    query('SELECT * FROM cat_prioridades WHERE activo = $1', [true]),
    query('SELECT * FROM cat_medios_canalizacion WHERE activo = $1', [true]),
  ]);


  return  <ReporteRecorridoZen 
      user={session.user} 
      catalogos={{ emergencias: emergencias.rows, incidentes: incidentes.rows, prioridades: prioridades.rows, canalizaciones: canalizaciones.rows }} 
    />
}
