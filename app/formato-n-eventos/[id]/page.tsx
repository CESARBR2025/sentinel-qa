'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default function EditarFormatoNEventoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/reportes/formato-n-eventos/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : '',
          hora: data.hora || '',
          region: data.region || '',
          evento: data.evento || '',
          ubicacion: data.ubicacion || '',
          descripcion: data.descripcion || '',
          atenciones: data.atenciones || '',
        })
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar el evento'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload = {
      fecha: formData.fecha,
      hora: formData.hora,
      region: formData.region,
      evento: formData.evento,
      ubicacion: formData.ubicacion || null,
      descripcion: formData.descripcion || null,
      atenciones: formData.atenciones || null,
    }

    try {
      const res = await fetch(`/api/reportes/formato-n-eventos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-eventos')
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
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <style>{fontsImport}</style>
            <DashboardHeader roleLabel="Editar Evento" />
      <PageHeader
        title="Editar"
        accent="Evento"
        subtitle="Formato N a Coordinación"
        actions={<PageHeaderLink href="/formato-n-eventos" variant="secondary">← Eventos Informados</PageHeaderLink>}
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Eventos Informados</div>
            </div>
            <div style={sectionBody}>
              <div className="grid-2">
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha || ''} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Hora</Label>
                  <input type="time" required style={inputStyle} value={formData.hora || ''} onChange={e => setFormData(f => ({ ...f, hora: e.target.value }))} />
                </div>
                <div>
                  <Label>Región</Label>
                  <input required style={inputStyle} value={formData.region || ''} onChange={e => setFormData(f => ({ ...f, region: e.target.value }))} />
                </div>
                <div>
                  <Label>Evento</Label>
                  <input required style={inputStyle} value={formData.evento || ''} onChange={e => setFormData(f => ({ ...f, evento: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Ubicación</Label>
                  <input style={inputStyle} value={formData.ubicacion || ''} onChange={e => setFormData(f => ({ ...f, ubicacion: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Descripción</Label>
                  <textarea style={{ ...inputStyle, minHeight: 60 }} value={formData.descripcion || ''} onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Atenciones</Label>
                  <input style={inputStyle} value={formData.atenciones || ''} onChange={e => setFormData(f => ({ ...f, atenciones: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-eventos" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
