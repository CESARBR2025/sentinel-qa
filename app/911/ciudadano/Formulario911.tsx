/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createIncidente } from "@/lib/incidentes/actions";
import { useCallback, useRef } from "react"; // Ya tienes useState, añade estos
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export default function Formulario911({ user, catalogos }: {
    user: { name: string; apellido?: string }, catalogos: {
        emergencias: any[],
        incidentes: any[],
        prioridades: any[],
        canalizaciones: any[]
    }
}) {
    const [anonimo, setAnonimo] = useState(false);
    const [tipoReporte, setTipoReporte] = useState("normal");

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

    const [esLlamadaAlarma, setEsLlamadaAlarma] = useState(false);
    const [nombreResponsable, setNombreResponsable] = useState(""); // Nuevo estado

    // 1. Cargar la API
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries
    });

    // 2. Estados para coordenadas (San Juan del Río por defecto)
    const [coords, setCoords] = useState({ lat: 20.3889, lng: -99.9961 });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [direccion, setDireccion] = useState({ calle: "", colonia: "" });

    const buscarDireccion = (lat: number, lng: number) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                let calle = "";
                let numero = "";
                let colonia = "";

                results[0].address_components.forEach((comp) => {
                    if (comp.types.includes("route")) calle = comp.long_name;
                    if (comp.types.includes("street_number")) numero = comp.long_name;
                    if (comp.types.includes("sublocality") || comp.types.includes("neighborhood")) colonia = comp.long_name;
                });

                setDireccion({
                    calle: numero ? `${calle} ${numero}` : calle,
                    colonia: colonia
                });
            }
        });
    };

    // 3. Función para cuando busques una dirección en el buscador
    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();

        // Verificamos que existan geometry y location para que desaparezca el rojo
        if (place && place.geometry && place.geometry.location) {
            const location = place.geometry.location; // Guardamos en una constante

            const newPos = {
                lat: location.lat(), // Ahora ya no debería marcar error
                lng: location.lng()
            };

            setCoords(newPos);
            map?.panTo(newPos);

            // ... el resto de tu lógica de calle y colonia
            let calle = "";
            let numero = "";
            let colonia = "";

            place.address_components?.forEach((comp) => {
                const types = comp.types;
                if (types.includes("route")) calle = comp.long_name;
                if (types.includes("street_number")) numero = comp.long_name;
                if (types.includes("sublocality") || types.includes("neighborhood")) colonia = comp.long_name;
            });

            setDireccion({
                calle: numero ? `${calle} ${numero}` : calle,
                colonia: colonia
            });
        }
    };


    return (
        <form action={async (fd) => {
            // ESTO ES LO NUEVO:
            fd.append("latitud", coords.lat.toString());
            fd.append("longitud", coords.lng.toString());

            const inc = await createIncidente(fd);
            window.location.href = `/incidentes/${inc.id}`;
        }}>
            <input type="hidden" name="canal" value="911" />
            {/* SECCIÓN 01 */}
            <div className="panel">
                <h2 className="sentinel-title">Datos del Incidente</h2>
                <div className="grid">
                    <div>
                        <label>Folio del Incidente</label>
                        <input type="text" placeholder="INC-0000" className="readonly-input" value="SISTEMA-GENERADO" readOnly />
                    </div>
                    <div>
                        <label>Folio CAD</label>
                        <input type="text" name="folioCad" placeholder="CAD-0000" />
                    </div>
                    <div>
                        <label>Tipo de Reporte</label>
                        <select name="tipoReporte"
                            value={tipoReporte}
                            onChange={(e) => setTipoReporte(e.target.value)}>
                            <option value="normal">Normal</option>
                            <option value="extorsion">Extorsión</option>
                            <option value="alarma_escolar">Alarma Escolar</option>
                        </select>
                    </div>
                    <div>
                        <label>Fecha y Hora Inicio</label>
                        <input type="datetime-local" name="fechaHoraInicio" required />
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
                            name="anonimo"
                            value={anonimo ? "true" : "false"}
                            onChange={(e) => setAnonimo(e.target.value === "true")}
                        >
                            <option value="false">No (Identificado)</option>
                            <option value="true">Sí (Anónimo)</option>
                        </select>
                    </div>
                    <div>
                        <label>Nombre del Reportante</label>
                        <input
                            name="nombreReportante"
                            type="text"
                            disabled={anonimo}
                            placeholder={anonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre completo"}
                        />
                    </div>
                    <div>
                        <label>Sexo</label>
                        <select name="sexo" disabled={anonimo}>
                            <option value="NE">No especifica</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label>Edad</label>
                        <input
                            type="number"
                            name="edad"
                            disabled={anonimo}
                            placeholder={anonimo ? "N/A" : "00"}
                        />
                    </div>

                    <div>
                        <label>¿Usuario Frecuente?</label>
                        <select name="esUsuarioFrecuente">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>
                    <div>
                        <label>¿Persona Afectada?</label>
                        <select name="esPersonaAfectada">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>
                    <div>
                        <label>¿Es Migrante?</label>
                        <select name="esMigrante">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 03 - Actualizada */}
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
                                {/* Agregamos name="p_nombre" */}
                                <input type="text" name="p_nombre" placeholder="Nombre completo" />
                            </div>
                            <div>
                                <label>Sexo</label>
                                {/* Agregamos name="p_sexo" */}
                                <select name="p_sexo">
                                    <option value="NE">N/E</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                            <div>
                                <label>Edad</label>
                                {/* Agregamos name="p_edad" */}
                                <input type="number" name="p_edad" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN 04 */}
            <div className="panel">
                <h2 className="sentinel-title">Ubicación</h2>

                {isLoaded ? (
                    <div style={{ marginBottom: '20px' }}>
                        <label>Buscador de Dirección (Google Maps)</label>
                        <Autocomplete
                            onLoad={(ref) => (autocompleteRef.current = ref)}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <input
                                type="text"
                                placeholder="Escribe una dirección para centrar el mapa..."
                                style={{ marginBottom: '10px', borderLeft: '3px solid #3b82f6' }}
                            />
                        </Autocomplete>

                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '4px' }}
                            center={coords}
                            zoom={15}
                            onLoad={(map) => setMap(map)}
                            onClick={(e) => e.latLng && setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                            options={{ streetViewControl: false, mapTypeControl: false }}
                        >
                            <Marker
                                position={coords}
                                draggable={true}
                                onDragEnd={(e) => e.latLng && setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                            />
                        </GoogleMap>
                        <p style={{ fontSize: '10px', color: '#64748b', marginTop: '5px', fontFamily: 'monospace' }}>
                            COORDENADAS SELECCIONADAS: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                    </div>
                ) : (
                    <p>Cargando Mapa...</p>
                )}

                <div className="grid">
                    <div>
                        <label>Calle y número</label>
                        <input
                            type="text"
                            name="calle" // <--- Mantiene conexión con backend
                            value={direccion.calle} // <--- Esto hace que se llene solo
                            onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })} // <--- Permite correcciones manuales
                        />
                    </div>

                    <div>
                        <label>Colonia</label>
                        <input
                            type="text"
                            name="colonia" // <--- Mantiene conexión con backend
                            value={direccion.colonia} // <--- Esto hace que se llene solo
                            onChange={(e) => setDireccion({ ...direccion, colonia: e.target.value })} // <--- Permite correcciones manuales
                        />
                    </div>

                    <div>
                        <label>Municipio</label>
                        <input
                            type="text"
                            defaultValue="San Juan del Río"
                            name="municipio"
                        />
                    </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                    <label>Referencia de la Ubicación</label>
                    <textarea
                        rows={3}
                        placeholder="Frente a..., detrás de..., junto a..."
                        name="referenciaUbicacion"
                    />
                </div>
            </div>

            {tipoReporte === "extorsion" && (
                <div className="panel" style={{ borderLeftColor: "#e11d48" }}>
                    <h2 className="sentinel-title" style={{ color: "#e11d48" }}>Detalles de Extorsión</h2>
                    <div className="grid">
                        <div>
                            <label>Teléfono de Extorsión</label>
                            <input type="text" name="telefonoExtorsion" placeholder="442..." />
                        </div>
                        <div>
                            <label>Grupo Delictivo</label>
                            <input type="text" name="grupoDelictivo" />
                        </div>
                        <div>
                            <label>Modus Operandi</label>
                            <input type="text" name="modusOperandi" />
                        </div>
                    </div>
                </div>
            )}

            {tipoReporte === "alarma_escolar" && (
                <div className="panel" style={{ borderLeftColor: "#059669" }}>
                    <h2 className="sentinel-title" style={{ color: "#059669" }}>Detalles de Alarma Escolar</h2>
                    <div className="grid">
                        <div>
                            <label>Establecimiento / Escuela</label>
                            <input type="text" name="establecimiento" />
                        </div>

                        <div>
                            <label>¿Origen del Reporte?</label>
                            <select
                                value={esLlamadaAlarma ? "true" : "false"}
                                onChange={(e) => {
                                    const esLlamada = e.target.value === "true";
                                    setEsLlamadaAlarma(esLlamada);
                                    if (esLlamada) setNombreResponsable("SISTEMA");
                                    else setNombreResponsable("");
                                }}
                            >
                                <option value="false">Manual (Escribir nombre)</option>
                                <option value="true">Llamada (Automático)</option>
                            </select>
                        </div>

                        <div>
                            <label>Nombre del Responsable</label>
                            <input
                                type="text"
                                name="nombreResponsable"
                                value={nombreResponsable}
                                onChange={(e) => setNombreResponsable(e.target.value)}
                                readOnly={esLlamadaAlarma}
                                className={esLlamadaAlarma ? "readonly-input" : ""}
                                placeholder={esLlamadaAlarma ? "SISTEMA" : "Nombre de quien reporta"}
                            />
                        </div>

                        <div>
                            <label>Inmueble</label>
                            <input type="text" name="inmueble" />
                        </div>

                        {/* NUEVO CAMPO NUMÉRICO */}
                        <div>
                            <label>Número de Activaciones</label>
                            <input
                                type="number"
                                name="numeroActivaciones"
                                min="1"
                                defaultValue="1"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* MODIFICACIÓN: Si es extorsión, se ocultan estas dos secciones */}
            {tipoReporte !== "extorsion" && (
                <>
                    {/* SECCIÓN 05 */}
                    <div className="panel">
                        <h2 className="sentinel-title">Clasificación Técnica</h2>
                        <div className="grid">
                            <div>
                                <label>Tipo de Emergencia</label>
                                {/* Agregamos el condicional al required para que no bloquee el envío si está oculto */}
                                <select name="tipoEmergenciaId" required={tipoReporte !== "extorsion"}>
                                    <option value="">Seleccionar...</option>
                                    {catalogos.emergencias.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tipo de Incidente</label>
                                <select name="tipoIncidenteId" required={tipoReporte !== "extorsion"}>
                                    <option value="">Seleccionar...</option>
                                    {catalogos.incidentes.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Prioridad</label>
                                <select name="prioridadId" required={tipoReporte !== "extorsion"}>
                                    {catalogos.prioridades.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <label>Descripción del Incidente</label>
                                <textarea
                                    name="descripcion"
                                    rows={5}
                                    placeholder="Describa brevemente lo reportado por el ciudadano..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 06 */}
                    <div className="panel">
                        <h2>Canalización</h2>
                        <div className="grid">
                            <div>
                                <label>Medio de Canalización</label>
                                <select name="medioCanalizacionId">
                                    <option value="">Seleccionar...</option>
                                    {catalogos.canalizaciones.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>¿Requiere Despacho?</label>
                                <select name="requiereDespacho">
                                    <option value="true">Sí (Enviar a despacho)</option>
                                    <option value="false">No (Informativo)</option>
                                </select>
                            </div>
                            <div>
                                <label>Estatus Inicial</label>
                                <input value="SIN DESPACHAR" className="readonly-input" readOnly />
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <label>Observaciones del Operador</label>
                            <textarea name="observaciones" rows={3} placeholder="Notas internas..." />
                        </div>
                    </div>
                </>
            )}



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
        </form>
    );
}