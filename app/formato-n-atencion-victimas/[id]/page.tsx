'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'

const PERIODOS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

export default function EditarFormatoNAtencionVictimasPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/reportes/formato-n-atencion-victimas/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : '',
          periodo: data.periodo || 'diario',
          numero_atenciones: String(data.numero_atenciones ?? 0),
          atenciones_medicas: String(data.atenciones_medicas ?? 0),
          atenciones_psicologicas: String(data.atenciones_psicologicas ?? 0),
          asesorias_juridicas: String(data.asesorias_juridicas ?? 0),
          observaciones: data.observaciones || '',
        })
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar el reporte'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload = {
      fecha: formData.fecha,
      periodo: formData.periodo,
      numero_atenciones: Number(formData.numero_atenciones ?? 0),
      atenciones_medicas: Number(formData.atenciones_medicas ?? 0),
      atenciones_psicologicas: Number(formData.atenciones_psicologicas ?? 0),
      asesorias_juridicas: Number(formData.asesorias_juridicas ?? 0),
      observaciones: formData.observaciones || null,
    }

    try {
      const res = await fetch(`/api/reportes/formato-n-atencion-victimas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-atencion-victimas')
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
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', background: '#ffffff' }}>
        <Link href="/formato-n-atencion-victimas" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Atención a Víctimas</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Editar Reporte</span>
      </header>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Atención a Víctimas</div>
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
                <div><Label>Número de Atenciones</Label><input type="number" min={0} style={inputStyle} value={formData.numero_atenciones ?? '0'} onChange={e => setFormData(f => ({ ...f, numero_atenciones: e.target.value }))} /></div>
                <div><Label>Atenciones Médicas</Label><input type="number" min={0} style={inputStyle} value={formData.atenciones_medicas ?? '0'} onChange={e => setFormData(f => ({ ...f, atenciones_medicas: e.target.value }))} /></div>
                <div><Label>Atenciones Psicológicas</Label><input type="number" min={0} style={inputStyle} value={formData.atenciones_psicologicas ?? '0'} onChange={e => setFormData(f => ({ ...f, atenciones_psicologicas: e.target.value }))} /></div>
                <div><Label>Asesorías Jurídicas</Label><input type="number" min={0} style={inputStyle} value={formData.asesorias_juridicas ?? '0'} onChange={e => setFormData(f => ({ ...f, asesorias_juridicas: e.target.value }))} /></div>
              </div>
              <div>
                <Label>Observaciones</Label>
                <textarea style={{ ...inputStyle, minHeight: 60 }} value={formData.observaciones || ''} onChange={e => setFormData(f => ({ ...f, observaciones: e.target.value }))} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-atencion-victimas" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
