'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'

const PERIODOS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

const CAMPOS: { label: string; name: string }[] = [
  { label: 'Carpetas Iniciadas', name: 'carpetas_iniciadas' },
  { label: 'Número de Cateos', name: 'numero_cateos' },
  { label: 'Vehículos Asegurados', name: 'vehiculos_asegurados' },
  { label: 'Domicilios Cateados', name: 'domicilios_cateados' },
  { label: 'Personas Aseguradas', name: 'personas_aseguradas' },
  { label: 'Aprehensiones', name: 'aprehensiones' },
  { label: 'Audiencias Iniciales', name: 'audiencias_iniciales' },
  { label: 'Abreviados', name: 'abreviados' },
  { label: 'Audiencias Intermedias', name: 'audiencias_intermedias' },
]

export default function NuevoFormatoNFgrPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<{ msg: string; existenteId?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())
    const payload: Record<string, string | number> = { fecha: data.fecha as string, periodo: data.periodo as string }
    for (const c of CAMPOS) payload[c.name] = data[c.name] ? Number(data[c.name]) : 0

    try {
      const res = await fetch('/api/reportes/formato-n-fgr', {
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
      router.push('/formato-n-fgr')
    } catch (err) {
      setError({ msg: err instanceof Error ? err.message : 'Error al crear' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', background: '#ffffff' }}>
        <Link href="/formato-n-fgr" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Eventos FGR</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Nuevo Reporte</span>
      </header>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'Inter', fontSize: 12, color: '#dc2626', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>⚠ {error.msg}</div>
            {error.existenteId && (
              <Link href={`/formato-n-fgr/${error.existenteId}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#2563eb', textDecoration: 'underline' }}>
                → Ir a editar el reporte existente
              </Link>
            )}
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#b45309' }}>
          Sin fuente automática — el sistema no distingue casos canalizados a Fiscalía Federal (solo existe catálogo de Fiscalía del Estado). Captura 100% manual.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Eventos Informados por la Fiscalía General de la República (FGR)</div>
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
                {CAMPOS.map(c => (
                  <div key={c.name}>
                    <Label>{c.label}</Label>
                    <input name={c.name} type="number" min={0} defaultValue={0} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-fgr" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR REPORTE'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
