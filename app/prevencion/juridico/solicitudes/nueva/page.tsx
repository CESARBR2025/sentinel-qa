import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSolicitud } from '@/lib/prevencion/actions'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'
import { FormHeader, Section, Field, Select, Textarea, FormActions } from '@/components/forms/FormKit'

const AUTORIDADES = [
  { value: 'FISCALIA',  label: 'Fiscalía' },
  { value: 'UMECA',     label: 'UMECA' },
  { value: 'JUZGADOS',  label: 'Juzgados' },
  { value: 'SEC_MUJER', label: 'Secretaría de la Mujer' },
]

export default async function NuevaSolicitudPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'solicitudes'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'crear'))) redirect('/dashboard')

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.12em' }}>
        <Link href="/prevencion/juridico" style={{ color: '#1f355a', textDecoration: 'none' }}>Área Jurídica</Link>
        <span>›</span>
        <span>Nueva Solicitud</span>
      </div>

      <FormHeader
        kicker="Prevención · Área Jurídica"
        title="Nueva"
        accent="Solicitud de Información"
      />

      <form action={createSolicitud} className="fk-form">
        <Section title="Datos del Oficio" num="01">
          <Field label="N° de Oficio" name="oficio" required />
          <Field label="Enlace" name="enlace" />
          <Field label="Fecha y hora de activación" name="fechaActivacion" type="datetime-local" required />
          <Field label="Fecha y hora de aceptación" name="fechaAceptacion" type="datetime-local" />
        </Section>

        <Section title="Autoridad Emisora" num="02">
          <Select label="Autoridad" name="autoridad" options={AUTORIDADES} required />
          <Field label="Fiscal que solicita" name="fiscalSolicita" />
        </Section>

        <Section title="Datos del Caso" num="03">
          <Field label="Delito" name="delito" />
          <Field label="Carpeta de investigación" name="carpetaInvestigacion" />
          <Textarea label="Texto de la solicitud" name="solicitudTexto" rows={4} />
        </Section>

        <FormActions submitLabel="Turnar a Jurídico →" cancelHref="/prevencion/juridico" cancelLabel="Cancelar" />
      </form>
    </div>
  )
}
