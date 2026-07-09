// page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegistroIncidenteForm from "@/components/911/whatsapp/RegistroIncidenteForm";
import { query } from "@/lib/db";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function RegistroIncidentePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  if (!(await tieneAccesoSeccion(session.user.id, "911_whatsapp"))) {
    redirect("/dashboard");
  }

  // 1. Traemos los datos
  const tiposIncidenteData = await query(
    'SELECT * FROM cat_tipos_incidente WHERE activo = $1',
    [true]
  );

  // DEBUG: Si quieres ver en tu consola si hay datos, descomenta la línea de abajo:
  console.log("TIPOS ENCONTRADOS:", tiposIncidenteData.rows);

  // 2. IMPORTANTE: Asegúrate de pasar la variable EXACTAMENTE con el mismo nombre
  return (
    <RegistroIncidenteForm 
      user={session.user} 
      tiposIncidente={tiposIncidenteData.rows} 
    />
  );
}
