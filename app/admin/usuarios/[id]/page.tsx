/* eslint-disable react-hooks/purity */
import { db }       from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq }        from 'drizzle-orm'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { format }    from 'date-fns'
import { updateUser } from '@/lib/admin/actions'

const L: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
  color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8,
}
const I: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#0b1220',
  border: '1px solid #1b2742', color: '#d8e0f0', fontFamily: 'Inter,sans-serif',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
}
const S: React.CSSProperties = { ...I, cursor: 'pointer' }
const BTN: React.CSSProperties = {
  padding: '10px 24px', background: '#c0223a', color: '#fff',
  fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
  fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
  border: 'none', cursor: 'pointer',
}

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [user] = await db
    .select({
      id:               users.id,
      name:             users.name,
      apellido:         users.apellido,
      email:            users.email,
      rolId:            users.rolId,
      activo:           users.activo,
      twoFactorEnabled: users.twoFactorEnabled,
      createdAt:        users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!user) notFound()

  const rolesList = await db.select().from(roles).where(eq(roles.activo, true))

  const createdAtValue = user.createdAt as Date | string | null

const createdAt =
  createdAtValue instanceof Date
    ? createdAtValue
    : new Date(createdAtValue ?? Date.now())

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 4px' }}>
            Editar <span style={{ color: '#d4a43a' }}>Usuario</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            Creado el {format(createdAt, 'dd/MM/yyyy')}
          </p>
        </div>
        <Link href="/admin/usuarios" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>

      <form action={updateUser} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input type="hidden" name="userId" value={user.id} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={L}>Nombre *</label>
            <input name="nombre" required defaultValue={user.name} style={I} />
          </div>
          <div>
            <label style={L}>Apellido</label>
            <input name="apellido" defaultValue={user.apellido ?? ''} style={I} />
          </div>
        </div>

        <div>
          <label style={L}>Correo electrónico</label>
          <input value={user.email} disabled style={{ ...I, opacity: 0.45, cursor: 'not-allowed' }} readOnly />
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.12em', margin: '6px 0 0' }}>
            El correo no puede modificarse
          </p>
        </div>

        <div>
          <label style={L}>Rol</label>
          <select name="rolId" defaultValue={user.rolId?.toString() ?? ''} style={S}>
            <option value="">— Sin rol asignado —</option>
            {rolesList.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={L}>Estado</label>
          <select name="activo" defaultValue={user.activo ? 'true' : 'false'} style={S}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div style={{ padding: '12px 16px', background: '#0b1220', border: '1px solid #1b2742' }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            Autenticación de dos factores
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: user.twoFactorEnabled ? '#4a9e6a' : '#4a5878' }}>
            {user.twoFactorEnabled ? '✓ Habilitado' : '— No configurado'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" style={BTN}>Guardar cambios</button>
          <Link
            href="/admin/usuarios"
            style={{ padding: '10px 20px', background: 'transparent', color: '#8a9bc0', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1b2742' }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
