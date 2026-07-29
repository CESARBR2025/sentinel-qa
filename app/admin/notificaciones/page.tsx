import Link from 'next/link'
import { listarAuditoria } from '@/lib/notificaciones/repository'
import { definicionEvento, eventosPorModulo } from '@/lib/notificaciones/catalogo'
import { listarRolesActivos } from '@/lib/admin/repository'
import { cardStyle, btnPrimario, btnSecundario, selectStyle, labelStyle } from '../admin-styles'

const COLOR_SEVERIDAD: Record<string, string> = {
  info: '#0284c7', aviso: '#ea580c', critico: '#dc2626',
}

export default async function AdminNotificacionesPage({ searchParams }: {
  searchParams: Promise<{ evento?: string; rolId?: string; exito?: string }>
}) {
  const sp = await searchParams
  const evento = sp.evento || null
  const rolId = sp.rolId ? Number(sp.rolId) : null

  const [registros, roles] = await Promise.all([
    listarAuditoria({ evento, rolId, limite: 100 }),
    listarRolesActivos(),
  ])

  const grupos = eventosPorModulo()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
            Auditoría de <span style={{ color: '#1f355a' }}>Notificaciones</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '6px 0 0 0' }}>
            Últimas 100 emisiones · {registros.length} mostradas
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/notificaciones/matriz" style={btnSecundario}>Matriz evento × rol</Link>
          <Link href="/admin/notificaciones/mantenimiento" style={btnSecundario}>Mantenimiento</Link>
          <Link href="/admin/notificaciones/enviar" style={{ ...btnPrimario, textDecoration: 'none' }}>Enviar aviso</Link>
        </div>
      </div>

      {sp.exito === 'aviso' && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(5,150,105,0.1)', border: '1px solid #059669', color: '#059669', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          Aviso enviado.
        </div>
      )}

      <form method="GET" style={{ ...cardStyle, padding: 18, marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 240 }}>
          <label style={labelStyle} htmlFor="f-evento">Evento</label>
          <select id="f-evento" name="evento" defaultValue={evento ?? ''} style={selectStyle}>
            <option value="">Todos</option>
            {grupos.map(g => (
              <optgroup key={g.modulo} label={g.modulo}>
                {g.eventos.map(e => <option key={e.clave} value={e.clave}>{e.def.label}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div style={{ minWidth: 200 }}>
          <label style={labelStyle} htmlFor="f-rol">Rol destinatario</label>
          <select id="f-rol" name="rolId" defaultValue={rolId ? String(rolId) : ''} style={selectStyle}>
            <option value="">Todos</option>
            {roles.map(r => <option key={r.id} value={String(r.id)}>{r.nombre}</option>)}
          </select>
        </div>
        <button type="submit" style={btnPrimario}>Filtrar</button>
      </form>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Evento', 'Título', 'Destinatario', 'Emitida por', 'Leídas', 'Fecha'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
                  › Sin notificaciones registradas
                </td>
              </tr>
            )}
            {registros.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={celda}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', fontSize: 9,
                    fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: COLOR_SEVERIDAD[n.severidad], border: `1px solid ${COLOR_SEVERIDAD[n.severidad]}`,
                  }}>
                    {definicionEvento(n.evento)?.label ?? n.evento}
                  </span>
                </td>
                <td style={{ ...celda, fontWeight: 600, color: '#0f172a' }}>{n.titulo}</td>
                <td style={celda}>
                  {n.rolNombre
                    ? <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>rol: {n.rolNombre}</span>
                    : <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b' }}>{n.usuarioNombre ?? '—'}</span>}
                </td>
                <td style={{ ...celda, color: '#64748b' }}>{n.emitidaPorNombre ?? 'Sistema'}</td>
                <td style={{ ...celda, fontFamily: 'JetBrains Mono,monospace' }}>{n.lecturas}</td>
                <td style={{ ...celda, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, whiteSpace: 'nowrap' }}>
                  {new Date(n.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

const celda: React.CSSProperties = {
  padding: '12px 16px', fontFamily: 'Inter,sans-serif', fontSize: 12.5, color: '#334155',
}
