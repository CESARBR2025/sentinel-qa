/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Save, Shield, Info, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// --- COMPONENTE AUXILIAR (Igual que en D1) ---
const SentinelField = ({ label, icon: Icon, name, type = "text", required = false, ...props }: any) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={14} style={iconStyle} />}
      <input
        name={name}
        type={type}
        required={required}
        style={{ ...inputStyle, paddingLeft: Icon ? '38px' : '12px' }}
        {...props}
      />
    </div>
  </div>
);

export default function FormularioRol({ user }: { user: any }) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, activo }),
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
    <form onSubmit={guardar} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* 1. SECCIÓN DE IDENTIFICACIÓN DEL ROL */}
      <section className="sentinel-panel">
        <h2 style={sectionTitleStyle}>
          <Shield size={18} /> IDENTIFICACIÓN DEL ROL
        </h2>

        <div style={grid2Style}>
          <SentinelField 
            label="Nombre del Rol" 
            name="nombre"
            icon={Shield} 
            required 
            placeholder="Ej. AUDITOR_SR"
            value={nombre}
            onChange={(e: any) => setNombre(e.target.value)}
          />

          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Estado Operativo</label>
            <div style={{ position: 'relative' }}>
              <CheckCircle size={14} style={iconStyle} />
              <select
                value={activo ? "true" : "false"}
                onChange={(e) => setActivo(e.target.value === "true")}
                style={{ ...inputStyle, paddingLeft: '38px', appearance: 'none' }}
              >
                <option value="true">ACTIVO / VIGENTE</option>
                <option value="false">INACTIVO / SUSPENDIDO</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <label style={labelStyle}>Descripción y Alcance Legal</label>
          <div style={{ position: 'relative' }}>
             <Info size={14} style={{ ...iconStyle, top: '15px', transform: 'none' }} />
             <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describa las facultades y limitaciones de este rol..."
                style={{
                  ...inputStyle,
                  paddingLeft: '38px',
                  resize: "vertical",
                  minHeight: "120px",
                  paddingTop: '12px'
                }}
              />
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE AUDITORÍA (Visual) */}
      <section className="sentinel-panel" style={{ borderLeftColor: '#b45309' }}>
        <h2 style={{ ...sectionTitleStyle, color: '#b45309' }}>
          <AlertCircle size={18} /> TRAZABILIDAD DE REGISTRO
        </h2>
        <div style={grid2Style}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Usuario Responsable</label>
            <input 
              readOnly 
              style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }} 
              value={`${user?.name || ''} ${user?.apellido || ''}`}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Fecha de Sistema</label>
            <input 
              readOnly 
              style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }} 
              value={new Date().toLocaleDateString('es-MX')}
            />
          </div>
        </div>
      </section>

      {/* BOTÓN DE ACCIÓN */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: "100px" }}>
        <button
          type="submit"
          disabled={guardando}
          style={{
            ...btnSubmitStyle,
            opacity: guardando ? 0.7 : 1,
            cursor: guardando ? "not-allowed" : "pointer"
          }}
        >
          {guardando ? (
            <>SINCRONIZANDO...</>
          ) : (
            <>
              <Save size={18} /> REGISTRAR ROL EN SISTEMA
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .sentinel-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #2563eb;
          padding: 32px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        input:focus, select:focus, textarea:focus {
          border-color: #2563eb !important;
          outline: none;
        }
      `}</style>
    </form>
  );
}

// --- ESTILOS TÁCTICOS UNIFICADOS (Basados en D1) ---
const grid2Style = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" };
const fieldContainerStyle = { display: "flex", flexDirection: "column" as const, gap: "8px" };
const labelStyle = { 
  fontFamily: "JetBrains Mono", 
  fontSize: "10px", 
  fontWeight: 700, 
  color: "#64748b", 
  textTransform: "uppercase" as const, 
  letterSpacing: "0.1em" 
};
const inputStyle = { 
  width: "100%", 
  padding: "12px", 
  border: "1px solid #e2e8f0", 
  borderRadius: "2px", 
  fontFamily: "Inter", 
  fontSize: "14px", 
  transition: "all 0.2s" 
};
const iconStyle = { 
  position: 'absolute' as const, 
  left: '12px', 
  top: '50%', 
  transform: 'translateY(-50%)', 
  color: '#94a3b8',
  zIndex: 1
};
const sectionTitleStyle = { 
  fontFamily: "Barlow Condensed", 
  fontSize: "20px", 
  fontWeight: 800, 
  color: "#0f172a", 
  marginBottom: "24px", 
  display: "flex", 
  alignItems: "center", 
  gap: "12px", 
  textTransform: "uppercase" as const 
};
const btnSubmitStyle = { 
  background: "#0f172a", 
  color: "#ffffff", 
  padding: "20px 60px", 
  border: "none", 
  borderRadius: "2px", 
  fontFamily: "JetBrains Mono", 
  fontWeight: 700, 
  fontSize: "13px", 
  letterSpacing: "0.2em", 
  display: "flex", 
  alignItems: "center", 
  gap: "12px",
  transition: "background 0.2s"
};