'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

export default function EditarFormatoNArmaAseguradaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/reportes/formato-n-armas-aseguradas/${id}`)
      .then(r => r.json())
      .then(data => {
        setFormData({
          fecha: data.fecha ? String(data.fecha).slice(0, 10) : '',
          carpeta_investigacion: data.carpeta_investigacion || '',
          tipo_arma: data.tipo_arma || '',
          matricula: data.matricula || '',
          calibre: data.calibre || '',
          observaciones: data.observaciones || '',
        })
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar el registro'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload = {
      fecha: formData.fecha,
      carpeta_investigacion: formData.carpeta_investigacion || null,
      tipo_arma: formData.tipo_arma,
      matricula: formData.matricula || null,
      calibre: formData.calibre || null,
      observaciones: formData.observaciones || null,
    }

    try {
      const res = await fetch(`/api/reportes/formato-n-armas-aseguradas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-armas-aseguradas')
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
      <SubHeader backHref="/formato-n-armas-aseguradas" backLabel="Armas Aseguradas" title="Editar Arma" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Armas de Fuego Aseguradas</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha || ''} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Carpeta de Investigación</Label>
                  <input style={inputStyle} value={formData.carpeta_investigacion || ''} onChange={e => setFormData(f => ({ ...f, carpeta_investigacion: e.target.value }))} />
                </div>
                <div>
                  <Label>Tipo de Arma</Label>
                  <input required style={inputStyle} value={formData.tipo_arma || ''} onChange={e => setFormData(f => ({ ...f, tipo_arma: e.target.value }))} />
                </div>
                <div>
                  <Label>Matrícula</Label>
                  <input style={inputStyle} value={formData.matricula || ''} onChange={e => setFormData(f => ({ ...f, matricula: e.target.value }))} />
                </div>
                <div>
                  <Label>Calibre</Label>
                  <input style={inputStyle} value={formData.calibre || ''} onChange={e => setFormData(f => ({ ...f, calibre: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Observaciones</Label>
                  <textarea style={{ ...inputStyle, minHeight: 60 }} value={formData.observaciones || ''} onChange={e => setFormData(f => ({ ...f, observaciones: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-armas-aseguradas" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
