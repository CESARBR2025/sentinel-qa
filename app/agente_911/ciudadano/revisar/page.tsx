import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { PageHeader, PageHeaderLink } from "@/components/partials/PageHeader";
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}} />

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Revisar Reporte"
      />

      <div
        className="pad-pagina"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <PageHeader
          title="Revisar"
          accent="Reporte"
          subtitle="Confirmación de datos antes de publicar"
          actions={<PageHeaderLink href="/agente_911/ciudadano" variant="secondary">← Formulario</PageHeaderLink>}
        />

        <RevisarFormulario />

        <DashboardFooter />
      </div>
    </main>
  );
}
