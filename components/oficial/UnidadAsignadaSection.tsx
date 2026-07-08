"use client";

import { useState } from "react";
import { Car, Pencil } from "lucide-react";
import { ModalSeleccionarUnidad } from "./ModalSeleccionarUnidad";
import type { PatrullaAsignacion } from "@/lib/flota/types";

interface Props {
  patrullaActual: PatrullaAsignacion | null;
  patrullas: PatrullaAsignacion[];
}

export function UnidadAsignadaSection({
  patrullaActual,
  patrullas,
}: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div
      style={{
        flex: "1 1 380px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        padding: 32,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <Car size={18} color="#2563eb" />
        <h2
          style={{
            fontFamily: "Barlow Condensed,sans-serif",
            fontSize: 20,
            fontWeight: 700,
            textTransform: "uppercase",
            margin: 0,
            color: "#0f172a",
            letterSpacing: "0.04em",
          }}
        >
          Unidad Asignada
        </h2>
      </div>

      {patrullaActual ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Car size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  fontSize: 9,
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Placa / Identificador
              </div>
              <div
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 14,
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                {patrullaActual.numero_unidad}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: 16,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#16a34a",
                  marginTop: 5,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  fontSize: 9,
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Unidad
              </div>
              <div
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 14,
                  color: "#0f172a",
                  fontWeight: 500,
                }}
              >
                {patrullaActual.descripcion}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#475569",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#475569";
              }}
            >
              <Pencil size={14} />
              Cambiar Unidad
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Car size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  fontSize: 9,
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Placa / Identificador
              </div>
              <div
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 14,
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                Sin unidad asignada
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                border: "1px solid #2563eb",
                background: "#2563eb",
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2563eb";
              }}
            >
              Asignar Unidad
            </button>
          </div>
        </>
      )}

      {modalAbierto && (
        <ModalSeleccionarUnidad
          patrullas={patrullas}
          patrullaActualId={patrullaActual?.id ?? null}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
