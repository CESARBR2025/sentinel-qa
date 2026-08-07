"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createIncidenteCliente } from "@/lib/incidentes/actions";

type CatalogoItem = { id: number; nombre: string };
type Catalogos = {
    emergencias: CatalogoItem[];
    subtipos: CatalogoItem[];
    incidentes: CatalogoItem[];
    prioridades: CatalogoItem[];
    dependencias: CatalogoItem[];
};
type Despachador = { id: string; name: string; apellido: string; rolNombre: string | null; activo: boolean; enLinea: boolean };

type Props = {
    open: boolean;
    data: Record<string, string>;
    coords: { lat: number; lng: number };
    catalogos: Catalogos;
    despachadores: Despachador[];
    onClose: () => void;
    onNuevo: () => void;
};

export default function ModalConfirmacion911({
    open,
    data,
    coords,
    catalogos,
    despachadores,
    onClose,
    onNuevo,
}: Props) {
    const router = useRouter();
    const [fase, setFase] = useState<'resumen' | 'despacho' | 'guardando' | 'exito'>(open ? 'resumen' : 'resumen');
    const [despachadorId, setDespachadorId] = useState("");
    const [folio, setFolio] = useState("");

    if (!open) return null;

    const f = (k: string) => data[k] || "";

    const catNombre = (cat: CatalogoItem[] | undefined, id: string | null) => {
        if (!cat || !id) return '—';
        const item = cat.find((c) => String(c.id) === id);
        return item?.nombre || id;
    };

    const requiere = f('requiereDespacho') === 'true';
    const prioridadEfectiva = f('prioridadId')
        ? catNombre(catalogos?.prioridades, f('prioridadId'))
        : f('prioridadCatalogo');
    const esAltaPrioridad = String(prioridadEfectiva).toUpperCase() === 'ALTA';
    const despachadorSeleccionado = despachadores.find((d) => d.id === despachadorId);
    const despachadorNoDisponible = Boolean(despachadorSeleccionado && !despachadorSeleccionado.activo);
    const despachadorSinActividad = Boolean(despachadorSeleccionado && despachadorSeleccionado.activo && !despachadorSeleccionado.enLinea);
    const esAlto = esAltaPrioridad;

    const getItems = () => {
        const items: { label: string; value: string }[] = [
            { label: 'Canal', value: '911' },
            { label: 'Folio CAD', value: f('folioCad') },
            { label: 'Tipo de Reporte', value: f('tipoReporte') },
            { label: 'Fecha/Hora Inicio', value: f('fechaHoraInicio') },
            { label: 'Anónimo', value: f('anonimo') === 'true' ? 'Sí' : 'No' },
            { label: 'Nombre del Reportante', value: f('anonimo') === 'true' ? '[ANÓNIMO]' : f('nombreReportante') },
            { label: 'Teléfono (ANI)', value: f('telefonoReportante') || '—' },
            { label: 'Sexo', value: f('sexo') },
            { label: 'Edad', value: f('edad') },
            { label: 'Usuario Frecuente', value: f('esUsuarioFrecuente') === 'true' ? 'Sí' : 'No' },
            { label: 'Persona Afectada', value: f('esPersonaAfectada') === 'true' ? 'Sí' : 'No' },
            { label: 'Es Migrante', value: f('esMigrante') === 'true' ? 'Sí' : 'No' },
            { label: 'Calle', value: f('calle') },
            { label: 'No. Exterior', value: f('numero_exterior') },
            { label: 'No. Interior', value: f('numero_interior') },
            { label: 'Colonia', value: f('colonia') },
            { label: 'Municipio', value: f('municipio') },
            { label: 'Referencia', value: f('referenciaUbicacion') },
            { label: 'Tipo de Emergencia', value: catNombre(catalogos?.emergencias, f('tipoEmergenciaId')) },
            { label: 'Subtipo', value: catNombre(catalogos?.subtipos, f('subtipoEmergenciaId')) },
            { label: 'Incidente', value: catNombre(catalogos?.incidentes, f('tipoIncidenteId')) },
            { label: 'Prioridad Catálogo', value: f('prioridadCatalogo') },
            { label: 'Prioridad (ajuste)', value: catNombre(catalogos?.prioridades, f('prioridadId')) || 'Automática' },
            { label: 'Descripción', value: f('descripcion') },
            { label: 'Requiere Despacho', value: f('requiereDespacho') === 'true' ? 'Sí' : 'No' },
            { label: 'Notificar SVV', value: f('svvNotificado') === 'true' ? 'Sí' : 'No' },
            { label: 'Dependencia', value: catNombre(catalogos?.dependencias, f('dependenciaId')) },
            { label: 'Observaciones Operador', value: f('observaciones') },
        ];

        if (f('tipoReporte') === 'extorsion') {
            items.push(
                { label: 'Teléfono Extorsión', value: f('telefonoExtorsion') },
                { label: 'Grupo Delictivo', value: f('grupoDelictivo') },
                { label: 'Modus Operandi', value: f('modusOperandi') },
            );
        }

        if (f('tipoReporte') === 'alarma_escolar') {
            items.push(
                { label: 'Establecimiento', value: f('establecimiento') },
                { label: 'Nombre Responsable', value: f('nombreResponsable') },
                { label: 'Inmueble', value: f('inmueble') },
                { label: 'Activaciones', value: f('numeroActivaciones') },
            );
        }

        return items;
    };

    const items = getItems();

    const section = (icon: string, title: string) => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 700,
            textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.03em',
        }}>
            <span style={{ fontSize: 15 }}>{icon}</span>
            {title}
        </div>
    );

    const field = (label: string, value: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
                fontFamily: 'var(--apple-font-display)', fontSize: 8, fontWeight: 600,
                color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{label}</span>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                {value || '—'}
            </span>
        </div>
    );

    const guardar = async (canalizar: boolean) => {
        setFase('guardando');
        try {
            const fd = new FormData();
            for (const key in data) {
                fd.append(key, data[key]);
            }
            fd.append("latitud", coords.lat.toString());
            fd.append("longitud", coords.lng.toString());
            if (canalizar && despachadorId) {
                fd.append("despachadorId", despachadorId);
            }
            const result = await createIncidenteCliente(fd);
            setFolio(result.folio);
            setFase('exito');
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Error al guardar el reporte');
            setFase(requiere ? 'despacho' : 'resumen');
        }
    };

    const fechaPublicado = new Date().toLocaleString('es-MX', {
        dateStyle: 'long',
        timeStyle: 'short',
    });

    const botonPrimario = (label: string, onClick: () => void, disabled = false) => (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '10px 22px',
                background: disabled ? '#cbd5e1' : '#1c3051',
                border: 'none', borderRadius: 10,
                fontFamily: 'var(--apple-font-display)', fontSize: 12,
                fontWeight: 700, color: '#ffffff', cursor: disabled ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 8,
            }}
        >
            {label}
        </button>
    );

    const botonSecundario = (label: string, onClick: () => void, disabled = false) => (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '10px 22px', background: '#f1f5f9', border: '1px solid #e2e8f0',
                borderRadius: 10, fontFamily: 'var(--apple-font-display)', fontSize: 12,
                fontWeight: 600, color: '#475569', cursor: disabled ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
            padding: 16,
        }}>
            <div style={{
                background: '#ffffff', width: 'min(680px, 94vw)',
                maxHeight: '90vh', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 24px 60px -20px rgba(15,23,42,0.45)',
                display: 'flex', flexDirection: 'column',
                fontFamily: 'var(--apple-font-display)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 24px', borderBottom: '1px solid #eef2f7',
                }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                            {fase === 'exito'
                                ? 'Reporte generado'
                                : fase === 'despacho'
                                    ? 'Asignar despacho'
                                    : 'Confirmación del reporte'}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                            {fase === 'despacho'
                                ? 'Selecciona al despachador responsable'
                                : 'Revisa los datos antes de publicar'}
                        </div>
                    </div>
                    {fase !== 'guardando' && (
                        <button onClick={() => { onClose(); }} style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: '#94a3b8', fontSize: 18, fontWeight: 600, lineHeight: 1,
                        }} aria-label="Cerrar">✕</button>
                    )}
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', padding: '20px 24px' }}>
                    {fase === 'exito' ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textAlign: 'center', padding: '12px 8px', gap: 14,
                        }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: '50%',
                                background: '#ecfdf5', color: '#16a34a',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                            }}>✓</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                                REPORTE ÁREA DE LÍNEAS GENERADO
                            </div>
                            <div style={{ width: '100%', maxWidth: 420, marginTop: 4 }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', gap: 12,
                                    padding: '12px 16px', borderBottom: '1px solid #eef2f7',
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                        Folio
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1c3051' }}>
                                        {folio}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', gap: 12,
                                    padding: '12px 16px', borderBottom: '1px solid #eef2f7',
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                        Fecha
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                                        {fechaPublicado}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', gap: 12,
                                    padding: '12px 16px',
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                        Prioridad
                                    </span>
                                    <span style={{
                                        fontSize: 13, fontWeight: 700, color: '#ffffff',
                                        background: String(prioridadEfectiva).toUpperCase() === 'ALTA' ? '#dc2626'
                                            : String(prioridadEfectiva).toUpperCase() === 'MEDIA' ? '#f59e0b'
                                                : '#16a34a',
                                        padding: '2px 12px', borderRadius: 999,
                                    }}>
                                        {prioridadEfectiva || '—'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                El reporte fue publicado en la bitácora.
                            </div>
                        </div>
                    ) : fase === 'despacho' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {despachadores.length === 0 && (
                                <div style={{
                                    padding: 20, textAlign: 'center', fontSize: 11,
                                    color: '#94a3b8', background: '#f8fafc', borderRadius: 12,
                                    border: '1px solid #e2e8f0',
                                }}>
                                    No hay despachadores disponibles
                                </div>
                            )}
                            {esAlto && despachadorNoDisponible && (
                                <div style={{
                                    padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca',
                                    borderRadius: 10, fontSize: 10, color: '#dc2626',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    ⚠ Prioridad ALTA: el despachador seleccionado figura como inactivo — considera elegir otro
                                </div>
                            )}
                            {esAlto && !despachadorNoDisponible && despachadorSinActividad && (
                                <div style={{
                                    padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a',
                                    borderRadius: 10, fontSize: 10, color: '#92400e',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    ⚠ Prioridad ALTA: el despachador seleccionado no está en línea en este momento — considera elegir otro
                                </div>
                            )}
                            {despachadores.map((d: Despachador) => {
                                const selected = despachadorId === d.id;
                                const fullName = `${d.name}${d.apellido ? ' ' + d.apellido : ''}`;
                                return (
                                    <div
                                        key={d.id}
                                        onClick={() => setDespachadorId(d.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 14px',
                                            border: `1.5px solid ${selected ? '#1c3051' : '#e2e8f0'}`,
                                            borderRadius: 12, cursor: 'pointer',
                                            background: selected ? '#f8fafc' : '#ffffff',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '50%',
                                            background: selected ? '#1c3051' : '#f1f5f9',
                                            color: selected ? '#ffffff' : '#64748b',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 13, fontWeight: 700, flexShrink: 0,
                                        }}>
                                            {fullName.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: 12, fontWeight: selected ? 700 : 500, color: '#1e293b',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            }}>
                                                {fullName}
                                            </div>
                                            <div style={{
                                                fontSize: 9, color: '#64748b', marginTop: 2,
                                                display: 'flex', alignItems: 'center', gap: 8,
                                            }}>
                                                {d.rolNombre && <span>rol: {d.rolNombre}</span>}
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    color: d.activo ? '#16a34a' : '#dc2626',
                                                }}>
                                                    <span style={{
                                                        width: 6, height: 6, borderRadius: '50%',
                                                        background: d.activo ? '#16a34a' : '#dc2626',
                                                        display: 'inline-block',
                                                    }} />
                                                    {d.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    color: d.enLinea ? '#16a34a' : '#94a3b8',
                                                }}>
                                                    <span style={{
                                                        width: 6, height: 6, borderRadius: '50%',
                                                        background: d.enLinea ? '#16a34a' : '#cbd5e1',
                                                        display: 'inline-block',
                                                    }} />
                                                    {d.enLinea ? 'En línea' : 'Sin actividad reciente'}
                                                </span>
                                            </div>
                                        </div>
                                        {selected && <span style={{ color: '#1c3051', fontSize: 16 }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {section('📋', 'Datos del Reportante')}
                            <div className="grid-2" style={{ gap: '8px 16px', marginBottom: 18 }}>
                                {items.filter(i => ['Canal', 'Nombre del Reportante', 'Teléfono (ANI)', 'Sexo', 'Edad', 'Anónimo'].includes(i.label)).map(i => field(i.label, i.value))}
                            </div>

                            {section('🏷️', 'Clasificación Técnica')}
                            <div className="grid-2" style={{ gap: '8px 16px', marginBottom: 18 }}>
                                {items.filter(i => ['Tipo de Emergencia', 'Subtipo', 'Incidente', 'Prioridad Catálogo', 'Prioridad (ajuste)'].includes(i.label)).map(i => field(i.label, i.value))}
                            </div>

                            {section('📍', 'Ubicación')}
                            <div className="grid-2" style={{ gap: '8px 16px', marginBottom: 18 }}>
                                {items.filter(i => ['Calle', 'Colonia', 'Municipio', 'Referencia'].includes(i.label)).map(i => field(i.label, i.value))}
                            </div>

                            {section('🔗', 'Canalización')}
                            <div className="grid-2" style={{ gap: '8px 16px' }}>
                                {items.filter(i => ['Requiere Despacho', 'Dependencia', 'Notificar SVV'].includes(i.label)).map(i => field(i.label, i.value))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid #eef2f7',
                    display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                }}>
                    {fase !== 'guardando' && fase !== 'exito' && (
                        <>
                            <div>
                                {fase === 'despacho' && botonSecundario('← Anterior', () => setFase('resumen'))}
                                {fase === 'despacho' && (
                                    <div style={{ marginTop: 4, fontSize: 9, color: '#94a3b8' }}>
                                        {despachadorNoDisponible && esAlto ? 'Selecciona un despachador activo' : ''}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {fase === 'despacho' ? (
                                    botonPrimario('CANALIZAR A DESPACHO', () => guardar(true), !despachadorId)
                                ) : (
                                    <>
                                        {botonSecundario('Cancelar', () => { onClose(); })}
                                        {botonPrimario(requiere ? 'SIGUIENTE' : 'GUARDAR REGISTRO', () =>
                                            requiere ? setFase('despacho') : guardar(false))}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {fase === 'guardando' && (
                        <div style={{
                            width: '100%', textAlign: 'center', padding: 4,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        }}>
                            <span style={{
                                width: 18, height: 18, borderRadius: '50%',
                                border: '2px solid #e2e8f0', borderTopColor: '#1c3051',
                                animation: 'spin 0.8s linear infinite', display: 'inline-block',
                            }} />
                            <span style={{ fontSize: 12, color: '#475569' }}>Publicando reporte...</span>
                        </div>
                    )}
                    {fase === 'exito' && (
                        <div style={{
                            width: '100%', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
                        }}>
                            {botonSecundario('Nuevo reporte', () => { onNuevo(); })}
                            {botonPrimario('Ver bitácora', () =>
                                router.push(`/agente_911/ciudadano/incidentes?creado=true&folio=${encodeURIComponent(folio)}`))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}