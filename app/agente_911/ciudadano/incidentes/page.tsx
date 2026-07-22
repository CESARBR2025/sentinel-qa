import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getIncidentesPaginados, getConteoEstatus } from "@/lib/911/service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Eye, Plus, MapPin, Hash, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/partials/Header";
import { Pagination } from "@/components/911/Pagination";
import { tieneAccesoSeccion } from "@/lib/911/permisos";
import ToastOnLoad from "./ToastOnLoad";

const STATUS_TOOLTIPS: Record<string, string> = {
    sin_despachar: 'Esperando a que una unidad tome el caso',
    en_despacho: 'Una unidad fue asignada y se dirige al lugar',
    en_sitio: 'La unidad llegó al lugar y está atendiendo la emergencia',
    atendido: 'El incidente fue resuelto y el servicio concluyó',
    cerrado_detencion: 'Caso cerrado con una detención realizada',
}

export default async function Listado911Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; estatus?: string }>;
}) {
    // 1. Manejo seguro de paginación
    const params = await searchParams;
    const page = Math.max(1, Number(params?.page) || 1);
    const estatus = params?.estatus || '';
    const pageSize = 10;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_ciudadano"))) redirect("/dashboard");

    const estatusActivo = estatus
    const { rows: listado, total: totalCount } = await getIncidentesPaginados('911', page, pageSize, estatus || null);
    const totalPages = Math.ceil(totalCount / pageSize);

    const conteos = await getConteoEstatus('911')
    const mapaConteos = Object.fromEntries(conteos.map(c => [c.estatus, c.count]))
    const totalGeneral = conteos.reduce((sum, c) => sum + c.count, 0)

    const TABS: { key: string; label: string; color: string; count: number }[] = [
        { key: '', label: 'TODOS', color: '#64748b', count: totalGeneral },
        { key: 'sin_despachar', label: 'SIN DESPACHAR', color: '#b45309', count: mapaConteos.sin_despachar || 0 },
        { key: 'en_despacho', label: 'EN DESPACHO', color: '#1c3051', count: mapaConteos.en_despacho || 0 },
        { key: 'en_sitio', label: 'EN SITIO', color: '#0f766e', count: mapaConteos.en_sitio || 0 },
        { key: 'atendido', label: 'ATENDIDO', color: '#15803d', count: mapaConteos.atendido || 0 },
        { key: 'cerrado_detencion', label: 'CERRADO DET', color: '#7c3aed', count: mapaConteos.cerrado_detencion || 0 },
    ]

    const ESTATUS_ETIQUETA = (estatusActivo ? TABS.find(t => t.key === estatusActivo)?.label || estatusActivo : '').toLowerCase()

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <Suspense fallback={null}><ToastOnLoad /></Suspense>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
                .fila-incidente { transition: background 0.15s ease; }
                .fila-incidente:hover { background: #f8fafc; }
                .fila-incidente:hover .btn-ver-ficha { color: #1c3051; }
            `}</style>

            <DashboardHeader
                user={{ name: session.user.name, apellido: (session.user as any).apellido, email: session.user.email }}
                roleLabel="Bitácora Central 911"
                backHref="/agente_911"
                backLabel="Panel 911"
            >
                <Link href="/agente_911/ciudadano" style={{
                    background: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '2px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
                    letterSpacing: '0.1em',
                }}>
                    <Plus size={14} />
                    <span>NUEVO REGISTRO</span>
                </Link>
            </DashboardHeader>

            <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 48px' }}>

                {/* TABLA DE INCIDENTES 911 */}
                <div style={cardStyle}>
                    <div style={sectionTitleStyle}>
                        <div style={decoratorStyle} /> LLAMADAS ENTRANTES 
                    </div>

                    {/* Segment control por estatus */}
                    <div style={{
                        display: 'flex', gap: 4, marginBottom: 24,
                        flexWrap: 'wrap',
                    }}>
                        {TABS.map(tab => {
                            const activo = estatusActivo === tab.key
                            return (
                                <Link
                                    key={tab.key}
                                    href={tab.key ? `/agente_911/ciudadano/incidentes?estatus=${tab.key}` : '/agente_911/ciudadano/incidentes'}
                                    style={{
                                        padding: '6px 14px', borderRadius: 2, textDecoration: 'none',
                                        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                                        letterSpacing: '0.05em', textTransform: 'uppercase',
                                        color: activo ? '#fff' : tab.color,
                                        background: activo ? tab.color : '#f8fafc',
                                        border: `1px solid ${activo ? tab.color : '#e2e8f0'}`,
                                        transition: 'all 0.15s ease',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                >
                                    <span style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: activo ? '#fff' : tab.color,
                                        display: 'inline-block', flexShrink: 0,
                                    }} />
                                    {tab.label}
                                    <span style={{
                                        marginLeft: 2, fontSize: 8, opacity: activo ? 0.8 : 0.5,
                                        fontWeight: 400,
                                    }}>
                                        {tab.count}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}><div style={headerInnerStyle}><Hash size={12}/> FOLIO</div></th>
                                <th style={{ ...thStyle, fontFamily: 'JetBrains Mono', fontSize: '9px' }}>FOLIO CAD</th>
                                <th style={{ ...thStyle, fontFamily: 'JetBrains Mono', fontSize: '9px' }}>CÓDIGO</th>
                                <th style={thStyle}><div style={headerInnerStyle}><Clock size={12}/> HORA</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><AlertTriangle size={12}/> INCIDENTE</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><MapPin size={12}/> COLONIA</div></th>
                                <th style={thStyle}>PRIORIDAD</th>
                                <th style={thStyle}>ESTATUS</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listado.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                                        {estatusActivo
                                            ? `NO HAY REPORTES EN ESTADO "${ESTATUS_ETIQUETA}"`
                                            : 'SIN REPORTES 911 REGISTRADOS'}
                                    </td>
                                </tr>
                            ) : (
                                listado.map((item, index) => {
                                    const isNewest = page === 1 && index === 0
                                    const fecha = new Date(item.fechaHoraInicio)
                                    const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
                                    const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                                    return (
                                    <tr key={item.id} className="fila-incidente" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#0f172a', position: 'relative' }}>
                                            <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} style={{
                                                position: 'absolute', inset: 0, display: 'block', zIndex: 1,
                                            }} aria-label={`Ver detalle de ${item.folio}`} />
                                            {item.folio}
                                            {isNewest && (
                                                <span style={{
                                                    marginLeft: 8, padding: '2px 6px', borderRadius: 2, fontSize: 8,
                                                    fontWeight: 700, background: '#16a34a', color: '#fff',
                                                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                                                    verticalAlign: 'middle',
                                                }}>NUEVO</span>
                                            )}
                                            {(item as any).svvNotificado && (
                                                <span style={{
                                                    marginLeft: 6, padding: '2px 6px', borderRadius: 2, fontSize: 8,
                                                    fontWeight: 700, background: '#eff1f3', color: '#1c3051',
                                                    border: '1px solid #c3c8d2',
                                                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                                                    verticalAlign: 'middle',
                                                }}>SVV</span>
                                            )}
                                        </td>
                                        <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8' }}>
                                            {(item as any).folioCad || '—'}
                                        </td>
                                        <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', letterSpacing: '0.02em' }}>
                                            {(item as any).codigoCatalogo || '—'}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{fechaStr}</span>
                                            {' · '}
                                            <span>{horaStr}</span>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: 600 }}>
                                            {item.tipoNombre?.toUpperCase() || 'NO ESPECIFICADO'}
                                        </td>
                                        <td style={tdStyle}>
                                            {item.colonia?.toUpperCase() || 'UBICACIÓN EN CURSO'}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ 
                                                fontSize: '10px', fontWeight: 800, 
                                                color: item.prioridadNombre?.toUpperCase() === 'ALTA' ? '#ef4444' : '#64748b' 
                                            }}>
                                                {item.prioridadNombre || 'MEDIA'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={getStatusBadgeStyle(item.estatus)}
                                                 title={STATUS_TOOLTIPS[item.estatus] || ''}>
                                                {item.estatus.replace('_', ' ').toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} className="btn-ver-ficha" style={btnViewStyle}>
                                                <Eye size={14} />
                                                VER FICHA
                                            </Link>
                                        </td>
                                    </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                    </div>

                    {/* PAGINACIÓN TÁCTICA */}
                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        baseUrl={estatus ? `/agente_911/ciudadano/incidentes?estatus=${estatus}` : "/agente_911/ciudadano/incidentes"}
                    />
                </div>
            </main>

            <footer style={footerStyle}>
                SISTEMA CENTINELA · ATENCIÓN CIUDADANA 911 · {new Date().getFullYear()}
            </footer>
        </div>
    );
}

// ... (Tus estilos se mantienen iguales)
const cardStyle = { 
    background: '#ffffff', border: '1px solid #e2e8f0', padding: '32px', 
    borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
};

const sectionTitleStyle: React.CSSProperties = { 
    fontFamily: 'Barlow Condensed', fontSize: '18px', fontWeight: 700, 
    textTransform: 'uppercase', color: '#1e293b', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '12px'
};

const decoratorStyle = { width: '4px', height: '18px', background: '#3e5171' };

const thStyle: React.CSSProperties = {
    padding: '16px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '10px',
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600
};

const headerInnerStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

const tdStyle: React.CSSProperties = {
    padding: '16px 12px', fontFamily: 'Inter', fontSize: '13px', color: '#475569'
};

const btnViewStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1f355a',
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
        case 'en_despacho':   return { ...base, background: '#eff1f3', color: '#1c3051', borderColor: '#dbdfe5' }; 
        case 'en_sitio':      return { ...base, background: '#f0fdfa', color: '#0f766e', borderColor: '#ccfbf1' }; 
        case 'atendido':      return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; 
        case 'cerrado_detencion': return { ...base, background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }; 
        default:              return { ...base, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' };
    }
}
