import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReporteRecorridoZen from "@/components/911/radio/FormSection"; 

import { db } from "@/lib/db/index";
import { 
  catTiposEmergencia, 
  catTiposIncidente, 
  catPrioridades, 
  catMediosCanalizacion 
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
    db.select().from(catTiposEmergencia).where(eq(catTiposEmergencia.activo, true)),
    db.select().from(catTiposIncidente).where(eq(catTiposIncidente.activo, true)),
    db.select().from(catPrioridades).where(eq(catPrioridades.activo, true)),
    db.select().from(catMediosCanalizacion).where(eq(catMediosCanalizacion.activo, true)),
  ]);


  return  <ReporteRecorridoZen 
      user={session.user} 
      catalogos={{ emergencias, incidentes, prioridades, canalizaciones }} 
    />
}