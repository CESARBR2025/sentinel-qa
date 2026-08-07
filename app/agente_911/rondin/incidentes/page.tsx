import { auth } from "@/lib/auth";
import { getIncidentesPaginados } from "@/lib/911/service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/partials/Header";
import { PageHeader, PageHeaderLink } from "@/components/partials/PageHeader";
import { Eye, Plus, Calendar, MapPin, Hash, Shield, Car } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/911/Pagination";
import { tieneAccesoSeccion, obtenerRolNombre } from "@/lib/911/permisos";
import { labelEstatus } from "@/lib/911/estatus-c4";

export default async function ListadoRondinPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    // 1. Configuración de paginación
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = 10;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    if (!(await tieneAccesoSeccion(session.user.id, "911_rondin"))) redirect("/dashboard");

    const rolNombre = await obtenerRolNombre(session.user.id)
    const backHref = rolNombre === 'agente_despacho' ? '/agente_despacho' : '/dashboard'
    const backLabel = rolNombre === 'agente_despacho' ? 'Panel Despacho' : 'Dashboard'

    // 2. Consultas paginadas via servicio (Optimizado)
    const { rows: listado, total: totalCount } = await getIncidentesPaginados('radio', page, pageSize);
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
            <style>{`
                .fila-rondin { transition: background 0.15s ease; }
                .fila-rondin:hover { background: #f8fafc; }
            `}</style>

            <DashboardHeader user={{ name: session.user.name, apellido: session.user.apellido ?? undefined, email: session.user.email }} backHref={backHref} backLabel={backLabel} />

            <main className="pad-pagina" style={{ flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>

                <PageHeader
                    title="Bitácora"
                    accent="Rondines / Radio"
                    subtitle="Recorridos en campo reportados por el canal de radio"
                    actions={<PageHeaderLink href="/agente_911/rondin">+ Nuevo Registro</PageHeaderLink>}
                />

                {/* TABLA */}
                <div style={cardStyle}>
                    <div className="tabla-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}><div style={headerInnerStyle}><Hash size={12}/> Folio</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Calendar size={12}/> Fecha</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Shield size={12}/> Oficial</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><Car size={12}/> Tipo / Motivo</div></th>
                                <th style={thStyle}><div style={headerInnerStyle}><MapPin size={12}/> Ubicación</div></th>
                                <th style={thStyle}>Estatus</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listado.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontFamily: 'var(--apple-font-display)', fontSize: 14 }}>
                                        No hay recorridos registrados en este canal
                                    </td>
                                </tr>
                            ) : (
                                listado.map((item) => (
                                    <tr key={item.id} className="fila-rondin" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'var(--apple-font-display)', color: '#0f172a' }}>
                                            {item.folio}
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(item.fechaHoraInicio).toLocaleString('es-MX', { 
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </td>
                                        <td style={{ ...tdStyle, fontSize: '12px', fontWeight: 600 }}>
                                            {item.nombreOficial || 'N/E'}
                                        </td>
                                        <td style={{ ...tdStyle, color: '#1f355a', fontWeight: 500 }}>
                                            {item.tipoNombre || 'Recorrido general'}
                                        </td>
                                        <td style={tdStyle}>
                                            {item.colonia || 'S/C'}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={getStatusBadgeStyle(item.estatus)}>
                                                {labelEstatus(item.estatus)}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <Link href={`/911/rondin/incidentes/${item.id}`} style={btnViewStyle}>
                                                <Eye size={14} />
                                                Detalles
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>

                    {/* PAGINACIÓN */}
                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        baseUrl="/agente_911/rondin/incidentes"
                    />
                </div>
            </main>

            <footer style={footerStyle}>
                SSPM · San Juan del Río · Qro
            </footer>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    background: '#ffffff', border: '1px solid #e2e8f0', overflow: 'hidden',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
};

const thStyle: React.CSSProperties = {
    padding: '14px 12px', textAlign: 'left', fontFamily: 'var(--apple-font-display)', fontSize: '12px',
    color: '#64748b', textTransform: 'none', letterSpacing: 'normal', fontWeight: 600,
};

const headerInnerStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

const tdStyle: React.CSSProperties = {
    padding: '14px 12px', fontFamily: 'var(--apple-font-display)', fontSize: '13px', color: '#475569',
};

const btnViewStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1f355a',
    fontFamily: 'var(--apple-font-display)', fontSize: '13px', fontWeight: 600,
    textDecoration: 'none', textTransform: 'none', letterSpacing: 'normal',
};

const footerStyle: React.CSSProperties = {
    marginTop: 'auto', padding: '24px 0', fontFamily: 'var(--apple-font-display)', fontSize: '12px', color: '#94a3b8',
    textAlign: 'center', letterSpacing: 'normal', textTransform: 'none',
};

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = {
        padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px',
        fontWeight: 600, fontFamily: 'var(--apple-font-display)', display: 'inline-block',
    };
    switch (estatus) {
        case 'sin_despachar': return { ...base, background: '#fef3c7', color: '#b45309' };
        case 'en_despacho':   return { ...base, background: '#f1f5f9', color: '#1f355a' };
        case 'en_sitio':      return { ...base, background: '#ccfbf1', color: '#0f766e' };
        case 'atendido':      return { ...base, background: '#dcfce7', color: '#16a34a' };
        case 'cerrado_detencion': return { ...base, background: '#f5f3ff', color: '#7c3aed' };
        default:              return { ...base, background: '#f8fafc', color: '#64748b' };
    }
}
