'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

const PERIODOS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

export default function NuevoFormatoNMediosAlternativosPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<{ msg: string; existenteId?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())
    const payload = {
      fecha: data.fecha as string,
      periodo: data.periodo as string,
      asuntos_canalizados_por_fiscalia: data.asuntos_canalizados_por_fiscalia ? Number(data.asuntos_canalizados_por_fiscalia) : 0,
      acuerdos: data.acuerdos ? Number(data.acuerdos) : 0,
      monto_reparacion_danos: data.monto_reparacion_danos ? Number(data.monto_reparacion_danos) : 0,
    }

    try {
      const res = await fetch('/api/reportes/formato-n-medios-alternativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        if (err.existenteId) setError({ msg: err.error, existenteId: err.existenteId })
        else setError({ msg: err.error || 'Error al guardar' })
        return
      }
      router.push('/formato-n-medios-alternativos')
    } catch (err) {
      setError({ msg: err instanceof Error ? err.message : 'Error al crear' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/formato-n-medios-alternativos" backLabel="Medios Alternativos" title="Nuevo Reporte" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'Inter', fontSize: 12, color: '#dc2626', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>⚠ {error.msg}</div>
            {error.existenteId && (
              <Link href={`/formato-n-medios-alternativos/${error.existenteId}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1f355a', textDecoration: 'underline' }}>
                → Ir a editar el reporte existente
              </Link>
            )}
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#b45309' }}>
          Sin fuente automática — ningún módulo del sistema captura acuerdos/asuntos canalizados hoy. Captura 100% manual.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Medios Alternativos de Solución de Conflictos</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input name="fecha" type="date" required style={inputStyle} defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>
                <div>
                  <Label>Periodo</Label>
                  <select name="periodo" required style={inputStyle} defaultValue="diario">
                    {PERIODOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><Label>Asuntos Canalizados por Fiscalía</Label><input name="asuntos_canalizados_por_fiscalia" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
                <div><Label>Acuerdos</Label><input name="acuerdos" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
                <div><Label>Monto Reparación de Daños</Label><input name="monto_reparacion_danos" type="number" min={0} step="0.01" defaultValue={0} style={inputStyle} /></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-medios-alternativos" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR REPORTE'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
