import Link from 'next/link'
import { listarRolesActivos } from '@/lib/admin/repository'
import { enviarAvisoAction } from '@/lib/notificaciones/admin-actions'
import { cardStyle, btnPrimario, btnSecundario, inputStyle, labelStyle } from '../../admin-styles'

export default async function EnviarAvisoPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>
}) {
  const sp = await searchParams
  const roles = await listarRolesActivos()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
            Enviar <span style={{ color: '#1f355a' }}>Aviso</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '6px 0 0 0' }}>
            Comunicado manual a uno o varios roles
          </p>
        </div>
        <Link href="/admin/notificaciones" style={btnSecundario}>Cancelar</Link>
      </div>

      {sp.error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          Falta el título, el mensaje o seleccionar al menos un rol.
        </div>
      )}

      <form action={enviarAvisoAction} style={{ ...cardStyle, padding: 28, maxWidth: 760 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle} htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" required maxLength={120} style={inputStyle}
            placeholder="Ej. Mantenimiento programado del sistema" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle} htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" name="mensaje" required rows={4} maxLength={500}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter,sans-serif' }}
            placeholder="Detalle del aviso…" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle} htmlFor="href">Enlace (opcional)</label>
          <input id="href" name="href" style={inputStyle} placeholder="/dashboard" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <span style={labelStyle}>Roles destinatarios</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
            {roles.map(r => (
              <label key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                border: '1px solid #e2e8f0', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontSize: 12.5, color: '#334155',
              }}>
                <input type="checkbox" name="roles" value={r.nombre} style={{ cursor: 'pointer' }} />
                {r.nombre}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" style={btnPrimario}>Enviar aviso</button>
      </form>
    </>
  )
}
