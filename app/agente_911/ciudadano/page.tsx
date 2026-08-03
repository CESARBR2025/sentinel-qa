// app/911/ciudadano/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCatalogos } from "@/lib/911/service";
import { getDespachadores } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
import { PageHeader, PageHeaderLink } from "@/components/partials/PageHeader";
import { DashboardFooter } from "@/components/partials/Footer";
import Formulario911 from "./Formulario911";
import { tieneAccesoSeccion } from "@/lib/911/permisos";




export default async function Ciudadano911Page() {
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
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        .sentinel-label-fix label {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 10px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.12em !important;
          color: #64748b !important;
          font-weight: 600 !important;
        }

        .sentinel-label-fix input, 
        .sentinel-label-fix select, 
        .sentinel-label-fix textarea {
          border-radius: 2px !important;
          font-family: 'Inter', sans-serif !important;
        }
      `}} />

      <DashboardHeader
        user={user}
        roleLabel="Reporte de Llamada al 911"
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
          actions={<PageHeaderLink href="/agente_911/ciudadano/incidentes" variant="secondary">← Bitácora</PageHeaderLink>}
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
