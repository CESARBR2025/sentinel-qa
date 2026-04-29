import { db }    from '@/lib/db/index'
import { roles }  from '@/lib/db/schema'
import { eq }     from 'drizzle-orm'
import Link       from 'next/link'
import { createUser } from '@/lib/admin/actions'

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

export default async function NuevoUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const rolesList = await db.select().from(roles).where(eq(roles.activo, true))

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: 0 }}>
          Nuevo <span style={{ color: '#d4a43a' }}>Usuario</span>
        </h2>
        <Link href="/admin/usuarios" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>

      {error === 'email_en_uso' && (
        <div style={{ padding: '12px 16px', background: 'rgba(192,34,58,0.1)', border: '1px solid #c0223a', marginBottom: 24, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#c0223a', letterSpacing: '0.1em' }}>
          ✕ El correo electrónico ya está registrado en el sistema
        </div>
      )}

      <form action={createUser} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={L}>Nombre *</label>
            <input name="nombre" required style={I} placeholder="Carlos" />
          </div>
          <div>
            <label style={L}>Apellido</label>
            <input name="apellido" style={I} placeholder="García López" />
          </div>
        </div>

        <div>
          <label style={L}>Correo electrónico *</label>
          <input name="email" type="email" required style={I} placeholder="usuario@sspm-sjr.gob.mx" />
        </div>

        <div>
          <label style={L}>Contraseña * (mínimo 8 caracteres)</label>
          <input name="password" type="password" required minLength={8} style={I} />
        </div>

        <div>
          <label style={L}>Rol</label>
          <select name="rolId" style={S}>
            <option value="">— Sin rol asignado —</option>
            {rolesList.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" style={BTN}>Crear usuario</button>
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
