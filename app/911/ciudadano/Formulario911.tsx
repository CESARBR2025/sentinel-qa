"use client";

import { useState } from "react";

export default function Formulario911() {
    const [anonimo, setAnonimo] = useState(false);
    const [personas, setPersonas] = useState([
        { nombre: "", sexo: "", edad: "" },
    ]);

    const agregarPersona = () => {
        setPersonas([
            ...personas,
            {
                nombre: "",
                sexo: "",
                edad: "",
            },
        ]);
    };

    return (
        <>
            <div className="panel">
                <h2>Datos del Incidente</h2>

                <div className="grid">
                    <div>
                        <label>Folio del Incidente</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Folio CAD</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Fecha y Hora Inicio</label>
                        <input type="datetime-local" />
                    </div>

                    <div>
                        <label>Fecha y Hora Cierre</label>
                        <input type="datetime-local" />
                    </div>
                </div>
            </div>

            <div className="panel">
                <h2>Datos del Reportante</h2>

                <div className="grid">
                                        <div>
                        <label>¿Reporte Anónimo?</label>

                        <select
                            value={anonimo ? "SI" : "NO"}
                            onChange={(e) => setAnonimo(e.target.value === "SI")}
                        >
                            <option value="NO">No</option>
                            <option value="SI">Sí</option>
                        </select>
                    </div>
                    <div>
                        <label>Nombre del Reportante</label>

                        <input
                            type="text"
                            disabled={anonimo}
                            placeholder={
                                anonimo
                                    ? "Reporte Anónimo"
                                    : "Nombre del Reportante"
                            }
                        />
                    </div>

                    <div>
                        <label>Sexo</label>

                        <select disabled={anonimo}>
                            <option>Seleccionar</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                        </select>
                    </div>

                    <div>
                        <label>Edad</label>

                        <input
                            type="number"
                            disabled={anonimo}
                            placeholder={anonimo ? "N/A" : "Edad"}
                        />
                    </div>

                    <div>
                        <label>Domicilio</label>
                        <textarea
                            rows={3}
                            disabled={anonimo}
                            placeholder="Domicilio de la persona"
                        />
                    </div>



                    <div>
                        <label>¿Usuario Frecuente?</label>
                        <select>
                            <option>No</option>
                            <option>Sí</option>
                        </select>
                    </div>

                    <div>
                        <label>¿Persona Afectada?</label>
                        <select>
                            <option>No</option>
                            <option>Sí</option>
                        </select>
                    </div>

                    <div>
                        <label>¿Migrante o Paisano?</label>
                        <select>
                            <option>Paisano</option>
                            <option>Migrante</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="titulo-con-boton">
                    <h2>Personas Afectadas</h2>

                    <button
                        type="button"
                        className="btn"
                        onClick={agregarPersona}
                    >
                        + Agregar Persona
                    </button>
                </div>

                {personas.map((_, index) => (
                    <div key={index} className="grid persona-card">
                        <div>
                            <label>Nombre</label>
                            <input type="text" />
                        </div>

                        <div>
                            <label>Sexo</label>
                            <select>
                                <option>Masculino</option>
                                <option>Femenino</option>
                            </select>
                        </div>

                        <div>
                            <label>Edad</label>
                            <input type="number" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="panel">
                <h2>Ubicación</h2>

                <div>
                    <label>Ubicación de los eventos</label>
                    <textarea
                        rows={3}
                        placeholder="Calle, colonia y entre qué calles"
                    />
                </div>

                <div>
                    <label>Referencia de la ubicación</label>
                    <textarea rows={3} />
                </div>
            </div>

            <div className="panel">
                <h2>Clasificación</h2>

                <div className="grid">
                    <div>
                        <label>Tipo de Emergencia</label>
                        <select />
                    </div>

                    <div>
                        <label>Tipo de Incidente</label>
                        <select />
                    </div>

                    <div>
                        <label>Prioridad</label>
                        <select>
                            <option>Alta</option>
                            <option>Media</option>
                            <option>Baja</option>
                        </select>
                    </div>
                </div>
            </div>



            <div className="panel">
                <h2>Canalización</h2>

                <div className="grid">
                    <div>
                        <label>Canal de Origen</label>
                        <input value="911" readOnly />
                    </div>

                    <div>
                        <label>Canalizado a</label>
                        <select>
                            <option>Protección Civil</option>
                            <option>Servicios Médicos</option>
                            <option>Bomberos</option>
                            <option>Seguridad Pública</option>
                        </select>
                    </div>

                    <div>
                        <label>Capturó</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Estatus</label>
                        <input value="Sin Despachar" readOnly />
                    </div>
                </div>
            </div>

            <div className="panel">
                <h2>Observaciones</h2>

                <textarea rows={6} />

                <div style={{ marginTop: 20 }}>
                    <button type="submit" className="btn">
                        Guardar Incidente
                    </button>
                </div>
            </div>

            <style jsx>{`
        .panel {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .panel h2 {
          color: #3b82f6;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #1e293b;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px;
        }

        .btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .titulo-con-boton {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .persona-card {
          padding: 16px;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        input:disabled,
select:disabled,
textarea:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.8;
}


      `}</style>
        </>
    );
}