'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { btnPrimario, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap } from '@/components/reportes/form-styles'
import { StepIndicator } from '@/components/partials/StepIndicator'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { useNovedadesStore, SECCIONES_STEPPER } from '@/lib/novedades/store'
import type { SeccionKey } from '@/lib/novedades/types'
import { PasoPeriodo, PasoResumen, PasoSubsecretaria, PasoAnalisis, PasoC4, PasoTransito, PasoPrevencion, PasoDelictivos, PasoOperativos, PasoResumenNovedades, PasoFuerza } from '@/features/novedades/components/pasos'

export default function NovedadesReportePage({ params }: { params: Promise<{ fecha: string }> }) {
  const router = useRouter()
  const fecha = useNovedadesStore(s => s.fecha)
  const paso = useNovedadesStore(s => s.paso)
  const loading = useNovedadesStore(s => s.loading)
  const guardando = useNovedadesStore(s => s.guardando)
  const error = useNovedadesStore(s => s.error)
  const msg = useNovedadesStore(s => s.msg)
  const estatus = useNovedadesStore(s => s.estatus)
  const cargar = useNovedadesStore(s => s.cargar)
  const setPaso = useNovedadesStore(s => s.setPaso)
  const setError = useNovedadesStore(s => s.setError)
  const confirmada = useNovedadesStore(s => s.confirmada)
  const avanzar = useNovedadesStore(s => s.avanzar)

  useEffect(() => {
    ;(async () => {
      const { fecha: f } = await params
      cargar(f)
    })()
  }, [params, cargar])

  if (loading) return <Cargando />
  if (error) return <Cargando msg={error} />

  const seccion = SECCIONES_STEPPER[paso]
  const esUltimo = paso === SECCIONES_STEPPER.length - 1
  const todasConfirmadas = SECCIONES_STEPPER.every(s => confirmada(s.key))

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <DashboardHeader roleLabel={`Novedades ${fecha}`} backHref="/envio-de-formatos/novedades" backLabel="Consolidado Novedades" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Parte de Novedades"
          accent={fecha}
          subtitle="Centro de Control C-4 · ventana 06:00 a 06:00"
        />

        <StepIndicator paso={paso + 1} total={SECCIONES_STEPPER.length} nombre={seccion.titulo} />

        {msg && (
          <div style={{ padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#047857', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} /> {msg}
          </div>
        )}

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#dc2626' }}>
            {error}
          </div>
        )}

        <PasoView key={seccion.key} seccion={seccion.key} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button
            type="button"
            disabled={paso === 0 || guardando}
            onClick={() => setPaso(paso - 1)}
            style={{ ...btnPrimario(paso === 0), background: paso === 0 ? '#94a3b8' : '#f1f5f9', color: paso === 0 ? '#fff' : '#0f172a', border: paso === 0 ? 'none' : '1px solid #e2e8f0' }}
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <button type="button" disabled={guardando} onClick={() => { setError(''); avanzar(seccion.key) }} style={btnPrimario(guardando)}>
            {guardando ? 'Guardando...' : esUltimo ? 'Finalizar reporte' : <>Siguiente <ChevronRight size={14} /></>}
          </button>
        </div>

        {esUltimo && todasConfirmadas && estatus && (
          <div style={{ padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 18, fontWeight: 600, color: '#047857', letterSpacing: 'normal', textTransform: 'none' }}>Reporte completo</div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#166534' }}>Las 11 secciones están confirmadas. Puedes descargar el documento oficial.</div>
            </div>
            <a href={`/api/novedades/generar?fecha=${fecha}`} style={{ ...btnPrimario(false), textDecoration: 'none' }}>
              <Download size={14} /> Descargar reporte
            </a>
            <button type="button" onClick={() => router.push('/envio-de-formatos/novedades')} style={{ ...btnPrimario(false), background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}>
              Ir al consolidado
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function Cargando({ msg }: { msg?: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>
      {msg ?? 'Cargando reporte...'}
    </div>
  )
}

function PasoView({ seccion }: { seccion: SeccionKey }) {
  switch (seccion) {
    case 'periodo': return <PasoPeriodo />
    case 'resumen': return <PasoResumen />
    case 'subsecretaria': return <PasoSubsecretaria />
    case 'analisis': return <PasoAnalisis />
    case 'c4': return <PasoC4 />
    case 'transito': return <PasoTransito />
    case 'prevencion': return <PasoPrevencion />
    case 'delictivos': return <PasoDelictivos />
    case 'operativos': return <PasoOperativos />
    case 'resumen_nov': return <PasoResumenNovedades />
    case 'fuerza': return <PasoFuerza />
  }
}

export { sectionCard, sectionHeader, sectionTitleStyle, sectionBody }
