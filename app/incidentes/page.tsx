/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, query } from "@/lib/db";
import { incidentes, catTiposIncidente, catPrioridades } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { DashboardHeader } from "@/components/partials/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { tienePermiso } from "@/lib/incidentes/permisos";
import {
    Search, MapPin, Clock, Eye, Radio, MessageSquare, AlertTriangle,
    Phone
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ROLES_PERMITIDOS = ['Administrador', 'Operador', 'Oficial de Campo']

export default async function BitacoraIncidentesPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const rolResult = await query<{ nombre: string }>(
        `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [session.user.id],
    )
    if (!ROLES_PERMITIDOS.includes(rolResult.rows[0]?.nombre ?? '')) redirect('/dashboard')
    if (!(await tienePermiso(session.user.id, 'incidentes', 'ver'))) redirect('/dashboard')

    // CAMBIAMOS A SELECT ESTÁNDAR CON JOINS (Evita el error de referencedTable)
    const listaIncidentes = await db
        .select({
            id: incidentes.id,
            folio: incidentes.folio,
            canal: incidentes.canal,
            estatus: incidentes.estatus,
            colonia: incidentes.colonia,
            fechaHoraInicio: incidentes.fechaHoraInicio,
            tipoIncidenteNombre: catTiposIncidente.nombre,
            prioridadNombre: catPrioridades.nombre
        })
        .from(incidentes)
        .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
        .leftJoin(catPrioridades, eq(incidentes.prioridadId, catPrioridades.id))
        .orderBy(desc(incidentes.creadoEn))
        .limit(100);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
                .sentinel-table tr { transition: background-color 0.2s; }
                .sentinel-table tr:hover { background-color: #f1f5f9 !important; }
            `}} />

            <DashboardHeader user={session.user as any} />

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>

                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={topLabelStyle}>CENTRO DE MANDO Y COMUNICACIONES</span>
                        <h1 style={titleStyle}>BITÁCORA GENERAL DE <span style={{ color: '#3b82f6' }}>INCIDENTES</span></h1>
                    </div>
                </div>

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
                            {listaIncidentes.map((item) => {
                                let urlDetalle = "";

                                if (item.canal === 'radio') {
                                    urlDetalle = `/911/rondin/incidentes/${item.id}`;
                                } else if (item.canal === 'whatsapp') {
                                    urlDetalle = `/911/whatsapp/incidentes/${item.id}`;
                                } else {
                                    // Por defecto mandamos a ciudadano (911)
                                    urlDetalle = `/911/ciudadano/incidentes/${item.id}`;
                                }

                                return (
                                    <tr key={item.id}>
                                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                                            {item.folio}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {/* ICONOS DINÁMICOS POR CANAL */}
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
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.tipoIncidenteNombre || 'S/C'}</span>
                                                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                                                    PRIORIDAD: {item.prioridadNombre || 'N/A'}
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
        case 'atendido': return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' };
        default: return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}