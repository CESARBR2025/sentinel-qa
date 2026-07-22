import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";
import RevisarFormulario from "./RevisarFormulario";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function RevisarPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) {
    redirect("/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1e293b",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}} />

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Revisar Reporte"
        backHref="/agente_911/ciudadano"
        backLabel="Formulario"
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 32px",
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
          <RevisarFormulario />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}
