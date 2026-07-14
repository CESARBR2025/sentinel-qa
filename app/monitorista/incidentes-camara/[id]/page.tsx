'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SubHeader } from '@/components/partials/SubHeader'

const TURNOS = [
  { value: 'MATUTINO', label: 'Primer Turno (07:00 - 15:00 HRS)' },
  { value: 'VESPERTINO', label: 'Segundo Turno (15:00 - 22:00 HRS)' },
  { value: 'NOCTURNO', label: 'Tercer Turno (22:00 - 07:00 HRS)' },
]

const CAMPOS: { label: string; name: string }[] = [
  { label: 'PERSONAS CAPTADAS POR CÁMARA SIN NOVEDAD', name: 'personas_sin_novedad' },
  { label: 'PERSONAS CAPTADAS POR CÁMARA CON ANTECEDENTES', name: 'personas_con_antecedentes' },
  { label: 'VEHÍCULOS CAPTADOS POR CÁMARA MANDADOS A REVISAR', name: 'vehiculos_revisar' },
  { label: 'VEHÍCULOS CAPTADOS POR CÁMARA REVISADOS EN REPUVE', name: 'vehiculos_repuve' },
  { label: 'PERSECUCIONES CAPTADAS POR CÁMARA', name: 'persecuciones' },
  { label: 'ASEGURADOS CAPTADOS VÍA CÁMARA', name: 'asegurados_camara' },
  { label: 'VEHÍCULOS RECUPERADOS POR CÁMARA', name: 'vehiculos_recuperados' },
  { label: 'INCENDIOS CAPTADOS POR CÁMARA', name: 'incendios' },
  { label: 'HECHOS DE TRÁNSITO CAPTADOS POR CÁMARAS', name: 'hechos_transito' },
  { label: 'MOTOS REVISADAS', name: 'motos_revisadas' },
  { label: 'TOTAL PERSONAS REVISADAS', name: 'total_personas_revisadas' },
]

export default function EditarIncidenteCamaraPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/monitorista/incidentes-camara/${id}`)
      .then(r => r.json())
      .then(data => {
        const fd: Record<string, string> = {}
        fd.fecha = data.fecha ? String(data.fecha).slice(0, 10) : ''
        fd.turno = data.turno || 'MATUTINO'
        for (const c of CAMPOS) {
          fd[c.name] = String(data[c.name] ?? 0)
        }
        setFormData(fd)
        setLoading(false)
      })
      .catch(() => { setError('No se pudo cargar el registro'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const payload: Record<string, string | number> = { fecha: formData.fecha, turno: formData.turno }
    for (const c of CAMPOS) {
      payload[c.name] = Number(formData[c.name] ?? 0)
    }

    try {
      const res = await fetch(`/api/monitorista/incidentes-camara/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/monitorista/incidentes-camara?exito=actualizado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#64748b' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap'); @keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <SubHeader backHref="/monitorista/incidentes-camara" backLabel="Incidentes" title="Editar Registro" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 700 }}>Modificar Datos</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Incidentes por Cámara</h1>
          <div style={{ width: 64, height: 3, background: '#1f355a', marginTop: 12 }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, marginBottom: 24 }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Registro de Otros Incidentes que se Captan en Cámara
              </div>
            </div>

            {error && (
              <div style={{ margin: '16px 24px 0', padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input name="fecha" type="date" required style={inputStyle} value={formData.fecha || ''} onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <Label>Turno</Label>
                  <select name="turno" required style={inputStyle} value={formData.turno || 'MATUTINO'} onChange={e => setFormData(f => ({ ...f, turno: e.target.value }))}>
                    {TURNOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ height: 1, background: '#e2e8f0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {CAMPOS.map(c => (
                  <div key={c.name}>
                    <Label>{c.label}</Label>
                    <input name={c.name} type="number" min={0} style={inputStyle} value={formData[c.name] ?? '0'} onChange={e => setFormData(f => ({ ...f, [c.name]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/monitorista/incidentes-camara" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }}>{children}</label>
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }
const btnSecundario: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer', textDecoration: 'none' }
const btnPrimario = (disabled: boolean): React.CSSProperties => ({ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: disabled ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 })
