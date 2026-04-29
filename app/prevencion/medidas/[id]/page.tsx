import { db }  from '@/lib/db/index'
import { medidasProteccion, visitasDomiciliarias, medidaAutoridadesAdicionales } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'
import Link         from 'next/link'
import { notFound } from 'next/navigation'
import { calcularSemaforoVigencia } from '@/lib/prevencion/semaforo'
import { SemaforoVigencia }         from '@/components/prevencion/SemaforoVigencia'
import { AutoridadBadge }           from '@/components/prevencion/AutoridadBadge'
import { VisitaModal }              from '@/components/prevencion/VisitaModal'
import { ProrrogaViewerModal }  from '@/components/prevencion/ProrrogaViewerModal'
import { ProrrogaModal }        from '@/components/prevencion/ProrrogaModal'
import { AgregarAutoridadForm } from '@/components/prevencion/AgregarAutoridadForm'

export default async function MedidaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [medida] = await db
    .select()
    .from(medidasProteccion)
    .where(eq(medidasProteccion.id, id))
    .limit(1)

  if (!medida) notFound()

  const visitas = await db
    .select()
    .from(visitasDomiciliarias)
    .where(eq(visitasDomiciliarias.medidaId, id))
    .orderBy(desc(visitasDomiciliarias.fechaVisita))

  const autoridadesAdicionales = await db
    .select()
    .from(medidaAutoridadesAdicionales)
    .where(eq(medidaAutoridadesAdicionales.medidaId, id))
    .orderBy(asc(medidaAutoridadesAdicionales.creadoEn))

  const semaforo = calcularSemaforoVigencia(medida.fechaVencimiento)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/medidas" style={{ color: '#4a5878', textDecoration: 'none' }}>Medidas</Link>
        <span>›</span>
        <span style={{ color: '#8a9bc0' }}>{medida.expediente}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: 0 }}>
              {medida.expediente}
            </h2>
            <SemaforoVigencia color={semaforo} />
            {medida.prorrogada && (
              <span style={{ padding: '3px 8px', border: '1px solid #d4a43a', color: '#d4a43a', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                PRÓRROGA
              </span>
            )}
            <AutoridadBadge autoridad={medida.autoridad} />
            {autoridadesAdicionales.map(a => (
              <AutoridadBadge key={a.id} autoridad={a.autoridad} />
            ))}
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#8a9bc0', margin: 0 }}>
            {medida.victima}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {semaforo === 'rojo' && <ProrrogaModal medidaId={id} />}
          <Link
            href="/prevencion/medidas"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            ← Regresar
          </Link>
        </div>
      </div>

      {/* Detalle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <Card title="Datos del Oficio">
          <Field label="No. Oficio"     value={medida.nOficio} />
          <Field label="Fecha Oficio"   value={medida.fechaOficio} />
          <Field label="Fecha Recepción" value={medida.fechaRecepcion} />
          <Field label="Recepciona"     value={medida.personaRecepciona} />
          <Field label="Autoridad"      value={<AutoridadBadge autoridad={medida.autoridad} />} />
          {medida.nombreAutoridad && <Field label="Emite"         value={medida.nombreAutoridad} />}
          {medida.delitos         && <Field label="Delito(s)"     value={medida.delitos} />}
        </Card>

        <Card title="Medida de Protección">
          <Field label="Víctima"        value={medida.victima} />
          {medida.demandado       && <Field label="Demandado"     value={medida.demandado} />}
          {medida.tipoMedida      && <Field label="Tipo Medida"   value={medida.tipoMedida} />}
          <Field label="Domicilio"      value={medida.domicilioProteccion} />
          {medida.colonia         && <Field label="Colonia"       value={medida.colonia} />}
          {medida.telefono        && <Field label="Teléfono"      value={medida.telefono} />}
          {medida.tiempoMedida    && <Field label="Tiempo"        value={medida.tiempoMedida} />}
          {medida.fechaVencimiento && <Field label="Vencimiento"  value={medida.fechaVencimiento} />}
          {medida.tipoApercibimiento && <Field label="Apercibimiento" value={medida.tipoApercibimiento} />}
{medida.prorrogada && (
            <Field label="Doc. prorrogue" value={
              medida.archivoProrrogaUrl ? (
                <ProrrogaViewerModal archivoProrrogaUrl={medida.archivoProrrogaUrl} />
              ) : (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.08em' }}>
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
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 2 }}>
              › Autoridades Adicionales
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.1em' }}>
              {autoridadesAdicionales.length === 0
                ? 'Solo la autoridad principal'
                : `${autoridadesAdicionales.length} autoridad${autoridadesAdicionales.length !== 1 ? 'es' : ''} adicional${autoridadesAdicionales.length !== 1 ? 'es' : ''}`}
            </div>
          </div>
        </div>

        {autoridadesAdicionales.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {autoridadesAdicionales.map(a => (
              <div key={a.id} style={{ background: '#0b1220', border: '1px solid #1b2742', padding: '10px 16px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <AutoridadBadge autoridad={a.autoridad} />
                {a.nOficio && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#d8e0f0' }}>
                    Oficio: {a.nOficio}
                  </span>
                )}
                {a.fechaOficio && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878' }}>
                    {a.fechaOficio}
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
        <div style={{ background: '#0b1220', border: '1px solid #1b2742', padding: '16px 20px', marginBottom: 32 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 8 }}>
            › Observaciones
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#8a9bc0', margin: 0, lineHeight: 1.6 }}>
            {medida.observaciones}
          </p>
        </div>
      )}

      {/* Visitas domiciliarias */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 4 }}>
              › Visitas Domiciliarias
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.1em' }}>
              {visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}
            </div>
          </div>
          <VisitaModal medidaId={id} />
        </div>

        {visitas.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e', letterSpacing: '0.15em' }}>
            › Sin visitas registradas
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visitas.map(v => (
              <div key={v.id} style={{ background: '#0b1220', border: '1px solid #1b2742', padding: '14px 18px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#d4a43a', whiteSpace: 'nowrap' }}>
                  {v.fechaVisita} · {v.horaVisita}
                </span>
                {v.apercibimientoAplicado && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#c0223a', border: '1px solid #c0223a', padding: '2px 7px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Apercibimiento aplicado
                  </span>
                )}
                {v.resultado && (
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#8a9bc0', flex: 1 }}>
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
    <div style={{ background: '#0b1220', border: '1px solid #1b2742', padding: '20px' }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 16 }}>
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
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', minWidth: 110, paddingTop: 2, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#d8e0f0', flex: 1 }}>
        {value}
      </span>
    </div>
  )
}
