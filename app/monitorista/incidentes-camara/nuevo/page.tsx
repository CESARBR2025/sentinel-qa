'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NuevoIncidenteCamaraPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())

    const numerics = [
      'personas_sin_novedad', 'personas_con_antecedentes', 'total_personas_revisadas',
      'vehiculos_revisar', 'vehiculos_repuve', 'motos_revisadas',
      'persecuciones', 'asegurados_camara', 'vehiculos_recuperados', 'incendios', 'hechos_transito',
    ] as const
    const payload: Record<string, string | number> = { fecha: data.fecha }
    for (const k of numerics) {
      payload[k] = data[k] ? Number(data[k]) : 0
    }

    try {
      const res = await fetch('/api/monitorista/incidentes-camara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/monitorista/incidentes-camara')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', background: '#ffffff' }}>
        <Link href="/monitorista/incidentes-camara" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Incidentes</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Nuevo Registro</span>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Captura de Datos</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Nuevo Incidente por Cámara</h1>
          <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>⚠ {error}</div>}

          <div>
            <Label>Fecha</Label>
            <input name="fecha" type="date" required style={inputStyle} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>

          <SectionTitle>Personas</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <NumField label="Personas Captadas por Cámara Sin Novedad" name="personas_sin_novedad" />
            <NumField label="Personas Captadas por Cámara con Antecedentes" name="personas_con_antecedentes" />
            <NumField label="Total Personas Revisadas" name="total_personas_revisadas" />
          </div>

          <SectionTitle>Vehículos</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <NumField label="Vehículos Capturados por Cámara Mandados a Revisar" name="vehiculos_revisar" />
            <NumField label="Vehículos Captados por Cámara Revisados en REPUVE" name="vehiculos_repuve" />
            <NumField label="Motos Revisadas" name="motos_revisadas" />
          </div>

          <SectionTitle>Eventos</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 20 }}>
            <NumField label="Persecuciones Captadas por Cámara" name="persecuciones" />
            <NumField label="Asegurados Captados vía Cámara" name="asegurados_camara" />
            <NumField label="Vehículos Recuperados por Cámara" name="vehiculos_recuperados" />
            <NumField label="Incendios Capturados por Cámara" name="incendios" />
            <NumField label="Hechos de Tránsito Captados por Cámaras" name="hechos_transito" />
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/monitorista/incidentes-camara" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR REGISTRO'}
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>{children}</div>
}

function NumField({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input name={name} type="number" min={0} defaultValue={0} style={inputStyle} />
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }
const btnSecundario: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer', textDecoration: 'none' }
const btnPrimario = (disabled: boolean): React.CSSProperties => ({ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: disabled ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 })
