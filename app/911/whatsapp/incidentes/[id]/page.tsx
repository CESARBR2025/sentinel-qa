// app/incidentes/[id]/page.tsx
import { db } from "@/lib/db";
import { incidentes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MapPin, User, Clock, AlertTriangle } from "lucide-react";

export default async function DetalleIncidentePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const session = await auth.api.getSession({ 
        headers: await headers() 
    });

    if (!session) {
        redirect("/login");
    }

    const incidente = await db.query.incidentes.findFirst({
        where: eq(incidentes.id, id),
    });

    if (!incidente) {
        notFound();
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <DashboardHeader user={session.user as any} />
            
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
                {/* CABECERA */}
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#2563eb', fontWeight: 600, textTransform: 'uppercase' }}>
                            Detalle de Folio
                        </span>
                        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 32, margin: 0, color: '#0f172a' }}>
                            {incidente.folio}
                        </h1>
                    </div>
                    <div style={{ 
                        background: '#3b82f6', color: 'white', padding: '8px 16px', 
                        fontFamily: 'JetBrains Mono', fontSize: 12, borderRadius: '2px' 
                    }}>
                        ESTATUS: {incidente.estatus.toUpperCase()}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    
                    {/* COLUMNA IZQUIERDA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> Información del Reporte
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={itemStyle}><User size={14} color="#64748b" /><span style={labelStyle}>Reportante:</span><span style={valueStyle}>{incidente.nombreReportante || 'ANÓNIMO'}</span></div>
                                <div style={itemStyle}><Clock size={14} color="#64748b" /><span style={labelStyle}>Fecha/Hora:</span><span style={valueStyle}>{new Date(incidente.fechaHoraInicio).toLocaleString()}</span></div>
                                <div style={itemStyle}><AlertTriangle size={14} color="#64748b" /><span style={labelStyle}>Canal:</span><span style={valueStyle}>{incidente.canal.toUpperCase()}</span></div>
                            </div>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> Descripción de los Hechos
                            </h2>
                            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '1.6', color: '#334155', margin: 0, whiteSpace: 'pre-wrap' }}>
                                {incidente.descripcion || 'Sin descripción detallada.'}
                            </p>
                        </section>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>
                                <div style={decoratorStyle} /> Ubicación
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={itemStyle}><MapPin size={14} color="#3b82f6" /><span style={labelStyle}>Calle:</span><span style={valueStyle}>{incidente.calle || 'N/A'}</span></div>
                                <div style={itemStyle}><span style={labelStyle}>Colonia:</span><span style={valueStyle}>{incidente.colonia || 'N/A'}</span></div>
                                <div style={{ marginTop: '8px', padding: '12px', background: '#f1f5f9', borderRadius: '2px' }}>
                                    <span style={labelStyle}>Referencias:</span>
                                    <p style={{ ...valueStyle, fontSize: 12, marginTop: '4px' }}>{incidente.referenciaUbicacion || 'Sin referencias.'}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ESTILOS EN LÍNEA (Sustituyen a styled-jsx)
const cardStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '4px' };
const sectionTitleStyle: React.CSSProperties = { 
    fontFamily: 'Barlow Condensed', fontSize: '16px', fontWeight: 700, 
    textTransform: 'uppercase', color: '#1e293b', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '8px'
};
const decoratorStyle = { width: '3px', height: '14px', background: '#3b82f6' };
const itemStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const labelStyle = { fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', textTransform: 'uppercase' as const };
const valueStyle = { fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#0f172a' };