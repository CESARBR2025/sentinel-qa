import Link from 'next/link'
import { createMedida } from '@/lib/prevencion/actions'

const AUTORIDADES = [
  { value: 'FISCALIA', label: 'Fiscalía' },
  { value: 'UMECA', label: 'UMECA' },
  { value: 'JUZGADOS', label: 'Juzgados' },
  { value: 'SEC_MUJER', label: 'Secretaría de la Mujer' },
]

export default function NuevaMedidaPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 6px' }}>
          Nueva <span style={{ color: '#2563eb' }}>Medida de Protección</span>
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Captura los datos del oficio y la víctima
        </p>
      </div>

      <form action={createMedida} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Sección 1 */}
        <Section title="Datos del Oficio">
          <Row>
            <Field label="No. Expediente *" name="expediente" required />
            <Field label="No. Oficio *" name="nOficio" required />
          </Row>
          <Row>
            <Field label="Fecha del Oficio *" name="fechaOficio" type="date" required />
            <Field label="Fecha de Recepción *" name="fechaRecepcion" type="date" required />
          </Row>
          <Field label="Persona que Recepciona *" name="personaRecepciona" required />
        </Section>

        {/* Sección 2 */}
        <Section title="Autoridad Emisora">
          <Row>
            <SelectField label="Autoridad *" name="autoridad" options={AUTORIDADES} required />
            <Field label="Nombre de quien emite (Fiscal / Juez)" name="nombreAutoridad" />
          </Row>
          <TextareaField label="Delito(s)" name="delitos" rows={2} />
        </Section>

        {/* Sección 3 */}
        <Section title="Víctima y Demandado">
          <Field label="Nombre de la Víctima *" name="victima" required />
          <Row>
            <Field label="Nombre del Demandado" name="demandado" />
            <Field label="Tipo de Medida de Protección" name="tipoMedida" />
          </Row>
        </Section>

        {/* Sección 4 */}
        <Section title="Domicilio de Protección">
          <TextareaField label="Domicilio *" name="domicilioProteccion" rows={2} required />
          <Row>
            <Field label="Colonia" name="colonia" />
            <Field label="Teléfono" name="telefono" type="tel" />
          </Row>
        </Section>

        {/* Sección 5 */}
        <Section title="Vigencia y Apercibimiento">
          <Row>
            <Field label="Tiempo de la Medida" name="tiempoMedida" placeholder="ej. 3 meses" />
            <Field label="Fecha de Vencimiento" name="fechaVencimiento" type="date" />
          </Row>
          <Field label="Tipo de Apercibimiento" name="tipoApercibimiento" />
        </Section>

        {/* Sección 6 */}
        <Section title="Datos Internos">
          <Field label="Enlace asignado" name="enlace" />
          <TextareaField label="Observaciones" name="observaciones" rows={3} />
        </Section>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <Link
            href="/prevencion/medidas"
            style={{ padding: '11px 20px', background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            ← Cancelar
          </Link>
          <button
            type="submit"
            style={{ flex: 1, padding: '12px 24px', background: '#2563eb', color: '#fff', border: '1px solid #2563eb', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
          >
            Guardar Medida →
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
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 12 }}>
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
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </span>
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
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <select
        name={name} required={required}
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}>
        <option value="">— Seleccionar —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

function TextareaField({ label, name, rows = 3, required }: {
  label: string; name: string; rows?: number; required?: boolean
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <textarea
        name={name} rows={rows} required={required}
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
    </label>
  )
}
