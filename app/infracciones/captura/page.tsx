import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verificarRolOficial } from "@/lib/oficial/service";
import { FileBadge2, ArrowLeft } from "lucide-react";
import { ProfileDropdown } from "@/components/oficial/ProfileDropdown";
import FormularioInfraccion from "@/features/via/oficiales/components/FormularioInfraccion";

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

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 48px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20, borderBottom: "1px solid #e2e8f0", position: "relative", marginBottom: 32 }}>
          <div style={{ position: "absolute", bottom: -1, left: 0, width: 64, height: 3, background: "#1f355a" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 48, objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: "0.3em", color: "#1f355a", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, background: "#1f355a", display: "inline-block" }} />
                VÍA · CAPTURA DE INFRACCIONES
              </div>
              <h1 style={{ fontFamily: "Barlow Condensed,sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, color: "#0f172a", lineHeight: 1 }}>
                NUEVA INFRACCIÓN
              </h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/oficial"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "JetBrains Mono,monospace", fontSize: 10, fontWeight: 600,
                color: "#64748b", textDecoration: "none", textTransform: "uppercase",
                letterSpacing: "0.1em", padding: "6px 12px", borderRadius: 6,
                border: "1px solid #e2e8f0", transition: "all 0.2s",
              }}
            >
              <ArrowLeft size={13} />
              Volver
            </Link>
            <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} />
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <FormularioInfraccion />
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #e2e8f0", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#94a3b8", letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>SENTINEL v0.1 · VÍA</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1f355a" }} />
          </div>
        </div>

      </div>
    </div>
  );
}
