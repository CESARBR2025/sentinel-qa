import { db } from "@/lib/db";
import { incidentes, catTiposIncidente } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm"; // Importamos count
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { Eye, Plus, Calendar, MapPin, Hash, Shield, Car } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/911/Pagination"; // Importamos el componente

export default async function ListadoRondinPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    // 1. Configuración de paginación
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    // 2. Ejecución de consultas en paralelo (Optimizado)
    const [totalRes, dataRes] = await Promise.all([
        // Conteo total para rondines (canal 'radio')
        db.select({ value: count() })
          .from(incidentes)
          .where(eq(incidentes.canal, 'radio')),
        
        // Datos paginados
        db.select({
            id: incidentes.id,
            folio: incidentes.folio,
            estatus: incidentes.estatus,
            fecha: incidentes.fechaHoraInicio,
            colonia: incidentes.colonia,
            tipo: catTiposIncidente.nombre,
            oficial: incidentes.nombreOficial,
        })
        .from(incidentes)
        .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
        .where(eq(incidentes.canal, 'radio')) 
        .orderBy(desc(incidentes.fechaHoraInicio))
        .limit(pageSize)
        .offset(offset)
    ]);

    const totalCount = totalRes[0].value;
    const totalPages = Math.ceil(totalCount / pageSize);
    const listado = dataRes;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

            <DashboardHeader user={session.user as any} />

            <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 48px' }}>
                
                {/* HEADER DE SECCIÓN */}
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
                            Operatividad y Prevención
                        </span>
                        <h1 style={{
                            fontFamily: 'Barlow Condensed, sans-serif',
                            fontWeight: 800, fontSize: 32, letterSpacing: '0.02em',
                            textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a'
                        }}>
                            BITÁCORA DE <span style={{ color: '#3b82f6' }}>RONDINES / RADIO</span>
                        </h1>
                    </div>

                    <Link href="/911/rondin" style={btnNuevoStyle}>
                        <Plus size={14} color="#3b82f6" />
                        <span>NUEVO REGISTRO</span>
                    </Link>
                </div>

                {/* TABLA TÁCTICA */}
                <div style={cardStyle}>
                    <div style={sectionTitleStyle}>
                        <div style={decoratorStyle} /> RECORRIDOS EN CAMPO
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}><div style={headerInnerStyle}><Hash size={12}/> FOLIO</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Calendar size={12}/> FECHA</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Shield size={12}/> OFICIAL</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Car size={12}/> TIPO / MOTIVO</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><MapPin size={12}/> UBICACIÓN</div></th>
                                <th style={thStyle}>ESTATUS</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listado.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                                        NO HAY RECORRIDOS REGISTRADOS EN ESTE CANAL
                                    </td>
                                </tr>
                            ) : (
                                listado.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#0f172a' }}>
                                            {item.folio}
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(item.fecha).toLocaleString('es-MX', { 
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </td>
                                        <td style={{ ...tdStyle, fontSize: '11px', fontWeight: 600 }}>
                                            {item.oficial?.toUpperCase() || 'N/E'}
                                        </td>
                                        <td style={{ ...tdStyle, color: '#2563eb', fontWeight: 500 }}>
                                            {item.tipo?.toUpperCase() || 'RECORRIDO GENERAL'}
                                        </td>
                                        <td style={tdStyle}>
                                            {item.colonia?.toUpperCase() || 'S/C'}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={getStatusBadgeStyle(item.estatus)}>
                                                {item.estatus.replace('_', ' ').toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <Link href={`/911/rondin/incidentes/${item.id}`} style={btnViewStyle}>
                                                <Eye size={14} />
                                                DETALLES
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* PAGINACIÓN INTEGRADA */}
                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        baseUrl="/911/rondin/incidentes" // <-- Ajusta esta URL a la ruta real de este archivo
                    />
                </div>
            </main>

            <footer style={footerStyle}>
                SSPM · UNIDAD DE ANÁLISIS TÁCTICO · {new Date().getFullYear()}
            </footer>
        </div>
    );
}

// ... (El resto de tus estilos se mantienen igual)
const cardStyle = { 
    background: '#ffffff', border: '1px solid #e2e8f0', padding: '32px', 
    borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
};

const sectionTitleStyle: React.CSSProperties = { 
    fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700, 
    textTransform: 'uppercase', color: '#1e293b', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '12px'
};

const decoratorStyle = { width: '4px', height: '18px', background: '#3b82f6' };

const thStyle: React.CSSProperties = {
    padding: '16px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '10px',
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600
};

const headerInnerStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

const tdStyle: React.CSSProperties = {
    padding: '16px 12px', fontFamily: 'Inter', fontSize: '13px', color: '#475569'
};

const btnNuevoStyle: React.CSSProperties = {
    background: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '2px',
    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, 
    display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
    letterSpacing: '0.1em'
};

const btnViewStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb',
    fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600, 
    textDecoration: 'none', textTransform: 'uppercase'
};

const footerStyle: React.CSSProperties = {
    padding: '32px', fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#94a3b8',
    textAlign: 'center', letterSpacing: '0.2em'
};

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = {
        padding: '4px 10px', borderRadius: '2px', fontSize: '9px', 
        fontWeight: 700, fontFamily: 'JetBrains Mono', display: 'inline-block',
        border: '1px solid'
    };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }; 
        case 'en_despacho':   return { ...base, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }; 
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}