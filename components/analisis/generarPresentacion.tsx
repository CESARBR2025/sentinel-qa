/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { User, FileText, Camera, Calendar, MapPin, Briefcase, GraduationCap, Heart, Fingerprint, AlertCircle, ChevronRight, Gavel, Clock, Map, Link as LinkIcon, Zap, History, Info, ChevronLeft, Check, Shield, Hash } from 'lucide-react';
import { useRegistroDetenido } from '@/hooks/useRegistroDetenido';
import GoogleMapPicker from '@/components/maps/GoogleMapPicker';
import { registroDetenidoService } from '@/services/registroDetenidoService';
import { generateDetenidoPPT } from '@/lib/utils/generatePPT';
import { analisisService } from '@/services/analisisService';



export default function RegistroDetenidoForm() {

    const { step, formData, setFormData, fotos, handleTextChange, handleChange, handleFileChange, handleNext, handleBack, loading, setLoading } = useRegistroDetenido();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        console.log("ID =", id);
        console.log("URL =", window.location.href);

        if (id) {
            const cargar = async () => {
                setLoading(true);
                try {
                    // Llamamos al servicio que ya tienes
                    const d = await registroDetenidoService.getPrellenadoInteligencia(id);
                    console.log(d);

                    if (d && !d.error) {

                        const clean = (obj: any) =>
                            Object.fromEntries(
                                Object.entries(obj).map(([k, v]) => [
                                    k,
                                    v === null || v === undefined ? "" : v,
                                ])
                            );
                        setFormData(prev => ({
                            ...prev,
                            ...clean(d),
                            // Formateo para input datetime-local
                            fechaHora: d.fechaHora ? d.fechaHora.substring(0, 16).replace(' ', 'T') : ''
                        }));
                    }
                } catch (e) {
                    console.error("Error en prellenado:", e);
                } finally {
                    setLoading(false);
                }
            };
            cargar();
        }
    }, [setFormData, setLoading]);

    const handleMapUpdate = (data: any, field: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: `${data.calle}, ${data.colonia}`.trim()
        }));
    };

    const handleFinalize = async () => {
        // 1. Validación de seguridad
        if (!confirm("¿Confirmar registro y generar reporte PowerPoint?")) return;

        setLoading(true); // Activamos el estado de carga

        try {
            // 2. CONEXIÓN A BASE DE DATOS
            // Enviamos los datos y las fotos al servidor
            await registroDetenidoService.guardarFichaCompleta(formData, fotos);

            // 3. CONEXIÓN AL GENERADOR DE PPT
            // Usamos los mismos datos que ya tenemos en el estado (formData y fotos)
            // Esta función hará que el navegador descargue el archivo automáticamente
            await generateDetenidoPPT(formData, fotos);

            alert("REGISTRO EXITOSO: Ficha guardada e informe generado.");

        } catch (error: any) {
            console.error(error);
            alert("ERROR EN EL SISTEMA: " + error.message);
        } finally {
            setLoading(false); // Apagamos el estado de carga
        }
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* CARD PRINCIPAL */}
            {step === 1 && (
                <div style={cardStyle}>
                    <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                        <h2 style={titleStyle}>01. FICHA DE <span style={{ color: '#3e5171' }}>IDENTIFICACIÓN</span></h2>
                        <p style={subLabelStyle}>Registro de datos generales y evidencia fotográfica del detenido.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>

                        {/* COLUMNA 1: FOTOS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <SentinelFileField
                                label="Fotografía Frontal"
                                name="fotoFrontal"
                                file={fotos.fotoFrontal}
                                onChange={handleFileChange}
                            />
                            <SentinelFileField
                                label="Evidencia (Armas/Objetos)"
                                name="fotoObjetos"
                                file={fotos.fotoObjetos}
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* COLUMNA 2 y 3: DATOS */}
                        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <SentinelField label="Nombre Completo del Detenido" name="nombreDetenido" icon={User} value={formData.nombreDetenido} onChange={handleTextChange} />
                            </div>
                            <SentinelField label="Folio de Registro" name="folio" icon={FileText} value={formData.folio ?? ""} onChange={handleTextChange} placeholder="REG-000" />
                            <SentinelField label="Fecha de Nacimiento" name="fechaNacimiento" icon={Calendar} type="date" value={formData.fechaNacimiento} onChange={handleTextChange} />

                            <SentinelField label="Origen (Ciudad/Edo)" name="origen" icon={MapPin} value={formData.origen} onChange={handleTextChange} />
                            <SentinelField label="Género" name="genero" as="select" value={formData.genero} onChange={handleTextChange}>
                                <option value="">SELECCIONAR</option>
                                <option value="M">MASCULINO</option>
                                <option value="F">FEMENINO</option>
                            </SentinelField>

                            <SentinelField label="Escolaridad" name="escolaridad" icon={GraduationCap} as="select" value={formData.escolaridad} onChange={handleTextChange}>
                                <option value="">SELECCIONAR</option>
                                <option value="PRIMARIA">PRIMARIA</option>
                                <option value="SECUNDARIA">SECUNDARIA</option>
                                <option value="PREPARATORIA">PREPARATORIA</option>
                                <option value="UNIVERSIDAD">UNIVERSIDAD</option>
                            </SentinelField>
                            <SentinelField label="Estado Civil" name="estadoCivil" icon={Heart} as="select" value={formData.estadoCivil} onChange={handleTextChange}>
                                <option value="">SELECCIONAR</option>
                                <option value="SOLTERO">SOLTERO(A)</option>
                                <option value="CASADO">CASADO(A)</option>
                                <option value="UNION_LIBRE">UNIÓN LIBRE</option>
                            </SentinelField>

                            <div style={{ gridColumn: 'span 2' }}>
                                <SentinelField label="Ocupación" name="ocupacion" icon={Briefcase} value={formData.ocupacion} onChange={handleTextChange} />
                            </div>
                        </div>

                        {/* FILA COMPLETA: DOMICILIO Y NARRATIVA */}
                        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '10px' }}>
                            <SentinelField label="Domicilio Actual" name="domicilio" icon={MapPin} value={formData.domicilio} onChange={handleTextChange} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <SentinelField label="Rasgos Particulares" name="rasgosParticulares" icon={Fingerprint} as="textarea" value={formData.rasgosParticulares} onChange={handleTextChange} placeholder="Tatuajes, cicatrices, señas..." />
                                <SentinelField label="Eventos Delictivos Previos" name="eventosDelictivos" icon={AlertCircle} as="textarea" value={formData.eventosDelictivos} onChange={handleTextChange} placeholder="Historial o relación con otros folios..." />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={handleNext} // <--- AGREGA ESTO
                            style={btnNextStyle}
                        >
                            CONTINUAR AL PASO 2 <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div style={cardStyle} className="animate-tactical">
                    <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={titleStyle}>02. DATOS <span style={{ color: '#3e5171' }}>OPERATIVOS Y LEGALES</span></h2>
                            <p style={subLabelStyle}>Vinculación de folios, geolocalización e inteligencia criminal.</p>
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#3e5171', fontWeight: 700 }}>PASO 2 DE 2</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

                        {/* BLOQUE: CONTROL LEGAL */}
                        <SentinelField label="Fecha y Hora del Evento" name="fechaHora" icon={Clock} type="datetime-local" value={formData.fechaHora} onChange={handleTextChange} />
                        <SentinelField label="Folio RND" name="rnd" icon={Hash} value={formData.rnd} onChange={handleTextChange} placeholder="Registro Nacional..." />
                        <SentinelField label="Folio IPH" name="iph" icon={FileText} value={formData.iph} onChange={handleTextChange} placeholder="Informe Policial..." />

                        <SentinelField label="No. Expediente" name="expediente" icon={FileText} value={formData.expediente} onChange={handleTextChange} />
                        <SentinelField label="Puesta a Disposición" name="puestaDisposicion" icon={Gavel} value={formData.puestaDisposicion} onChange={handleTextChange} placeholder="Autoridad que recibe..." />
                        <SentinelField label="Zona de Operación" name="zonaOperacion" icon={Shield} value={formData.zonaOperacion} onChange={handleTextChange} placeholder="Sector o cuadrante..." />

                        {/* BLOQUE: UBICACIONES CON MAPA */}
                        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '10px' }}>
                            <div style={mapBoxStyle}>
                                <label style={labelStyle}><Map size={12} /> Lugar del Evento</label>
                                <GoogleMapPicker onLocationSelect={(d: any) => handleMapUpdate(d, 'lugarEvento')} />
                                <div style={{ marginTop: '10px' }}>
                                    <SentinelField label="Dirección Evento" name="lugarEvento" value={formData.lugarEvento} onChange={handleTextChange} />
                                </div>
                            </div>
                            <div style={mapBoxStyle}>
                                <label style={labelStyle}><Map size={12} /> Lugar de la Detención</label>
                                <GoogleMapPicker onLocationSelect={(d: any) => handleMapUpdate(d, 'lugarDetencion')} />
                                <div style={{ marginTop: '10px' }}>
                                    <SentinelField label="Dirección Detención" name="lugarDetencion" value={formData.lugarDetencion} onChange={handleTextChange} />
                                </div>
                            </div>
                        </div>

                        {/* BLOQUE: INTELIGENCIA Y NARRATIVA */}
                        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <SentinelField label="Modus Operandi" name="modusOperandi" icon={Zap} as="textarea" value={formData.modusOperandi} onChange={handleTextChange} />
                            <SentinelField label="Nexos Delictivos" name="nexosDelictivos" icon={LinkIcon} as="textarea" value={formData.nexosDelictivos} onChange={handleTextChange} placeholder="Bandas, cómplices o grupos..." />
                        </div>

                        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <SentinelField label="Delitos (Antecedentes)" name="antecedentes" icon={History} as="textarea" value={formData.antecedentes} onChange={handleTextChange} />
                            <SentinelField label="Faltas Administrativas" name="faltasAdmin" icon={History} as="textarea" value={formData.faltasAdmin} onChange={handleTextChange} />
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                            <SentinelField label="Información Adicional" name="infoAdicional" icon={Info} as="textarea" value={formData.infoAdicional} onChange={handleTextChange} style={{ minHeight: '80px' }} />
                        </div>
                    </div>

                    {/* ACCIONES FINALIZAR */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" onClick={handleBack} style={btnBackStyle}>ANTERIOR</button>
                        <button
                            type="button"
                            onClick={handleFinalize} // <--- CAMBIA EL console.log POR ESTO
                            style={btnFinishStyle}
                            disabled={loading} // Evita que le den clic dos veces mientras procesa
                        >
                            {loading ? 'PROCESANDO...' : <><Check size={16} /> FINALIZAR REGISTRO TÁCTICO</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPONENTES INTERNOS ---

const SentinelField = ({ label, icon: Icon, name, value, onChange, as = 'input', ...props }: any) => {
    const Component = as;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {Icon && <Icon size={14} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />}
                <Component
                    name={name} value={value} onChange={onChange} {...props}
                    style={{
                        width: '100%', padding: `10px 12px 10px ${Icon ? '38px' : '12px'}`,
                        border: '1px solid #e2e8f0', borderLeft: '3px solid #3e5171', borderRadius: '2px',
                        fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none',
                        minHeight: as === 'textarea' ? '100px' : 'auto', ...props.style
                    }}
                />
            </div>
        </div>
    );
};

const SentinelFileField = ({ label, name, file, onChange }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={labelStyle}>{label}</label>
        <div style={{
            height: '140px', border: '2px dashed #e2e8f0', borderRadius: '4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: file ? '#f0f9ff' : '#f8fafc', position: 'relative', overflow: 'hidden'
        }}>
            {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <>
                    <Camera size={24} color="#94a3b8" />
                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>SUBIR IMAGEN</span>
                </>
            )}
            <input
                type="file" name={name} onChange={onChange} accept="image/*"
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
        </div>
    </div>
);

// --- ESTILOS ---
const cardStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const titleStyle = { fontFamily: 'Barlow Condensed', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase' as const, margin: 0, color: '#0f172a' };
const labelStyle = { fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };
const subLabelStyle = { fontFamily: 'Inter', fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' };
const btnNextStyle = {
    background: '#0f172a', color: 'white', border: 'none', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
};
const mapBoxStyle = { padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' };
const btnBackStyle = {
    background: 'white', color: '#64748b', border: '1px solid #e2e8f0', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
};
const btnFinishStyle = {
    background: '#059669', color: 'white', border: 'none', padding: '14px 32px',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, borderRadius: '2px',
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
};
