import { redirect } from 'next/navigation'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { listarParaUsuario, contarNoLeidas, contarTotal } from '@/lib/notificaciones/repository'
import { definicionEvento } from '@/lib/notificaciones/catalogo'
import { SubHeader } from '@/components/partials/SubHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { ListaHistorial } from '@/components/notificaciones/ListaHistorial'

const POR_PAGINA = 25

export default async function NotificacionesPage({ searchParams }: {
  searchParams: Promise<{ pagina?: string; soloNoLeidas?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const sp = await searchParams
  const pagina = Math.max(Number(sp.pagina ?? 1), 1)
  const soloNoLeidas = sp.soloNoLeidas === 'true'

  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null

  const [notificaciones, noLeidas, total] = await Promise.all([
    listarParaUsuario(session.user.id, rolId, {
      limite: POR_PAGINA,
      offset: (pagina - 1) * POR_PAGINA,
      soloNoLeidas,
    }),
    contarNoLeidas(session.user.id, rolId),
    contarTotal(session.user.id, rolId),
  ])

  const enriquecidas = notificaciones.map(n => ({
    ...n,
    modulo: definicionEvento(n.evento)?.modulo ?? '—',
  }))

  const user = session.user as { name: string; apellido?: string; email: string }
  const totalPaginas = Math.max(Math.ceil(total / POR_PAGINA), 1)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />
      <SubHeader backHref="/dashboard" backLabel="Dashboard" title="Mis" accent="Notificaciones" user={user} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ListaHistorial
          notificaciones={enriquecidas}
          noLeidas={noLeidas}
          total={total}
          pagina={pagina}
          totalPaginas={totalPaginas}
          soloNoLeidas={soloNoLeidas}
        />
        <DashboardFooter />
      </main>
    </div>
  )
}
