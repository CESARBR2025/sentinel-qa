import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerDatosCapturados } from '@/lib/n-coordinacion/repository'
import { guardarDatosCoordinacion } from '@/lib/n-coordinacion/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { FileDown } from 'lucide-react'
import { obtenerConteosDetenidos } from '@/lib/n-coordinacion/repository'
import { tieneAccesoFormatoN } from '@/lib/reportes/permisos'

const LBL: React.CSSProperties = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }
const INP: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', background: '#ffffff' }
const NUM: React.CSSProperties = { ...INP, textAlign: 'center' as const }
const CARD: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, padding: '24px 28px', marginBottom: 16 }
const SEC: React.CSSProperties = { fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16 }

function NumField({ label, name, defaultValue = 0 }: { label: string; name: string; defaultValue?: number }) {
    return (
        <div>
            <label style={LBL}>{label}</label>
            <input type="number" name={name} defaultValue={defaultValue ?? 0} min={0} style={NUM} />
        </div>
    )
}

export default async function NCoordinacionPage({
    searchParams,
}: {
    searchParams: Promise<{ fecha?: string; guardado?: string }>
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    if (!(await tieneAccesoFormatoN(session.user.id))) redirect('/dashboard')

    const user = session.user as { name: string; apellido?: string; email: string }
    const sp = await searchParams
    const hoy = new Date().toISOString().split('T')[0]
    const fecha = sp.fecha ?? hoy

    const [datos, conteosFge, conteosFgr] = await Promise.all([
        obtenerDatosCapturados(fecha),
        obtenerConteosDetenidos(fecha, 'FISCALIA'),
        obtenerConteosDetenidos(fecha, 'FGR'),
    ])

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            <DashboardHeader user={user} roleLabel="Grupo de Coordinación" backHref="/agente_reportes" backLabel="Panel de Reportes" />

            <div className="pad-pagina" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>

                {sp.guardado === '1' && (
                    <div style={{ padding: '12px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, marginBottom: 20, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#15803d', fontWeight: 700 }}>
                        DATOS GUARDADOS CORRECTAMENTE
                    </div>
                )}

                <PageHeader
                    title="Grupo de"
                    accent="Coordinación"
                    accentColor="#2563eb"
                    subtitle="PARTE DE NOVEDADES · reporte de coordinación"
                    actions={
                        <PageHeaderLink href={`/api/nCoordinacion/generar?fecha=${fecha}`}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <FileDown size={16} /> GENERAR WORD
                            </span>
                        </PageHeaderLink>
                    }
                />

                <form action={guardarDatosCoordinacion}>
                    {/* Fecha */}
                    <div style={CARD}>
                        <div style={SEC}>Fecha del Reporte</div>
                        <div>
                            <label style={LBL}>Fecha</label>
                            <input type="date" name="fecha" defaultValue={fecha} style={{ ...INP, maxWidth: 200 }} />
                        </div>
                    </div>

                    {/* FGE */}
                    <div style={CARD}>
                        <div style={SEC}>B. Fiscalía General del Estado (FGE)</div>
                        <div className="grid-3">
                            {/* Automáticos — readonly */}
                            <div>
                                <label style={LBL}>Carpetas Iniciadas (auto)</label>
                                <input type="number" disabled defaultValue={conteosFge.carpetas_iniciadas} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Número de Cateos (auto)</label>
                                <input type="number" disabled defaultValue={conteosFge.numero_cateos} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Vehículos Asegurados (auto)</label>
                                <input type="number" disabled defaultValue={conteosFge.vehiculos_asegurados} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Personas Aseguradas (auto)</label>
                                <input type="number" disabled defaultValue={conteosFge.personas_aseguradas} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            {/* Manuales */}
                            <NumField label="Domicilios Cateados" name="fge_domicilios" defaultValue={Number(datos.fge?.domicilios_cateados ?? 0)} />
                            <NumField label="Aprehensiones" name="fge_aprehensiones" defaultValue={Number(datos.fge?.aprehensiones ?? 0)} />
                            <NumField label="Audiencias Iniciales" name="fge_audiencias" defaultValue={Number(datos.fge?.audiencias_iniciales ?? 0)} />
                            <NumField label="Abreviados" name="fge_abreviados" defaultValue={Number(datos.fge?.abreviados ?? 0)} />
                            <NumField label="Audiencias Intermedias" name="fge_intermedias" defaultValue={Number(datos.fge?.audiencias_intermedias ?? 0)} />
                        </div>
                    </div>

                    {/* FGR */}
                    <div style={CARD}>
                        <div style={SEC}>C. Fiscalía General de la República (FGR)</div>
                        <div className="grid-3">
                            {/* Automáticos — readonly */}
                            <div>
                                <label style={LBL}>Carpetas Iniciadas (auto)</label>
                                <input type="number" disabled defaultValue={conteosFgr.carpetas_iniciadas} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Número de Cateos (auto)</label>
                                <input type="number" disabled defaultValue={conteosFgr.numero_cateos} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Vehículos Asegurados (auto)</label>
                                <input type="number" disabled defaultValue={conteosFgr.vehiculos_asegurados} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            <div>
                                <label style={LBL}>Personas Aseguradas (auto)</label>
                                <input type="number" disabled defaultValue={conteosFgr.personas_aseguradas} style={{ ...NUM, background: '#f1f5f9', color: '#64748b' }} />
                            </div>
                            {/* Manuales */}
                            <NumField label="Domicilios Cateados" name="fgr_domicilios" defaultValue={Number(datos.fgr?.domicilios_cateados ?? 0)} />
                            <NumField label="Aprehensiones" name="fgr_aprehensiones" defaultValue={Number(datos.fgr?.aprehensiones ?? 0)} />
                            <NumField label="Audiencias Iniciales" name="fgr_audiencias" defaultValue={Number(datos.fgr?.audiencias_iniciales ?? 0)} />
                            <NumField label="Abreviados" name="fgr_abreviados" defaultValue={Number(datos.fgr?.abreviados ?? 0)} />
                            <NumField label="Audiencias Intermedias" name="fgr_intermedias" defaultValue={Number(datos.fgr?.audiencias_intermedias ?? 0)} />
                        </div>
                    </div>

                    {/* MASC */}
                    <div style={CARD}>
                        <div style={SEC}>E. Medios Alternativos de Solución de Conflictos</div>
                        <div className="grid-3">
                            <NumField label="Asuntos Canalizados por Fiscalía" name="masc_asuntos" defaultValue={Number(datos.masc?.asuntos_canalizados_por_fiscalia ?? 0)} />
                            <NumField label="Acuerdos" name="masc_acuerdos" defaultValue={Number(datos.masc?.acuerdos ?? 0)} />
                            <div>
                                <label style={LBL}>Monto Reparación de Daños</label>
                                <input type="number" name="masc_monto" defaultValue={Number(datos.masc?.monto_reparacion_danos ?? 0)} min={0} step={0.01} style={NUM} />
                            </div>
                        </div>
                    </div>

                    {/* Atención a víctimas */}
                    <div style={CARD}>
                        <div style={SEC}>F. Atención a Víctimas</div>
                        <div className="grid-3">
                            <NumField label="Número de Atenciones" name="vic_atenciones" defaultValue={Number(datos.victimas?.numero_atenciones ?? 0)} />
                            <NumField label="Atenciones Médicas" name="vic_medicas" defaultValue={Number(datos.victimas?.atenciones_medicas ?? 0)} />
                            <NumField label="Atenciones Psicológicas" name="vic_psicologicas" defaultValue={Number(datos.victimas?.atenciones_psicologicas ?? 0)} />
                            <NumField label="Asesorías Jurídicas" name="vic_juridicas" defaultValue={Number(datos.victimas?.asesorias_juridicas ?? 0)} />
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div style={CARD}>
                        <div style={SEC}>G. Observaciones</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={LBL}>Observaciones</label>
                                <textarea name="observaciones" defaultValue={String(datos.obs?.observaciones ?? '')} rows={4}
                                    style={{ ...INP, resize: 'vertical', lineHeight: 1.6 }}
                                    placeholder="Sin Novedad" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" style={{ padding: '12px 32px', background: '#2563eb', color: '#ffffff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                        GUARDAR DATOS
                    </button>
                </form>
            </div>
        </div>
    )
}