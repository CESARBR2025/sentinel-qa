// app/911/ciudadano/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

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

    const [emergencias, incidentes, prioridades, canalizaciones] = await Promise.all([
    query('SELECT * FROM cat_tipos_emergencia WHERE activo = $1', [true]),
    query('SELECT * FROM cat_tipos_incidente WHERE activo = $1', [true]),
    query('SELECT * FROM cat_prioridades WHERE activo = $1', [true]),
    query('SELECT * FROM cat_medios_canalizacion WHERE activo = $1', [true]),
  ]);

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

      <DashboardHeader user={user} />
      
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
          {/* ENCABEZADO ESTILO SENTINEL */}
          <div
            style={{
              marginBottom: "40px",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "24px"
            }}
          >
            <div
              style={{
                color: "#2563eb",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
              }}
            >
              Sistema de Atención de Emergencias
            </div>

            <h1
              style={{
                margin: "12px 0",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "38px",
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Reporte de Llamada <span style={{ color: "#3b82f6" }}>al 911</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '16px', background: '#3b82f6' }} />
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                >
                  Registro inicial de incidentes reportados por la ciudadanía.
                </p>
            </div>
          </div>

          {/* AQUÍ VA EL FORMULARIO DE TU AMIGO */}
          <Formulario911 
            user={user} 
            catalogos={{
              emergencias: emergencias.rows,
              incidentes: incidentes.rows,
              prioridades: prioridades.rows,
              canalizaciones: canalizaciones.rows
            }}
          />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}
