/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { 
    incidentes, 
    catTiposIncidente, catPrioridades, catTiposEmergencia 
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { 
    MapPin, User, Clock, AlertTriangle, ArrowLeft, 
    MessageSquare, Shield, Info 
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { tieneAccesoSeccion } from "@/lib/911/permisos";

export default async function DetalleWhatsAppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_whatsapp"))) redirect("/dashboard");

    // Consulta con Joins para evitar el error de 'referencedTable'
    const [data] = await db
        .select({
            inc: incidentes,
            tipoNombre: catTiposIncidente.nombre,
            prioridadNombre: catPrioridades.nombre,
            emergenciaNombre: catTiposEmergencia.nombre
        })
        .from(incidentes)
        .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
        .leftJoin(catPrioridades, eq(incidentes.prioridadId, catPrioridades.id))
        .leftJoin(catTiposEmergencia, eq(incidentes.tipoEmergenciaId, catTiposEmergencia.id))
        .where(eq(incidentes.id, id))
        .limit(1);

    if (!data) notFound();
    const { inc } = data as any;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');` }} />
            <DashboardHeader user={session.user as any} />
            
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
                
                <Link href="/911/whatsapp/incidentes" style={btnBackStyle}>
                    <ArrowLeft size={14} /> VOLVER AL LISTADO GENERAL
                </Link>

                {/* CABECERA TÁCTICA */}
                <div style={headerStyle}>
                    <div>
                        <span style={labelTopStyle}>REPORTE VÍA WHATSAPP / REDES</span>
                        <h1 style={titleStyle}>{inc.folio}</h1>
                    </div>
                    <div style={getStatusBadgeStyle(inc.estatus)}>
                        {inc.estatus?.replace('_', ' ').toUpperCase()}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    
                    {/* COLUMNA IZQUIERDA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> DATOS DEL GRUPO Y REPORTANTE
                            </h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><Shield size={12}/> GRUPO DE ORIGEN</label>
                                    <span style={{...valueStyle, color: '#059669', fontWeight: 700}}>
                                        {inc.grupoWhatsapp || 'SIN GRUPO ESPECIFICADO'}
                                    </span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><User size={12}/> REPORTANTE</label>
                                    <span style={valueStyle}>
                                        {inc.anonimo ? 'MODO ANÓNIMO' : (inc.nombreReportante || 'No identificado')}
                                    </span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><Clock size={12}/> FECHA Y HORA</label>
                                    <span style={valueStyle}>
                                        {inc.fechaHoraInicio ? new Date(inc.fechaHoraInicio).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><MessageSquare size={12}/> CANAL</label>
                                    <span style={valueStyle}>WHATSAPP</span>
                                </div>
                            </div>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> CLASIFICACIÓN TÉCNICA
                            </h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}>TIPO DE INCIDENTE</label>
                                    <span style={valueStyle}>{data.tipoNombre || 'S/C'}</span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}>PRIORIDAD</label>
                                    <span style={{...valueStyle, fontWeight: 700}}>{data.prioridadNombre || 'N/A'}</span>
                                </div>
                            </div>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> DESCRIPCIÓN DE LOS HECHOS
                            </h2>
                            <div style={narrativaBoxStyle}>
                                {inc.descripcion || 'Sin descripción detallada.'}
                            </div>
                        </section>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        <section style={{ ...cardStyle, borderLeft: '4px solid #059669' }}>
                            <h2 style={sectionTitleStyle}>
                                <div style={{...decoratorStyle, background: '#059669'}} /> UBICACIÓN
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><MapPin size={12}/> CALLE / COLONIA</label>
                                    <span style={valueStyle}>{inc.calle}, {inc.colonia}</span>
                                </div>
                                <div style={refBoxStyle}>
                                    <label style={labelStyle}>REFERENCIAS</label>
                                    <p style={{fontSize: '13px', margin: 0}}>
                                        {inc.referenciaUbicacion || 'SIN REFERENCIAS'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div style={footerCardStyle}>
                            REGISTRO CAPTURADO POR:<br/>
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'white' }}>
                                {inc.capturadoPor}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- ESTILOS ---
const cardStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '4px' };
const sectionTitleStyle: React.CSSProperties = { fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' };
const decoratorStyle = { width: '4px', height: '18px', background: '#3b82f6' };
const labelStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 };
const valueStyle = { fontFamily: 'Inter', fontSize: '15px', fontWeight: 500, color: '#1e293b' };
const itemGroupStyle = { display: 'flex', flexDirection: 'column' as const };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };
const narrativaBoxStyle: React.CSSProperties = { fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7', color: '#334155', padding: '20px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '2px', whiteSpace: 'pre-wrap' };
const refBoxStyle = { marginTop: '8px', padding: '16px', background: '#f0fdf4', borderRadius: '2px', border: '1px solid #dcfce7' };
const btnBackStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '11px', textDecoration: 'none', marginBottom: '24px' };
const headerStyle = { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' };
const labelTopStyle = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#059669', fontWeight: 700, letterSpacing: '0.2em' };
const titleStyle = { fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 42, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase' as const };
const footerCardStyle: React.CSSProperties = { padding: '20px', background: '#0f172a', color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' };

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = { padding: '8px 16px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono', border: '1px solid' };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }; 
        case 'en_despacho':   return { ...base, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }; 
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}