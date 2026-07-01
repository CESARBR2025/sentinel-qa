'use client';

import { useState, useEffect, useCallback } from 'react';
import { abrirDocumento } from '@/lib/shared/abrirDocumento';
import { obtenerDocumentosLiberacion, generarOrdenPagoAction, revisarDocumentoAction, finalizarRevisionAction } from '@/lib/agente_liberaciones/actions';
import {
    FileText, CheckCircle2, XCircle, Eye, Loader2, MessageSquare,
    Receipt, IdCard, Home, Car, FileBadge2, ScrollText, FileCheck,
    AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';

const accent = '#0891b2';

type Documento = {
    id: string;
    tipo: string;
    url: string;
    estatusRevision: string | null;
    observaciones: string | null;
};

const DOC_ICONS: Record<string, React.ReactNode> = {
    factura: <Receipt size={14} />,
    ine_titular: <IdCard size={14} />,
    ine_representante_legal: <IdCard size={14} />,
    comprobante_domicilio: <Home size={14} />,
    tarjeta_circulacion: <Car size={14} />,
    oficio_liberacion_fiscalia: <FileBadge2 size={14} />,
    oficio_liberacion_juzgado: <FileCheck size={14} />,
    poder_notarial: <ScrollText size={14} />,
    constancia_situacion_fiscal: <FileText size={14} />,
};

const DOC_LABELS: Record<string, string> = {
    factura: 'Factura',
    ine_titular: 'INE del Titular',
    comprobante_domicilio: 'Comprobante de Domicilio',
    tarjeta_circulacion: 'Tarjeta de Circulación',
    oficio_liberacion_fiscalia: 'Oficio Lib. Fiscalía',
    oficio_liberacion_juzgado: 'Oficio Lib. Juzgado Cívico',
    ine_representante_legal: 'INE del Rep. Legal',
    poder_notarial: 'Poder Notarial',
    constancia_situacion_fiscal: 'Cte. Situación Fiscal',
};

export default function RevisionDocumentosSection({
    infraccionId,
    onValidated,
}: {
    infraccionId: string;
    onValidated?: () => void;
}) {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [accionando, setAccionando] = useState<string | null>(null);
    const [rechazoDoc, setRechazoDoc] = useState<string | null>(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [mostrarObs, setMostrarObs] = useState(false);

    const fetchDocs = useCallback(async () => {
        setLoading(true);
        const result = await obtenerDocumentosLiberacion(infraccionId);
        if (!result.error && result.documentos) setDocumentos(result.documentos);
        setLoading(false);
    }, [infraccionId]);
    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const handleRevision = async (docId: string, accion: 'ACEPTADO' | 'RECHAZADO', observaciones?: string) => {
        setAccionando(docId);
        try {
            await revisarDocumentoAction({ documentoId: docId, accion, observaciones });
            await fetchDocs();
        } finally {
            setAccionando(null);
        }
    };

    const [finalizando, setFinalizando] = useState(false);
    const [finalizadoEstatus, setFinalizadoEstatus] = useState<string | null>(null);
    const [paso, setPaso] = useState<'save' | 'order' | null>(null);

    const handleFinalizar = async () => {
        if (stats.pendientes > 0) return;
        setFinalizando(true);
        setPaso('save');
        try {
            const result = await finalizarRevisionAction(infraccionId);
            if (result.error) throw new Error(result.error);
            setFinalizadoEstatus(result.estatus ?? null);

            if (result.estatus === 'PENDIENTE_PAGO' && result.folio && result.concepto_id) {
                setPaso('order');
                await generarOrdenPagoAction({
                    infraccion_id: infraccionId,
                    nombre_usuario: result.nombre_usuario ?? '',
                    apellidos_usuario: result.apellidos_usuario ?? '',
                    concepto_id: Number(result.concepto_id),
                    folio: result.folio ?? '',
                    correoInfractor: result.correo_infractor ?? '',
                    descuentoAplicado: String(result.descuento_aplicado || ''),
                });
            }
            onValidated?.();
        } catch (err) {
            console.error('[FINALIZAR]', err);
        } finally {
            setFinalizando(false);
            setPaso(null);
        }
    };

    const stats = {
        pendientes: documentos.filter((d) => !d.estatusRevision || d.estatusRevision === 'PENDIENTE').length,
        aceptados: documentos.filter((d) => d.estatusRevision === 'ACEPTADO').length,
        rechazados: documentos.filter((d) => d.estatusRevision === 'RECHAZADO').length,
    };

    if (loading) {
        return (
            <div style={{
                border: '1px solid #e2e8f0', background: '#ffffff', padding: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b',
            }}>
                <Loader2 size={18} className="animate-spin" style={{ color: accent }} />
                <span>Cargando documentos del ciudadano</span>
            </div>
        );
    }

    if (documentos.length === 0) return null;

    const styles = {
        card: {
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            overflow: 'hidden',
        },
        th: {
            padding: '12px 24px',
            textAlign: 'left' as const,
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#64748b',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
        },
        td: {
            padding: '14px 24px',
            fontSize: 13,
            fontFamily: 'Inter,sans-serif',
            color: '#1e293b',
            borderBottom: '1px solid #f1f5f9',
        },
    };

    return (
        <div style={styles.card}>

            {/* ─── HEADER ─── */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                position: 'relative',
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: 2, width: 40, background: accent }} />

                <div style={{
                    width: 36, height: 36,
                    background: '#ecfeff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <FileText size={16} style={{ color: accent }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontFamily: '"JetBrains Mono",monospace', fontSize: 10,
                        letterSpacing: '0.15em', color: accent, textTransform: 'uppercase',
                        marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <span style={{ width: 6, height: 6, background: accent, display: 'inline-block' }} />
                        REVISIÓN DOCUMENTAL
                    </div>
                    <h3 style={{
                        fontFamily: '"Barlow Condensed",sans-serif', fontWeight: 700,
                        fontSize: 22, letterSpacing: '0.04em', textTransform: 'uppercase',
                        margin: 0, color: '#0f172a', lineHeight: 1.1,
                    }}>
                        Documentos del Ciudadano
                    </h3>
                </div>

                {/* STATS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {[
                        { count: stats.pendientes, label: 'pend', dot: '#94a3b8', bg: '#f8fafc', text: '#64748b' },
                        { count: stats.aceptados, label: 'acept', dot: '#22c55e', bg: '#f0fdf4', text: '#16a34a' },
                        { count: stats.rechazados, label: 'rechaz', dot: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', background: s.bg,
                            fontFamily: '"JetBrains Mono",monospace', fontSize: 10,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                            <span style={{ fontWeight: 600, color: s.text }}>{s.count}</span>
                            <span style={{ color: s.text, opacity: 0.7 }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── PROGRESS BAR ─── */}
            {documentos.length > 0 && (
                <div style={{ display: 'flex', height: 3, width: '100%' }}>
                    <div style={{ width: `${(stats.aceptados / documentos.length) * 100}%`, background: '#22c55e', transition: 'width 0.5s' }} />
                    <div style={{ width: `${(stats.rechazados / documentos.length) * 100}%`, background: '#ef4444', transition: 'width 0.5s' }} />
                    <div style={{ width: `${(stats.pendientes / documentos.length) * 100}%`, background: '#e2e8f0', transition: 'width 0.5s' }} />
                </div>
            )}

            {/* ─── TABLE ─── */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Documento</th>
                            <th style={styles.th}>Estatus</th>
                            <th style={{ ...styles.th, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentos.map((doc, idx) => {
                            const pendiente = !doc.estatusRevision || doc.estatusRevision === 'PENDIENTE';
                            const aceptado = doc.estatusRevision === 'ACEPTADO';
                            const rechazado = doc.estatusRevision === 'RECHAZADO';
                            const rowBg = aceptado ? 'rgba(34,197,94,0.03)' : rechazado ? 'rgba(239,68,68,0.03)' : undefined;

                            return (
                                <tr key={doc.id} style={{ background: rowBg, transition: 'background 0.15s' }}
                                    className="hover-row">
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 34, height: 34,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: aceptado ? '#dcfce7' : rechazado ? '#fee2e2' : '#f1f5f9',
                                                color: aceptado ? '#16a34a' : rechazado ? '#dc2626' : '#64748b',
                                                flexShrink: 0,
                                            }}>
                                                {DOC_ICONS[doc.tipo] || <FileText size={14} />}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                                                    {DOC_LABELS[doc.tipo] || doc.tipo}
                                                </div>
                                                <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#94a3b8' }}>
                                                    DOC #{idx + 1}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={styles.td}>
                                        {pendiente ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
                                                <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: '#94a3b8' }}>
                                                    PENDIENTE
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                padding: '3px 10px',
                                                fontFamily: '"JetBrains Mono",monospace', fontSize: 10, fontWeight: 600,
                                                background: aceptado ? '#dcfce7' : '#fee2e2',
                                                color: aceptado ? '#166534' : '#991b1b',
                                            }}>
                                                {aceptado ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                {aceptado ? 'ACEPTADO' : 'RECHAZADO'}
                                            </span>
                                        )}
                                    </td>

                                    <td style={{ ...styles.td, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                                            <button onClick={() => abrirDocumento(doc.url)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                                    padding: '6px 12px', fontSize: 11, fontWeight: 500,
                                                    fontFamily: 'Inter,sans-serif',
                                                    color: '#475569', background: '#ffffff',
                                                    border: '1px solid #e2e8f0', cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}>
                                                <Eye size={13} /> Ver
                                            </button>

                                            {pendiente && accionando !== doc.id && (
                                                <>
                                                    <button onClick={() => handleRevision(doc.id, 'ACEPTADO')}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                                            padding: '6px 12px', fontSize: 11, fontWeight: 600,
                                                            fontFamily: 'Inter,sans-serif',
                                                            color: '#ffffff', background: '#22c55e', border: 'none',
                                                            cursor: 'pointer', transition: 'all 0.15s',
                                                        }}>
                                                        <CheckCircle2 size={12} /> Aceptar
                                                    </button>
                                                    <button onClick={() => { setRechazoDoc(doc.id); setMotivoRechazo(''); }}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                                            padding: '6px 12px', fontSize: 11, fontWeight: 600,
                                                            fontFamily: 'Inter,sans-serif',
                                                            color: '#ffffff', background: '#ef4444', border: 'none',
                                                            cursor: 'pointer', transition: 'all 0.15s',
                                                        }}>
                                                        <XCircle size={12} /> Rechazar
                                                    </button>
                                                </>
                                            )}

                                            {accionando === doc.id && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Loader2 size={14} className="animate-spin" style={{ color: accent }} />
                                                    <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: accent }}>PROCESANDO</span>
                                                </div>
                                            )}

                                            {(aceptado || rechazado) && (
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                                    padding: '6px 12px', fontSize: 10, fontWeight: 600,
                                                    fontFamily: '"JetBrains Mono",monospace',
                                                    background: aceptado ? '#dcfce7' : '#fee2e2',
                                                    color: aceptado ? '#16a34a' : '#dc2626',
                                                }}>
                                                    {aceptado ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                    BLOQUEADO
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ─── MODAL DE RECHAZO ─── */}
            {rechazoDoc && (
                <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '20px 24px', background: '#fef2f2' }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#fee2e2', color: '#dc2626', flexShrink: 0,
                            }}>
                                <AlertTriangle size={16} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div>
                                    <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, fontWeight: 600, color: '#dc2626', letterSpacing: '0.05em' }}>
                                        RECHAZAR DOCUMENTO
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                        {DOC_LABELS[documentos.find((d) => d.id === rechazoDoc)?.tipo || ''] || 'Documento'}
                                    </div>
                                </div>
                                <textarea value={motivoRechazo} onChange={(e) => setMotivoRechazo(e.target.value)}
                                    placeholder="Describe el motivo del rechazo..." rows={3}
                                    style={{
                                        width: '100%', resize: 'none',
                                        border: '1px solid #fecaca', background: '#ffffff',
                                        padding: '10px 14px', fontSize: 13, color: '#0f172a',
                                        fontFamily: 'Inter,sans-serif', outline: 'none',
                                    }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#94a3b8' }}>
                                        {motivoRechazo.length} / 500 caracteres
                                    </span>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => setRechazoDoc(null)}
                                            style={{
                                                padding: '8px 16px', fontSize: 12, fontWeight: 500,
                                                fontFamily: 'Inter,sans-serif',
                                                color: '#64748b', background: '#ffffff',
                                                border: '1px solid #e2e8f0', cursor: 'pointer',
                                            }}>
                                            Cancelar
                                        </button>
                                        <button onClick={() => { if (motivoRechazo.trim()) { handleRevision(rechazoDoc, 'RECHAZADO', motivoRechazo.trim()); setRechazoDoc(null); setMotivoRechazo(''); } }}
                                            disabled={!motivoRechazo.trim()}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                padding: '8px 16px', fontSize: 12, fontWeight: 600,
                                                fontFamily: 'Inter,sans-serif',
                                                color: '#ffffff', background: '#ef4444', border: 'none',
                                                cursor: motivoRechazo.trim() ? 'pointer' : 'not-allowed',
                                                opacity: motivoRechazo.trim() ? 1 : 0.5,
                                            }}>
                                            <XCircle size={13} /> Confirmar rechazo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── OBSERVACIONES ─── */}
            {documentos.some((d) => d.observaciones) && (
                <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    <button onClick={() => setMostrarObs(!mostrarObs)}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 24px', fontFamily: '"JetBrains Mono",monospace', fontSize: 10,
                            color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MessageSquare size={12} />
                            Observaciones ({documentos.filter((d) => d.observaciones).length})
                        </span>
                        {mostrarObs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {mostrarObs && (
                        <div>
                            {documentos.filter((d) => d.observaciones).map((doc) => (
                                <div key={`obs-${doc.id}`} style={{
                                    padding: '12px 24px', display: 'flex', gap: 12,
                                    background: '#f8fafc', borderTop: '1px solid #f1f5f9',
                                }}>
                                    <MessageSquare size={12} style={{ color: '#64748b', marginTop: 2, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, fontWeight: 600, color: '#0f172a' }}>
                                            {DOC_LABELS[doc.tipo] || doc.tipo}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
                                            &ldquo;{doc.observaciones}&rdquo;
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── FOOTER / FINALIZAR ─── */}
            <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 24px' }}>
                {finalizadoEstatus === 'REGISTRADA' ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', background: '#fef3c7', border: '1px solid #fde68a',
                    }}>
                        <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0 }} />
                        <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, fontWeight: 500, color: '#92400e' }}>
                            Se requiere corrección del ciudadano titular, espera a que los suba nuevamente
                        </span>
                    </div>
                ) : finalizadoEstatus === 'PENDIENTE_PAGO' ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0',
                    }}>
                        <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                        <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, fontWeight: 500, color: '#166534' }}>
                            Documentos aprobados, pendiente de pago
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: stats.pendientes === 0 ? '#22c55e' : '#f59e0b',
                            }} />
                            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#64748b' }}>
                                {stats.pendientes === 0
                                    ? 'TODOS LOS DOCUMENTOS HAN SIDO REVISADOS'
                                    : `${stats.pendientes} DOCUMENTO(S) PENDIENTE(S)`}
                            </span>
                        </div>
                        <button onClick={handleFinalizar} disabled={stats.pendientes > 0 || finalizando}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 24px', fontSize: 12, fontWeight: 600,
                                fontFamily: 'Inter,sans-serif',
                                color: '#ffffff', border: 'none', cursor: stats.pendientes === 0 && !finalizando ? 'pointer' : 'not-allowed',
                                opacity: stats.pendientes === 0 && !finalizando ? 1 : 0.5,
                                background: stats.pendientes === 0 ? accent : '#94a3b8',
                                transition: 'all 0.15s',
                            }}>
                            {finalizando ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            {finalizando ? (paso === 'order' ? 'Generando orden de pago...' : 'Guardando revisión...') : 'Finalizar revisión'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
