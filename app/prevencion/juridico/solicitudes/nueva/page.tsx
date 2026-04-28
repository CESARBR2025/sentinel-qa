import Link from 'next/link'
import { createSolicitud } from '@/lib/prevencion/actions'

const AUTORIDADES = [
  { value: 'FISCALIA',  label: 'Fiscalía' },
  { value: 'UMECA',     label: 'UMECA' },
  { value: 'JUZGADOS',  label: 'Juzgados' },
  { value: 'SEC_MUJER', label: 'Secretaría de la Mujer' },
]

export default function NuevaSolicitudPage() {
  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/juridico" style={{ color: '#4a5878', textDecoration: 'none' }}>Área Jurídica</Link>
        <span>›</span>
        <span>Nueva Solicitud</span>
      </div>

      <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 32px' }}>
        Nueva <span style={{ color: '#d4a43a' }}>Solicitud de Información</span>
      </h2>

      <form action={createSolicitud} style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Section title="Datos del Oficio">
          <Row>
            <Field label="N° de Oficio *" name="oficio" required />
            <Field label="Enlace" name="enlace" />
          </Row>
          <Row>
            <Field label="Fecha y hora de activación *" name="fechaActivacion" type="datetime-local" required />
            <Field label="Fecha y hora de aceptación" name="fechaAceptacion" type="datetime-local" />
          </Row>
        </Section>

        <Section title="Autoridad Emisora">
          <Row>
            <SelectField label="Autoridad *" name="autoridad" options={AUTORIDADES} required />
            <Field label="Fiscal que solicita" name="fiscalSolicita" />
          </Row>
        </Section>

        <Section title="Datos del Caso">
          <Row>
            <Field label="Delito" name="delito" />
            <Field label="Carpeta de investigación" name="carpetaInvestigacion" />
          </Row>
          <TextareaField label="Texto de la solicitud" name="solicitudTexto" rows={4} />
        </Section>

        <div style={{ padding: '24px 0 0', display: 'flex', gap: 20, alignItems: 'center' }}>
          <button
            type="submit"
            style={{ padding: '12px 28px', background: '#c0223a', color: '#fff', border: 'none', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Turnar a Jurídico
          </button>
          <Link
            href="/prevencion/juridico"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #1b2742', marginBottom: 0, borderBottom: 'none' }}>
      <div style={{ background: '#0b1220', padding: '10px 20px', borderBottom: '1px solid #1b2742', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#d4a43a', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
        › {title}
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {children}
    </div>
  )
}

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        style={{ background: '#070b16', border: '1px solid #1b2742', color: '#d8e0f0', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        style={{ background: '#070b16', border: '1px solid #1b2742', color: '#d8e0f0', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', width: '100%', boxSizing: 'border-box' }}
      >
        <option value="" disabled>Seleccionar...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function TextareaField({ label, name, rows }: { label: string; name: string; rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <textarea
        name={name}
        rows={rows ?? 3}
        style={{ background: '#070b16', border: '1px solid #1b2742', color: '#d8e0f0', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
      />
    </div>
  )
}
