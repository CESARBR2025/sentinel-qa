'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

const PERIODOS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

export default function NuevoFormatoNAtencionVictimasPage() {
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
      numero_atenciones: data.numero_atenciones ? Number(data.numero_atenciones) : 0,
      atenciones_medicas: data.atenciones_medicas ? Number(data.atenciones_medicas) : 0,
      atenciones_psicologicas: data.atenciones_psicologicas ? Number(data.atenciones_psicologicas) : 0,
      asesorias_juridicas: data.asesorias_juridicas ? Number(data.asesorias_juridicas) : 0,
      observaciones: (data.observaciones as string) || null,
    }

    try {
      const res = await fetch('/api/reportes/formato-n-atencion-victimas', {
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
      router.push('/formato-n-atencion-victimas')
    } catch (err) {
      setError({ msg: err instanceof Error ? err.message : 'Error al crear' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <style>{fontsImport}</style>
            <DashboardHeader roleLabel="Nuevo Reporte" />
      <PageHeader
        title="Nuevo"
        accent="Reporte"
        subtitle="Formato N a Coordinación"
        actions={<PageHeaderLink href="/formato-n-atencion-victimas" variant="secondary">← Atención a Víctimas</PageHeaderLink>}
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'Inter', fontSize: 12, color: '#dc2626', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>⚠ {error.msg}</div>
            {error.existenteId && (
              <Link href={`/formato-n-atencion-victimas/${error.existenteId}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1f355a', textDecoration: 'underline' }}>
                → Ir a editar el reporte existente
              </Link>
            )}
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#b45309' }}>
          Sin fuente automática — ningún módulo del sistema captura atenciones médicas/psicológicas/jurídicas hoy. Captura 100% manual.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Atención a Víctimas</div>
            </div>
            <div style={sectionBody}>
              <div className="grid-2">
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
              <div className="grid-2">
                <div><Label>Número de Atenciones</Label><input name="numero_atenciones" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
                <div><Label>Atenciones Médicas</Label><input name="atenciones_medicas" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
                <div><Label>Atenciones Psicológicas</Label><input name="atenciones_psicologicas" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
                <div><Label>Asesorías Jurídicas</Label><input name="asesorias_juridicas" type="number" min={0} defaultValue={0} style={inputStyle} /></div>
              </div>
              <div>
                <Label>Observaciones</Label>
                <textarea name="observaciones" style={{ ...inputStyle, minHeight: 60 }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-atencion-victimas" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR REPORTE'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
