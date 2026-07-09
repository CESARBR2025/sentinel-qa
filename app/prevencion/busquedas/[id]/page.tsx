import { auth }      from '@/lib/auth'
import { headers }   from 'next/headers'
import { query }     from '@/lib/db'
import Link         from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { format }   from 'date-fns'
import { SeguimientoTimeline } from '@/components/prevencion/SeguimientoTimeline'
import { CancelacionModal }    from '@/components/prevencion/CancelacionModal'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'

const TIPO_CFG: Record<string, { label: string; color: string }> = {
  PROTOCOLO_ALBA:   { label: 'Protocolo Alba',      color: '#991b1b' },
  PROTOCOLO_AMBAR:  { label: 'Protocolo Ambar',     color: '#854d0e' },
  BUSQUEDA_PERSONA: { label: 'Búsqueda de Persona', color: '#2563eb' },
}

function toISO(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString()
}

function fmtDT(v: Date | string | null): string {
  if (!v) return '—'
  return format(v instanceof Date ? v : new Date(String(v)), 'dd/MM/yyyy HH:mm')
}

export default async function FichaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'busquedas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'busquedas', 'ver'))) redirect('/dashboard')

  const { id } = await params

  const fichaResult = await query<any>(`SELECT * FROM fichas_busqueda WHERE id = $1 LIMIT 1`, [id])
  const ficha = fichaResult.rows[0]

  if (!ficha) notFound()

  const seguimientosResult = await query<any>(
    `SELECT sb.id, sb.tipo, sb.fecha_hora_envio, sb.archivo_url, sb.registrado_por,
            u.name AS nombre_usuario, u.apellido AS apellido_usuario
     FROM seguimientos_busqueda sb
     LEFT JOIN users u ON sb.registrado_por = u.id
     WHERE sb.ficha_id = $1
     ORDER BY sb.creado_en ASC`,
    [id]
  )
  const seguimientos = seguimientosResult.rows

  const cfg        = TIPO_CFG[ficha.tipo] ?? { label: ficha.tipo, color: '#64748b' }
  const fichaActiva = ficha.status === 'activa'

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/busquedas" style={{ color: '#2563eb', textDecoration: 'none' }}>Búsquedas</Link>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{ficha.folio ?? ficha.id.slice(0, 8)}</span>
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
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1e293b', margin: '0 0 4px' }}>
            {ficha.nombre_desaparecida}
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
            style={{ padding: '9px 16px', background: '#ffffff', color: '#2563eb', border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}
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
          <Field label="Activación"         value={fmtDT(ficha.fecha_activacion)} />
          <Field label="Aceptación"         value={fmtDT(ficha.fecha_aceptacion)} />
          <Field label="Carpeta Invest."    value={ficha.carpeta_investigacion} />
        </Card>

        <Card title="Personal Asignado">
          <Field label="Enlace"             value={ficha.enlace} />
          <Field label="RT que atiende"     value={ficha.rt_atiende} />
          <Field label="Elemento Novedades" value={ficha.elemento_novedades} />
          {!fichaActiva && (
            <>
              <Field label="Cancelación"    value={fmtDT(ficha.fecha_cancelacion)} />
              <Field label="Fiscal cancela" value={ficha.fiscal_cancela} />
              <Field label="Motivo"         value={ficha.motivo_cancelacion} />
            </>
          )}
        </Card>
      </div>

      {/* Timeline de seguimientos */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 16 }}>
          › Seguimientos de Tiempo ({seguimientos.length}/{24} registrados)
        </div>

        <SeguimientoTimeline
          fichaId={id}
          fechaActivacionISO={toISO(ficha.fecha_activacion)}
          seguimientosRegistrados={seguimientos.map(s => ({
            tipo:               s.tipo,
            fechaHoraEnvioISO: toISO(s.fecha_hora_envio),
            archivoUrl:        s.archivo_url,
            nombreUsuario:     s.nombre_usuario && s.apellido_usuario ? `${s.nombre_usuario} ${s.apellido_usuario}` : s.nombre_usuario,
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
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', flex: 1 }}>
        {value}
      </span>
    </div>
  )
}
