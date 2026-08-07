// app/agente_911/ciudadano/nuevoreporte/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCatalogos } from "@/lib/911/service";
import { getDespachadores } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
import { PageHeader } from "@/components/partials/PageHeader";
import { DashboardFooter } from "@/components/partials/Footer";
import Formulario911 from "../Formulario911";
import { tieneAccesoSeccion } from "@/lib/911/permisos";




export default async function NuevoReporteCiudadanoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) {
    redirect("/dashboard");
  }

  const user = session.user as {
    name: string;
    apellido?: string;
    email: string;
  };

    const catalogos = await getCatalogos();
    const despachadores = await getDespachadores();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* INYECCIÓN DE ESTILOS COMPATIBLE CON SERVER COMPONENTS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sentinel-label-fix label {
          font-family: var(--apple-font-display) !important;
          font-size: 10px !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          color: #64748b !important;
          font-weight: 600 !important;
        }

        .sentinel-label-fix input, 
        .sentinel-label-fix select, 
        .sentinel-label-fix textarea {
          border-radius: var(--radius-lg) !important;
          font-family: var(--apple-font-display) !important;
        }
      `}} />

      <DashboardHeader
        user={user}
        roleLabel="Reporte de Llamada al 911"
        backHref="/agente_911/ciudadano/incidentes"
        backLabel="Bitácora"
      />

      <div
        className="sentinel-label-fix pad-pagina"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <PageHeader
          title="Nuevo"
          accent="Registro"
          subtitle="Registro inicial de incidentes reportados por la ciudadanía"
        />

        <Formulario911
          user={user}
          catalogos={catalogos}
          despachadores={despachadores}
        />

        <DashboardFooter />
      </div>
    </main>
  );
}