import { auth }         from '@/lib/auth'
import { headers }      from 'next/headers'
import { redirect }     from 'next/navigation'
import Link            from 'next/link'
import { createFicha } from '@/lib/prevencion/actions'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'

const TIPOS = [
  { value: 'PROTOCOLO_ALBA',   label: 'Protocolo Alba' },
  { value: 'PROTOCOLO_AMBAR',  label: 'Protocolo Ambar' },
  { value: 'BUSQUEDA_PERSONA',  label: 'Búsqueda de Persona' },
]

export default async function NuevaFichaPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'busquedas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'busquedas', 'crear'))) redirect('/dashboard')

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 6px' }}>
          Activar <span style={{ color: '#2563eb' }}>Protocolo / Búsqueda</span>
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Registra los datos de activación — se generará la ficha de difusión automáticamente
        </p>
      </div>

      <form action={createFicha} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Tipo y folio */}
        <Section title="Tipo de Activación">
          <Row>
            <SelectField label="Tipo *" name="tipo" options={TIPOS} required />
            <Field label="Folio" name="folio" placeholder="ej. ALBA-2025-001" />
          </Row>
          <Row>
            <Field label="Fecha y Hora de Activación *" name="fechaActivacion" type="datetime-local" required />
            <Field label="Fecha y Hora de Aceptación"   name="fechaAceptacion" type="datetime-local" />
          </Row>
          <Field label="Carpeta de Investigación" name="carpetaInvestigacion" />
        </Section>

        {/* Persona desaparecida */}
        <Section title="Datos de la Persona">
          <Field label="Nombre Completo *" name="nombreDesaparecida" required />
          <Field label="Edad" name="edad" type="number" placeholder="años" />
        </Section>

        {/* Personal asignado */}
        <Section title="Personal Asignado">
          <Row>
            <Field label="Enlace asignado"     name="enlace" />
            <Field label="RT que Atiende"      name="rtAtiende" />
          </Row>
          <Field label="Elemento de Novedades" name="elementoNovedades" />
        </Section>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <Link
            href="/prevencion/busquedas"
            style={{ padding: '11px 20px', background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            ← Cancelar
          </Link>
          <button
            type="submit"
            style={{ flex: 1, padding: '12px 24px', background: '#2563eb', color: '#ffffff', border: '1px solid #2563eb', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
          >
            Activar Protocolo →
          </button>
        </div>
      </form>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#d4a43a', textTransform: 'uppercase', marginBottom: 12 }}>
        › {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {children}
    </div>
  )
}

function Field({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#8a9bc0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
      <input
        type={type} name={name} required={required} placeholder={placeholder}
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}
        />
    </label>
  )
}

function SelectField({ label, name, options, required }: {
  label: string; name: string; options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#8a9bc0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
      <select
        name={name} required={required}
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}
        >
        <option value="">— Seleccionar —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
