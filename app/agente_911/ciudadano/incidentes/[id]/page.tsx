/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound, redirect } from "next/navigation";
import { getIncidenteConExtras } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MapPin, User, Clock, AlertTriangle, ArrowLeft, Phone, School, Info } from "lucide-react";
import Link from "next/link";
import React from "react";
import { tieneAccesoSeccion, obtenerRolNombre } from "@/lib/911/permisos";

export default async function DetalleCiudadanoCompletoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) redirect("/dashboard");

    const rolNombre = await obtenerRolNombre(session.user.id)
    const backHref = rolNombre === 'agente_911' ? '/agente_911' : '/dashboard'
    const backLabel = rolNombre === 'agente_911' ? 'Panel 911' : 'Dashboard'

    const data = await getIncidenteConExtras(id) as any;
    if (!data) notFound();
    const { inc, ext, ala } = data;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');` }} />
            <DashboardHeader user={session.user as any} backHref={backHref} backLabel={backLabel} />
            
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
                <Link href="/agente_911/ciudadano/incidentes" style={btnBackStyle}><ArrowLeft size={14} /> BITÁCORA GENERAL</Link>

                <div style={headerStyle}>
                    <div>
                        <span style={labelTopStyle}>FICHA TÉCNICA DE EMERGENCIA 911</span>
                        <h1 style={titleStyle}>{inc.folio}</h1>
                    </div>
                    <div style={getStatusBadgeStyle(inc.estatus)}>{inc.estatus?.toUpperCase()}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* REPORTANTE COMPLETO */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}><User size={18}/> DATOS DEL REPORTANTE</h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}><label style={labelStyle}>NOMBRE</label><span style={valueStyle}>{inc.anonimo ? 'MODO ANÓNIMO' : inc.nombre_reportante}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>SEXO / EDAD</label><span style={valueStyle}>{inc.sexo || 'NE'} / {inc.edad || '--'} AÑOS</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>¿MIGRANTE?</label><span style={valueStyle}>{inc.es_migrante ? 'SÍ' : 'NO'}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>¿USUARIO FRECUENTE?</label><span style={valueStyle}>{inc.es_usuario_frecuente ? 'SÍ' : 'NO'}</span></div>
                            </div>
                        </section>

                        {/* CLASIFICACIÓN */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}><AlertTriangle size={18}/> CLASIFICACIÓN TÉCNICA</h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}><label style={labelStyle}>EMERGENCIA</label><span style={valueStyle}>{data.emergencia_nombre}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>INCIDENTE</label><span style={valueStyle}>{data.tipo_nombre}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>PRIORIDAD</label><span style={{...valueStyle, fontWeight: 800}}>{data.prioridad_nombre}</span></div>
                            </div>
                        </section>

                        {/* NARRATIVA */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>DESCRIPCIÓN DE HECHOS</h2>
                            <div style={narrativaBoxStyle}>{inc.descripcion}</div>
                            {inc.observaciones && (
                                <div style={{marginTop: '20px', padding: '15px', borderTop: '1px solid #e2e8f0'}}>
                                    <label style={labelStyle}>NOTAS DEL OPERADOR</label>
                                    <p style={{fontSize: '13px', margin: 0}}>{inc.observaciones}</p>
                                </div>
                            )}
                        </section>

                        {/* DATOS ESPECIALES (EXTORSIÓN / ALARMA) */}
                        {ext && (
                            <section style={{...cardStyle, borderLeft: '4px solid #e11d48'}}>
                                <h2 style={{...sectionTitleStyle, color: '#e11d48'}}><Phone size={18}/> DETALLES DE EXTORSIÓN</h2>
                                <div style={infoGridStyle}>
                                    <div><label style={labelStyle}>TELÉFONO</label><span style={valueStyle}>{ext.telefono_extorsion}</span></div>
                                    <div><label style={labelStyle}>GRUPO</label><span style={valueStyle}>{ext.grupo_delictivo}</span></div>
                                    <div style={{gridColumn: 'span 2'}}><label style={labelStyle}>MODUS OPERANDI</label><p style={valueStyle}>{ext.modus_operandi}</p></div>
                                </div>
                            </section>
                        )}

                        {ala && (
                            <section style={{...cardStyle, borderLeft: '4px solid #059669'}}>
                                <h2 style={{...sectionTitleStyle, color: '#059669'}}><School size={18}/> ALARMA ESCOLAR</h2>
                                <div style={infoGridStyle}>
                                    <div><label style={labelStyle}>ESTABLECIMIENTO</label><span style={valueStyle}>{ala.establecimiento}</span></div>
                                    <div><label style={labelStyle}>RESPONSABLE</label><span style={valueStyle}>{ala.nombre_responsable}</span></div>
                                    <div><label style={labelStyle}>INMUEBLE</label><span style={valueStyle}>{ala.inmueble}</span></div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <section style={{...cardStyle, borderLeft: '4px solid #3b82f6'}}>
                            <h2 style={sectionTitleStyle}><MapPin size={18}/> UBICACIÓN</h2>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <div><label style={labelStyle}>DOMICILIO</label><span style={valueStyle}>{inc.calle}, {inc.colonia}</span></div>
                                <div><label style={labelStyle}>REFERENCIAS</label><p style={{fontSize: '12px'}}>{inc.referencia_ubicacion}</p></div>
                            </div>
                        </section>
                        <div style={footerCardStyle}>CAPTURADO POR: {inc.capturado_por}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const cardStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '4px' };
const sectionTitleStyle: React.CSSProperties = { fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' };
const labelStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 };
const valueStyle = { fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#1e293b' };
const itemGroupStyle = { display: 'flex', flexDirection: 'column' as const };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };
const narrativaBoxStyle: React.CSSProperties = { fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7', color: '#334155', padding: '20px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '2px', whiteSpace: 'pre-wrap' };
const refBoxStyle = { marginTop: '8px', padding: '16px', background: '#eff6ff', borderRadius: '2px' };
const btnBackStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '11px', textDecoration: 'none', marginBottom: '24px' };
const headerStyle = { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' };
const labelTopStyle = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', fontWeight: 700, letterSpacing: '0.2em' };
const titleStyle = { fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 42, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase' as const };
const footerCardStyle: React.CSSProperties = { padding: '20px', background: '#0f172a', color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' };

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = { padding: '8px 16px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono', border: '1px solid' };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }; 
        case 'en_despacho':   return { ...base, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }; 
        case 'en_sitio':      return { ...base, background: '#f0fdfa', color: '#0f766e', borderColor: '#ccfbf1' }; 
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        case 'cerrado_detencion': return { ...base, background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}
