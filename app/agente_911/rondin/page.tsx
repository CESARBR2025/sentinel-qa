import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generarFolioIncidente } from "@/lib/incidentes/folio";
import { FormRondinEscalado } from "@/components/911/radio/FormRondinEscalado";
import { getCatalogos } from "@/lib/911/service";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function ReporteRecorridoPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (!(await tieneAccesoSeccion(session.user.id, "911_rondin"))) redirect("/dashboard");

  const [catalogos, folioData] = await Promise.all([
    getCatalogos(),
    generarFolioIncidente(),
  ]);

  return (
    <FormRondinEscalado
      catalogos={{ emergencias: catalogos.emergencias, subtipos: catalogos.subtipos, incidentes: catalogos.incidentes, prioridades: catalogos.prioridades }}
      backHref="/agente_911"
      folio={folioData.folio}
      folioConsecutivo={folioData.consecutivo}
    />
  )
}
