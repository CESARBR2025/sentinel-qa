'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, Radio, FileText } from 'lucide-react'
import { RondinTabla } from './RondinTabla'
import { FormRondinEscalado } from '@/components/911/radio/FormRondinEscalado'
import type { RondinOficialResumen } from '@/lib/oficial/types'
import type { CatalogosJerarquicos } from '@/lib/911/types'

type View = 'list' | 'form'

export function RondinPageClient({
  rondines,
  catalogos,
  nombreOficial,
  folio,
  folioConsecutivo,
}: {
  rondines: RondinOficialResumen[]
  catalogos: Pick<CatalogosJerarquicos, 'emergencias' | 'subtipos' | 'incidentes' | 'prioridades'>
  nombreOficial: string
  folio: string
  folioConsecutivo: number
}) {
  const [view, setView] = useState<View>('list')

  if (view === 'form') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px' }}>
          <button
            onClick={() => setView('list')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#64748b', fontFamily: 'JetBrains Mono,monospace',
              fontSize: 11, textDecoration: 'none', marginBottom: 24,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <ArrowLeft size={13} /> VOLVER A REPORTES
          </button>

          <div style={{ marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
            <span style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
              color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Radio size={14} /> NUEVO REPORTE
            </span>
            <h1 style={{
              fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800,
              fontSize: 36, margin: '4px 0 0', color: '#0f172a',
              textTransform: 'uppercase',
            }}>
              Reporte de <span style={{ color: '#1f355a' }}>Rondín</span>
            </h1>
          </div>

          <FormRondinEscalado
            catalogos={catalogos}
            backHref="/oficial/rondin"
            nombreOficial={nombreOficial}
            folio={folio}
            folioConsecutivo={folioConsecutivo}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 48px' }}>
        {/* Back link */}
        <a href="/oficial" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#64748b', fontFamily: 'JetBrains Mono,monospace',
          fontSize: 11, textDecoration: 'none', marginBottom: 24,
        }}>
          <ArrowLeft size={13} /> VOLVER AL PANEL
        </a>

        {/* Header */}
        <div style={{ marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Radio size={14} /> RONDÍN
          </span>
          <h1 style={{
            fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800,
            fontSize: 36, margin: '4px 0 0', color: '#0f172a',
            textTransform: 'uppercase',
          }}>
            Reportes de <span style={{ color: '#1f355a' }}>Rondín</span>
          </h1>
        </div>

        {/* Segmented control + action button */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{
              padding: '8px 20px',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: '#ffffff', color: '#0f172a',
              border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'default',
            }}>
              <FileText size={13} />
              Enviados
              <span style={{
                background: '#e2e8f0', color: '#475569',
                padding: '0 6px', fontSize: 10, borderRadius: 2,
                marginLeft: 2,
              }}>
                {rondines.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => setView('form')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#1f355a', color: '#ffffff', border: 'none',
              padding: '10px 22px',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 2,
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(31, 53, 90,0.2)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1c3051' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#1f355a' }}
          >
            <Plus size={15} />
            Nuevo Reporte
          </button>
        </div>

        {/* Table */}
        <div style={{
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <RondinTabla rondines={rondines} />
        </div>
      </div>
    </div>
  )
}
