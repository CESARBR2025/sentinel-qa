import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import { listarCuestionariosRobo } from '@/lib/auxiliar/service'
import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { tienePermiso } from '@/lib/auxiliar/permisos'

const TH: React.CSSProperties = { padding:'10px 14px', textAlign:'left', fontFamily:'JetBrains Mono,monospace', fontSize:9, color:'#64748b', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600, background:'#f8fafc', borderBottom:'1px solid #e2e8f0', whiteSpace:'nowrap' }
const TD: React.CSSProperties = { padding:'10px 14px', fontFamily:'Inter,sans-serif', fontSize:12, color:'#1e293b', borderBottom:'1px solid #f1f5f9' }

export default async function CuestionarioRoboPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)

  if (!userWithRole || !['Administrador', 'Auxiliar de Novedades', 'Auxiliar'].includes(userWithRole.rolNombre ?? '')) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'auxiliar_cuestionario_robo', 'ver'))) redirect('/dashboard')

  const datos = await listarCuestionariosRobo()

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', color:'#1e293b', fontFamily:'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'40px 48px' }}>

        <Link href="/auxiliar" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:'JetBrains Mono,monospace', fontSize:11, textDecoration:'none', marginBottom:24 }}>
          <ArrowLeft size={13} /> VOLVER AL PANEL
        </Link>

        <div style={{ marginBottom:32, borderBottom:'1px solid #e2e8f0', paddingBottom:20, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#2563eb', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>AUXILIAR DE NOVEDADES</span>
            <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:36, margin:'4px 0 0', color:'#0f172a', textTransform:'uppercase' }}>
              Cuestionario Único de <span style={{ color:'#2563eb' }}>Robo</span>
            </h1>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <a href="/api/auxiliar/exportar-robo?formato=xlsx"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', background:'#16a34a', color:'#ffffff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>
              <Download size={14} /> Excel
            </a>
            <a href="/api/auxiliar/exportar-robo?formato=pdf"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', background:'#dc2626', color:'#ffffff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>
              <Download size={14} /> PDF
            </a>
          </div>
        </div>

        {datos.length === 0 ? (
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', padding:'64px 32px', textAlign:'center', borderRadius:2 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Sin reportes de robo registrados</div>
          </div>
        ) : (
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:2, overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr>
                  <th style={TH}>Folio Incidente</th>
                  <th style={TH}>Folio Reporte</th>
                  <th style={TH}>Fecha</th>
                  <th style={TH}>Hora</th>
                  <th style={TH}>Folio Cuestionario</th>
                  <th style={TH}>Robo / Delito</th>
                  <th style={TH}>Nombre Policía</th>
                  <th style={TH}>Nómina</th>
                  <th style={TH}>Reg. Tableta</th>
                  <th style={TH}>Sector</th>
                  <th style={TH}>Ingresó Registro</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((r, i) => (
                  <tr key={`${r.reporteCampoId}-${i}`} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ ...TD, fontFamily:'JetBrains Mono,monospace', fontSize:11, fontWeight:700, color:'#2563eb' }}>{r.folioIncidente.slice(0,8)}...</td>
                    <td style={{ ...TD, fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{r.folioReporte || '—'}</td>
                    <td style={{ ...TD, fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{r.fecha}</td>
                    <td style={{ ...TD, fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{r.hora}</td>
                    <td style={{ ...TD, fontWeight:600 }}>{r.folioCuestionario || '—'}</td>
                    <td style={TD}>{r.robo || '—'}</td>
                    <td style={TD}>{r.nombrePolicia || '—'}</td>
                    <td style={{ ...TD, fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{r.nominaPolicia || '—'}</td>
                    <td style={TD}>{r.registroTableta || '—'}</td>
                    <td style={TD}>{r.sector || '—'}</td>
                    <td style={TD}>{r.nombreIngreso || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop:12, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#94a3b8' }}>
          {datos.length} REGISTROS
        </div>
      </div>
    </div>
  )
}