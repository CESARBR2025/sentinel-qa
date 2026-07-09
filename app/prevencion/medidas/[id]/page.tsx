import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import Link         from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { calcularSemaforoVigencia } from '@/lib/prevencion/semaforo'
import { SemaforoVigencia }         from '@/components/prevencion/SemaforoVigencia'
import { AutoridadBadge }           from '@/components/prevencion/AutoridadBadge'
import { VisitaModal }              from '@/components/prevencion/VisitaModal'
import { ProrrogaViewerModal }  from '@/components/prevencion/ProrrogaViewerModal'
import { ProrrogaModal }        from '@/components/prevencion/ProrrogaModal'
import { AgregarAutoridadForm } from '@/components/prevencion/AgregarAutoridadForm'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'

export default async function MedidaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'medidas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'medidas', 'ver'))) redirect('/dashboard')

  const { id } = await params

  const medidaResult = await query<any>(`SELECT * FROM medidas_proteccion WHERE id = $1 LIMIT 1`, [id])
  const medida = medidaResult.rows[0]

  if (!medida) notFound()

  const visitasResult = await query<any>(
    `SELECT * FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita DESC`,
    [id]
  )
  const visitas = visitasResult.rows

  const autoridadesAdicionalesResult = await query<any>(
    `SELECT * FROM medida_autoridades_adicionales WHERE medida_id = $1 ORDER BY creado_en ASC`,
    [id]
  )
  const autoridadesAdicionales = autoridadesAdicionalesResult.rows

  const semaforo = calcularSemaforoVigencia(medida.fecha_vencimiento)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#334155', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/medidas" style={{ color: '#2563eb', textDecoration: 'none' }}>Medidas</Link>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{medida.expediente}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1e293b', margin: 0 }}>
              {medida.expediente}
            </h2>
            <SemaforoVigencia color={semaforo} />
            {medida.prorrogada && (
              <span style={{ padding: '3px 8px', border: '1px solid #854d0e', color: '#854d0e', background: '#fffbeb', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                PRÓRROGA
              </span>
            )}
            <AutoridadBadge autoridad={medida.autoridad} />
            {autoridadesAdicionales.map(a => (
              <AutoridadBadge key={a.id} autoridad={a.autoridad} />
            ))}
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#334155', margin: 0 }}>
            {medida.victima}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {semaforo === 'rojo' && <ProrrogaModal medidaId={id} />}
          <Link
            href="/prevencion/medidas"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2563eb', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            ← Regresar
          </Link>
        </div>
      </div>

      {/* Detalle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <Card title="Datos del Oficio">
          <Field label="No. Oficio"     value={medida.n_oficio} />
          <Field label="Fecha Oficio"   value={medida.fecha_oficio} />
          <Field label="Fecha Recepción" value={medida.fecha_recepcion} />
          <Field label="Recepciona"     value={medida.persona_recepciona} />
          <Field label="Autoridad"      value={<AutoridadBadge autoridad={medida.autoridad} />} />
          {medida.nombre_autoridad && <Field label="Emite"         value={medida.nombre_autoridad} />}
          {medida.delitos         && <Field label="Delito(s)"     value={medida.delitos} />}
        </Card>

        <Card title="Medida de Protección">
          <Field label="Víctima"        value={medida.victima} />
          {medida.demandado       && <Field label="Demandado"     value={medida.demandado} />}
          {medida.tipo_medida      && <Field label="Tipo Medida"   value={medida.tipo_medida} />}
          <Field label="Domicilio"      value={medida.domicilio_proteccion} />
          {medida.colonia         && <Field label="Colonia"       value={medida.colonia} />}
          {medida.telefono        && <Field label="Teléfono"      value={medida.telefono} />}
          {medida.tiempo_medida    && <Field label="Tiempo"        value={medida.tiempo_medida} />}
          {medida.fecha_vencimiento && <Field label="Vencimiento"  value={medida.fecha_vencimiento} />}
          {medida.tipo_apercibimiento && <Field label="Apercibimiento" value={medida.tipo_apercibimiento} />}
{medida.prorrogada && (
            <Field label="Doc. prorrogue" value={
              medida.archivo_prorroga_url ? (
                <ProrrogaViewerModal archivoProrrogaUrl={medida.archivo_prorroga_url} />
              ) : (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#334155', letterSpacing: '0.08em' }}>
                  Sin archivo adjunto
                </span>
              )
            } />
          )}
        </Card>
      </div>

      {/* Autoridades adicionales */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 2 }}>
              › Autoridades Adicionales
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#334155', letterSpacing: '0.1em' }}>
              {autoridadesAdicionales.length === 0
                ? 'Solo la autoridad principal'
                : `${autoridadesAdicionales.length} autoridad${autoridadesAdicionales.length !== 1 ? 'es' : ''} adicional${autoridadesAdicionales.length !== 1 ? 'es' : ''}`}
            </div>
          </div>
        </div>

        {autoridadesAdicionales.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {autoridadesAdicionales.map(a => (
              <div key={a.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <AutoridadBadge autoridad={a.autoridad} />
                {a.n_oficio && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1e293b' }}>
                    Oficio: {a.n_oficio}
                  </span>
                )}
                {a.fecha_oficio && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#334155' }}>
                    {a.fecha_oficio}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <AgregarAutoridadForm
          medidaId={id}
          autoridadPrincipal={medida.autoridad}
          yaAgregadas={autoridadesAdicionales.map(a => a.autoridad)}
        />
      </div>

      {medida.observaciones && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: 32 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 }}>
            › Observaciones
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.6 }}>
            {medida.observaciones}
          </p>
        </div>
      )}

      {/* Visitas domiciliarias */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 4 }}>
              › Visitas Domiciliarias
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#334155', letterSpacing: '0.1em' }}>
              {visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}
            </div>
          </div>
          <VisitaModal medidaId={id} />
        </div>

        {visitas.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.15em' }}>
            › Sin visitas registradas
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visitas.map(v => (
              <div key={v.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px 18px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2563eb', whiteSpace: 'nowrap' }}>
                  {v.fecha_visita} · {v.hora_visita}
                </span>
                {v.apercibimiento_aplicado && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#991b1b', border: '1px solid #991b1b', background: '#fef2f2', padding: '2px 7px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Apercibimiento aplicado
                  </span>
                )}
                {v.resultado && (
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', flex: 1 }}>
                    {v.resultado}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 16 }}>
        › {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', minWidth: 110, paddingTop: 2, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', flex: 1 }}>
        {value}
      </span>
    </div>
  )
}
