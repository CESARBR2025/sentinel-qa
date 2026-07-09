import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verificarRolOficial, verReporteDetalle } from '@/lib/oficial/service'
import { ArrowLeft, AlertTriangle, CheckCircle2, MapPin, Clock, User, Shield, Car, Home } from 'lucide-react'
import Link from 'next/link'
import { MapaPinFijo } from '@/components/oficial/MapaPinFijo'

const LBL: React.CSSProperties = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }
const VAL: React.CSSProperties = { fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#1e293b' }
const CARD: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, padding: '24px 28px' }
const SEC: React.CSSProperties  = { fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }
const G3: React.CSSProperties   = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }

export default async function ReporteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const { id } = await params
  const r = await verReporteDetalle(id, session.user.id)
  if (!r) notFound()

  const tieneDenuncia = !!r.d1
  const pendienteDenu = r.quiereDenuncia && !r.d1

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <Link href="/oficial/reportes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, textDecoration: 'none' }}>
          <ArrowLeft size={13} /> MIS REPORTES
        </Link>

        {/* Encabezado */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2563eb', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>REPORTE DE CAMPO</span>
          <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, margin: '4px 0 0', color: '#0f172a', textTransform: 'uppercase' }}>
            <span style={{ color: '#2563eb' }}>{r.folioReporteCampo || r.ofiFolioCad || 'S/C'}</span>
          </h1>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b', marginTop: 4 }}>
            Folio CAD: {r.ofiFolioCad || 'S/C'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} />
              {new Date(r.createdAt).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            {tieneDenuncia && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                <CheckCircle2 size={11} /> CON DENUNCIA D1
              </span>
            )}
            {pendienteDenu && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
                <AlertTriangle size={11} /> DENUNCIA PENDIENTE
              </span>
            )}
          </div>
        </div>

        {/* Origen */}
        <div style={CARD}>
          <div style={SEC}><User size={16} /> Origen e Identificación</div>
          <div style={G3}>
            <div><span style={LBL}>Canal</span><span style={VAL}>Radio / Recorrido</span></div>
            <div><span style={LBL}>Folio CAD</span><span style={VAL}>{r.ofiFolioCad || '—'}</span></div>
            <div><span style={LBL}>Oficial</span><span style={VAL}>{r.ofiOficialNombre || '—'}</span></div>
            <div><span style={LBL}>Reportante</span><span style={VAL}>{r.ofiAnonimo ? 'ANÓNIMO' : r.ofiNombreReportante || '—'}</span></div>
            <div><span style={LBL}>Estatus</span><span style={VAL}>{r.ofiEstatus}</span></div>
          </div>
        </div>

        {/* Incidente */}
        <div style={CARD}>
          <div style={SEC}><AlertTriangle size={16} /> Incidente</div>
          <div style={G3}>
            <div><span style={LBL}>Tipo de Incidente</span><span style={VAL}>{r.ofiTipoIncidente || '—'}</span></div>
            <div><span style={LBL}>Tipo de Emergencia</span><span style={VAL}>{r.ofiTipoEmergencia || '—'}</span></div>
            <div><span style={LBL}>Prioridad</span><span style={VAL}>{r.ofiPrioridad || '—'}</span></div>
            <div style={{ gridColumn: '1/-1' }}><span style={LBL}>Descripción</span><span style={VAL}>{r.ofiDescripcion || '—'}</span></div>
            <div style={{ gridColumn: '1/-1' }}><span style={LBL}>Contenido del Reporte</span><span style={VAL}>{r.ofiContenidoReporte || '—'}</span></div>
          </div>
        </div>

        {/* Ubicación con mapa */}
        <div style={CARD}>
          <div style={SEC}><MapPin size={16} /> Ubicación del Incidente</div>
          <div style={G3}>
            <div><span style={LBL}>Calle</span><span style={VAL}>{r.ofiCalle || '—'}</span></div>
            <div><span style={LBL}>Colonia</span><span style={VAL}>{r.ofiColonia || '—'}</span></div>
            <div><span style={LBL}>Datos Positivos/Negativos</span><span style={VAL}>{r.ofiDatosPn || '—'}</span></div>
          </div>
          {r.ofiLatitud && r.ofiLongitud && (
            <div style={{ marginTop: 16 }}>
              <MapaPinFijo lat={r.ofiLatitud} lng={r.ofiLongitud} label="Lugar del incidente" color="red" />
            </div>
          )}
        </div>

        {/* Intervención */}
        <div style={CARD}>
          <div style={SEC}><Shield size={16} /> Intervención</div>
          <div style={G3}>
            <div style={{ gridColumn: '1/-1' }}><span style={LBL}>Acciones Realizadas</span><span style={VAL}>{r.ofiAcciones || '—'}</span></div>
            <div><span style={LBL}>¿Hubo Detención?</span><span style={VAL}>{r.ofiHayDetencion ? 'SÍ' : 'NO'}</span></div>
            {r.ofiHayDetencion && (
              <>
                <div><span style={LBL}>Autoridad que Recibe</span><span style={VAL}>{r.ofiAutoridadRecibe || '—'}</span></div>
                <div>
                  <span style={LBL}>Detenidos</span>
                  {r.ofiDetenidos.length > 0
                    ? r.ofiDetenidos.map((d, i) => (
                        <div key={i} style={VAL}>
                          {[d.nombre, d.apellidoPaterno, d.apellidoMaterno].filter(Boolean).join(' ')}
                        </div>
                      ))
                    : <span style={VAL}>—</span>
                  }
                </div>
              </>
            )}
            {r.ofiMontoRobo && (
              <div><span style={LBL}>Monto Robado</span><span style={VAL}>${r.ofiMontoRobo.toLocaleString('es-MX')}</span></div>
            )}
          </div>
        </div>

        {/* Aseguramientos */}
        {(r.ofiHayVehiculo || r.ofiHayCateo || r.ofiObjetosRecuperados) && (
          <div style={CARD}>
            <div style={SEC}><Car size={16} /> Aseguramientos y Cateos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {r.ofiObjetosRecuperados && (
                <div><span style={LBL}>Objetos Recuperados</span><span style={VAL}>{r.ofiObjetosRecuperados}</span></div>
              )}
              {r.ofiHayVehiculo && r.ofiVehiculos.length > 0 && (
                <div>
                  <span style={LBL}>Vehículos Asegurados</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {r.ofiVehiculos.map((v, i) => (
                      <div key={i} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#334155', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        #{i+1} · {v.tipo} · Placas: {v.placas} · Serie: {v.serie} · Color: {v.color} · Destino: {v.destino}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {r.ofiHayCateo && r.ofiCateo && (
                <div>
                  <div style={SEC}><Home size={16} /> Cateo</div>
                  <div style={G3}>
                    <div><span style={LBL}>Calle</span><span style={VAL}>{r.ofiCateo.calle || '—'}</span></div>
                    <div><span style={LBL}>Colonia</span><span style={VAL}>{r.ofiCateo.colonia || '—'}</span></div>
                    <div><span style={LBL}>Número</span><span style={VAL}>{r.ofiCateo.numero || '—'}</span></div>
                    <div style={{ gridColumn: '1/-1' }}><span style={LBL}>Resultado del Cateo</span><span style={VAL}>{r.ofiResultadoCateo || '—'}</span></div>
                  </div>
                  {r.ofiCateo.lat && r.ofiCateo.lng && (
                    <div style={{ marginTop: 16 }}>
                      <MapaPinFijo lat={r.ofiCateo.lat} lng={r.ofiCateo.lng} label="Domicilio cateado" color="blue" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Denuncia D1 */}
        {tieneDenuncia && r.d1 && (
          <div style={{ ...CARD, borderLeft: '4px solid #16a34a' }}>
            <div style={{ ...SEC, color: '#15803d' }}><CheckCircle2 size={16} /> Denuncia D1 Vinculada</div>
            <div style={G3}>
              <div><span style={LBL}>Folio Denuncia</span><span style={{ ...VAL, fontWeight: 700 }}>{r.d1.folioDenuncia}</span></div>
              <div><span style={LBL}>IPH</span><span style={VAL}>{r.d1.iph || '—'}</span></div>
              <div><span style={LBL}>Folio CU</span><span style={VAL}>{r.d1.folioCu || '—'}</span></div>
              <div><span style={LBL}>Fecha Reporte</span><span style={VAL}>{r.d1.fechaReporte || '—'}</span></div>
              <div><span style={LBL}>Hora Reporte</span><span style={VAL}>{r.d1.horaReporte || '—'}</span></div>
              <div><span style={LBL}>Tipo de Evento</span><span style={VAL}>{r.d1.tipoEvento || '—'}</span></div>
              <div><span style={LBL}>Delito</span><span style={VAL}>{r.d1.delito || '—'}</span></div>
              <div><span style={LBL}>¿Violencia?</span><span style={VAL}>{r.d1.violencia ? 'SÍ' : 'NO'}</span></div>
              <div><span style={LBL}>¿Se generó D1?</span><span style={VAL}>{r.d1.seGeneroD1 ? 'SÍ' : 'NO'}</span></div>
              <div><span style={LBL}>Ofendidos</span><span style={VAL}>{r.d1.ofendidoHombre}H / {r.d1.ofendidoMujer}M</span></div>
              <div><span style={LBL}>Policía a Cargo</span><span style={VAL}>{r.d1.policiaCargo || '—'}</span></div>
              {r.d1.observaciones && (
                <div style={{ gridColumn: '1/-1' }}><span style={LBL}>Observaciones</span><span style={VAL}>{r.d1.observaciones}</span></div>
              )}
            </div>
            {r.d1.latitud && r.d1.longitud && (
              <div style={{ marginTop: 16 }}>
                <span style={{ ...LBL, marginBottom: 8 }}>Lugar del Hecho (D1)</span>
                <MapaPinFijo lat={r.d1.latitud} lng={r.d1.longitud} label="Lugar del hecho" color="green" />
              </div>
            )}
          </div>
        )}

        {/* Completar denuncia pendiente */}
        {pendienteDenu && (
          <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderLeft: '4px solid #d97706', borderRadius: 2, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 18, color: '#b45309', textTransform: 'uppercase', marginBottom: 4 }}>
                Denuncia pendiente de registro
              </div>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#92400e' }}>
                La víctima indicó que desea hacer la denuncia pero aún no se ha registrado el D1.
              </div>
            </div>
            <Link
              href={`/denuncia/nuevo?reporteCampoId=${r.id}&calle=${encodeURIComponent(r.ofiCalle ?? '')}&colonia=${encodeURIComponent(r.ofiColonia ?? '')}&lat=${r.ofiLatitud ?? ''}&lng=${r.ofiLongitud ?? ''}&oficial=${encodeURIComponent(r.ofiOficialNombre ?? '')}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#d97706', color: '#ffffff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}>
              <AlertTriangle size={14} /> COMPLETAR DENUNCIA
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}