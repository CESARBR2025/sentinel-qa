'use client'

import { useRef, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createRondinEscalado } from '@/lib/incidentes/actions'
import { ArrowLeft, MapPin, Radio, Crosshair, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useRondinFormStore } from '@/stores/useRondinFormStore'

interface CatalogoItem { id: number; nombre: string }

interface Props {
  catalogos: {
    emergencias: CatalogoItem[]
    incidentes: CatalogoItem[]
    prioridades: CatalogoItem[]
  }
  backHref: string
  nombreOficial?: string
  folio: string
  folioConsecutivo: number
}

function ahoraLocal(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function FormRondinEscalado({ catalogos, backHref, nombreOficial, folio, folioConsecutivo }: Props) {
  const anonimo = useRondinFormStore((s) => s.anonimo)
  const obteniendoUbicacion = useRondinFormStore((s) => s.obteniendoUbicacion)
  const errorUbicacion = useRondinFormStore((s) => s.errorUbicacion)
  const mapsReady = useRondinFormStore((s) => s.mapsReady)
  const setAnonimo = useRondinFormStore((s) => s.setAnonimo)
  const setObteniendoUbicacion = useRondinFormStore((s) => s.setObteniendoUbicacion)
  const setErrorUbicacion = useRondinFormStore((s) => s.setErrorUbicacion)
  const setMapsReady = useRondinFormStore((s) => s.setMapsReady)

  const calleRef = useRef<HTMLInputElement>(null)
  const coloniaRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
      setMapsReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.onload = () => setMapsReady(true)
    document.head.appendChild(script)
  }, [setMapsReady])

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setErrorUbicacion('Geolocalización no disponible en este navegador')
      return
    }
    setObteniendoUbicacion(true)
    setErrorUbicacion(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        const latInput = document.querySelector<HTMLInputElement>('input[name="latitud"]')
        const lngInput = document.querySelector<HTMLInputElement>('input[name="longitud"]')
        if (latInput) latInput.value = String(latitude)
        if (lngInput) lngInput.value = String(longitude)

        if (mapsReady && window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              let calle = ''
              let colonia = ''
              for (const comp of results[0].address_components ?? []) {
                if (comp.types.includes('route')) calle = comp.long_name
                if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) colonia = comp.long_name
              }
              if (calle && calleRef.current) { calleRef.current.value = calle }
              if (colonia && coloniaRef.current) { coloniaRef.current.value = colonia }
            }
            setObteniendoUbicacion(false)
          })
        } else {
          setObteniendoUbicacion(false)
        }
      },
      (err) => {
        setErrorUbicacion(err.code === 1 ? 'Permiso de ubicación denegado' : 'No se pudo obtener la ubicación')
        setObteniendoUbicacion(false)
      },
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }

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

        <form action={createRondinEscalado} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <input type="hidden" name="anonimo" value={String(anonimo)} />
          <input type="hidden" name="latitud" />
          <input type="hidden" name="longitud" />
          <input type="hidden" name="folio" value={folio} />
          <input type="hidden" name="folioConsecutivo" value={folioConsecutivo} />

          {/* Origen */}
          <Seccion titulo="Origen">
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, padding: '6px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2, color: '#1d4ed8' }}>
                <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>FOLIO</span>
                <span style={{ fontWeight: 700 }}>{folio}</span>
              </div>
            </div>
            {nombreOficial ? (
              <>
                <input type="hidden" name="nombreOficial" value={nombreOficial} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                      Reporta: {nombreOficial}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#16a34a', marginLeft: 'auto' }}>
                      OFICIAL EN RONDÍN
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <Campo label="Oficial que reporta" requerido>
                <input name="nombreOficial" required placeholder="Nombre del oficial en rondín" style={inputStyle} />
              </Campo>
            )}
            <Campo label="¿Reportante anónimo?">
              <select value={String(anonimo)} onChange={(e) => setAnonimo(e.target.value === 'true')} style={inputStyle}>
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
                {catalogos.emergencias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Tipo de incidente" requerido>
              <select name="tipoIncidenteId" required style={inputStyle}>
                {catalogos.incidentes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Prioridad" requerido>
              <select name="prioridadId" required style={inputStyle}>
                {catalogos.prioridades.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
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
              <input ref={calleRef} name="calle" required placeholder="Calle" style={inputStyle} />
            </Campo>
            <Campo label="Colonia">
              <input ref={coloniaRef} name="colonia" placeholder="Colonia" style={inputStyle} />
            </Campo>
            <Campo label="Entre calles">
              <input name="entreCalles" placeholder="Calle A y Calle B" style={inputStyle} />
            </Campo>
            <Campo label="Referencia">
              <input name="referenciaUbicacion" placeholder="Ej. frente a la tienda…" style={inputStyle} />
            </Campo>
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button type="button" onClick={obtenerUbicacion} disabled={obteniendoUbicacion}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 18px', background: obteniendoUbicacion ? '#e2e8f0' : '#f8fafc', color: obteniendoUbicacion ? '#94a3b8' : '#2563eb', border: `1px solid ${obteniendoUbicacion ? '#e2e8f0' : '#2563eb'}`, borderRadius: 2, cursor: obteniendoUbicacion ? 'wait' : 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all .15s' }}>
                {obteniendoUbicacion ? <Loader2 size={14} /> : <Crosshair size={14} />}
                {obteniendoUbicacion ? 'OBTENIENDO UBICACIÓN…' : 'OBTENER UBICACIÓN ACTUAL'}
              </button>
              {errorUbicacion && (
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#dc2626' }}>{errorUbicacion}</div>
              )}
            </div>
          </Seccion>

          <SubmitButton />
        </form>
      </main>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', background: pending ? '#93c5fd' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending ? 'wait' : 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {pending ? <><Loader2 size={15} /> ESCALANDO…</> : <><MapPin size={15} /> ESCALAR A DESPACHO</>}
    </button>
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
