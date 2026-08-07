import { PageHeader } from '@/components/partials/PageHeader'
import { SegmentPage } from '@/components/partials/SegmentPage'
import { Panel911 } from '@/components/911/kpi-generales/Panel911'
import { Gauge } from 'lucide-react'

export default async function KpisPage({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const { seccion = 'sspm' } = await searchParams

  return (
    <div>
      <PageHeader
        title="KPIs Generales"
        accent="SSPM"
        subtitle="Indicadores operativos por área · 911"
      />

      <SegmentPage
        tabs={[
          { key: 'sspm', label: 'SSPM', href: '/dashboard/kpis?seccion=sspm' },
          { key: 'infracciones', label: 'Infracciones', href: '/dashboard/kpis?seccion=infracciones' },
        ]}
        activeKey={seccion}
      />

      {seccion === 'sspm' && <SeccionSspm />}
      {seccion === 'infracciones' && <SeccionInfraccionesPlaceholder />}
    </div>
  )
}

function SeccionSspm() {
  return (
    <div style={{ marginTop: 24 }}>
      <Panel911 />
    </div>
  )
}

function SeccionInfraccionesPlaceholder() {
  return (
    <div style={{
      marginTop: 24, padding: '48px 24px', textAlign: 'center',
      background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid var(--apple-glass-border)', borderRadius: 'var(--radius-xl)',
      fontFamily: 'var(--apple-font-display)',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, maxWidth: 320, margin: '0 auto',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-full)',
          background: 'rgba(31, 53, 90, 0.08)', color: '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Gauge size={22} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Infracciones</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Este módulo está en preparación. Próximamente encontrarás aquí los indicadores operativos de infracciones de tránsito.
        </div>
      </div>
    </div>
  )
}
