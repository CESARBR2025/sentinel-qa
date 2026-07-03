import { db }       from '@/lib/db/index'
import { solicitudesInformacion, solicitudesC4Internas, contestaciones } from '@/lib/db/schema'
import { eq, asc }  from 'drizzle-orm'
import Link          from 'next/link'
import { notFound } from 'next/navigation'
import { format }   from 'date-fns'
import { AutoridadBadge }    from '@/components/prevencion/AutoridadBadge'
import { SolicitudC4Form }   from '@/components/prevencion/SolicitudC4Form'
import { ContestacionForm }  from '@/components/prevencion/ContestacionForm'

function toDate(v: Date | string): Date {
  return v instanceof Date ? v : new Date(String(v))
}

function fmtDT(v: Date | string | null): string {
  if (!v) return '—'
  return format(toDate(v), 'dd/MM/yyyy HH:mm')
}

export default async function SolicitudDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [solicitud] = await db
    .select()
    .from(solicitudesInformacion)
    .where(eq(solicitudesInformacion.id, id))
    .limit(1)

  if (!solicitud) notFound()

  const solicitudesC4 = await db
    .select()
    .from(solicitudesC4Internas)
    .where(eq(solicitudesC4Internas.solicitudId, id))
    .orderBy(asc(solicitudesC4Internas.creadoEn))

  const [contestacion] = await db
    .select()
    .from(contestaciones)
    .where(eq(contestaciones.solicitudId, id))
    .limit(1)

  const completado = solicitud.status === 'completado'

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/juridico" style={{ color: '#2563eb', textDecoration: 'none' }}>Área Jurídica</Link>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{solicitud.oficio}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <AutoridadBadge autoridad={solicitud.autoridad} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: completado ? '#166534' : '#2563eb', fontWeight: 600 }}>
              {completado ? '✓ Completado' : '● En Jurídico'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            {solicitud.oficio}
          </h2>
          {solicitud.delito && (
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', margin: 0 }}>
              {solicitud.delito}
            </p>
          )}
        </div>
      </div>

      {/* Detail cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <Card title="Datos del Oficio">
          <Field label="Oficio"      value={solicitud.oficio} />
          <Field label="Activación"  value={fmtDT(solicitud.fechaActivacion)} />
          <Field label="Aceptación"  value={fmtDT(solicitud.fechaAceptacion)} />
          <Field label="Enlace"      value={solicitud.enlace} />
        </Card>
        <Card title="Datos del Caso">
          <Field label="Fiscal"      value={solicitud.fiscalSolicita} />
          <Field label="Delito"      value={solicitud.delito} />
          <Field label="Carpeta"     value={solicitud.carpetaInvestigacion} />
          <Field label="Solicitud"   value={solicitud.solicitudTexto} />
        </Card>
      </div>

      {/* Solicitudes a C4 */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 16 }}>
          › Solicitudes a C4 ({solicitudesC4.length} registrada{solicitudesC4.length !== 1 ? 's' : ''})
        </div>

        {!completado && <SolicitudC4Form solicitudId={id} />}

        {solicitudesC4.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {solicitudesC4.map(c4 => (
              <div key={c4.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 16px' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {format(toDate(c4.creadoEn), 'dd/MM/yyyy HH:mm')}
                  {' · '}
                  <span style={{ color: c4.status === 'completada' ? '#166534' : '#854d0e' }}>{c4.status}</span>
                </div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#0f172a', margin: 0 }}>
                  {c4.descripcionEvidencias}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px 0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.15em' }}>
            › Sin solicitudes a C4 registradas
          </div>
        )}
      </div>

      {/* Contestación */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 16 }}>
          › Contestación y Acuse de Entrega
        </div>

        {completado && contestacion ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Fecha contestación" value={contestacion.fechaContestacion} />
              <Field label="Archivo PDF"         value={contestacion.archivoPdfUrl} />
              <Field label="Fecha de entrega"    value={contestacion.fechaEntrega} />
              <Field label="Hora de entrega"     value={contestacion.horaEntrega} />
              <Field label="Recibió"             value={contestacion.nombreQuienRecibio} />
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#166534', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ✓ Expediente completado — campos en solo lectura
            </div>
          </div>
        ) : !completado ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
            <ContestacionForm solicitudId={id} />
          </div>
        ) : null}
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
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', minWidth: 110, paddingTop: 2, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#0f172a', flex: 1 }}>
        {value}
      </span>
    </div>
  )
}
