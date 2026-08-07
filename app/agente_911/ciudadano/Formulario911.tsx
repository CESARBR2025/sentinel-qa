 
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { toast } from "sonner"
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "@/lib/maps/googleMapsConfig"
import { StepIndicator } from "@/components/partials/StepIndicator";
import { verificarTelefonoFrecuente } from "@/lib/incidentes/actions";
import ModalConfirmacion911 from "@/components/911/ModalConfirmacion911";

const COORDS_DEFAULT = { lat: 20.3889, lng: -99.9961 }

const STEPS = [
    'Incidente',
    'Reportante',
    'Ubicación',
    'Clasificación',
    'Canalización',
]

export default function Formulario911({ user, catalogos, despachadores }: {
    user: { name: string; apellido?: string }
    catalogos: {
        emergencias: { id: number; codigo: string; nombre: string }[]
        subtipos: { id: number; tipoEmergenciaId: number; codigo: string; nombre: string }[]
        incidentes: { id: number; nombre: string; subtipoEmergenciaId: number | null; codigoCatalogo: string | null; prioridadCatalogo: string | null }[]
        prioridades: { id: number; nombre: string }[]
        canalizaciones: { id: number; nombre: string }[]
        dependencias: { id: number; clave: string; nombre: string; tipo: string }[]
    }
    despachadores: { id: string; name: string; apellido: string; rolNombre: string | null; activo: boolean; enLinea: boolean }[]
}) {
    const [step, setStep] = useState(1);
    const [anonimo, setAnonimo] = useState(false);
    const [tipoReporte, setTipoReporte] = useState("normal");

    const [personas, setPersonas] = useState([
        { nombre: "", sexo: "", edad: "" },
    ]);

    const agregarPersona = useCallback(() => {
        setPersonas(p => [...p, { nombre: "", sexo: "", edad: "" }]);
    }, []);

    const [esLlamadaAlarma, setEsLlamadaAlarma] = useState(false);
    const [nombreResponsable, setNombreResponsable] = useState("");

    // Regla de negocio: usuario frecuente automático (>=5 reportes del mismo teléfono)
    const [usuarioFrecuente, setUsuarioFrecuente] = useState(false);
    const [verificandoTel, setVerificandoTel] = useState(false);

    // ¿El reportante es la persona afectada? Si NO, se renderizan las personas en paso 2.
    const [esPersonaAfectada, setEsPersonaAfectada] = useState("false");

    const verificarTelefono = useCallback(async () => {
        const tel = formRef.current
            ?.querySelector<HTMLInputElement>('input[name="telefonoReportante"]')?.value?.trim()
        if (!tel) { setUsuarioFrecuente(false); return }
        setVerificandoTel(true)
        try {
            const { count } = await verificarTelefonoFrecuente(tel)
            setUsuarioFrecuente(count >= 5)
        } catch { /* silencioso: el servidor re-verifica al publicar */ }
        finally { setVerificandoTel(false) }
    }, [])

    // Estado para selects jerárquicos de 3 niveles
    const [selectedTipo, setSelectedTipo] = useState<string>("")
    const [selectedSubtipo, setSelectedSubtipo] = useState<string>("")
    const [selectedIncidente, setSelectedIncidente] = useState<string>("")
    const subTiposFiltrados = selectedTipo
        ? catalogos.subtipos.filter(s => s.tipoEmergenciaId === Number(selectedTipo))
        : []
    const incidentesFiltrados = selectedSubtipo
        ? catalogos.incidentes.filter(i => i.subtipoEmergenciaId === Number(selectedSubtipo))
        : []
    const prioridadAutocompletada = selectedIncidente
        ? catalogos.incidentes.find(i => i.id === Number(selectedIncidente))?.prioridadCatalogo
        : null
    const esImprocedente = selectedTipo
        ? catalogos.emergencias.find(e => e.id === Number(selectedTipo))?.codigo === '7'
        : false

    // Estado del modal
    const formRef = useRef<HTMLFormElement>(null)

    // Auto-llenar fecha/hora actual al montar el formulario
    useEffect(() => {
        const now = new Date()
        const offset = now.getTimezoneOffset()
        const local = new Date(now.getTime() - offset * 60000)
        const input = document.querySelector<HTMLInputElement>('input[name="fechaHoraInicio"]')
        if (input && !input.value) {
            input.value = local.toISOString().slice(0, 16)
        }
        // Seleccionar primer item de catálogos si existen
        const autoSelectFirst = (name: string) => {
            const sel = document.querySelector<HTMLSelectElement>(`select[name="${name}"]`)
            if (sel && !sel.value) {
                const first = sel.querySelector('option:not([value=""])')
                if (first) sel.value = first.getAttribute('value') || ''
            }
        }
        autoSelectFirst('medioCanalizacionId')
    }, [catalogos])

    // 1. Cargar la API
    const { isLoaded } = useJsApiLoader({
        id: GOOGLE_MAPS_LOADER_ID,
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    // 2. Estados para coordenadas (San Juan del Río por defecto)
    const [coords, setCoords] = useState({ lat: 20.3889, lng: -99.9961 });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [direccion, setDireccion] = useState({ calle: "Av. Juárez", numeroExterior: "104", colonia: "Centro" });

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
                    calle: calle,
                    numeroExterior: numero,
                    colonia: colonia
                });
            }
        });
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            const newPos = { lat: location.lat(), lng: location.lng() };
            setCoords(newPos);
            map?.panTo(newPos);

            let calle = "";
            let numero = "";
            let colonia = "";
            // No necesitamos municipio en el estado si es fijo, 
            // pero lo extraemos para evitar que se meta en 'colonia'

            place.address_components?.forEach((comp) => {
                const types = comp.types;

                if (types.includes("route")) {
                    calle = comp.long_name;
                } else if (types.includes("street_number")) {
                    numero = comp.long_name;
                } else if (types.includes("sublocality_level_1") || types.includes("neighborhood")) {
                    // Priorizamos sublocalidad nivel 1 para la Colonia en México
                    colonia = comp.long_name;
                } else if (colonia === "" && types.includes("sublocality")) {
                    colonia = comp.long_name;
                }
            });

            setDireccion({
                calle: calle,
                numeroExterior: numero,
                colonia: colonia
            });
        }
    };

    const [modalAbierto, setModalAbierto] = useState(false)
    const [modalCtx, setModalCtx] = useState<{ data: Record<string, string>; coords: typeof COORDS_DEFAULT } | null>(null)

    const handleSubmit = () => {
        if (coords.lat === COORDS_DEFAULT.lat && coords.lng === COORDS_DEFAULT.lng) {
            toast.error('Coloca el marcador en la ubicación del incidente en el mapa')
            return
        }
        const fd = new FormData(formRef.current!)
        fd.append("latitud", coords.lat.toString());
        fd.append("longitud", coords.lng.toString());
        const data: Record<string, string> = {};
        fd.forEach((value, key) => { data[key] = String(value) })
        setModalCtx({ data, coords })
        setModalAbierto(true)
    }

    const reload = () => { window.location.reload() }

    return (
        <><form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input type="hidden" name="canal" value="911" />

            <StepIndicator paso={step} total={STEPS.length} nombre={STEPS[step - 1]} />

            {/* STEP 1 — SECCIÓN 01 */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <div className="panel">
                <h2 className="sentinel-title">Datos del Incidente</h2>
                <div className="grid">
                    <div>
                        <label>Folio del Incidente</label>
                        <input type="text" placeholder="SSPM-AL-AAAAMMDD-######" className="readonly-input" value="Se asigna al publicar" readOnly />
                    </div>
                    <div>
                        <label>Folio CAD</label>
                        <input type="text" name="folioCad" defaultValue="CAD-1234" placeholder="CAD-0000" />
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
            </div>

            {/* STEP 2 — SECCIÓN 02 */}
            <div style={{ display: step === 2 ? 'block' : 'none' }}>
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
                            defaultValue="Juan Pérez"
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
                            defaultValue="35"
                            disabled={anonimo}
                            placeholder={anonimo ? "N/A" : "00"}
                        />
                    </div>
                    <div>
                        <label>Teléfono del reportante (ANI)</label>
                        <input type="text" name="telefonoReportante" defaultValue="4421234567" placeholder="442..." onBlur={verificarTelefono} />
                    </div>

                    <div>
                        <label>¿Usuario Frecuente?</label>
                        <input
                            type="text"
                            className="readonly-input"
                            readOnly
                            value={verificandoTel ? 'Verificando...' : usuarioFrecuente ? 'SÍ (Automático)' : 'No'}
                        />
                        <input type="hidden" name="esUsuarioFrecuente" value={usuarioFrecuente ? 'true' : 'false'} />
                        <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--apple-font-display)' }}>
                            Se marca automáticamente si el teléfono tiene 5+ reportes previos
                        </span>
                    </div>
                    <div>
                        <label>¿El reportante es la persona afectada?</label>
                        <select
                            name="esPersonaAfectada"
                            value={esPersonaAfectada}
                            onChange={(e) => setEsPersonaAfectada(e.target.value)}
                        >
                            <option value="false">No (hay otras personas afectadas)</option>
                            <option value="true">Sí (el reportante es la persona afectada)</option>
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

                {esPersonaAfectada === "false" && (
                    <div style={{ marginTop: 24 }}>
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
                                        <input type="text" name="p_nombre" defaultValue="María López" placeholder="Nombre completo" />
                                    </div>
                                    <div>
                                        <label>Sexo</label>
                                        <select name="p_sexo">
                                            <option value="NE">N/E</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Edad</label>
                                        <input type="number" name="p_edad" defaultValue="30" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>

            {/* STEP 3 — SECCIÓN 03 (Ubicación) */}
            <div style={{ display: step === 3 ? 'block' : 'none' }}>
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
                                style={{ marginBottom: '10px', borderLeft: '3px solid #1f355a' }}
                            />
                        </Autocomplete>

                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '300px', borderRadius: 'var(--radius-lg)' }}
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
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontFamily: 'var(--apple-font-display)' }}>
                            Coordenadas seleccionadas: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                    </div>
                ) : (
                    <p>Cargando Mapa...</p>
                )}

                <div className="grid">
                    {/* CALLE */}
                    <div>
                        <label>Calle / Vialidad</label>
                        <input
                            type="text"
                            name="calle"
                            value={direccion.calle || ""}
                            onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
                            placeholder="Nombre de la calle"
                        />
                    </div>

                    {/* NÚMERO EXTERIOR (AUTORELLENABLE) */}
                    <div>
                        <label>Número Exterior</label>
                        <input
                            type="text"
                            name="numero_exterior" // <--- Importante para el backend
                            value={direccion.numeroExterior || ""}
                            onChange={(e) => setDireccion({ ...direccion, numeroExterior: e.target.value })}
                            placeholder="Ej. 104-B"
                        />
                    </div>

                    {/* NÚMERO INTERIOR (MANUAL) */}
                    <div>
                        <label>Número Interior</label>
                        <input
                            type="text"
                            name="numero_interior" // <--- Importante para el backend
                            defaultValue="A"
                            placeholder="Depto / Local"
                        />
                    </div>

                    {/* COLONIA */}
                    <div>
                        <label>Colonia</label>
                        <input
                            type="text"
                            name="colonia"
                            value={direccion.colonia || ""}
                            onChange={(e) => setDireccion({ ...direccion, colonia: e.target.value })}
                            placeholder="Nombre de la colonia"
                        />
                    </div>

                    {/* MUNICIPIO (Se queda igual) */}
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
                        defaultValue="Frente a la plaza principal"
                        placeholder="Frente a..., detrás de..., junto a..."
                        name="referenciaUbicacion"
                    />
                </div>
            </div>
            </div>

            {/* STEP 4 — Clasificación (extorsión/alarma + clasificación técnica) */}
            <div style={{ display: step === 4 ? 'block' : 'none' }}>

            {tipoReporte === "extorsion" && (
                <div className="panel" style={{ borderLeft: '4px solid #dc2626' }}>
                    <h2 className="sentinel-title" style={{ color: "#dc2626" }}>Detalles de Extorsión</h2>
                    <div className="grid">
                        <div>
                            <label>Teléfono de Extorsión</label>
                            <input type="text" name="telefonoExtorsion" defaultValue="4421234567" placeholder="442..." />
                        </div>
                        <div>
                            <label>Grupo Delictivo</label>
                            <input type="text" name="grupoDelictivo" defaultValue="Los Zetas" />
                        </div>
                        <div>
                            <label>Modus Operandi</label>
                            <input type="text" name="modusOperandi" defaultValue="Llamada telefónica amenazando" />
                        </div>
                        <div>
                            <label>Resultado</label>
                            <input type="text" name="resultado" defaultValue="Orientación" placeholder="Orientación, Reportante cuelga la llamada..." />
                        </div>
                    </div>
                </div>
            )}

            {tipoReporte === "alarma_escolar" && (
                <div className="panel" style={{ borderLeft: '4px solid #16a34a' }}>
                    <h2 className="sentinel-title" style={{ color: "#16a34a" }}>Detalles de Alarma Escolar</h2>
                    <div className="grid">
                        <div>
                            <label>Establecimiento / Escuela</label>
                            <input type="text" name="establecimiento" defaultValue="Escuela Primaria Benito Juárez" />
                        </div>

                        <div>
                            <label>Inmueble</label>
                            <input type="text" name="inmueble" defaultValue="Edificio principal" />
                        </div>

                        <div>
                            <label>Tipo de Señal</label>
                            <select name="reporteDescripcion" defaultValue="Alarma Instantánea">
                                <option value="Alarma Instantánea">Alarma Instantánea</option>
                                <option value="Detector Inalámbrico Desconectado">Detector Inalámbrico Desconectado</option>
                                <option value="Apagado CA">Apagado CA</option>
                                <option value="Alarma de Robo">Alarma de Robo</option>
                                <option value="Detector Manipulado">Detector Manipulado</option>
                                <option value="Alarma de Pánico">Alarma de Pánico</option>
                                <option value="Otro">Otro</option>
                            </select>
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
                            <label>Cargo del Responsable</label>
                            <input type="text" name="responsable" placeholder="Dirección, Delegada, Vocal..." />
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
                            <label>Verificador (operador C4)</label>
                            <input type="text" name="nombreVerificador" placeholder="Nombre de quien verifica" />
                        </div>

                        <div>
                            <label>Número de Activaciones</label>
                            <input
                                type="number"
                                name="activaciones"
                                min="1"
                                defaultValue="1"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label>¿Se confirmó como falsa?</label>
                            <select name="esFalso" defaultValue="">
                                <option value="">Sin confirmar</option>
                                <option value="true">Sí, alarma falsa</option>
                                <option value="false">No, alarma real</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* MODIFICACIÓN: Si es extorsión, se ocultan estas dos secciones */}
            {tipoReporte !== "extorsion" && (
                <>
                    {/* SECCIÓN 05 — Clasificación Técnica (Jerárquica 3 niveles) */}
                    <div className="panel">
                        <h2 className="sentinel-title">Clasificación Técnica</h2>
                        <div className="grid">
                            <div>
                                <label>Tipo de Emergencia</label>
                                <select
                                    name="tipoEmergenciaId"
                                    required={tipoReporte !== "extorsion"}
                                    value={selectedTipo}
                                    onChange={(e) => {
                                        setSelectedTipo(e.target.value)
                                        setSelectedSubtipo("")
                                        setSelectedIncidente("")
                                    }}
                                >
                                    <option value="">Seleccionar...</option>
                                    {catalogos.emergencias.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Subtipo de Emergencia</label>
                                <select
                                    name="subtipoEmergenciaId"
                                    required={tipoReporte !== "extorsion"}
                                    value={selectedSubtipo}
                                    onChange={(e) => {
                                        setSelectedSubtipo(e.target.value)
                                        setSelectedIncidente("")
                                    }}
                                    disabled={!selectedTipo}
                                >
                                    <option value="">{selectedTipo ? "Seleccionar subtipo..." : "Primero seleccione tipo"}</option>
                                    {subTiposFiltrados.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Incidente Específico</label>
                                <select
                                    name="tipoIncidenteId"
                                    required={tipoReporte !== "extorsion"}
                                    value={selectedIncidente}
                                    onChange={(e) => setSelectedIncidente(e.target.value)}
                                    disabled={!selectedSubtipo}
                                >
                                    <option value="">{selectedSubtipo ? "Seleccionar incidente..." : "Primero seleccione subtipo"}</option>
                                    {incidentesFiltrados.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Prioridad (autocompletada)</label>
                                <input
                                    type="text"
                                    className="readonly-input"
                                    readOnly
                                    value={prioridadAutocompletada || "—"}
                                />
                                <input type="hidden" name="prioridadCatalogo" value={prioridadAutocompletada || ""} />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label>Descripción del Incidente</label>
                                <textarea
                                    name="descripcion"
                                    rows={4}
                                    defaultValue="Reporte de prueba – persona sospechosa en via publica"
                                    placeholder="Describa brevemente lo reportado por el ciudadano..."
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            </div>
            {/* cierra STEP 5 (Clasificación) */}

            {/* STEP 5 — SECCIÓN 05 Canalización (también para extorsión: puede terminar con unidad real despachada) */}
            <div style={{ display: step === 5 ? 'block' : 'none' }}>
                <div className="panel">
                    <h2 className="sentinel-title">Canalización</h2>
                        <div className="grid">
                            <div>
                                <label>¿Requiere Despacho?</label>
                                <select key={esImprocedente ? "imp" : "normal"} name="requiereDespacho" disabled={esImprocedente} defaultValue={esImprocedente ? "false" : "true"}>
                                    <option value="true">Requiere Despacho</option>
                                    <option value="false">No requiere despacho</option>
                                </select>
                                {esImprocedente && (
                                    <span style={{ fontSize: 10, color: '#b45309', fontFamily: 'var(--apple-font-display)' }}>
                                        Tipo Improcedentes: no se canaliza a despacho, solo se registra con fines estadísticos
                                    </span>
                                )}
                            </div>
                            <div>
                                <label>Dependencia Responsable</label>
                                <select name="dependenciaId" className="readonly-input" style={{ borderLeftColor: '#cbd5e1' }}>
                                    {catalogos.dependencias.filter(d => d.clave === 'SEGURIDAD_PUBLICA').map(d => (
                                        <option key={d.id} value={d.id}>{d.nombre}</option>
                                    ))}
                                </select>
                                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--apple-font-display)' }}>
                                    Por el momento, todos los despachos se canalizan a Seguridad Pública
                                </span>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                    <input type="checkbox" name="svvNotificado" value="true" style={{ width: 'auto' }} />
                                    Notificar a Monitoristas (SVV)
                                </label>
                                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--apple-font-display)' }}>
                                    Los monitoristas recibirán una notificación para revisar cámaras cercanas
                                </span>
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <label>Observaciones del Operador</label>
                            <textarea name="observaciones" rows={3} defaultValue="Reporte de prueba para verificar flujo de creación" placeholder="Notas internas..." />
                        </div>
                </div>
                </div>
                {/* cierra STEP 5 (Canalización) */}

            {/* NAVEGACIÓN */}
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <button type="button" onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="btn-secundario" style={{ padding: '12px 32px' }}>
                    ← Anterior
                </button>

                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
                    {step} / {STEPS.length}
                </span>

                {step < STEPS.length ? (
                    <button type="button" onClick={() => setStep(Math.min(STEPS.length, step + 1))}
                        className="btn-principal" style={{ padding: '12px 32px' }}>
                        Siguiente →
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} className="btn-principal">
                        Publicar reporte en bitácora
                    </button>
                )}
            </div>

            <style jsx>{`
                /* CONTENEDORES */
                .panel {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: var(--radius-lg);
                    padding: 28px;
                    margin-bottom: 28px;
                    box-shadow: var(--shadow-card);
                }

                /* TÍTULOS DE SECCIÓN */
                .sentinel-title {
                    font-family: var(--apple-font-display);
                    color: #0f172a;
                    margin-bottom: 20px;
                    font-size: 16px;
                    font-weight: 600;
                    text-transform: none;
                    letter-spacing: normal;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sentinel-title::before {
                    content: '';
                    width: 3px;
                    height: 16px;
                    background: #1f355a;
                    border-radius: var(--radius-full);
                    display: block;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 20px 22px;
                }
                @media (max-width: 720px) {
                    .grid { grid-template-columns: 1fr; }
                }

                /* ETIQUETAS */
                label {
                    display: block;
                    margin-bottom: 6px;
                    font-family: var(--apple-font-display);
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: none;
                    letter-spacing: normal;
                    color: #64748b;
                }

                /* INPUTS */
                input, select, textarea {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: var(--radius-lg);
                    padding: 11px 13px;
                    font-family: var(--apple-font-display);
                    font-size: 14px;
                    color: #1e293b;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #1f355a;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(31,53,90,0.12);
                }

                .readonly-input {
                    background: #f8fafc;
                    font-weight: 500;
                    color: #64748b;
                }

                /* BOTONES */
                .btn-principal {
                    background: #1f355a;
                    color: #ffffff;
                    border: none;
                    padding: 14px 26px;
                    border-radius: var(--radius-lg);
                    font-family: var(--apple-font-display);
                    font-size: 15px;
                    font-weight: 600;
                    letter-spacing: normal;
                    text-transform: none;
                    cursor: pointer;
                    transition: all 0.15s;
                    box-shadow: 0 3px 10px rgba(31,53,90,0.28);
                }
                .btn-principal:hover {
                    background: #274268;
                    box-shadow: 0 4px 14px rgba(31,53,90,0.32);
                }
                .btn-principal:active {
                    transform: scale(0.97);
                }

                .btn-secundario {
                    background: #ffffff;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                    padding: 11px 20px;
                    border-radius: var(--radius-lg);
                    font-family: var(--apple-font-display);
                    font-size: 13px;
                    font-weight: 500;
                    text-transform: none;
                    letter-spacing: normal;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .btn-secundario:hover {
                    border-color: #1f355a;
                    color: #1f355a;
                    background: #f8fafc;
                }
                .btn-secundario:active {
                    transform: scale(0.97);
                }

                .titulo-con-boton {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .persona-card {
                    padding: 20px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: var(--radius-lg);
                    margin-bottom: 12px;
                }

                input:disabled, select:disabled, textarea:disabled {
                    background: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
                }
            `}</style>
        </form>

        {modalAbierto && modalCtx && (
            <ModalConfirmacion911
                open
                data={modalCtx.data}
                coords={modalCtx.coords}
                catalogos={catalogos}
                despachadores={despachadores}
                onClose={() => setModalAbierto(false)}
                onNuevo={reload}
            />
        )}
    </>
)
}