import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db }      from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq }      from 'drizzle-orm'
import { listarParesReporte } from '@/lib/auxiliar/service'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { tienePermiso } from '@/lib/auxiliar/permisos'

export default async function ChecklistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [userRole] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!['Administrador', 'Auxiliar de Novedades', 'Auxiliar'].includes(userRole?.rolNombre ?? '')) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'auxiliar_checklist', 'ver'))) redirect('/dashboard')

  const pares = await listarParesReporte()

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', color:'#1e293b', fontFamily:'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 48px' }}>

        <Link href="/auxiliar" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:'JetBrains Mono,monospace', fontSize:11, textDecoration:'none', marginBottom:24 }}>
          <ArrowLeft size={13} /> VOLVER AL PANEL
        </Link>

        <div style={{ marginBottom:32, borderBottom:'1px solid #e2e8f0', paddingBottom:20, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#2563eb', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>AUXILIAR DE NOVEDADES</span>
            <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:36, margin:'4px 0 0', color:'#0f172a', textTransform:'uppercase' }}>
              Checklist de <span style={{ color:'#2563eb' }}>Novedades</span>
            </h1>
          </div>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#94a3b8' }}>
            {pares.length} REGISTROS
          </span>
        </div>

        {pares.length === 0 ? (
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', padding:'64px 32px', textAlign:'center', borderRadius:2 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Sin pares reporte-D1 registrados</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {pares.map(p => {
              const hecho = !!p.checklist
              return (
                <Link key={`${p.reporteCampoId}-${p.reporteD1Id}`}
                  href={`/auxiliar/checklist/${p.reporteCampoId}?d1=${p.reporteD1Id}`}
                  style={{ background:'#ffffff', border:`1px solid ${hecho ? '#bbf7d0' : '#e2e8f0'}`, borderLeft:`4px solid ${hecho ? '#16a34a' : '#2563eb'}`, borderRadius:2, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', textDecoration:'none', color:'inherit' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight:700, color:'#0f172a' }}>{p.folioCad || 'S/C'}</span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#2563eb' }}>D1: {p.folioDenuncia}</span>
                      <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, color:'#64748b' }}>{p.tipoIncidente || '—'}</span>
                      <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, color:'#94a3b8' }}>{p.oficialNombre || '—'}</span>
                    </div>
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#94a3b8' }}>
                      {new Date(p.fechaReporte).toLocaleString('es-MX', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {hecho ? (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'JetBrains Mono,monospace', fontSize:10, fontWeight:700, padding:'3px 10px', background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:2 }}>
                        <CheckCircle2 size={11} /> COMPLETADO
                      </span>
                    ) : (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'JetBrains Mono,monospace', fontSize:10, padding:'3px 10px', background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:2 }}>
                        <Circle size={11} /> PENDIENTE
                      </span>
                    )}
                    <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#94a3b8' }}>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}