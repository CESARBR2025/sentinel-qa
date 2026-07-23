// page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegistroIncidenteForm from "@/components/911/whatsapp/RegistroIncidenteForm";
import { getCatalogos, getDespachadores } from "@/lib/911/service";
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

  const catalogos = await getCatalogos();
  const despachadores = await getDespachadores();

  return (
    <RegistroIncidenteForm
      user={session.user}
      catalogos={catalogos}
      despachadores={despachadores}
    />
  );
}
