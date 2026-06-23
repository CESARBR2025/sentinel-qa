// app/911/ciudadano/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";

import Formulario911 from "./Formulario911";



export default async function Ciudadano911Page() {
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
        background: "#e2e8f0",
        color: "#1e293b",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <DashboardHeader user={user} />

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                color: "#3b82f6",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Sistema de Atención de Emergencias
            </div>

            <h1
              style={{
                margin: "8px 0",
                fontSize: "36px",
                fontWeight: 800,
                color: "#1e293b",
              }}
            >
              Reporte de Llamada al 911
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748b",
              }}
            >
              Registro inicial de incidentes reportados por la ciudadanía.
            </p>
          </div>

          <Formulario911 />
        </div>

        <DashboardFooter />
      </div>
    </main>
  );
}