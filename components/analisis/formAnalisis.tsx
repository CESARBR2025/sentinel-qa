/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Navigation, Activity, User, MapPin, Calendar, Hash, ChevronRight, Fingerprint, Gavel, FileText, Shield, LocateFixed, ChevronLeft, Save, MessageSquare, Hand, Zap, AlertOctagon, Clock, AlertTriangle, Search, Car, Phone, Home } from 'lucide-react';
import { useDetenidoForm } from '@/hooks/useAnalistaForm';
import { analistaService } from '@/services/analistaService';
import GoogleMapPicker from '@/components/maps/GoogleMapPicker';



// Reutilizamos el SentinelField pero adaptado a Hooks
const SentinelField = ({ label, icon: Icon, name, value, onChange, as = 'input', ...props }: any) => {
    const Component = as;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {Icon && <Icon size={14} style={{ position: 'absolute', left: '12px', color: '#94a3b8', zIndex: 1 }} />}
                <Component
                    name={name}
                    value={value}
                    onChange={onChange}
                    {...props}
                    style={{
                        width: '100%',
                        padding: `12px 12px 12px ${Icon ? '40px' : '12px'}`,
                        border: '1px solid #e2e8f0',
                        borderLeft: '4px solid #3b82f6',
                        borderRadius: '2px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        outline: 'none',
                        ...props.style
                    }}
                />
            </div>
        </div>
    );
};

