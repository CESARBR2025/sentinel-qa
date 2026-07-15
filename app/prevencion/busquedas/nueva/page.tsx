import { auth }         from '@/lib/auth'
import { headers }      from 'next/headers'
import { redirect }     from 'next/navigation'
import { createFicha } from '@/lib/prevencion/actions'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'
import { FormHeader, Section, Field, Select, FormActions } from '@/components/forms/FormKit'

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
    <div style={{ maxWidth: 1000 }}>
      <FormHeader
        kicker="Prevención · Búsquedas / Alba"
        title="Activar"
        accent="Protocolo / Búsqueda"
        subtitle="Registra los datos de activación — se generará la ficha de difusión automáticamente"
      />

      <form action={createFicha} className="fk-form">
        <Section title="Tipo de Activación" num="01">
          <Select label="Tipo" name="tipo" options={TIPOS} required />
          <Field label="Folio" name="folio" placeholder="ej. ALBA-2025-001" />
          <Field label="Fecha y Hora de Activación" name="fechaActivacion" type="datetime-local" required />
          <Field label="Fecha y Hora de Aceptación"   name="fechaAceptacion" type="datetime-local" />
          <Field label="Carpeta de Investigación" name="carpetaInvestigacion" full />
        </Section>

        <Section title="Datos de la Persona" num="02">
          <Field label="Nombre Completo" name="nombreDesaparecida" required />
          <Field label="Edad" name="edad" type="number" placeholder="años" />
        </Section>

        <Section title="Personal Asignado" num="03">
          <Field label="Enlace asignado"     name="enlace" />
          <Field label="RT que Atiende"      name="rtAtiende" />
          <Field label="Elemento de Novedades" name="elementoNovedades" full />
        </Section>

        <FormActions submitLabel="Activar Protocolo →" cancelHref="/prevencion/busquedas" />
      </form>
    </div>
  )
}
