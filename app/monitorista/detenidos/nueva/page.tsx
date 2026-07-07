'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { BuscadorEvento } from '@/components/monitorista/BuscadorEvento'
import React from 'react'

export default function NuevaDetenidoPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tipoEvento, setTipoEvento] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())
    data.tipo_evento = tipoEvento

    try {
      const res = await fetch('/api/monitorista/detenidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const json = await res.json()
      router.push(`/monitorista/detenidos/${json.id}?exito=1`)
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
        <Link href="/monitorista/detenidos" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={14} /> Detenidos</Link>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, marginLeft: 24, color: '#0f172a', textTransform: 'uppercase' }}>Nueva Solicitud</span>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Captura de Datos</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Nuevo Reporte de Detenido</h1>
          <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>⚠ {error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="Nombre del Detenido *" name="nombre_detenido" required />
            <Field label="Folio *" name="folio" required />
          </div>

          <BuscadorEvento value={tipoEvento} onChange={setTipoEvento} />
          <div style={{ display: 'none' }}><input name="tipo_evento" value={tipoEvento} readOnly /></div>
          <Field label="Delitos" name="delitos" as="textarea" />
          <Field label="Falta Administrativa" name="falta_admin" as="textarea" />
          <Field label="Modus Operandi" name="modus_operandi" as="textarea" />

          <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/monitorista/detenidos" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'CREAR SOLICITUD'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

function Field({ label, name, required, placeholder, as }: { label: string; name: string; required?: boolean; placeholder?: string; as?: 'textarea' }) {
  const shared: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', outline: 'none' }
  return (
    <div>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {as === 'textarea'
        ? <textarea name={name} rows={3} style={{ ...shared, resize: 'vertical' }} required={required} placeholder={placeholder} />
        : <input name={name} type="text" style={shared} required={required} placeholder={placeholder} />}
    </div>
  )
}

const btnSecundario: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer', textDecoration: 'none' }
const btnPrimario = (disabled: boolean): React.CSSProperties => ({ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: disabled ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 })
