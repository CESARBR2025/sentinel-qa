import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";
import FormularioRol from "@/components/admin/roles/FormularioRol"; // Importas tu formulario de roles
import { Shield, ArrowLeft } from "lucide-react"; // Usamos Shield para diferenciarlo de D1 visualmente
import Link from "next/link";

export default async function AgregarRolPage() {
  // 1. Verificación de Sesión (Exactamente igual a D1)
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
        background: "#f8fafc", // Fondo claro táctico (Igual a D1)
        color: "#1e293b",
      }}
    >
      {/* INYECCIÓN DE FUENTES TÁCTICAS - CLON EXACTO */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}} />

      {/* Header del Dashboard */}
      
      <div
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 32px", // Asegúrate de que esto sea exacto
    display: "flex",
    flexDirection: "column",
    gap: "32px", // Este espacio entre el botón volver y el cuadro blanco
  }}
>
        {/* BOTÓN DE RETORNO - ESTILO D1 */}
        <Link 
          href="/admin/roles" 
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
          VOLVER A GESTIÓN DE ROLES
        </Link>

        {/* ENCABEZADO DEL MÓDULO (Estructura espejo de D1) */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderLeft: "6px solid #0f172a", // Borde grueso característico
            borderRadius: "4px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decoración de fondo (Marca de agua táctica - Usamos Shield) */}
          <Shield 
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
                color: "#d4a43a", // Dorado Sentinel
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
              Administración del Sistema y Seguridad
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
              Crear Nuevo <span style={{ color: "#2563eb" }}>Rol Operativo</span>
            </h1>

            <p
              style={{
                margin: "16px 0 0 0",
                fontFamily: "'Inter', sans-serif",
                color: "#64748b",
                fontSize: "15px",
                maxWidth: "650px",
                lineHeight: "1.6"
              }}
            >
              Registre un nuevo rol para el sistema. Posteriormente podrá asignarle permisos específicos para controlar el acceso a los distintos módulos del sistema de auditoría.
            </p>
          </div>
        </div>

        {/* CONTENEDOR DEL FORMULARIO - IGUAL QUE EN D1 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <FormularioRol user={user} />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}