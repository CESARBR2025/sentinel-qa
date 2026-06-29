import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'

export default async function MonitoristaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const r = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`,
    [session.user.id],
  )

  const rol = r.rows[0]?.nombre
  if (rol !== 'Monitorista' && rol !== 'Administrador') redirect('/dashboard')

  return <>{children}</>
}
