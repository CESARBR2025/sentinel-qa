'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'

export default function EditarFormatoNRndPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/reportes/formato-n-rnd/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : '',
          hora_detencion: data.hora_detencion || '',
          delito: data.delito || '',
          autoridad_que_realizo_detencion: data.autoridad_que_realizo_detencion || '',
          folio: data.folio || '',
        })
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar la inscripción'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload = {
      fecha: formData.fecha,
      hora_detencion: formData.hora_detencion,
      delito: formData.delito,
      autoridad_que_realizo_detencion: formData.autoridad_que_realizo_detencion,
      folio: formData.folio,
    }

    try {
      const res = await fetch(`/api/reportes/formato-n-rnd/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-rnd')
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
        <Link href="/formato-n-rnd" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Registro Nacional de Detenciones</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Editar Inscripción</span>
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
              <div style={sectionTitleStyle}>Inscripciones en el Registro Nacional de Detenciones</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha || ''} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Hora de Detención</Label>
                  <input type="time" required style={inputStyle} value={formData.hora_detencion || ''} onChange={e => setFormData(f => ({ ...f, hora_detencion: e.target.value }))} />
                </div>
                <div>
                  <Label>Folio</Label>
                  <input required style={inputStyle} value={formData.folio || ''} onChange={e => setFormData(f => ({ ...f, folio: e.target.value }))} />
                </div>
                <div>
                  <Label>Delito</Label>
                  <input required style={inputStyle} value={formData.delito || ''} onChange={e => setFormData(f => ({ ...f, delito: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Autoridad que Realizó la Detención</Label>
                  <input required style={inputStyle} value={formData.autoridad_que_realizo_detencion || ''} onChange={e => setFormData(f => ({ ...f, autoridad_que_realizo_detencion: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-rnd" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
