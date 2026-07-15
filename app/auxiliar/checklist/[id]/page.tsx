import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { listarParesReporte } from '@/lib/auxiliar/service'
import { upsertChecklistAction } from '@/lib/auxiliar/actions'
import { ToastExito } from '@/components/oficial/ToastExito'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { tienePermiso } from '@/lib/auxiliar/permisos'

const LBL: React.CSSProperties = { fontFamily:'JetBrains Mono,monospace', fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:6 }
const SEL: React.CSSProperties = { padding:'10px 12px', border:'1px solid #e2e8f0', borderLeft:'3px solid #1f355a', borderRadius:2, fontFamily:'Inter,sans-serif', fontSize:13, outline:'none', background:'#ffffff', width:'100%' }
const INP: React.CSSProperties = { ...SEL }
const BTN: React.CSSProperties = { padding:'12px 32px', background:'#1f355a', color:'#ffffff', fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', border:'none', cursor:'pointer', borderRadius:2 }

function CheckRow({ label, name, defaultValue }: { label: string; name: string; defaultValue: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', border:'1px solid #e2e8f0', borderRadius:2, background:'#ffffff' }}>
      <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, color:'#1e293b' }}>{label}</span>
      <select name={name} defaultValue={String(defaultValue)} style={{ ...SEL, width:'auto', minWidth:80 }}>
        <option value="false">NO</option>
        <option value="true">SÍ</option>
      </select>
    </div>
  )
}

export default async function ChecklistFormPage({
  params, searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ d1?: string; exito?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'auxiliar_checklist', 'ver'))) redirect('/dashboard')

  const { id }    = await params
  const { d1, exito } = await searchParams
  if (!d1) notFound()

  const pares = await listarParesReporte()
  const par   = pares.find(p => p.reporteCampoId === id && p.reporteD1Id === d1)
  if (!par) notFound()

  const cl = par.checklist

  // Pre-llenado automático desde datos existentes
  const tieneDenuncia    = !!par.d1Id
  const hayDetencion     = par.ofiHayDetencion ?? false
  const autoridadRecibe  = par.ofiAutoridadRecibe ?? ''

  const denunciaCuD1Default = cl?.denunciaCuD1  ?? tieneDenuncia
  const detenidoFgeDefault  = cl?.detenidoFge   ?? (hayDetencion && autoridadRecibe === 'FISCALIA')
  const detenidoJcDefault   = cl?.detenidoJc    ?? (hayDetencion && autoridadRecibe === 'JUZGADO CIVICO')

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', color:'#1e293b', fontFamily:'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 48px' }}>

        <Link href="/auxiliar/checklist" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:'JetBrains Mono,monospace', fontSize:11, textDecoration:'none', marginBottom:24 }}>
          <ArrowLeft size={13} /> VOLVER AL LISTADO
        </Link>

        <div style={{ marginBottom:32, borderBottom:'1px solid #e2e8f0', paddingBottom:20 }}>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#1f355a', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>CHECKLIST DE NOVEDADES</span>
          <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:32, margin:'4px 0 0', color:'#0f172a', textTransform:'uppercase' }}>
            {par.folioCad || 'S/C'} · D1: {par.folioDenuncia}
          </h1>
          <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#94a3b8', marginTop:6 }}>
            {par.oficialNombre} · {par.tipoIncidente} · {new Date(par.fechaReporte).toLocaleDateString('es-MX')}
          </div>
        </div>

        <form action={upsertChecklistAction} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <input type="hidden" name="reporteCampoId" value={id} />
          <input type="hidden" name="reporteD1Id"    value={d1} />

          {/* Denuncia CU-D1 */}
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:2, padding:'20px 24px' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:16, textTransform:'uppercase', color:'#0f172a', marginBottom:16 }}>
              Denuncia CU-D1
            </div>
            {tieneDenuncia && !cl && (
              <div style={{ marginBottom:12, padding:'8px 12px', background:'#eff1f3', border:'1px solid #c3c8d2', borderRadius:2, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#1c3051' }}>
                PRE-LLENADO — Este reporte tiene D1 vinculado
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={LBL}>¿Se realizó?</label>
                <select name="denunciaCuD1" defaultValue={String(denunciaCuD1Default)} style={SEL}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </select>
              </div>
              <div>
                <label style={LBL}>Duración</label>
                <input name="denunciaCuD1Duracion" defaultValue={cl?.denunciaCuD1Duracion ?? ''} placeholder="Ej. 00:45" style={INP} />
              </div>
            </div>
          </div>

          {/* Checks */}
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:2, padding:'20px 24px' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:16, textTransform:'uppercase', color:'#0f172a', marginBottom:16 }}>
              Detenidos y Acciones
            </div>
            {hayDetencion && !cl && (
              <div style={{ marginBottom:12, padding:'8px 12px', background:'#eff1f3', border:'1px solid #c3c8d2', borderRadius:2, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#1c3051' }}>
                PRE-LLENADO — Autoridad: {autoridadRecibe || '—'}
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <CheckRow label="Detenido FGE (Fiscalía General del Estado)"      name="detenidoFge"       defaultValue={detenidoFgeDefault} />
              <CheckRow label="Detenido FGR (Fiscalía General de la República)" name="detenidoFgr"       defaultValue={cl?.detenidoFgr    ?? false} />
              <CheckRow label="Detenido JC (Juzgado Cívico)"                   name="detenidoJc"        defaultValue={detenidoJcDefault} />
              <CheckRow label="Convenios"                                        name="convenios"         defaultValue={cl?.convenios      ?? false} />
              <CheckRow label="Trabajos en Favor de la Comunidad"               name="trabajosComunidad" defaultValue={cl?.trabajosComunidad ?? false} />
            </div>
          </div>

          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:2, padding:'20px 24px' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:700, fontSize:16, textTransform:'uppercase', color:'#0f172a', marginBottom:16 }}>
              Verificación Operativa
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <CheckRow label="Coincide la Ubicación del GPS" name="coincideGps"     defaultValue={cl?.coincideGps     ?? false} />
              <CheckRow label="Se Visualizó Vía Cámara"       name="visualizoCamara" defaultValue={cl?.visualizoCamara ?? false} />
              <CheckRow label="TI/PI (Tiempo de Llegada)"     name="tiPi"            defaultValue={cl?.tiPi            ?? false} />
            </div>
          </div>

          {/* Observaciones */}
          <div style={{ background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:2, padding:'20px 24px' }}>
            <label style={LBL}>Observaciones</label>
            <textarea name="observaciones" defaultValue={cl?.observaciones ?? ''} rows={4}
              style={{ ...INP, resize:'vertical', fontFamily:'Inter,sans-serif', lineHeight:1.6 }}
              placeholder="Observaciones adicionales..." />
          </div>

          <div>
            <button type="submit" style={BTN}>
              {cl ? 'ACTUALIZAR CHECKLIST' : 'GUARDAR CHECKLIST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}