import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verificarRolOficial } from "@/lib/oficial/service";
import { DashboardHeader } from "@/components/partials/Header";
import FormularioInfraccion from "@/features/via/oficiales/components/FormularioInfraccion";
import { APP_VERSION } from "@/lib/constants"

export default async function CapturaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const esOficial = await verificarRolOficial(session.user.id);
  if (!esOficial) redirect("/dashboard");

  const user = session.user as { name: string; apellido?: string; email: string };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "Inter,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Nueva Infracción" backHref="/oficial" backLabel="Volver" />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 48px", display: "flex", flexDirection: "column" }}>

        {/* Form */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <FormularioInfraccion />
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #e2e8f0", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#94a3b8", letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · VÍA</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1f355a" }} />
          </div>
        </div>

      </div>
    </div>
  );
}
