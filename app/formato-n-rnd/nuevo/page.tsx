'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, btnTiny, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'

interface FuenteDetencion {
  id: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
}

export default function NuevoFormatoNRndPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Record<string, string>>({
    fecha: new Date().toISOString().slice(0, 10),
    hora_detencion: '', delito: '', autoridad_que_realizo_detencion: '', folio: '',
  })

  const [fuenteFecha, setFuenteFecha] = useState(formData.fecha)
  const [fuenteResultados, setFuenteResultados] = useState<FuenteDetencion[] | null>(null)
  const [fuenteLoading, setFuenteLoading] = useState(false)

  async function buscarFuente() {
    setFuenteLoading(true)
    try {
      const res = await fetch(`/api/reportes/formato-n-rnd/fuente?fecha=${fuenteFecha}`)
      const data = await res.json()
      setFuenteResultados(data)
    } finally {
      setFuenteLoading(false)
    }
  }

  function usarCandidato(c: FuenteDetencion) {
    setFormData(f => ({
      ...f,
      fecha: fuenteFecha,
      hora_detencion: c.hora_detencion,
      delito: c.delito,
      autoridad_que_realizo_detencion: c.autoridad_que_realizo_detencion,
      folio: c.folio,
    }))
  }

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
      const res = await fetch('/api/reportes/formato-n-rnd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-rnd')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', background: '#ffffff' }}>
        <Link href="/formato-n-rnd" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Registro Nacional de Detenciones</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Nueva Inscripción</span>
      </header>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <div style={sectionCard}>
          <div style={sectionHeader}>
            <div style={sectionTitleStyle}>Cargar desde Detenciones Registradas (evitar duplicar)</div>
          </div>
          <div style={sectionBody}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Label>Fecha a buscar</Label>
                <input type="date" style={inputStyle} value={fuenteFecha} onChange={e => setFuenteFecha(e.target.value)} />
              </div>
              <button type="button" style={btnTiny} onClick={buscarFuente} disabled={fuenteLoading}>
                <Search size={12} /> {fuenteLoading ? 'BUSCANDO...' : 'BUSCAR'}
              </button>
            </div>
            {fuenteResultados !== null && (
              fuenteResultados.length === 0 ? (
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8' }}>No hay detenciones registradas esa fecha.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {fuenteResultados.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b' }}>
                        <strong>{c.hora_detencion || '—'}</strong> — {c.delito || 'Sin delito'} {c.folio ? `· Folio ${c.folio}` : ''}
                      </div>
                      <button type="button" style={btnTiny} onClick={() => usarCandidato(c)}>USAR</button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Inscripciones en el Registro Nacional de Detenciones</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input type="date" required style={inputStyle} value={formData.fecha} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Hora de Detención</Label>
                  <input type="time" required style={inputStyle} value={formData.hora_detencion} onChange={e => setFormData(f => ({ ...f, hora_detencion: e.target.value }))} />
                </div>
                <div>
                  <Label>Folio</Label>
                  <input required style={inputStyle} value={formData.folio} onChange={e => setFormData(f => ({ ...f, folio: e.target.value }))} />
                </div>
                <div>
                  <Label>Delito</Label>
                  <input required style={inputStyle} value={formData.delito} onChange={e => setFormData(f => ({ ...f, delito: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Autoridad que Realizó la Detención</Label>
                  <input required style={inputStyle} value={formData.autoridad_que_realizo_detencion} onChange={e => setFormData(f => ({ ...f, autoridad_que_realizo_detencion: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-rnd" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR INSCRIPCIÓN'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
