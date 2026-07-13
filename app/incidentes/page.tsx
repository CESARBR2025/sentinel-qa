import { listarConFiltros } from "@/lib/incidentes/service";
import { getCatalogos } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
import { FiltrosIncidentes } from "@/components/911/FiltrosIncidentes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { tienePermiso } from "@/lib/incidentes/permisos";
import { MapPin, Clock, Eye, Radio, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SearchParams {
    canal?: string;
    estatus?: string;
    desde?: string;
    hasta?: string;
    folio?: string;
    tipoIncidenteId?: string;
    prioridadId?: string;
}

export default async function BitacoraIncidentesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    if (!(await tienePermiso(session.user.id, 'incidentes', 'ver'))) redirect('/dashboard')

    const sp = await searchParams;

    const [listaIncidentes, catalogos] = await Promise.all([
        listarConFiltros({
            canal: sp.canal || null,
            estatus: sp.estatus || null,
            desde: sp.desde || null,
            hasta: sp.hasta ? `${sp.hasta}T23:59:59` : null,
            folio: sp.folio || null,
            tipoIncidenteId: sp.tipoIncidenteId ? Number(sp.tipoIncidenteId) : null,
            prioridadId: sp.prioridadId ? Number(sp.prioridadId) : null,
        }),
        getCatalogos(),
    ]);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
                .sentinel-table tr { transition: background-color 0.2s; }
                .sentinel-table tr:hover { background-color: #f1f5f9 !important; }
            `}} />

            <DashboardHeader user={session.user as { name: string; apellido?: string; email: string }} />

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>

                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={topLabelStyle}>CENTRO DE MANDO Y COMUNICACIONES</span>
                        <h1 style={titleStyle}>BITÁCORA GENERAL DE <span style={{ color: '#3b82f6' }}>INCIDENTES</span></h1>
                    </div>
                </div>

                <FiltrosIncidentes tiposIncidente={catalogos.incidentes} prioridades={catalogos.prioridades} />

                <div style={tableWrapperStyle}>
                    <table className="sentinel-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={thStyle}>FOLIO</th>
                                <th style={thStyle}>CANAL</th>
                                <th style={thStyle}>INCIDENTE / PRIORIDAD</th>
                                <th style={thStyle}>UBICACIÓN</th>
                                <th style={thStyle}>FECHA Y HORA</th>
                                <th style={thStyle}>ESTATUS</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaIncidentes.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '48px 24px', color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                                        SIN RESULTADOS PARA LOS FILTROS APLICADOS
                                    </td>
                                </tr>
                            )}
                            {listaIncidentes.map((item) => {
                                const urlDetalle = item.canal === 'radio'
                                    ? `/agente_911/rondin/incidentes/${item.id}`
                                    : item.canal === 'whatsapp'
                                        ? `/agente_911/whatsapp/incidentes/${item.id}`
                                        : `/agente_911/ciudadano/incidentes/${item.id}`;

                                return (
                                    <tr key={item.id}>
                                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                                            {item.folio}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {item.canal === 'radio' && <Radio size={14} color="#2563eb" />}
                                                {item.canal === 'whatsapp' && <MessageSquare size={14} color="#059669" />}
                                                {item.canal === '911' && <Phone size={14} color="#dc2626" />}

                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: item.canal === 'whatsapp' ? '#059669' : 'inherit'
                                                }}>
                                                    {item.canal?.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.tipoIncidente || 'S/C'}</span>
                                                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                                                    PRIORIDAD: {item.prioridad || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <MapPin size={12} color="#64748b" />
                                                {item.colonia || 'No especificada'}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <Clock size={12} color="#64748b" />
                                                {new Date(item.fechaHoraInicio).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={getStatusBadgeStyle(item.estatus || '')}>
                                                {item.estatus?.replace('_', ' ').toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <Link href={urlDetalle} style={btnViewStyle}>
                                                <Eye size={14} /> VER FICHA
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

// --- ESTILOS (Iguales a los anteriores) ---
const topLabelStyle = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', fontWeight: 700, letterSpacing: '0.2em' };
const titleStyle = { fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 36, margin: '4px 0 0 0', color: '#0f172a', textTransform: 'uppercase' as const };
const tableWrapperStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' };
const thStyle: React.CSSProperties = { padding: '16px 24px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontFamily: 'Inter', fontSize: '13px' };
const btnViewStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0f172a', color: 'white', textDecoration: 'none', borderRadius: '2px', fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 600 };

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = { display: 'inline-block', padding: '4px 10px', borderRadius: '2px', fontSize: '10px', fontWeight: 700, fontFamily: 'JetBrains Mono', border: '1px solid' };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' };
        case 'en_despacho': return { ...base, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' };
        case 'en_sitio': return { ...base, background: '#f0fdfa', color: '#0f766e', borderColor: '#ccfbf1' };
        case 'atendido': return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' };
        case 'cerrado_detencion': return { ...base, background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' };
        default: return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}
