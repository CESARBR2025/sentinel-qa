'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Calculator } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, btnTiny, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

const PERIODOS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

const CAMPOS_CALCULABLES: { label: string; name: string }[] = [
  { label: 'Carpetas Iniciadas', name: 'carpetas_iniciadas' },
  { label: 'Número de Cateos', name: 'numero_cateos' },
  { label: 'Vehículos Asegurados', name: 'vehiculos_asegurados' },
  { label: 'Domicilios Cateados', name: 'domicilios_cateados' },
  { label: 'Personas Aseguradas', name: 'personas_aseguradas' },
  { label: 'Aprehensiones', name: 'aprehensiones' },
]

const CAMPOS_MANUALES: { label: string; name: string }[] = [
  { label: 'Audiencias Iniciales', name: 'audiencias_iniciales' },
  { label: 'Abreviados', name: 'abreviados' },
  { label: 'Audiencias Intermedias', name: 'audiencias_intermedias' },
]

export default function NuevoFormatoNFgePage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [calculando, setCalculando] = useState(false)
  const [error, setError] = useState<{ msg: string; existenteId?: string } | null>(null)

  const [formData, setFormData] = useState<Record<string, string>>({
    fecha: new Date().toISOString().slice(0, 10),
    periodo: 'diario',
    carpetas_iniciadas: '0', numero_cateos: '0', vehiculos_asegurados: '0', domicilios_cateados: '0',
    personas_aseguradas: '0', aprehensiones: '0', audiencias_iniciales: '0', abreviados: '0', audiencias_intermedias: '0',
  })

  async function calcularDeReportes() {
    setCalculando(true)
    try {
      const res = await fetch(`/api/reportes/formato-n-fge/calcular?fecha=${formData.fecha}`)
      const conteos = await res.json()
      setFormData(f => ({
        ...f,
        carpetas_iniciadas: String(conteos.carpetas_iniciadas ?? 0),
        numero_cateos: String(conteos.numero_cateos ?? 0),
        vehiculos_asegurados: String(conteos.vehiculos_asegurados ?? 0),
        domicilios_cateados: String(conteos.domicilios_cateados ?? 0),
        personas_aseguradas: String(conteos.personas_aseguradas ?? 0),
        aprehensiones: String(conteos.aprehensiones ?? 0),
      }))
    } finally {
      setCalculando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload: Record<string, string | number> = { fecha: formData.fecha, periodo: formData.periodo }
    for (const c of [...CAMPOS_CALCULABLES, ...CAMPOS_MANUALES]) payload[c.name] = Number(formData[c.name] ?? 0)

    try {
      const res = await fetch('/api/reportes/formato-n-fge', {
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
      router.push('/formato-n-fge')
    } catch (err) {
      setError({ msg: err instanceof Error ? err.message : 'Error al crear' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/formato-n-fge" backLabel="Eventos FGE" title="Nuevo Reporte" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'Inter', fontSize: 12, color: '#dc2626', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>⚠ {error.msg}</div>
            {error.existenteId && (
              <Link href={`/formato-n-fge/${error.existenteId}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#2563eb', textDecoration: 'underline' }}>
                → Ir a editar el reporte existente
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Eventos Informados por la Fiscalía General del Estado (FGE)</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Periodo</Label>
                  <select required style={inputStyle} value={formData.periodo} onChange={e => setFormData(f => ({ ...f, periodo: e.target.value }))}>
                    {PERIODOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Conteos de cateos, vehículos y detenciones ya capturados ese día
                </div>
                <button type="button" style={btnTiny} onClick={calcularDeReportes} disabled={calculando}>
                  <Calculator size={12} /> {calculando ? 'CALCULANDO...' : 'CALCULAR DE REPORTES'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {CAMPOS_CALCULABLES.map(c => (
                  <div key={c.name}>
                    <Label>{c.label}</Label>
                    <input type="number" min={0} style={inputStyle} value={formData[c.name] ?? '0'} onChange={e => setFormData(f => ({ ...f, [c.name]: e.target.value }))} />
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: '#e2e8f0' }} />

              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                  Sin fuente automática — captura manual (etapas de juzgado, no registradas en el sistema)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {CAMPOS_MANUALES.map(c => (
                    <div key={c.name}>
                      <Label>{c.label}</Label>
                      <input type="number" min={0} style={inputStyle} value={formData[c.name] ?? '0'} onChange={e => setFormData(f => ({ ...f, [c.name]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-fge" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR REPORTE'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
