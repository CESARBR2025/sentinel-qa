"use client";

import { useState } from "react";
import { Pencil, Car } from "lucide-react";
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
    <>
      <div className="pf-head">
        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-lg)", background: "rgba(31,53,90,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Car size={18} color="#1f355a" strokeWidth={1.5} />
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--apple-font-display)", fontSize: 20, fontWeight: 600, textTransform: "none", margin: 0, color: "#0f172a", letterSpacing: "normal" }}>
            Unidad Asignada
          </h2>
          <p style={{ fontFamily: "var(--apple-font-display)", fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
            {patrullaActual ? "Vehículo de servicio en tu turno" : "Sin unidad asignada para tu turno"}
          </p>
        </div>
      </div>

      {patrullaActual ? (
        <>
          <div className="pf-row">
            <span className="pf-label">Placa</span>
            <span className="pf-value" style={{ fontFamily: "var(--apple-font-display)", fontWeight: 600, letterSpacing: "0.04em" }}>
              {patrullaActual.etiqueta}
            </span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Unidad</span>
            <span className="pf-value">{patrullaActual.detalle}</span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Estatus</span>
            <span className="pf-badge pf-badge-activo">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a" }} />
              Asignada
            </span>
          </div>
          <div className="pf-actions">
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="up-btn-secondary"
            >
              <Pencil size={12} />
              Cambiar unidad
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="pf-row">
            <span className="pf-label">Estatus</span>
            <span className="pf-badge pf-badge-inactivo" style={{ background: "#f1f5f9", color: "#64748b" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#94a3b8" }} />
              Sin asignar
            </span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Unidad</span>
            <span className="pf-value" style={{ color: "#94a3b8" }}>—</span>
          </div>
          <div className="pf-actions">
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="up-btn-primary"
            >
              Asignar unidad
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
    </>
  );
}
