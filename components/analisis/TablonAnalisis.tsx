/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Shield, Gavel, Car, Eye, Box, MapPin, Search, Clock } from 'lucide-react';
import { analisisService } from '@/services/analisisService';
import Link from 'next/link';

export default function TablonAnalisis() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analisisService.getReportesRondin()
            .then(res => setData(Array.isArray(res) ? res : []))
            .finally(() => setLoading(false));
    }, []);

    // Función para armar la ubicación "por partes"
    const formatUbicacion = (r: any) => {
        const partes = [];
        // Ahora r.colonia y r.calle vienen de la tabla incidentes
        if (r.colonia && r.colonia !== '') partes.push(`Col. ${r.colonia}`);
        if (r.calle && r.calle !== '') partes.push(r.calle);

        return partes.length > 0 ? partes.join(', ') : 'UBICACIÓN NO ESPECIFICADA';
    };

    if (loading) return <div style={loadingStyle}>SINCRONIZANDO MATRIZ DE INTELIGENCIA...</div>;

    return (
        <div style={containerStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th style={thStyle}>IDENTIFICADOR / UNIDAD</th>
                        <th style={thStyle}>EVENTO</th>
                        <th style={thStyle}>UBICACIÓN DE CAMPO</th>
                        <th style={thStyle}>RESULTADOS</th>
                        <th style={thStyle}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((r, index) => (
                        <tr key={`${r.id}-${index}`} className="analisis-row" style={trStyle}>
                            {/* COLUMNA 1: FOLIO Y OFICIAL */}
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 800, fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#0f172a' }}>{r.folio}</div>
                                <div style={{ fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                    <Shield size={12} color="#2563eb" />
                                    <span style={{ letterSpacing: '0.05em' }}>{r.oficial || 'OFICIAL NO REGISTRADO'}</span>
                                </div>
                            </td>

                            {/* COLUMNA 2: INCIDENTE */}
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{r.tipo_incidente || 'NO CLASIFICADO'}</div>
                                <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                    <Clock size={10} /> {new Date(r.fecha).toLocaleString('es-MX', { hour12: true })}
                                </div>
                            </td>

                            {/* COLUMNA 3: UBICACIÓN INTELIGENTE */}
                            <td style={tdStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                    <MapPin size={14} color="#3b82f6" style={{ marginTop: 2 }} />
                                    <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#475569', maxWidth: '250px' }}>
                                        {formatUbicacion(r)}
                                        {r.entre_calles && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: 2 }}>E/C: {r.entre_calles}</div>}
                                    </div>
                                </div>
                            </td>

                            {/* COLUMNA 4: RESULTADOS TÁCTICOS */}
                            <td style={tdStyle}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <ResultBadge active={r.tiene_iph} label="IPH" icon={Gavel} color="#dc2626" bg="#fef2f2" />
                                    <ResultBadge active={r.tiene_veh} label="VEH" icon={Car} color="#2563eb" bg="#eff6ff" />
                                    <ResultBadge active={r.tiene_obj} label="OBJ" icon={Box} color="#475569" bg="#f1f5f9" />
                                </div>
                            </td>

                            {/* COLUMNA 5: ACCIÓN */}
                            <td style={tdStyle}>
                                <Link
                                    href={`/analisis/formulario-ingreso?id=${r.id}`}
                                    style={btnStyle}
                                >
                                    <Search size={14} /> VER FICHA
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- SUB-COMPONENTE PARA BADGES ---
const ResultBadge = ({ active, label, icon: Icon, color, bg }: any) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 2, fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono',
        background: active ? bg : '#f8fafc',
        color: active ? color : '#cbd5e1',
        border: `1px solid ${active ? color + '33' : '#e2e8f0'}`,
        opacity: active ? 1 : 0.5
    }}>
        <Icon size={12} /> {label}
    </div>
);

// --- ESTILOS ---
const containerStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const headerRowStyle = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle: React.CSSProperties = { padding: '16px 24px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' };
const tdStyle: React.CSSProperties = { padding: '20px 24px', borderBottom: '1px solid #f1f5f9' };
const trStyle = { transition: 'all 0.2s' };
const loadingStyle = { padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textAlign: 'center' as const };
const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0f172a', color: 'white', borderRadius: 2, fontSize: 10, fontWeight: 700, textDecoration: 'none', fontFamily: 'JetBrains Mono', transition: 'all 0.2s' };