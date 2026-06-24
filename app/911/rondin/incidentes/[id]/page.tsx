/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { 
    incidentes, incidenteReporteCampo, 
    catTiposIncidente, catPrioridades 
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { 
    MapPin, Shield, Clock, Gavel, FileText, 
    Archive, Car, ArrowLeft, Search, User, AlertTriangle 
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function DetalleRondinCompletoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const [data] = await db
        .select({
            // INCIDENTE
            inc: incidentes,
            // CATALOGOS
            tipoNombre: catTiposIncidente.nombre,
            prioridadNombre: catPrioridades.nombre,
            // REPORTE DE CAMPO
            rep: incidenteReporteCampo
        })
        .from(incidentes)
        .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
        .leftJoin(catPrioridades, eq(incidentes.prioridadId, catPrioridades.id))
        .leftJoin(incidenteReporteCampo, eq(incidentes.id, incidenteReporteCampo.incidenteId))
        .where(eq(incidentes.id, id))
        .limit(1);

    if (!data) notFound();
    const { inc, rep } = data as any;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');` }} />
            <DashboardHeader user={session.user as any} />
            
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
                <Link href="/incidentes" style={btnBackStyle}><ArrowLeft size={14} /> BITÁCORA GENERAL</Link>

                <div style={headerStyle}>
                    <div>
                        <span style={labelTopStyle}>INFORME POLICIAL HOMOLOGADO (RECORRIDO)</span>
                        <h1 style={titleStyle}>{inc.folio}</h1>
                        <div style={{fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#64748b'}}>CAD: {inc.folioCad || 'N/A'}</div>
                    </div>
                    <div style={getStatusBadgeStyle(inc.estatus)}>{inc.estatus?.toUpperCase()}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* CARD 1: DATOS TÉCNICOS */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}><Shield size={18}/> CLASIFICACIÓN OPERATIVA</h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}><label style={labelStyle}>OFICIAL QUE REPORTA</label><span style={valueStyle}>{inc.nombreOficial}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>TIPO INCIDENTE</label><span style={valueStyle}>{data.tipoNombre}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>PRIORIDAD</label><span style={{...valueStyle, color: '#dc2626'}}>{data.prioridadNombre}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>CAPTURÓ</label><span style={valueStyle}>{inc.capturadoPor}</span></div>
                            </div>
                        </section>

                        {/* CARD 2: TIEMPOS */}
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}><Clock size={18}/> CRONOLOGÍA</h2>
                            <div style={infoGridStyle}>
                                <div style={itemGroupStyle}><label style={labelStyle}>INICIO</label><span style={valueStyle}>{new Date(inc.fechaHoraInicio).toLocaleString()}</span></div>
                                <div style={itemGroupStyle}><label style={labelStyle}>CIERRE</label><span style={valueStyle}>{inc.fechaHoraFin ? new Date(inc.fechaHoraFin).toLocaleString() : 'EN PROCESO'}</span></div>
                            </div>
                        </section>

                        {/* CARD 3: RELATORÍA (TODO) */}
                        <section style={{...cardStyle, borderLeft: '4px solid #0f172a'}}>
                            <h2 style={sectionTitleStyle}>RELATORÍA DETALLADA DE HECHOS</h2>
                            <div style={narrativaBoxStyle}>
                                <strong style={{fontSize: '10px', color: '#2563eb'}}>DESCRIPCIÓN INICIAL:</strong><br/>
                                {inc.descripcion}<br/><br/>
                                <strong style={{fontSize: '10px', color: '#2563eb'}}>INFORME DE CAMPO:</strong><br/>
                                {rep?.contenidoReporte || 'Sin informe detallado.'}
                            </div>
                        </section>

                        {/* CARD 4: RESULTADOS POSITIVOS */}
                        {rep && (
                            <section style={{...cardStyle, background: '#f0f9ff'}}>
                                <h2 style={sectionTitleStyle}><Search size={18}/> RESULTADOS DE INTERVENCIÓN</h2>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                    <div><label style={labelStyle}>DATOS POSITIVOS/NEGATIVOS</label><p style={valueStyle}>{rep.datosPositivosNegativos}</p></div>
                                    <div><label style={labelStyle}>ACCIONES REALIZADAS</label><p style={valueStyle}>{rep.accionesRealizadas}</p></div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* UBICACIÓN COMPLETA */}
                        <section style={{...cardStyle, borderTop: '4px solid #3b82f6'}}>
                            <h2 style={sectionTitleStyle}><MapPin size={18}/> UBICACIÓN</h2>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                <div><label style={labelStyle}>CALLE</label><span style={valueStyle}>{inc.calle}</span></div>
                                <div><label style={labelStyle}>COLONIA</label><span style={valueStyle}>{inc.colonia}</span></div>
                                <div><label style={labelStyle}>ENTRE CALLES</label><span style={valueStyle}>{inc.entreCalles || 'N/A'}</span></div>
                                <div style={refBoxStyle}><label style={labelStyle}>REFERENCIA</label><p style={{fontSize: '12px', margin: 0}}>{inc.referenciaUbicacion}</p></div>
                            </div>
                        </section>

                        {/* DETENCIONES */}
                        {rep?.hayDetencion && (
                            <section style={{...cardStyle, background: '#fef2f2', border: '1px solid #fee2e2'}}>
                                <h2 style={{...sectionTitleStyle, color: '#991b1b'}}><Gavel size={18}/> DETENCIONES</h2>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <div><label style={labelStyle}>NOMBRES</label><span style={{...valueStyle, fontSize: '13px'}}>{rep.nombreDetenidos}</span></div>
                                    <div><label style={labelStyle}>AUTORIDAD</label><span style={valueStyle}>{rep.autoridadRecibe}</span></div>
                                    <div><label style={labelStyle}>EXPEDIENTE CI</label><span style={{...valueStyle, fontWeight: 700}}>{rep.expedienteCi}</span></div>
                                </div>
                            </section>
                        )}

                        {/* ASEGURAMIENTOS */}
                        {(rep?.objetosRecuperados || rep?.vehiculosRecuperados) && (
                            <section style={{...cardStyle, background: '#f8fafc'}}>
                                <h2 style={sectionTitleStyle}><Archive size={18}/> ASEGURAMIENTOS</h2>
                                {rep.objetosRecuperados && <div style={{marginBottom: '15px'}}><label style={labelStyle}>OBJETOS</label><p style={{fontSize: '12px'}}>{rep.objetosRecuperados}</p></div>}
                                {rep.vehiculosRecuperados && <div><label style={labelStyle}><Car size={14}/> VEHÍCULO</label><p style={{fontSize: '12px'}}>{rep.vehiculosRecuperados}<br/><strong>TIPO:</strong> {rep.tipoVehiculo}<br/><strong>DESTINO:</strong> {rep.destinoVehiculo}</p></div>}
                            </section>
                        )}
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
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}