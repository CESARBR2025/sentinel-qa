"use client";
import { useState } from "react";

import { DashboardHeader } from '@/components/partials/Header';
import { DashboardFooter } from '@/components/partials/Footer';

export default function Ciudadano911Page() {
  const [personasAfectadas, setPersonasAfectadas] = useState([
    { nombre: "", sexo: "", edad: "" },
  ]);

  const agregarPersona = () => {
    setPersonasAfectadas([
      ...personasAfectadas,
      { nombre: "", sexo: "", edad: "" },
    ]);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "32px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid rgba(59,130,246,.25)",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              color: "#3b82f6",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Sistema de Atención de Emergencias
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 800,
            }}
          >
            Alta de Llamada 911
          </h1>
        </div>

        <form>
          {/* DATOS INCIDENTE */}
          <section className="panel">
            <h2>Datos del Incidente</h2>

            <div className="grid">
              <input placeholder="Folio del Incidente" />
              <input placeholder="Folio CAD" />
              <input type="datetime-local" />
              <input type="datetime-local" />
            </div>
          </section>

          {/* REPORTANTE */}
          <section className="panel">
            <h2>Datos del Reportante</h2>

            <div className="grid">
              <input placeholder="Nombre del Reportante" />

              <select>
                <option>Sexo</option>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>

              <input
                type="number"
                placeholder="Edad"
              />

              <select>
                <option>Anónimo</option>
                <option>Sí</option>
                <option>No</option>
              </select>

              <select>
                <option>Usuario Frecuente</option>
                <option>Sí</option>
                <option>No</option>
              </select>

              <select>
                <option>Persona Afectada</option>
                <option>Sí</option>
                <option>No</option>
              </select>

              <select>
                <option>Migrante / Paisano</option>
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>
          </section>

          {/* UBICACION */}
          <section className="panel">
            <h2>Ubicación</h2>

            <div className="grid-1">
              <textarea
                rows={3}
                placeholder="Domicilio (calle, colonia, entre calles)"
              />

              <textarea
                rows={3}
                placeholder="Referencia de la ubicación"
              />
            </div>
          </section>

          {/* PERSONAS AFECTADAS */}
          <section className="panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>Personas Afectadas</h2>

              <button
                type="button"
                onClick={agregarPersona}
                className="btn"
              >
                + Agregar
              </button>
            </div>

            {personasAfectadas.map((_, index) => (
              <div
                key={index}
                className="grid"
                style={{
                  marginBottom: "15px",
                }}
              >
                <input placeholder="Nombre" />

                <select>
                  <option>Sexo</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                </select>

                <input
                  type="number"
                  placeholder="Edad"
                />
              </div>
            ))}
          </section>

          {/* CLASIFICACION */}
          <section className="panel">
            <h2>Clasificación</h2>

            <div className="grid">
              <select>
                <option>Tipo de Emergencia</option>
              </select>

              <select>
                <option>Tipo de Incidente</option>
              </select>

              <select>
                <option>Prioridad</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>

              <select>
                <option>Sin Despachar</option>
              </select>
            </div>
          </section>

          {/* CANALIZACION */}
          <section className="panel">
            <h2>Canalización</h2>

            <div className="grid">
              <input
                value="911"
                readOnly
              />

              <select>
                <option>Canalizar a...</option>
                <option>Protección Civil</option>
                <option>Servicios Médicos</option>
                <option>Bomberos</option>
                <option>Seguridad Pública</option>
              </select>

              <input placeholder="Capturó" />
            </div>
          </section>

          {/* OBSERVACIONES */}
          <section className="panel">
            <h2>Observaciones</h2>

            <textarea
              rows={6}
              placeholder="Descripción detallada de los hechos..."
            />
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "30px",
            }}
          >
            <button
              type="submit"
              className="btn"
            >
              Guardar Incidente
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .panel {
          background: #1e293b;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .panel h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #3b82f6;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
          gap: 16px;
        }

        .grid-1 {
          display: grid;
          gap: 16px;
        }

        input,
        select,
        textarea {
          width: 100%;
          background: #0f172a;
          border: 1px solid rgba(59,130,246,.25);
          color: #e2e8f0;
          padding: 12px;
          border-radius: 8px;
          outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.15);
        }

        .btn {
          background: #3b82f6;
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn:hover {
          background: #2563eb;
        }
      `}</style>
    </main>
  );
}
