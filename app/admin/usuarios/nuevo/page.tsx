import { listarRolesActivos } from '@/lib/admin/repository'
import Link       from 'next/link'
import { createUser } from '@/lib/admin/actions'
import { labelStyle as L, inputStyle as I, selectStyle as S, btnPrimario as BTN, btnSecundario } from '../../admin-styles'

export default async function NuevoUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const rolesList = await listarRolesActivos()

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: 0 }}>
          Nuevo <span style={{ color: '#2563eb' }}>Usuario</span>
        </h2>
        <Link href="/admin/usuarios" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>

      {error === 'email_en_uso' && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 24, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#dc2626', letterSpacing: '0.1em' }}>
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
          <Link href="/admin/usuarios" style={btnSecundario}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
