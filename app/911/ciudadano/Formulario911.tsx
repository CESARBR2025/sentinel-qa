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
            {/* SECCIÓN 01 */}
            <div className="panel">
                <h2 className="sentinel-title">Datos del Incidente</h2>
                <div className="grid">
                    <div>
                        <label>Folio del Incidente</label>
                        <input type="text" placeholder="INC-0000" />
                    </div>
                    <div>
                        <label>Folio CAD</label>
                        <input type="text" placeholder="CAD-0000" />
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

            {/* SECCIÓN 02 */}
            <div className="panel">
                <h2 className="sentinel-title">Datos del Reportante</h2>
                <div className="grid">
                    <div>
                        <label>¿Reporte Anónimo?</label>
                        <select
                            value={anonimo ? "SI" : "NO"}
                            onChange={(e) => setAnonimo(e.target.value === "SI")}
                        >
                            <option value="NO">No (Identificado)</option>
                            <option value="SI">Sí (Anónimo)</option>
                        </select>
                    </div>
                    <div>
                        <label>Nombre del Reportante</label>
                        <input
                            type="text"
                            disabled={anonimo}
                            placeholder={anonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre completo"}
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
                            placeholder={anonimo ? "N/A" : "00"}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Domicilio del Reportante</label>
                        <textarea
                            rows={2}
                            disabled={anonimo}
                            placeholder="Dirección completa..."
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
                </div>
            </div>

            {/* SECCIÓN 03 */}
            <div className="panel">
                <div className="titulo-con-boton">
                    <h2 className="sentinel-title">Personas Afectadas</h2>
                    <button type="button" className="btn-secundario" onClick={agregarPersona}>
                        + Agregar Registro
                    </button>
                </div>

                {personas.map((_, index) => (
                    <div key={index} className="persona-card">
                        <div className="grid">
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
                    </div>
                ))}
            </div>

            {/* SECCIÓN 04 */}
            <div className="panel">
                <h2 className="sentinel-title">Ubicación de los Eventos</h2>
                <div className="grid">
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Dirección del Incidente</label>
                        <textarea rows={2} placeholder="Calle, colonia y entre qué calles..." />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Referencia Visual</label>
                        <textarea rows={2} placeholder="Fachada, puntos de interés cercanos..." />
                    </div>
                </div>
            </div>

            {/* SECCIÓN 05 */}
            <div className="panel">
                <h2 className="sentinel-title">Clasificación Técnica</h2>
                <div className="grid">
                    <div>
                        <label>Tipo de Emergencia</label>
                        <select><option>SEGURIDAD</option></select>
                    </div>
                    <div>
                        <label>Tipo de Incidente</label>
                        <select><option>ROBO</option></select>
                    </div>
                    <div>
                        <label>Prioridad</label>
                        <select>
                            <option>ALTA</option>
                            <option>MEDIA</option>
                            <option>BAJA</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 06 */}
            <div className="panel">
                <h2 className="sentinel-title">Canalización</h2>

                <div className="grid">
                    <div>
                        <label>Canal de Origen</label>
                        {/* Cambiamos value por defaultValue */}
                        <input
                            defaultValue="CENTRAL 911"
                            readOnly
                            className="readonly-input"
                        />
                    </div>

                    <div>
                        <label>Canalizado a</label>
                        <select defaultValue="Seguridad Pública">
                            <option value="Protección Civil">PROTECCIÓN CIVIL</option>
                            <option value="Servicios Médicos">SERVICIOS MÉDICOS</option>
                            <option value="Bomberos">BOMBEROS</option>
                            <option value="Seguridad Pública">SEGURIDAD PÚBLICA</option>
                        </select>
                    </div>

                    <div>
                        <label>Capturó</label>
                        <input type="text" placeholder="NOMBRE DEL OPERADOR" />
                    </div>

                    <div>
                        <label>Estatus</label>
                        <select>
                            <option>DESPACHO</option>
                            <option>SIN DESPACHO</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* OBSERVACIONES FINAL */}
            <div className="panel">
                <h2 className="sentinel-title">Observaciones</h2>
                <textarea rows={4} placeholder="Notas adicionales del operador..." />
                <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="btn-principal">
                        PUBLICAR REPORTE EN BITÁCORA
                    </button>
                </div>
            </div>

            <style jsx>{`
                /* CONTENEDORES TIPO SENTINEL */
                .panel {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 32px;
                    margin-bottom: 32px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.01);
                }

                /* TÍTULOS EN BARLOW */
                .sentinel-title {
                    font-family: 'Barlow Condensed', sans-serif;
                    color: #0f172a;
                    margin-bottom: 24px;
                    font-size: 18px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sentinel-title::before {
                    content: '';
                    width: 4px;
                    height: 18px;
                    background: #3b82f6;
                    display: block;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 24px;
                }

                /* ETIQUETAS EN JETBRAINS MONO */
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                }

                /* INPUTS TÉCNICOS */
                input, select, textarea {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-left: 3px solid #0f172a;
                    border-radius: 2px;
                    padding: 10px 12px;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    color: #1e293b;
                    transition: all 0.2s;
                    background: #ffffff;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: #fcfcfc;
                }

                .readonly-input {
                    background: #f8fafc;
                    border-left-color: #cbd5e1;
                    font-weight: 600;
                    color: #64748b;
                }

                /* BOTONES */
                .btn-principal {
                    background: #0f172a;
                    color: white;
                    border: none;
                    padding: 16px 48px;
                    border-radius: 2px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-principal:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .btn-secundario {
                    background: transparent;
                    color: #3b82f6;
                    border: 1px solid #3b82f6;
                    padding: 6px 14px;
                    border-radius: 2px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    cursor: pointer;
                }

                .titulo-con-boton {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .persona-card {
                    padding: 20px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-left: 3px solid #3b82f6;
                    border-radius: 2px;
                    margin-bottom: 12px;
                }

                input:disabled, select:disabled, textarea:disabled {
                    background: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
                    border-left-color: #e2e8f0;
                }
            `}</style>
        </>
    );
}