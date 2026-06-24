// page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegistroIncidenteForm from "@/components/911/whatsapp/RegistroIncidenteForm";
import { db } from "@/lib/db"; // IMPORTANTE: Revisa que esta ruta a tu DB sea correcta
import { catTiposIncidente } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function RegistroIncidentePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // 1. Traemos los datos
  const tiposIncidenteData = await db
    .select()
    .from(catTiposIncidente)
    .where(eq(catTiposIncidente.activo, true));

  // DEBUG: Si quieres ver en tu consola si hay datos, descomenta la línea de abajo:
  console.log("TIPOS ENCONTRADOS:", tiposIncidenteData);

  // 2. IMPORTANTE: Asegúrate de pasar la variable EXACTAMENTE con el mismo nombre
  return (
    <RegistroIncidenteForm 
      user={session.user} 
      tiposIncidente={tiposIncidenteData} 
    />
  );
}