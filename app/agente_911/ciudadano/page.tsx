// app/911/ciudadano/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCatalogos } from "@/lib/911/service";
import { getDespachadores } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
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
        backHref="/agente_911/ciudadano/incidentes"
        backLabel="Bitácora"
      />

      <div
        className="sentinel-label-fix"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          {/* ENCABEZADO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 32 }}>
                <div style={{ width: '4px', height: '16px', background: '#1f355a' }} />
                <p style={{
                    margin: 0, fontFamily: "'Inter', sans-serif",
                    color: "#64748b", fontSize: "14px", fontWeight: 500
                }}>
                    Registro inicial de incidentes reportados por la ciudadanía.
                </p>
            </div>

          {/* AQUÍ VA EL FORMULARIO DE TU AMIGO */}
          <Formulario911 
            user={user} 
            catalogos={catalogos}
            despachadores={despachadores}
          />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}
