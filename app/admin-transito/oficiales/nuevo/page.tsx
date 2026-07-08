import Link from 'next/link'
import { query } from '@/lib/db'
import { FlotaService } from '@/lib/flota/service'
import { ToastAuto } from '@/components/ui/ToastAuto'
import NuevoOficialForm from '@/components/admin-transito/NuevoOficialForm'

interface Departamento {
  id: string
  clave: string
  nombre: string
}

export default async function NuevoOficialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; exito?: string }>
}) {
  const { error, exito } = await searchParams

  const deptos = await query<Departamento>(
    `SELECT id, clave, nombre FROM via.v2_departamentos WHERE activo = true ORDER BY nombre`,
  )

  const patrullas = await FlotaService.listarPatrullasParaAsignacion()

  return (
    <div>
      <ToastAuto show={exito === 'creado'} mensaje="Oficial creado correctamente" />
      <ToastAuto show={error === 'email_en_uso'} mensaje="El correo electrónico ya está registrado" tipo="error" />
      <ToastAuto show={error === 'nombre_requerido'} mensaje="El nombre es obligatorio" tipo="error" />

      <div
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <h2
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: 0,
          }}
        >
          Nuevo{' '}
          <span style={{ color: '#2563eb' }}>Oficial</span>
        </h2>
        <Link
          href="/admin-transito/oficiales"
          style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Volver
        </Link>
      </div>

      <NuevoOficialForm deptos={deptos.rows} patrullas={patrullas} />
    </div>
  )
}
