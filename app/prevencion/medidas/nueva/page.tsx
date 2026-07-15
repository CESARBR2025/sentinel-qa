import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createMedida } from '@/lib/prevencion/actions'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'
import { FormHeader, Section, Field, Select, Textarea, FormActions } from '@/components/forms/FormKit'

const AUTORIDADES = [
  { value: 'FISCALIA', label: 'Fiscalía' },
  { value: 'UMECA', label: 'UMECA' },
  { value: 'JUZGADOS', label: 'Juzgados' },
  { value: 'SEC_MUJER', label: 'Secretaría de la Mujer' },
]

export default async function NuevaMedidaPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'medidas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'medidas', 'crear'))) redirect('/dashboard')

  return (
    <div style={{ maxWidth: 1000 }}>
      <FormHeader
        kicker="Prevención · Medidas de Protección"
        title="Nueva"
        accent="Medida de Protección"
        subtitle="Captura los datos del oficio y la víctima"
      />

      <form action={createMedida} className="fk-form">
        <Section title="Datos del Oficio" num="01">
          <Field label="No. Expediente" name="expediente" required />
          <Field label="No. Oficio" name="nOficio" required />
          <Field label="Fecha del Oficio" name="fechaOficio" type="date" required />
          <Field label="Fecha de Recepción" name="fechaRecepcion" type="date" required />
          <Field label="Persona que Recepciona" name="personaRecepciona" required full />
        </Section>

        <Section title="Autoridad Emisora" num="02">
          <Select label="Autoridad" name="autoridad" options={AUTORIDADES} required />
          <Field label="Nombre de quien emite (Fiscal / Juez)" name="nombreAutoridad" />
          <Textarea label="Delito(s)" name="delitos" rows={2} />
        </Section>

        <Section title="Víctima y Demandado" num="03">
          <Field label="Nombre de la Víctima" name="victima" required full />
          <Field label="Nombre del Demandado" name="demandado" />
          <Field label="Tipo de Medida de Protección" name="tipoMedida" />
        </Section>

        <Section title="Domicilio de Protección" num="04">
          <Textarea label="Domicilio" name="domicilioProteccion" rows={2} required />
          <Field label="Colonia" name="colonia" />
          <Field label="Teléfono" name="telefono" type="tel" />
        </Section>

        <Section title="Vigencia y Apercibimiento" num="05">
          <Field label="Tiempo de la Medida" name="tiempoMedida" placeholder="ej. 3 meses" />
          <Field label="Fecha de Vencimiento" name="fechaVencimiento" type="date" />
          <Field label="Tipo de Apercibimiento" name="tipoApercibimiento" full />
        </Section>

        <Section title="Datos Internos" num="06">
          <Field label="Enlace asignado" name="enlace" full />
          <Textarea label="Observaciones" name="observaciones" rows={3} />
        </Section>

        <FormActions submitLabel="Guardar Medida →" cancelHref="/prevencion/medidas" />
      </form>
    </div>
  )
}
