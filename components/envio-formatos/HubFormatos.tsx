'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, CircleDot, FileDown, ChevronRight } from 'lucide-react'
import { pageWrap } from '@/components/reportes/form-styles'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'

// Hub selector de formatos de envío (Etapa 9). Muestra las tarjetas de Formato N
// a Coordinación y Parte de Novedades C-4. Llega aquí solo quien tiene permiso de
// AMBOS (quien tiene uno solo se redirige directo a su formato en la página).

interface EstatusFormatoN {
  fecha: string
  eventos_confirmado: boolean
  fge_confirmado: boolean
  fgr_confirmado: boolean
  rnd_confirmado: boolean
  medios_confirmado: boolean
  victimas_confirmado: boolean
  armas_confirmado: boolean
  observaciones_confirmado: boolean
}

interface EstatusNovedades {
  fecha: string
  periodo_confirmado: boolean
  resumen_confirmado: boolean
  subsecretaria_confirmado: boolean
  analisis_confirmado: boolean
  c4_confirmado: boolean
  transito_confirmado: boolean
  prevencion_confirmado: boolean
  delictivos_confirmado: boolean
  operativos_confirmado: boolean
  resumen_nov_confirmado: boolean
  fuerza_confirmado: boolean
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)', padding: '20px 22px', marginBottom: 16,
}

const tagBase: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: 'normal', textTransform: 'none',
  padding: '5px 12px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: 6,
}

const tagListo: React.CSSProperties = { ...tagBase, color: '#16a34a', background: '#dcfce7' }
const tagPendiente: React.CSSProperties = { ...tagBase, color: '#b45309', background: '#fef3c7' }

const btnBase: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, letterSpacing: 'normal', textTransform: 'none',
  textDecoration: 'none', borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: 8,
  cursor: 'pointer', border: 'none',
}

const linkBtn: React.CSSProperties = { ...btnBase, background: '#0f172a', color: '#fff', padding: '10px 20px' }
const linkBtnSecondary: React.CSSProperties = { ...btnBase, background: '#f1f5f9', color: '#475569', padding: '10px 18px', border: '1px solid #e2e8f0' }

export default function HubFormatos({ user }: { user: { name: string; apellido?: string; email: string } }) {
  const router = useRouter()
  const hoy = new Date().toISOString().slice(0, 10)
  const [fn, setFn] = useState<EstatusFormatoN | null>(null)
  const [nv, setNv] = useState<EstatusNovedades | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    ;(async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch('/api/reportes/formato-n-consolidado', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha_inicio: hoy, fecha_fin: hoy }),
          }).then(r => r.ok ? r.json() : []),
          fetch(`/api/novedades/dia?fecha=${hoy}`).then(r => r.ok ? r.json() : null),
        ])
        if (!activo) return
        const fila = Array.isArray(r1) ? r1.find((x: { fecha: string }) => x.fecha === hoy) : null
        setFn(fila?.estatus ?? null)
        setNv(r2?.estatus ?? null)
      } finally {
        if (activo) setLoading(false)
      }
    })()
    return () => { activo = false }
  }, [hoy])

  const confirmadasN = (e: EstatusFormatoN | null) => e
    ? [e.eventos_confirmado, e.fge_confirmado, e.fgr_confirmado, e.rnd_confirmado, e.medios_confirmado, e.victimas_confirmado, e.armas_confirmado, e.observaciones_confirmado].filter(Boolean).length
    : 0
  const confirmadasNov = (e: EstatusNovedades | null) => e
    ? [e.periodo_confirmado, e.resumen_confirmado, e.subsecretaria_confirmado, e.analisis_confirmado, e.c4_confirmado, e.transito_confirmado, e.prevencion_confirmado, e.delictivos_confirmado, e.operativos_confirmado, e.resumen_nov_confirmado, e.fuerza_confirmado].filter(Boolean).length
    : 0

  const listoN = confirmadasN(fn) === 8
  const listoNov = confirmadasNov(nv) === 11

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .enf-btn:active { transform: scale(0.97); box-shadow: var(--apple-shadow-glass); transition: transform .12s ease-out, box-shadow .12s ease-out; }
        .enf-btn:hover { transform: translateY(-2px); box-shadow: var(--apple-shadow-glass-hover); }
        @media (prefers-reduced-motion: reduce) {
          .enf-btn, .enf-btn:hover, .enf-btn:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
        }
      `}</style>
      <DashboardHeader user={user} roleLabel="Envío de Formatos" backHref="/agente_reportes" backLabel="Panel de Reportes" onBack={() => router.push('/agente_reportes')} />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader title="Envío de" accent="Formatos" subtitle="Formatos oficiales diarios" />

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 4, height: 28, borderRadius: 'var(--radius-full)', background: listoN ? '#16a34a' : '#94a3b8' }} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>Formato N a Coordinación</div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {loading ? 'Cargando...' : listoN ? 'Completado' : `Reporte del día · ${confirmadasN(fn)}/8 secciones completas`}
              </div>
            </div>
            <div>
              {listoN
                ? <span style={tagListo}><CheckCircle2 size={12} /> Listo</span>
                : <span style={tagPendiente}><CircleDot size={12} /> Pendiente</span>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {listoN && <Link href={`/api/nCoordinacion/generar?fecha=${hoy}`} className="enf-btn" style={linkBtn}><FileDown size={14} /> Descargar Word</Link>}
              <Link href={`/envio-de-formatos/reporte/${hoy}`} className="enf-btn" style={listoN ? linkBtnSecondary : linkBtn}>{listoN ? 'Editar' : 'Completar'} <ChevronRight size={14} /></Link>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 4, height: 28, borderRadius: 'var(--radius-full)', background: listoNov ? '#16a34a' : '#94a3b8' }} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>Parte de Novedades C-4</div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {loading ? 'Cargando...' : listoNov ? 'Completado' : `Reporte del día · ${confirmadasNov(nv)}/11 secciones completas`}
              </div>
            </div>
            <div>
              {listoNov
                ? <span style={tagListo}><CheckCircle2 size={12} /> Listo</span>
                : <span style={tagPendiente}><CircleDot size={12} /> Pendiente</span>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {listoNov && <Link href={`/api/novedades/generar?fecha=${hoy}`} className="enf-btn" style={linkBtn}><FileDown size={14} /> Descargar Word</Link>}
              <Link href={`/envio-de-formatos/novedades/${hoy}`} className="enf-btn" style={listoNov ? linkBtnSecondary : linkBtn}>{listoNov ? 'Editar' : 'Completar'} <ChevronRight size={14} /></Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
