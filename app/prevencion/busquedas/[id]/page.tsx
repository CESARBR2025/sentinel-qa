import { db } from '@/lib/db/index'
import { fichasBusqueda, seguimientosBusqueda } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import Link         from 'next/link'
import { notFound } from 'next/navigation'
import { format }   from 'date-fns'
import { SeguimientoTimeline } from '@/components/prevencion/SeguimientoTimeline'
import { CancelacionModal }    from '@/components/prevencion/CancelacionModal'

const TIPO_CFG: Record<string, { label: string; color: string }> = {
  PROTOCOLO_ALBA:   { label: 'Protocolo Alba',      color: '#c0223a' },
  BUSQUEDA_PERSONA: { label: 'Búsqueda de Persona', color: '#5a8fd4' },
}

function toISO(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString()
}

function fmtDT(v: Date | string | null): string {
  if (!v) return '—'
  return format(v instanceof Date ? v : new Date(String(v)), 'dd/MM/yyyy HH:mm')
}

export default async function FichaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [ficha] = await db
    .select()
    .from(fichasBusqueda)
    .where(eq(fichasBusqueda.id, id))
    .limit(1)

  if (!ficha) notFound()

  const seguimientos = await db
    .select()
    .from(seguimientosBusqueda)
    .where(eq(seguimientosBusqueda.fichaId, id))
    .orderBy(asc(seguimientosBusqueda.creadoEn))

  const cfg        = TIPO_CFG[ficha.tipo] ?? { label: ficha.tipo, color: '#4a5878' }
  const fichaActiva = ficha.status === 'activa'

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/busquedas" style={{ color: '#4a5878', textDecoration: 'none' }}>Búsquedas</Link>
        <span>›</span>
        <span style={{ color: '#8a9bc0' }}>{ficha.folio ?? ficha.id.slice(0, 8)}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: cfg.color, border: `1px solid ${cfg.color}`, padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {cfg.label}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: fichaActiva ? '#c0223a' : '#4a9e6a' }}>
              {fichaActiva ? '● Activa' : '✓ Cerrada'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 4px' }}>
            {ficha.nombreDesaparecida}
          </h2>
          {ficha.edad != null && (
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#8a9bc0', margin: 0 }}>
              {ficha.edad} años
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            href={`/prevencion/busquedas/${id}/imprimir`}
            style={{ padding: '9px 16px', background: 'transparent', color: '#d4a43a', border: '1px solid #d4a43a50', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Imprimir ficha →
          </Link>
          {fichaActiva && <CancelacionModal fichaId={id} />}
        </div>
      </div>

      {/* Detalle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <Card title="Datos de Activación">
          <Field label="Folio"              value={ficha.folio} />
          <Field label="Tipo"               value={cfg.label} />
          <Field label="Activación"         value={fmtDT(ficha.fechaActivacion)} />
          <Field label="Aceptación"         value={fmtDT(ficha.fechaAceptacion)} />
          <Field label="Carpeta Invest."    value={ficha.carpetaInvestigacion} />
        </Card>

        <Card title="Personal Asignado">
          <Field label="Enlace"             value={ficha.enlace} />
          <Field label="RT que atiende"     value={ficha.rtAtiende} />
          <Field label="Elemento Novedades" value={ficha.elementoNovedades} />
          {!fichaActiva && (
            <>
              <Field label="Cancelación"    value={fmtDT(ficha.fechaCancelacion)} />
              <Field label="Fiscal cancela" value={ficha.fiscalCancela} />
              <Field label="Motivo"         value={ficha.motivoCancelacion} />
            </>
          )}
        </Card>
      </div>

      {/* Timeline de seguimientos */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 16 }}>
          › Seguimientos de Tiempo ({seguimientos.length}/{24} registrados)
        </div>

        <SeguimientoTimeline
          fichaId={id}
          fechaActivacionISO={toISO(ficha.fechaActivacion)}
          seguimientosRegistrados={seguimientos.map(s => ({
            tipo:              s.tipo,
            fechaHoraEnvioISO: toISO(s.fechaHoraEnvio),
          }))}
          fichaActiva={fichaActiva}
        />
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
  if (!value) return null
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
