"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
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
          {/* Placa — asignada */}
          <div className="up-placa-box">
            <div className="up-placa-header">
              <span>SSPM</span>
              <span>QRO</span>
            </div>
            <div className="up-placa-numero">
              {patrullaActual.numeroUnidad}
            </div>
            <div className="up-placa-footer">SAN JUAN DEL RÍO</div>
          </div>

          <div className="up-modelo">{patrullaActual.descripcion}</div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <span className="up-badge up-badge-asignada">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a" }} />
              Asignada
            </span>
          </div>

          <div className="up-footer" style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="up-btn-secondary"
            >
              <Pencil size={12} />
              Cambiar Unidad
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Placa — sin asignar */}
          <div className="up-placa-box up-placa-box-empty">
            <div className="up-placa-header">
              <span style={{ color: "#94a3b8" }}>SSPM</span>
              <span style={{ color: "#94a3b8" }}>QRO</span>
            </div>
            <div className="up-placa-numero up-placa-numero-empty">
              — — — — —
            </div>
            <div className="up-placa-footer" style={{ color: "#94a3b8" }}>
              SIN ASIGNAR
            </div>
          </div>

          <div className="up-modelo up-modelo-empty">
            No tienes una unidad asignada
          </div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <span className="up-badge up-badge-sin">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#94a3b8" }} />
              Sin asignar
            </span>
          </div>

          <div className="up-footer" style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="up-btn-primary"
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
