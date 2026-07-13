// app/911/ciudadano/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCatalogos } from "@/lib/911/service";
import { ProfileDropdown } from "@/components/oficial/ProfileDropdown"
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

      {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                padding: '24px 48px', borderBottom: '1px solid #e2e8f0', position: 'relative',
                background: '#ffffff',
            }}>
                <div style={{ position: 'absolute', bottom: -1, left: 48, width: 64, height: 3, background: '#2563eb' }} />

                <div>
                    <Link href="/agente_911/ciudadano/incidentes" style={{
                        fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.25em',
                        color: '#94a3b8', textTransform: 'uppercase', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                    }}>
                        <ArrowLeft size={14} /> Bitácora
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <img src="/logo_sentinel.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, background: '#2563eb', display: 'inline-block' }} />
                                Sistema de Atención de Emergencias
                            </div>
                            <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                                Reporte de Llamada <span style={{ color: '#2563eb' }}>al 911</span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} rolLabel="Agente 911" mostrarPerfil={false} />
                </div>
            </div>
      
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
                <div style={{ width: '4px', height: '16px', background: '#2563eb' }} />
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
            catalogos={{
              emergencias: catalogos.emergencias,
              incidentes: catalogos.incidentes,
              prioridades: catalogos.prioridades,
              canalizaciones: catalogos.canalizaciones
            }}
          />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}
