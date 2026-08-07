/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound, redirect } from "next/navigation";
import { getIncidenteConExtras } from "@/lib/911/service";
import { DashboardHeader } from "@/components/partials/Header";
import { DashboardFooter } from "@/components/partials/Footer";
import { PageHeader } from "@/components/partials/PageHeader";
import { MapaFicha911 } from "@/components/911/MapaFicha911";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    MapPin, User, Clock, AlertTriangle, Phone, School, FileText,
    PhoneCall, Hash, Building2, UserRound, Globe, Gauge, Ruler, KeyRound,
} from "lucide-react";
import React from "react";
import { tienePermiso } from "@/lib/permisos/core";
import { labelEstatus } from "@/lib/911/estatus-c4";

const ETIQUETA_TIPO: Record<string, string> = {
    'normal': 'Normal',
    'extorsion': 'Extorsión',
    'alarma_escolar': 'Alarma Escolar',
}

const TIPO_COLOR: Record<string, { strong: string; bg: string }> = {
    'normal':         { strong: '#475569', bg: '#f1f5f9' },
    'extorsion':      { strong: '#b91c1c', bg: '#fee2e2' },
    'alarma_escolar': { strong: '#15803d', bg: '#dcfce7' },
}

const ESTATUS_COLOR: Record<string, { strong: string; bg: string }> = {
    sin_despachar:     { strong: '#b45309', bg: '#fef3c7' },
    en_despacho:       { strong: '#1f355a', bg: '#f1f5f9' },
    en_sitio:          { strong: '#0f766e', bg: '#ccfbf1' },
    atendido:          { strong: '#16a34a', bg: '#dcfce7' },
    cerrado_detencion: { strong: '#7c3aed', bg: '#f5f3ff' },
}

const COLOR_PRIORIDAD: Record<string, string> = {
    'ALTA': '#dc2626',
    'MEDIA': '#b45309',
    'BAJA': '#64748b',
}

function getStatusBadgeStyle(estatus: string): React.CSSProperties {
    const base: React.CSSProperties = {
        padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13,
        fontWeight: 600, fontFamily: 'var(--apple-font-display)', display: 'inline-flex',
        alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
    }
    const c = ESTATUS_COLOR[estatus]
    if (!c) return { ...base, background: '#f1f5f9', color: '#64748b' }
    return { ...base, background: c.bg, color: c.strong }
}

function getTipoBadgeStyle(tipo: string): React.CSSProperties {
    const base: React.CSSProperties = {
        padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 12,
        fontWeight: 600, fontFamily: 'var(--apple-font-display)', display: 'inline-flex',
        alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
    }
    const c = TIPO_COLOR[tipo]
    if (!c) return { ...base, background: '#f1f5f9', color: '#64748b' }
    return { ...base, background: c.bg, color: c.strong }
}

export default async function DetalleCiudadanoCompletoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    // Igual que el detalle de whatsapp/rondin: quien tenga acceso a la bitácora
    // general de incidentes (ej. despachador, bitacorista) también puede ver el
    // detalle de un reporte de canal ciudadano, no solo quien captura ese canal.
    const tieneAcceso = (await tienePermiso(session.user.id, "911_ciudadano", "ver")) || (await tienePermiso(session.user.id, "incidentes", "ver"))
    if (!tieneAcceso) redirect("/dashboard");

    const backHref = '/agente_911/ciudadano/incidentes'
    const backLabel = 'Bitácora'

    const data = await getIncidenteConExtras(id) as any;
    if (!data) notFound();
    const { inc, ext, ala } = data;

    const prio = String(data.prioridad_nombre ?? 'MEDIA').toUpperCase()
    const prioColor = COLOR_PRIORIDAD[prio] ?? '#64748b'
    const fechaInicio = inc.fecha_hora_inicio
        ? new Date(inc.fecha_hora_inicio).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—'
    const fechaFin = inc.fecha_hora_fin
        ? new Date(inc.fecha_hora_fin).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'En proceso'
    const domicilio = [inc.calle, inc.numero_exterior, inc.numero_interior].filter(Boolean).join(' ') || '—'

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                .ficha-columnas { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 24px; align-items: start; }
                @media (max-width: 720px) { .ficha-columnas { grid-template-columns: 1fr; } }
            `}</style>

            <DashboardHeader user={session.user as any} backHref={backHref} backLabel={backLabel} />

            <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <PageHeader
                        title="Ficha"
                        accent="de Incidente"
                        accentColor="#1f355a"
                        subtitle={`${inc.folio}${inc.folio_cad ? ` · Folio CAD ${inc.folio_cad}` : ''} · Reporte telefónico canal ciudadano`}
                        actions={<span style={getStatusBadgeStyle(inc.estatus)}>{labelEstatus(inc.estatus, false)}</span>}
                    />

                    <div className="ficha-columnas">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* DATOS DEL REPORTANTE */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitleStyle}><User size={16} /> Datos del reportante</h2>
                                <div className="grid-2">
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><UserRound size={12} /> Nombre</label>
                                        <span style={valueStyle}>{inc.anonimo ? 'Modo anónimo' : (inc.nombre_reportante || '—')}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><PhoneCall size={12} /> Teléfono (ANI)</label>
                                        <span style={valueStyle}>{inc.telefono_reportante || '—'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><UserRound size={12} /> Sexo / Edad</label>
                                        <span style={valueStyle}>{inc.sexo || 'NE'} / {inc.edad || '--'} años</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><Globe size={12} /> ¿Migrante?</label>
                                        <span style={valueStyle}>{inc.es_migrante ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><UserRound size={12} /> ¿Usuario frecuente?</label>
                                        <span style={valueStyle}>{inc.es_usuario_frecuente ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><UserRound size={12} /> ¿Persona afectada?</label>
                                        <span style={valueStyle}>{inc.es_persona_afectada ? 'Sí' : 'No'}</span>
                                    </div>
                                </div>
                            </section>

                            {/* CLASIFICACIÓN TÉCNICA */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitleStyle}><AlertTriangle size={16} /> Clasificación técnica</h2>
                                <div className="grid-2">
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><AlertTriangle size={12} /> Emergencia</label>
                                        <span style={valueStyle}>{data.emergencia_nombre || '—'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><FileText size={12} /> Incidente</label>
                                        <span style={valueStyle}>{data.tipo_nombre || '—'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><Hash size={12} /> Tipo de reporte</label>
                                        <span><span style={getTipoBadgeStyle(inc.tipo_reporte)}>{ETIQUETA_TIPO[inc.tipo_reporte] ?? (inc.tipo_reporte || '—')}</span></span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><Gauge size={12} /> Prioridad</label>
                                        <span style={{ ...valueStyle, fontWeight: 700, color: prioColor }}>{data.prioridad_nombre || '—'}</span>
                                    </div>
                                    {inc.svv_notificado && (
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><Building2 size={12} /> SVV</label>
                                            <span style={{ ...valueStyle, color: '#1c3051', fontWeight: 600 }}>Monitoristas notificados</span>
                                        </div>
                                    )}
                                    {data.dependencia_nombre && (
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><Building2 size={12} /> Dependencia</label>
                                            <span style={valueStyle}>{data.dependencia_nombre}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* CRONOLOGÍA */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitleStyle}><Clock size={16} /> Cronología</h2>
                                <div className="grid-2">
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><Clock size={12} /> Fecha y hora de inicio</label>
                                        <span style={valueStyle}>{fechaInicio}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><Clock size={12} /> Fecha y hora de cierre</label>
                                        <span style={valueStyle}>{fechaFin}</span>
                                    </div>
                                </div>
                            </section>

                            {/* NARRATIVA */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitleStyle}><FileText size={16} /> Descripción de hechos</h2>
                                <div style={narrativaBoxStyle}>{inc.descripcion || 'Sin descripción registrada.'}</div>
                                {inc.observaciones && (
                                    <div style={{ marginTop: 20, padding: '16px 18px', borderTop: '1px solid #e2e8f0' }}>
                                        <label style={labelStyle}>Notas del operador</label>
                                        <p style={{ fontSize: 14, margin: 0, color: '#334155', lineHeight: 1.6 }}>{inc.observaciones}</p>
                                    </div>
                                )}
                            </section>

                            {/* DATOS ESPECIALES (EXTORSIÓN / ALARMA) */}
                            {ext && (
                                <section style={{ ...cardStyle, borderLeft: '4px solid #dc2626' }}>
                                    <h2 style={{ ...sectionTitleStyle, color: '#b91c1c' }}><Phone size={16} /> Detalles de extorsión</h2>
                                    <div className="grid-2">
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><PhoneCall size={12} /> Teléfono</label>
                                            <span style={valueStyle}>{ext.telefono_extorsion || '—'}</span>
                                        </div>
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><UserRound size={12} /> Grupo</label>
                                            <span style={valueStyle}>{ext.grupo_delictivo || '—'}</span>
                                        </div>
                                        <div style={{ ...itemGroupStyle, gridColumn: 'span 2' }}>
                                            <label style={labelStyle}><FileText size={12} /> Modus operandi</label>
                                            <p style={{ ...valueStyle, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{ext.modus_operandi || '—'}</p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {ala && (
                                <section style={{ ...cardStyle, borderLeft: '4px solid #059669' }}>
                                    <h2 style={{ ...sectionTitleStyle, color: '#15803d' }}><School size={16} /> Alarma escolar</h2>
                                    <div className="grid-2">
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><School size={12} /> Establecimiento</label>
                                            <span style={valueStyle}>{ala.establecimiento || '—'}</span>
                                        </div>
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><UserRound size={12} /> Responsable</label>
                                            <span style={valueStyle}>{ala.nombre_responsable || '—'}</span>
                                        </div>
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><Building2 size={12} /> Inmueble</label>
                                            <span style={valueStyle}>{ala.inmueble || '—'}</span>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* PANEL LATERAL */}
                        <div className="panel-lateral" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <section style={{ ...cardStyle, borderTop: '4px solid #1f355a' }}>
                                <h2 style={sectionTitleStyle}><MapPin size={16} /> Ubicación</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><MapPin size={12} /> Domicilio</label>
                                        <span style={valueStyle}>{domicilio}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><MapPin size={12} /> Colonia</label>
                                        <span style={valueStyle}>{inc.colonia || '—'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><MapPin size={12} /> Municipio</label>
                                        <span style={valueStyle}>{inc.municipio || '—'}</span>
                                    </div>
                                    <div style={itemGroupStyle}>
                                        <label style={labelStyle}><MapPin size={12} /> Entre calles</label>
                                        <span style={valueStyle}>{inc.entre_calles || '—'}</span>
                                    </div>
                                    {inc.referencia_ubicacion && (
                                        <div style={refBoxStyle}>
                                            <label style={labelStyle}>Referencias</label>
                                            <p style={{ fontSize: 13, margin: 0, color: '#334155', lineHeight: 1.5 }}>{inc.referencia_ubicacion}</p>
                                        </div>
                                    )}
                                    {(inc.latitud || inc.longitud) && (
                                        <div style={itemGroupStyle}>
                                            <label style={labelStyle}><Ruler size={12} /> Coordenadas</label>
                                            <span style={{ ...valueStyle, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                                                {Number(inc.latitud).toFixed(6)}, {Number(inc.longitud).toFixed(6)}
                                            </span>
                                        </div>
                                    )}

                                    {(inc.latitud || inc.longitud) && (
                                        <div style={{ marginTop: 2 }}>
                                            <MapaFicha911
                                                lat={inc.latitud ? Number(inc.latitud) : null}
                                                lng={inc.longitud ? Number(inc.longitud) : null}
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section style={cardStyle}>
                                <h2 style={sectionTitleStyle}><KeyRound size={16} /> Registro</h2>
                                <div style={itemGroupStyle}>
                                    <label style={labelStyle}><UserRound size={12} /> Capturado por</label>
                                    <span style={valueStyle}>{data.capturado_por_nombre || inc.capturado_por || '—'}</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="pad-pagina" style={{ paddingTop: 8 }}>
                    <DashboardFooter />
                </div>
            </main>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    background: '#ffffff', border: '1px solid #e2e8f0',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', padding: '22px 24px',
};
const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 16, fontWeight: 600,
    color: '#0f172a', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
    letterSpacing: 'normal', textTransform: 'none',
};
const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b',
    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontWeight: 500,
    letterSpacing: 'normal', textTransform: 'none',
};
const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#1e293b', lineHeight: 1.4,
};
const itemGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const narrativaBoxStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 14, lineHeight: 1.7, color: '#334155',
    padding: '18px 20px', background: '#f8fafc', border: '1px solid #f1f5f9',
    borderRadius: 'var(--radius-lg)', whiteSpace: 'pre-wrap',
};
const refBoxStyle: React.CSSProperties = {
    padding: '14px 16px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 'var(--radius-lg)',
};
