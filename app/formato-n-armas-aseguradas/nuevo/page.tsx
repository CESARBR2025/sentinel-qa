'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { inputStyle, btnSecundario, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

export default function NuevaFormatoNArmaAseguradaPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())
    const payload = {
      fecha: data.fecha as string,
      carpeta_investigacion: (data.carpeta_investigacion as string) || null,
      tipo_arma: data.tipo_arma as string,
      matricula: (data.matricula as string) || null,
      calibre: (data.calibre as string) || null,
      observaciones: (data.observaciones as string) || null,
    }

    try {
      const res = await fetch('/api/reportes/formato-n-armas-aseguradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      router.push('/formato-n-armas-aseguradas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/formato-n-armas-aseguradas" backLabel="Armas Aseguradas" title="Nueva Arma" />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
        {error && (
          <div style={{ marginBottom: 24, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#dc2626' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#b45309' }}>
          Sin fuente automática — el registro de armas ya capturado (reportes de campo) no guarda tipo de arma, matrícula ni calibre. Captura 100% manual.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div style={sectionTitleStyle}>Armas de Fuego Aseguradas</div>
            </div>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <Label>Fecha</Label>
                  <input name="fecha" type="date" required style={inputStyle} defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>
                <div>
                  <Label>Carpeta de Investigación</Label>
                  <input name="carpeta_investigacion" style={inputStyle} />
                </div>
                <div>
                  <Label>Tipo de Arma</Label>
                  <input name="tipo_arma" required style={inputStyle} />
                </div>
                <div>
                  <Label>Matrícula</Label>
                  <input name="matricula" style={inputStyle} />
                </div>
                <div>
                  <Label>Calibre</Label>
                  <input name="calibre" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Observaciones</Label>
                  <textarea name="observaciones" style={{ ...inputStyle, minHeight: 60 }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link href="/formato-n-armas-aseguradas" style={btnSecundario}>Cancelar</Link>
            <button type="submit" disabled={pending} style={btnPrimario(pending)}>
              <Save size={14} /> {pending ? 'GUARDANDO...' : 'GUARDAR ARMA'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
