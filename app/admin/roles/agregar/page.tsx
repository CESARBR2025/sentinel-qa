import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormularioRol from "@/components/admin/roles/FormularioRol";

export default async function AgregarRolPage() {
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
        background: "#f8fafc",
        color: "#1e293b",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        body{
          font-family:'Inter',sans-serif;
        }
      `,
        }}
      />

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
        <Link
          href="/admin/roles"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            textDecoration: "none",
            fontFamily: "JetBrains Mono",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} />
          VOLVER A ROLES
        </Link>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderLeft: "6px solid #0f172a",
            borderRadius: "4px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Shield
            size={120}
            style={{
              position: "absolute",
              right: "-20px",
              bottom: "-20px",
              color: "#f1f5f9",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                color: "#d4a43a",
                fontFamily: "JetBrains Mono",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "2px",
                  background: "#d4a43a",
                }}
              ></span>

              Administración del Sistema
            </div>

            <h1
              style={{
                margin: "12px 0",
                fontFamily: "Barlow Condensed",
                fontSize: "48px",
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Crear <span style={{ color: "#2563eb" }}>Rol</span>
            </h1>

            <p
              style={{
                margin: "16px 0 0 0",
                fontFamily: "Inter",
                color: "#64748b",
                fontSize: "15px",
                maxWidth: "650px",
                lineHeight: "1.6",
              }}
            >
              Registre un nuevo rol para el sistema. Posteriormente podrá
              asignarle permisos específicos para controlar el acceso a los
              distintos módulos del sistema.
            </p>
          </div>
        </div>

        <FormularioRol />

        <DashboardFooter />
      </div>
    </main>
  );
}