const ForceLevelToggle = ({ label, icon: Icon, name, checked, onChange, danger = false }: any) => (
    <label style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        background: checked ? (danger ? '#fef2f2' : '#eff6ff') : '#ffffff',
        border: `1px solid ${checked ? (danger ? '#ef4444' : '#3b82f6') : '#e2e8f0'}`,
        borderLeft: `6px solid ${checked ? (danger ? '#dc2626' : '#2563eb') : '#94a3b8'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: checked ? (danger ? '#fee2e2' : '#dbeafe') : '#f1f5f9',
                color: checked ? (danger ? '#dc2626' : '#2563eb') : '#64748b'
            }}>
                <Icon size={20} />
            </div>
            <span style={{
                fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 700,
                color: checked ? '#0f172a' : '#64748b', textTransform: 'uppercase'
            }}>
                {label}
            </span>
        </div>
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
    </label>
);

export default function RegistroDetenidoStepper() {
    const { step, formData, setFormData, handleChange, handleNext, handleBack, loading, setLoading } = useDetenidoForm();

    const handleLocationFromMap = (data: any) => {
        setFormData((prev: any) => ({
            ...prev,
            calleDetenido: data.calle,
            coloniaDetenido: data.colonia,
            numeroDetenido: data.numero,
            // Si tienes campos de lat/lng en el paso 2, actualízalos aquí también
            latitudArresto: data.lat.toString(),
            longitudArresto: data.lng.toString()
        }));
    };

    const finalizarRegistro = async () => {
        setLoading(true);
        try {
            await analistaService.registrarIPH(formData);
            alert("Registro IPH guardado con éxito.");
        } catch (e) {
            alert("Error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    const handleArrestoMapSelect = (data: any) => {
        setFormData((prev: any) => ({
            ...prev,
            calleArresto: data.calle,
            coloniaArresto: data.colonia,
            latitudArresto: data.lat.toString(),
            longitudArresto: data.lng.toString()
        }));
    };

    // Función para el botón "OBTENER GPS" (Usa la ubicación real del dispositivo)
    const getActualGPS = () => {
        if (!navigator.geolocation) return alert("Tu navegador no soporta geolocalización");

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            setFormData((prev: any) => ({
                ...prev,
                latitudArresto: latitude.toString(),
                longitudArresto: longitude.toString()
            }));

        }, () => alert("No se pudo obtener la ubicación actual"));
    };

    const handleHechoMapSelect = (data: any) => {
        setFormData((prev: any) => ({
            ...prev,
            calleHecho: data.calle,
            coloniaHecho: data.colonia,
            numeroHecho: data.numero,
            // Si necesitas guardar coordenadas específicas del hecho:
            latitudHecho: data.lat.toString(),
            longitudHecho: data.lng.toString()
        }));
    };

    // Función GPS para el HECHO
    const getHechoGPS = () => {
        if (!navigator.geolocation) return alert("Geolocalización no soportada");

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev: any) => ({
                ...prev,
                latitudHecho: latitude.toString(),
                longitudHecho: longitude.toString()
            }));
            // Nota: Aquí podrías disparar una geocodificación inversa manual si lo deseas
        }, () => alert("Error al capturar GPS"));
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&display=swap');
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; transition: all 0.3s; }
        .step-dot.active { background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
      `}</style>

            {/* INDICADOR DE PASOS TÁCTICO */}
            <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 1 ? '#0f172a' : '#94a3b8' }}>01. DATOS PERSONALES</span>
                </div>
                <div style={{ height: '1px', flexGrow: 1, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 2 ? '#0f172a' : '#94a3b8' }}>02. REGISTRO BIOMÉTRICO</span>
                </div>
                <div style={{ height: '1px', flexGrow: 1, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 3}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 3 ? '#0f172a' : '#94a3b8' }}>03. USO DE FUERZA</span>
                </div>
                <div style={{ height: '1px', flexGrow: 1, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 4}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 4 ? '#0f172a' : '#94a3b8' }}>04. INTEGRIDAD</span>
                </div>
                <div style={{ height: '1px', flexGrow: 1, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 5}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 5 ? '#0f172a' : '#94a3b8' }}>05. PASO 5</span>
                </div>
                <div style={{ height: '1px', flexGrow: 1, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`step-dot ${step >= 6}`} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: step === 6 ? '#0f172a' : '#94a3b8' }}>06. AFECTADOS Y CIERRE JUDICIAL</span>
                </div>
            </div>

            {/* CONTENIDO DEL PASO 1 */}
            {step === 1 && (
                <section className="sentinel-card" style={cardStyle}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={titleStyle}>IDENTIFICACIÓN DEL <span style={{ color: '#3b82f6' }}>DETENIDO</span></h2>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: 0 }}>Paso 1: Información básica y domicilio de origen.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {/* FILA 1 */}
                        <SentinelField label="Fecha de Nacimiento*" required name="fechaNacimiento" icon={Calendar} type="date" value={formData.fechaNacimiento} onChange={handleChange} />
                        <SentinelField label="Edad" required name="edad" icon={Hash} type="number" placeholder="00" value={formData.edad} onChange={handleChange} />
                        <SentinelField label="Género" required name="genero" as="select" value={formData.genero} onChange={handleChange}>
                            <option value="">SELECCIONAR</option>
                            <option value="M">MASCULINO</option>
                            <option value="F">FEMENINO</option>
                            <option value="NE">NO ESPECIFICA</option>
                        </SentinelField>

                        {/* FILA 2 */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <SentinelField label="Alias / Apodo" name="alias" icon={Fingerprint} placeholder="Ej: 'El Chori'..." value={formData.alias} onChange={handleChange} />
                        </div>
                        <SentinelField label="Ciudad de Origen" name="ciudadOrigen" icon={MapPin} placeholder="Municipio/Estado" value={formData.ciudadOrigen} onChange={handleChange} />

                        {/* SECCIÓN DOMICILIO */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <label style={{ ...labelStyle, marginBottom: '10px', display: 'block' }}>
                                <MapPin size={12} style={{ marginRight: 5 }} /> Ubicación en Mapa (Clic para fijar domicilio)
                            </label>
                            <GoogleMapPicker onLocationSelect={handleLocationFromMap} />

                            <h3 style={{ ...labelStyle, color: '#0f172a', marginBottom: '16px' }}>Domicilio del Detenido</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '24px' }}>
                                <SentinelField label="Calle" name="calleDetenido" icon={MapPin} placeholder="Av. Principal..." value={formData.calleDetenido} onChange={handleChange} />
                                <SentinelField label="Número" name="numeroDetenido" placeholder="Ext/Int" value={formData.numeroDetenido} onChange={handleChange} />
                                <SentinelField label="Colonia" name="coloniaDetenido" placeholder="Fraccionamiento..." value={formData.coloniaDetenido} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* BOTÓN SIGUIENTE */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleNext}
                            style={btnNextStyle}
                        >
                            CONTINUAR AL PASO 2
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {step === 2 && (
                <section className="sentinel-card" style={cardStyle}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={titleStyle}>DATOS JURÍDICOS Y <span style={{ color: '#3b82f6' }}>LUGAR DE ARRESTO</span></h2>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: 0 }}>Paso 2: Clasificación de la falta y geolocalización.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

                        {/* SECCIÓN LEGAL */}
                        <SentinelField label="Artículo" name="articulo" icon={Gavel} placeholder="Ej: Art. 25..." value={formData.articulo} onChange={handleChange} />
                        <div style={{ gridColumn: 'span 2' }}>
                            <SentinelField label="Tipo de Falta Administrativa" name="tipoFalta" icon={FileText} placeholder="Descripción de la infracción..." value={formData.tipoFalta} onChange={handleChange} />
                        </div>
                        <div style={{ gridColumn: 'span 3' }}>
                            <SentinelField label="Registro Nacional de Detenidos (RND)" name="rnd" icon={Hash} placeholder="Folio oficial RND..." value={formData.rnd} onChange={handleChange} />
                        </div>

                        {/* SECCIÓN UBICACIÓN DEL ARRESTO */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <MapPin size={16} color="#3b82f6" />
                                <h3 style={{ ...labelStyle, color: '#0f172a', margin: 0 }}>Ubicación del Arresto (Mapa Táctico)</h3>
                            </div>

                            {/* MAPA DE GOOGLE PARA EL ARRESTO */}
                            <div style={{ marginBottom: '24px' }}>
                                <GoogleMapPicker onLocationSelect={handleArrestoMapSelect} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '24px' }}>
                                <SentinelField
                                    label="Lugar de Arresto (Calle/Av)"
                                    name="calleArresto"
                                    icon={MapPin}
                                    placeholder="Detectado por mapa..."
                                    value={formData.calleArresto}
                                    onChange={handleChange}
                                />
                                <SentinelField
                                    label="Colonia"
                                    name="coloniaArresto"
                                    placeholder="Detectado por mapa..."
                                    value={formData.coloniaArresto}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* SECCIÓN OPERATIVA */}
                        <SentinelField label="Sector" name="sectorArresto" icon={Shield} as="select" value={formData.sectorArresto} onChange={handleChange}>
                            <option value="">SELECCIONAR</option>
                            <option value="CENTRO">CENTRO</option>
                            <option value="NORTE">NORTE</option>
                            <option value="SUR">SUR</option>
                        </SentinelField>

                        <div style={{ gridColumn: 'span 2' }}>
                            <SentinelField
                                label="Agrupamiento"
                                name="agrupamientoArresto"
                                icon={Shield}
                                placeholder="Unidad o grupo responsable..."
                                value={formData.agrupamientoArresto}
                                onChange={handleChange}
                            />
                        </div>

                        {/* COORDENADAS */}
                        <SentinelField
                            label="Latitud"
                            name="latitudArresto"
                            icon={Navigation}
                            placeholder="0.000000"
                            value={formData.latitudArresto}
                            onChange={handleChange}
                        />
                        <SentinelField
                            label="Longitud"
                            name="longitudArresto"
                            icon={Navigation}
                            placeholder="0.000000"
                            value={formData.longitudArresto}
                            onChange={handleChange}
                        />

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={getActualGPS} // <--- Conectamos la función GPS
                                style={btnGeoStyle}
                            >
                                <LocateFixed size={14} />
                                OBTENER GPS
                            </button>
                        </div>

                    </div>

                    {/* BOTONES DE NAVEGACIÓN */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handleBack} style={btnBackStyle}>
                            <ChevronLeft size={16} />
                            ANTERIOR
                        </button>
                        <button onClick={handleNext} style={btnNextStyle}>
                            CONTINUAR AL PASO 3
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {step === 3 && (
                <section className="sentinel-card" style={cardStyle}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={titleStyle}>NIVELES DEL <span style={{ color: '#3b82f6' }}>USO DE LA FUERZA</span></h2>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Paso 3: Indique los niveles de control aplicados según la resistencia del ciudadano.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        <ForceLevelToggle
                            label="Presencia Policial"
                            icon={Shield}
                            name="presencia"
                            checked={formData.presencia}
                            onChange={handleChange}
                        />

                        <ForceLevelToggle
                            label="Verbalización"
                            icon={MessageSquare}
                            name="verbalizacion"
                            checked={formData.verbalizacion}
                            onChange={handleChange}
                        />

                        <ForceLevelToggle
                            label="Control de Contacto"
                            icon={Hand}
                            name="controlContacto"
                            checked={formData.controlContacto}
                            onChange={handleChange}
                        />

                        <ForceLevelToggle
                            label="Control Físico"
                            icon={Activity}
                            name="controlFisico"
                            checked={formData.controlFisico}
                            onChange={handleChange}
                        />

                        <ForceLevelToggle
                            label="Técnicas Defensivas No Letales"
                            icon={Zap}
                            name="tecnicasNoLetales"
                            checked={formData.tecnicasNoLetales}
                            onChange={handleChange}
                        />

                        <ForceLevelToggle
                            label="Fuerza Potencial Letal"
                            icon={AlertOctagon}
                            name="fuerzaLetal"
                            checked={formData.fuerzaLetal}
                            onChange={handleChange}
                            danger={true}
                        />

                    </div>

                    {/* BOTONES DE NAVEGACIÓN */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handleBack} style={btnBackStyle}>
                            <ChevronLeft size={16} />
                            ANTERIOR
                        </button>
                        <button onClick={handleNext} style={btnNextStyle}>
                            CONTINUAR AL PASO 4
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {step === 4 && (
                <section className="sentinel-card" style={cardStyle}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={titleStyle}>TIEMPOS Y <span style={{ color: '#3b82f6' }}>FOLIOS OFICIALES</span></h2>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Paso 4: Registro de folios de control y cronología exacta del evento.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

                        {/* SECCIÓN FOLIOS */}
                        <SentinelField
                            label="Folio IPH"
                            name="folioIPH"
                            icon={FileText}
                            placeholder="Ej: SSPM/IPH/000/2026"
                            value={formData.folioIPH}
                            onChange={handleChange}
                        />
                        <SentinelField
                            label="Folio 911"
                            name="folio911"
                            icon={Hash}
                            placeholder="Folio de llamada"
                            value={formData.folio911}
                            onChange={handleChange}
                        />
                        <SentinelField
                            label="Día del Evento"
                            name="diaEvento"
                            as="select"
                            value={formData.diaEvento}
                            onChange={handleChange}
                        >
                            <option value="">SELECCIONAR</option>
                            <option value="LUNES">LUNES</option>
                            <option value="MARTES">MARTES</option>
                            <option value="MIERCOLES">MIÉRCOLES</option>
                            <option value="JUEVES">JUEVES</option>
                            <option value="VIERNES">VIERNES</option>
                            <option value="SABADO">SÁBADO</option>
                            <option value="DOMINGO">DOMINGO</option>
                        </SentinelField>

                        {/* SECCIÓN FECHAS */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <h3 style={{ ...labelStyle, color: '#0f172a', marginBottom: '16px' }}>Cronología de Fechas</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <SentinelField label="Fecha del Evento" name="fechaEvento" icon={Calendar} type="date" value={formData.fechaEvento} onChange={handleChange} />
                                <SentinelField label="Fecha de Reporte (Admin)" name="fechaReporte" icon={Calendar} type="date" value={formData.fechaReporte} onChange={handleChange} />
                            </div>
                        </div>

                        {/* SECCIÓN HORAS */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <h3 style={{ ...labelStyle, color: '#0f172a', marginBottom: '16px' }}>Registro de Horarios</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                <SentinelField label="Hora Reporte" name="horaReporte" icon={Clock} type="time" value={formData.horaReporte} onChange={handleChange} />
                                <SentinelField label="Inicio Evento" name="horaInicioEvento" icon={Clock} type="time" value={formData.horaInicioEvento} onChange={handleChange} />
                                <SentinelField label="Final Evento" name="horaFinalEvento" icon={Clock} type="time" value={formData.horaFinalEvento} onChange={handleChange} />
                                <SentinelField label="Hora Promedio" name="horaPromedio" icon={Clock} type="time" value={formData.horaPromedio} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* BOTONES DE NAVEGACIÓN FINAL */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handleBack} style={btnBackStyle}>
                            <ChevronLeft size={16} /> ANTERIOR
                        </button>
                        <button onClick={handleNext} style={btnNextStyle}>
                            CONTINUAR AL PASO 5
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {step === 5 && (
                <section className="sentinel-card" style={cardStyle}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={titleStyle}>DETALLES DE LA <span style={{ color: '#3b82f6' }}>INTERVENCIÓN</span></h2>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Paso 5: Clasificación del delito, ubicación del hecho y datos de la unidad responsable.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

                        {/* SECCIÓN DELITO */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <SentinelField label="Delito" name="delito" icon={AlertTriangle} placeholder="Nombre del delito imputado..." value={formData.delito} onChange={handleChange} />
                        </div>
                        <SentinelField label="Modus Operandi" name="modusOperandi" icon={Search} placeholder="Ej: Asalto con violencia..." value={formData.modusOperandi} onChange={handleChange} />

                        <div style={{ gridColumn: 'span 3' }}>
                            <SentinelField label="Artículos u Objetos Asegurados" name="articulosObjetos" as="textarea" placeholder="Describa armas, pertenencias o bienes recuperados..." value={formData.articulosObjetos} onChange={handleChange} style={{ minHeight: '80px' }} />
                        </div>

                        {/* SECCIÓN UBICACIÓN DEL HECHO */}
                        {/* SECCIÓN UBICACIÓN DEL HECHO */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={16} color="#3b82f6" />
                                    <h3 style={{ ...labelStyle, color: '#0f172a', margin: 0 }}>Ubicación del Hecho (Mapa Táctico)</h3>
                                </div>

                                {/* Botón GPS integrado en la cabecera de la sección */}
                                <button
                                    type="button"
                                    onClick={getHechoGPS}
                                    style={{ ...btnGeoStyle, width: 'auto', height: '32px', padding: '0 12px' }}
                                >
                                    <LocateFixed size={12} />
                                    USAR UBICACIÓN ACTUAL
                                </button>
                            </div>

                            {/* MAPA DE GOOGLE PARA EL HECHO */}
                            <div style={{ marginBottom: '24px' }}>
                                <GoogleMapPicker onLocationSelect={handleHechoMapSelect} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                <SentinelField
                                    label="Calle"
                                    name="calleHecho"
                                    icon={MapPin}
                                    placeholder="Detectado por mapa..."
                                    value={formData.calleHecho}
                                    onChange={handleChange}
                                />
                                <SentinelField
                                    label="Número o Referencia"
                                    name="numeroHecho"
                                    placeholder="Ej: No. 123 o Frente a tienda..."
                                    value={formData.numeroHecho}
                                    onChange={handleChange}
                                />
                                <SentinelField
                                    label="Colonia"
                                    name="coloniaHecho"
                                    placeholder="Detectado por mapa..."
                                    value={formData.coloniaHecho}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* SECCIÓN RESPONSABLES */}
                        <div style={{ gridColumn: 'span 3', marginTop: '12px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <h3 style={{ ...labelStyle, color: '#0f172a', marginBottom: '16px' }}>Unidad y Mando Responsable</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                                <SentinelField label="Sector" name="sectorHecho" icon={Shield} as="select" value={formData.sectorHecho} onChange={handleChange}>
                                    <option value="">SELECCIONAR</option>
                                    <option value="CENTRO">CENTRO</option>
                                    <option value="NORTE">NORTE</option>
                                    <option value="SUR">SUR</option>
                                    <option value="ORIENTE">ORIENTE</option>
                                </SentinelField>
                                <SentinelField label="RT (Mando)" name="rtResponsable" icon={User} placeholder="Nombre del RT..." value={formData.rtResponsable} onChange={handleChange} />
                                <SentinelField label="Turno" name="turnoResponsable" as="select" value={formData.turnoResponsable} onChange={handleChange}>
                                    <option value="">SELECCIONAR</option>
                                    <option value="A">TURNO A</option>
                                    <option value="B">TURNO B</option>
                                    <option value="C">TURNO C</option>
                                </SentinelField>
                                <SentinelField label="CRP (Unidad)" name="crpUnidad" icon={Shield} placeholder="Ej: SSPM-000" value={formData.crpUnidad} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* BOTONES DE NAVEGACIÓN FINAL */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handleBack} style={btnBackStyle}>
                            <ChevronLeft size={16} /> ANTERIOR
                        </button>
                        <button onClick={handleNext} style={btnNextStyle}>
                            CONTINUAR AL PASO 6
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {step === 6 && (
                <section style={cardStyle}>
                    <h2 style={titleStyle}>06. AFECTADOS Y CIERRE <span style={{ color: '#3b82f6' }}>JUDICIAL</span></h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <SentinelField label="Nombre del Afectado" name="nombreAfectado" icon={User} value={formData.nombreAfectado} onChange={handleChange} />
                            <SentinelField label="Teléfono de Afectado" name="telefonoAfectado" icon={Phone} value={formData.telefonoAfectado} onChange={handleChange} />
                            <SentinelField label="Calle del Afectado" name="calleAfectado" icon={Home} value={formData.calleAfectado} onChange={handleChange} />
                            <SentinelField label="Numero de domicilio" name="numeroAfectado" icon={Home} value={formData.numeroAfectado} onChange={handleChange} />
                            <SentinelField label="Colonia del afectado" name="coloniaAfectado" icon={Home} value={formData.coloniaAfectado} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '15px', border: '1px solid #e2e8f0' }}>
                            <SentinelField label="Marca" name="marcaVehiculo" icon={Car} value={formData.marcaVehiculo} onChange={handleChange} />
                            <SentinelField label="Submarca" name="submarcaVehiculo" value={formData.submarcaVehiculo} onChange={handleChange} />
                            <SentinelField label="Tipo de Vehiculo" name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} />
                            <SentinelField label="Color del Vehiculo" name="colorVehiculo" value={formData.colorVehiculo} onChange={handleChange} />
                            <SentinelField label="Placas" name="placasVehiculo" value={formData.placasVehiculo} onChange={handleChange} />
                            <SentinelField label="Estado del vehiculo" name="estadoVehiculo" value={formData.estadoVehiculo} onChange={handleChange} />
                            <SentinelField label="Niv Vehiculo" name="nivVehiculo" value={formData.nivVehiculo} onChange={handleChange} />
                            <SentinelField label="Motor del Vehiculo" name="motorVehiculo" value={formData.motorVehiculo} onChange={handleChange} />
                            <SentinelField label="Modelo" name="modeloVehiculo" value={formData.modeloVehiculo} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                            <SentinelField label="AP / NUC" name="apNuc" icon={FileText} value={formData.apNuc} onChange={handleChange} />
                            <SentinelField label="Fuero" name="fuero" as="select" value={formData.fuero} onChange={handleChange}>
                                <option value="">SELECCIONAR</option><option value="COMUN">COMÚN</option><option value="FEDERAL">FEDERAL</option>
                            </SentinelField>
                            <SentinelField label="Agente Aprehensor" name="agenteAprehensor" icon={Shield} value={formData.agenteAprehensor} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={footerActions}><button onClick={handleBack} style={btnBackStyle}><ChevronLeft size={16} /> ANTERIOR</button><button onClick={finalizarRegistro} style={btnFinishStyle} disabled={loading}>{loading ? 'GUARDANDO...' : <><Save size={16} /> FINALIZAR IPH</>}</button></div>
                </section>
            )}
        </div>
    );
}



const StepIndicator = ({ label, active }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: active ? '#3b82f6' : '#e2e8f0',
            boxShadow: active ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
        }} />
        <span style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700,
            color: active ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap'
        }}>{label}</span>
    </div>
);

// --- ESTILOS ---
const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const titleStyle = { fontFamily: 'Barlow Condensed', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase' as const, margin: '0 0 8px 0', color: '#0f172a', letterSpacing: '0.02em' };
const labelStyle = { fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };
const lineStyle = { height: '1px', flexGrow: 1, background: '#e2e8f0' };

const btnNextStyle = {
    background: '#0f172a', color: '#ffffff', border: 'none', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s'
};
const btnBackStyle = {
    background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
};
const btnGeoStyle = {
    background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', padding: '12px 20px',
    fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '100%', height: '46px'
};
const btnFinishStyle = {
    background: '#059669', color: '#ffffff', border: 'none', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
};
const footerActions = { marginTop: '32px', display: 'flex', justifyContent: 'space-between', gap: '15px' };
