import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";
import FormularioD1 from "@/components/denuncias/FormularioD1"; // Asegúrate de que el nombre del archivo coincida
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NuevaDenunciaD1Page() {
  // 1. Verificación de Sesión
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user as {
    name: string;
    apellido?: string;
    email: string;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc", // Fondo claro táctico
        color: "#1e293b",
      }}
    >
      {/* INYECCIÓN DE FUENTES TÁCTICAS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}} />

      {/* Header del Dashboard */}
      <DashboardHeader user={user} />
      
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* BOTÓN DE RETORNO */}
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#64748b', 
            textDecoration: 'none',
            fontFamily: 'JetBrains Mono',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={14} />
          VOLVER AL PANEL PRINCIPAL
        </Link>

        {/* ENCABEZADO DEL MÓDULO D1 */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderLeft: "6px solid #0f172a",
            borderRadius: "4px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decoración de fondo (Marca de agua táctica) */}
          <FileText 
            size={120} 
            style={{ 
              position: 'absolute', 
              right: '-20px', 
              bottom: '-20px', 
              color: '#f1f5f9',
              zIndex: 0 
            }} 
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                color: "#d4a43a", // Dorado Sentinel para auditoría
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ width: '12px', height: '2px', background: '#d4a43a' }}></span>
              Módulo de Auditoría y Control Legal
            </div>

            <h1
              style={{
                margin: "12px 0",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "48px",
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1
              }}
            >
              Registro de <span style={{ color: "#2563eb" }}>Reporte D1</span>
            </h1>

            <p
              style={{
                margin: "16px 0 0 0",
                fontFamily: "'Inter', sans-serif",
                color: "#64748b",
                fontSize: "15px",
                maxWidth: "600px",
                lineHeight: "1.6"
              }}
            >
              Capture la cronometría exacta del evento, folios de denuncia y datos de victimología para el seguimiento del IPH y CU.
            </p>
          </div>
        </div>

        {/* CONTENEDOR DEL FORMULARIO */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <FormularioD1 user={user} />
        </div>

      </div>
    </main>
  );
}