/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createIncidenteCliente } from "@/lib/incidentes/actions";
import { toast } from "sonner"

export default function RevisarFormulario() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [despachadorId, setDespachadorId] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [data, setData] = useState<Record<string, string>>({})
    const [coords, setCoords] = useState({ lat: 0, lng: 0 })
    const [catalogos, setCatalogos] = useState<any>(null)
    const [despachadores, setDespachadores] = useState<any[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const raw = sessionStorage.getItem('revisar_form_data')
        const coordRaw = sessionStorage.getItem('revisar_coords')
        const catRaw = sessionStorage.getItem('revisar_catalogos')
        const despRaw = sessionStorage.getItem('revisar_despachadores')
        if (!raw || !coordRaw) {
            toast.error('No hay datos del formulario. Regresa y completa el reporte.')
            router.replace('/agente_911/ciudadano')
            return
        }
        setData(JSON.parse(raw))
        setCoords(JSON.parse(coordRaw))
        if (catRaw) setCatalogos(JSON.parse(catRaw))
        if (despRaw) setDespachadores(JSON.parse(despRaw))
        setLoaded(true)
    }, [router])

    const f = (k: string) => data[k] || ''

    const catNombre = (cat: any[], id: string | null) => {
        if (!cat || !id) return '—'
        const item = cat.find((c: any) => String(c.id) === id)
        return item?.nombre || id
    }

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
        ]

        if (f('tipoReporte') === 'extorsion') {
            items.push(
                { label: 'Teléfono Extorsión', value: f('telefonoExtorsion') },
                { label: 'Grupo Delictivo', value: f('grupoDelictivo') },
                { label: 'Modus Operandi', value: f('modusOperandi') },
            )
        }

        if (f('tipoReporte') === 'alarma_escolar') {
            items.push(
                { label: 'Establecimiento', value: f('establecimiento') },
                { label: 'Nombre Responsable', value: f('nombreResponsable') },
                { label: 'Inmueble', value: f('inmueble') },
                { label: 'Activaciones', value: f('numeroActivaciones') },
            )
        }

        return items
    }

    const requiere = f('requiereDespacho') === 'true';
    const totalSteps = requiere ? 3 : 2;
    const items = getItems();

    const stepLabel = (s: number) => {
        if (s === 1) return 'Datos del Reporte';
        if (s === 2) return requiere ? 'Asignar Despacho' : 'Confirmación';
        return 'Confirmación';
    };

    const avanzar = () => setStep(s => Math.min(s + 1, totalSteps));
    const retroceder = () => setStep(s => Math.max(s - 1, 1));

    const section = (icon: string, title: string) => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14, fontWeight: 700,
            textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.03em',
        }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            {title}
        </div>
    );

    const field = (label: string, value: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
                color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{label}</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#1e293b', fontWeight: 500 }}>
                {value || '—'}
            </span>
        </div>
    );

    const confirmarEnvio = async (canalizar: boolean) => {
        setEnviando(true)
        try {
            const fd = new FormData()
            for (const key in data) {
                fd.append(key, data[key])
            }
            fd.append("latitud", coords.lat.toString());
            fd.append("longitud", coords.lng.toString());
            if (canalizar && despachadorId) {
                fd.append("despachadorId", despachadorId);
            }

            const result = await createIncidenteCliente(fd)
            sessionStorage.removeItem('revisar_form_data')
            sessionStorage.removeItem('revisar_coords')
            sessionStorage.removeItem('revisar_catalogos')
            sessionStorage.removeItem('revisar_despachadores')
            router.push(`/agente_911/ciudadano/incidentes?creado=true&folio=${encodeURIComponent(result.folio)}`)
        } catch (e: any) {
            toast.error(e?.message || 'Error al guardar el reporte')
            setEnviando(false)
        }
    }

    if (!loaded) {
        return <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#94a3b8' }}>Cargando...</p>
    }

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#334155' }}>
            {/* Title + Step indicator */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800,
                    color: '#0f172a', textTransform: 'uppercase', margin: '0 0 20px 0',
                }}>
                    {stepLabel(step)}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, idx) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < totalSteps - 1 ? 1 : undefined }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                                background: step === s ? '#1c3051' : step > s ? '#16a34a' : '#e2e8f0',
                                color: step >= s ? '#ffffff' : '#94a3b8',
                                transition: 'all 0.2s',
                                flexShrink: 0,
                            }}>
                                {step > s ? '✓' : s}
                            </div>
                            {idx < totalSteps - 1 && (
                                <div style={{
                                    flex: 1, height: 2,
                                    background: step > s ? '#16a34a' : '#e2e8f0',
                                    transition: 'all 0.2s',
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Review data */}
            {step === 1 && (
                <>
                    {section('📋', 'Datos del Reportante')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 20 }}>
                        {items.filter(i => ['Canal', 'Nombre del Reportante', 'Teléfono (ANI)', 'Sexo', 'Edad', 'Anónimo'].includes(i.label)).map(i => field(i.label, i.value))}
                    </div>

                    {section('🏷️', 'Clasificación Técnica')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 20 }}>
                        {items.filter(i => ['Tipo de Emergencia', 'Subtipo', 'Incidente', 'Código', 'Prioridad Catálogo', 'Prioridad (ajuste)'].includes(i.label)).map(i => field(i.label, i.value))}
                    </div>

                    {section('📍', 'Ubicación')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 20 }}>
                        {items.filter(i => ['Calle', 'Colonia', 'Municipio', 'Referencia'].includes(i.label)).map(i => field(i.label, i.value))}
                        {items.filter(i => i.label === 'No. Exterior' || i.label === 'No. Interior').map(i => field(i.label, i.value))}
                    </div>

                    {section('🔗', 'Canalización')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
                        {items.filter(i => ['Requiere Despacho', 'Dependencia', 'Notificar SVV'].includes(i.label)).map(i => field(i.label, i.value))}
                    </div>
                </>
            )}

            {/* Step 2: Assign dispatcher (only if requiere despacho) */}
            {step === 2 && requiere && (
                <>
                    {section('👤', 'Asignar Despachador')}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {despachadores.length === 0 && (
                            <div style={{
                                padding: 20, textAlign: 'center',
                                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                color: '#94a3b8', background: '#f8fafc', borderRadius: 2,
                                border: '1px solid #e2e8f0',
                            }}>
                                No hay despachadores disponibles
                            </div>
                        )}
                        {despachadores.map((d: any) => {
                            const selected = despachadorId === d.id;
                            const fullName = `${d.name}${d.apellido ? ' ' + d.apellido : ''}`;
                            return (
                                <div
                                    key={d.id}
                                    onClick={() => setDespachadorId(d.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '12px 16px',
                                        border: `1px solid ${selected ? '#1c3051' : '#e2e8f0'}`,
                                        borderLeft: `3px solid ${selected ? '#1c3051' : '#e2e8f0'}`,
                                        borderRadius: 2, cursor: 'pointer',
                                        background: selected ? '#f8fafc' : '#ffffff',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: selected ? '#1c3051' : '#f1f5f9',
                                        color: selected ? '#ffffff' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700,
                                        flexShrink: 0,
                                    }}>
                                        {fullName.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: 'Inter, sans-serif', fontSize: 13,
                                            fontWeight: selected ? 700 : 500, color: '#1e293b',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {fullName.toUpperCase()}
                                        </div>
                                        <div style={{
                                            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                                            color: '#64748b', marginTop: 2,
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
                                        </div>
                                    </div>
                                    {selected && (
                                        <span style={{ color: '#1c3051', fontSize: 18 }}>✓</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Step 3 / final step: Confirm */}
            {step === totalSteps && (
                <>
                    {section('✅', 'Resumen Final')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 20 }}>
                        {items.map(i => field(i.label, i.value))}
                    </div>
                    {requiere && (
                        <div style={{
                            marginTop: 12, padding: 12, background: '#f0fdf4',
                            border: '1px solid #bbf7d0', borderRadius: 2,
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#15803d',
                        }}>
                            Despachador: {despachadorId ? despachadores.find((d: any) => d.id === despachadorId)?.name || 'Seleccionado' : 'No asignado'}
                        </div>
                    )}
                    {items.some(i => i.label === 'Notificar SVV' && i.value === 'Sí') && (
                        <div style={{
                            marginTop: 8, padding: 12, background: '#eff1f3',
                            border: '1px solid #c3c8d2', borderRadius: 2,
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#1c3051',
                        }}>
                            📹 Monitoristas (SVV) serán notificados
                        </div>
                    )}
                </>
            )}

            {/* Footer */}
            <div style={{
                marginTop: 32, paddingTop: 24, borderTop: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', gap: 12,
            }}>
                <div>
                    {step > 1 && (
                        <button onClick={retroceder} disabled={enviando} style={{
                            padding: '10px 24px', background: '#f1f5f9', border: '1px solid #e2e8f0',
                            borderRadius: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            fontWeight: 600, color: '#475569', cursor: enviando ? 'not-allowed' : 'pointer',
                        }}>
                            ← ANTERIOR
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {step < totalSteps ? (
                        <button onClick={avanzar} style={{
                            padding: '10px 32px', background: '#1c3051', border: 'none',
                            borderRadius: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            fontWeight: 700, color: '#ffffff', cursor: 'pointer',
                            letterSpacing: '0.1em',
                        }}>
                            SIGUIENTE →
                        </button>
                    ) : (
                        <>
                            {requiere ? (
                                <button onClick={() => confirmarEnvio(true)} disabled={enviando || !despachadorId} style={{
                                    padding: '10px 32px', background: enviando || !despachadorId ? '#94a3b8' : '#1c3051', border: 'none',
                                    borderRadius: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                    fontWeight: 700, color: '#ffffff', cursor: enviando || !despachadorId ? 'not-allowed' : 'pointer',
                                    letterSpacing: '0.1em',
                                }}>
                                    {enviando ? 'CANALIZANDO...' : 'CANALIZAR A DESPACHO'}
                                </button>
                            ) : (
                                <button onClick={() => confirmarEnvio(false)} disabled={enviando} style={{
                                    padding: '10px 32px', background: enviando ? '#94a3b8' : '#1c3051', border: 'none',
                                    borderRadius: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                    fontWeight: 700, color: '#ffffff', cursor: enviando ? 'not-allowed' : 'pointer',
                                    letterSpacing: '0.1em',
                                }}>
                                    {enviando ? 'GUARDANDO...' : 'GUARDAR REGISTRO'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
