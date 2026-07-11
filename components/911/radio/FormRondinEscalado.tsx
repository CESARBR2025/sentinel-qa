'use client'

import { useState } from 'react'
import { createRondinEscalado } from '@/lib/incidentes/actions'
import { ArrowLeft, MapPin, Radio, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface CatalogoItem { id: number; nombre: string }

interface Props {
  catalogos: {
    emergencias: CatalogoItem[]
    incidentes: CatalogoItem[]
    prioridades: CatalogoItem[]
  }
  backHref: string
  nombreOficialDefault?: string
}

function ahoraLocal(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function FormRondinEscalado({ catalogos, backHref, nombreOficialDefault }: Props) {
  const [anonimo, setAnonimo] = useState(true)
  const [enviando, setEnviando] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 48px' }}>

        <Link href={backHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, textDecoration: 'none', marginBottom: 16 }}>
          <ArrowLeft size={14} /> Volver
        </Link>

        <div style={{ marginBottom: 28 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={12} /> Rondín · Escala a Despacho
          </span>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 30, textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a' }}>
            REPORTE DE <span style={{ color: '#2563eb' }}>RONDÍN</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#64748b', margin: '8px 0 0 0', lineHeight: 1.5 }}>
            Este reporte genera una <strong>solicitud de despacho</strong>. Despacho asignará unidades y el oficial en sitio capturará el resultado al cerrar.
          </p>
        </div>

        <form
          action={createRondinEscalado}
          onSubmit={() => setEnviando(true)}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <input type="hidden" name="anonimo" value={String(anonimo)} />

          {/* Origen */}
          <Seccion titulo="Origen">
            <Campo label="Oficial que reporta" requerido>
              <input name="nombreOficial" required defaultValue={nombreOficialDefault ?? ''} placeholder="Nombre del oficial en rondín" style={inputStyle} />
            </Campo>
            <Campo label="¿Reportante anónimo?">
              <select value={String(anonimo)} onChange={e => setAnonimo(e.target.value === 'true')} style={inputStyle}>
                <option value="true">Sí — sin reportante</option>
                <option value="false">No — capturar nombre</option>
              </select>
            </Campo>
            {!anonimo && (
              <Campo label="Nombre del reportante">
                <input name="nombreReportante" placeholder="Nombre completo" style={inputStyle} />
              </Campo>
            )}
          </Seccion>

          {/* Avistamiento */}
          <Seccion titulo="Avistamiento">
            <Campo label="Tipo de emergencia" requerido>
              <select name="tipoEmergenciaId" required style={inputStyle}>
                {catalogos.emergencias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Tipo de incidente" requerido>
              <select name="tipoIncidenteId" required style={inputStyle}>
                {catalogos.incidentes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Prioridad" requerido>
              <select name="prioridadId" required style={inputStyle}>
                {catalogos.prioridades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Fecha y hora del avistamiento" requerido>
              <input name="fechaHoraInicio" type="datetime-local" required defaultValue={ahoraLocal()} style={inputStyle} />
            </Campo>
            <Campo label="Descripción de lo observado" requerido ancho>
              <textarea name="descripcion" required rows={3} placeholder="¿Qué se observó durante el rondín?" style={{ ...inputStyle, resize: 'vertical' }} />
            </Campo>
            <Campo label="Observaciones adicionales" ancho>
              <textarea name="observaciones" rows={2} placeholder="Opcional" style={{ ...inputStyle, resize: 'vertical' }} />
            </Campo>
          </Seccion>

          {/* Ubicación */}
          <Seccion titulo="Ubicación">
            <Campo label="Calle" requerido>
              <input name="calle" required placeholder="Calle" style={inputStyle} />
            </Campo>
            <Campo label="Colonia">
              <input name="colonia" placeholder="Colonia" style={inputStyle} />
            </Campo>
            <Campo label="Entre calles">
              <input name="entreCalles" placeholder="Calle A y Calle B" style={inputStyle} />
            </Campo>
            <Campo label="Referencia">
              <input name="referenciaUbicacion" placeholder="Ej. frente a la tienda…" style={inputStyle} />
            </Campo>
          </Seccion>

          <button type="submit" disabled={enviando}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', background: enviando ? '#93c5fd' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: 2, cursor: enviando ? 'wait' : 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Send size={15} /> {enviando ? 'ESCALANDO…' : 'ESCALAR A DESPACHO'}
          </button>
        </form>
      </main>
    </div>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '20px 24px' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin size={14} color="#2563eb" /> {titulo}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {children}
      </div>
    </div>
  )
}

function Campo({ label, requerido, ancho, children }: { label: string; requerido?: boolean; ancho?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: ancho ? '1 / -1' : undefined }}>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}{requerido && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'Inter', fontSize: 13, padding: '9px 12px',
  border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb',
  borderRadius: 2, background: '#ffffff', color: '#1e293b', outline: 'none', width: '100%',
}
