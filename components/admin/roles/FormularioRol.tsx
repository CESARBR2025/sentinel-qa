"use client";

import { useState } from "react";
import { Save, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmpleado } from '@/hooks/useEmpleado';

export default function FormularioRol() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Ingrese el nombre del rol.");
      return;
    }

    setGuardando(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          activo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ocurrió un error.");
        return;
      }

      alert("Rol registrado correctamente.");

      router.push("/admin/roles");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el rol.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={guardar}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}>
          <Shield size={18} />
          INFORMACIÓN DEL ROL
        </h2>

        <div style={grid2Style}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Nombre del Rol
              <span style={{ color: "#dc2626" }}> *</span>
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Administrador"
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Estado
            </label>

            <select
              value={activo ? "true" : "false"}
              onChange={(e) => setActivo(e.target.value === "true")}
              style={inputStyle}
            >
              <option value="true">
                ACTIVO
              </option>

              <option value="false">
                INACTIVO
              </option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
          }}
        >
          <label style={labelStyle}>
            Descripción
          </label>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            placeholder="Descripción del rol..."
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "120px",
            }}
          />
        </div>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "80px",
        }}
      >
        <button
          type="submit"
          disabled={guardando}
          style={btnSubmitStyle}
        >
          <Save size={18} />

          {guardando
            ? "GUARDANDO..."
            : "GUARDAR ROL"}
        </button>
      </div>

      <style jsx>{`
        .sentinel-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #2563eb;
          padding: 32px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, .10);
        }

        button:hover {
          opacity: .92;
        }
      `}</style>
    </form>
  );
}

const grid2Style = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const labelStyle = {
  fontFamily: "JetBrains Mono",
  fontSize: "10px",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: ".12em",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #e2e8f0",
  borderRadius: "2px",
  fontFamily: "Inter",
  fontSize: "14px",
  outline: "none",
};

const sectionTitleStyle = {
  fontFamily: "Barlow Condensed",
  fontSize: "22px",
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: "24px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textTransform: "uppercase" as const,
};

const btnSubmitStyle = {
  background: "#0f172a",
  color: "#ffffff",
  padding: "18px 50px",
  border: "none",
  borderRadius: "2px",
  fontFamily: "JetBrains Mono",
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: ".2em",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};
