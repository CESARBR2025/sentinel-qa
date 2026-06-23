// app/incidentes/[id]/page.tsx
import { db } from "@/lib/db";
import { incidentes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MapPin, User, Clock, AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default async function DetalleIncidentePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) redirect("/login");

    const incidente = await db.query.incidentes.findFirst({
        where: eq(incidentes.id, id),
    });

    if (!incidente) notFound();

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            {/* Carga de fuentes */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
            
            <DashboardHeader user={session.user as any} />
            
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
                
                {/* BOTÓN VOLVER */}
                <Link href="/911/whatsapp/incidentes" style={btnBackStyle}>
                    <ArrowLeft size={14} />
                    VOLVER AL LISTADO
                </Link>

                {/* CABECERA TÁCTICA */}
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
                    <div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Ficha Técnica de Incidente
                        </span>
                        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 42, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase', lineHeight: 1 }}>
                            {incidente.folio}
                        </h1>
                    </div>
                    <div style={getStatusBadgeStyle(incidente.estatus)}>
                        {incidente.estatus.replace('_', ' ').toUpperCase()}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    
                    {/* COLUMNA IZQUIERDA: DATOS Y NARRATIVA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* CARD: INFORMACIÓN GENERAL */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> DATOS DEL REPORTE
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><User size={12}/> REPORTANTE</label>
                                    <span style={valueStyle}>{incidente.nombreReportante || 'ANÓNIMO'}</span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><Clock size={12}/> FECHA Y HORA</label>
                                    <span style={valueStyle}>{new Date(incidente.fechaHoraInicio).toLocaleString('es-MX')}</span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><AlertTriangle size={12}/> CANAL DE ENTRADA</label>
                                    <span style={{...valueStyle, color: '#2563eb'}}>{incidente.canal.toUpperCase()}</span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><Shield size={12}/> GRUPO WHATSAPP</label>
                                    <span style={valueStyle}>{incidente.grupoWhatsapp || 'N/A'}</span>
                                </div>
                            </div>
                        </section>

                        {/* CARD: DESCRIPCIÓN */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> DESCRIPCIÓN DE LOS HECHOS
                            </h2>
                            <div style={narrativaBoxStyle}>
                                {incidente.descripcion || 'Sin descripción detallada en el registro inicial.'}
                            </div>
                        </section>
                    </div>

                    {/* COLUMNA DERECHA: UBICACIÓN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <section style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> UBICACIÓN
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><MapPin size={12}/> DOMICILIO</label>
                                    <span style={valueStyle}>{incidente.calle || 'CALLE NO ESPECIFICADA'}</span>
                                </div>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}>COLONIA</label>
                                    <span style={valueStyle}>{incidente.colonia || 'COLONIA NO ESPECIFICADA'}</span>
                                </div>
                                <div style={refBoxStyle}>
                                    <label style={{ ...labelStyle, marginBottom: '8px' }}>REFERENCIAS VISUALES</label>
                                    <p style={{ ...valueStyle, fontSize: '13px', margin: 0 }}>
                                        {incidente.referenciaUbicacion || 'SIN REFERENCIAS REGISTRADAS'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div style={footerCardStyle}>
                            REGISTRO GENERADO POR ID:<br/>
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}>{incidente.capturadoPor}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- ESTILOS EN LÍNEA TÁCTICOS ---

const cardStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' };

const sectionTitleStyle: React.CSSProperties = { 
    fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700, 
    textTransform: 'uppercase', color: '#0f172a', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.05em'
};

const decoratorStyle = { width: '4px', height: '18px', background: '#3b82f6' };

const labelStyle: React.CSSProperties = { 
    fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', 
    textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', 
    alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 
};

const valueStyle = { fontFamily: 'Inter', fontSize: '15px', fontWeight: 500, color: '#1e293b' };

const itemGroupStyle = { display: 'flex', flexDirection: 'column' as const };

const narrativaBoxStyle = { 
    fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7', color: '#334155', 
    margin: 0, whiteSpace: 'pre-wrap' as const, padding: '20px', 
    background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '2px' 
};

const refBoxStyle = { marginTop: '8px', padding: '16px', background: '#eff6ff', borderRadius: '2px', border: '1px solid #dbeafe' };

const btnBackStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600, 
    textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s'
};

const footerCardStyle: React.CSSProperties = {
    padding: '20px', background: '#0f172a', color: '#94a3b8', fontSize: '9px',
    fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5'
};

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = {
        padding: '8px 16px', borderRadius: '2px', fontSize: '12px', 
        fontWeight: 700, fontFamily: 'JetBrains Mono', border: '1px solid'
    };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }; 
        case 'en_despacho':   return { ...base, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }; 
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}   