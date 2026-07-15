'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

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

export default function EditarFormatoNFgrPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/reportes/formato-n-fgr/${id}`)
      .then(r => r.json())
      .then(data => {
        const fd: Record<string, string> = {}
        fd.fecha = data.fecha ? String(data.fecha).slice(0, 10) : ''
        fd.periodo = data.periodo || 'diario'
        for (const c of CAMPOS) fd[c.name] = String(data[c.name] ?? 0)
        setFormData(fd)
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar el reporte'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload: Record<string, string | number> = { fecha: formData.fecha, periodo: formData.periodo }
    for (const c of CAMPOS) payload[c.name] = Number(formData[c.name] ?? 0)

    try {
      const res = await fetch(`/api/reportes/formato-n-fgr/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-fgr')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#64748b' }} />
      </div>
    )
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/formato-n-fgr" backLabel="Eventos FGR" title="Editar Reporte" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Eventos Informados por la Fiscalía General de la República (FGR)</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha || ''} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Periodo</Label>
                  <select required style={inputStyle} value={formData.periodo || 'diario'} onChange={e => setFormData(f => ({ ...f, periodo: e.target.value }))}>
                    {PERIODOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {CAMPOS.map(c => (
                  <div key={c.name}>
                    <Label>{c.label}</Label>
                    <input type="number" min={0} style={inputStyle} value={formData[c.name] ?? '0'} onChange={e => setFormData(f => ({ ...f, [c.name]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-fgr" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
