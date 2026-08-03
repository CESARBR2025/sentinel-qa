'use client'

import { useRef, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createRondinEscalado } from '@/lib/incidentes/actions'
import { ArrowLeft, Plus, FileText, MapPin, Crosshair, Loader2 } from 'lucide-react'
import React from 'react'
import { RondinTabla } from './RondinTabla'
import { useRondinFormStore } from '@/stores/useRondinFormStore'
import { loadGoogleMaps } from '@/lib/maps/loadGoogleMaps'
import GoogleMapPicker from '@/components/maps/GoogleMapPicker'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import type { RondinOficialResumen } from '@/lib/oficial/types'
import type { CatalogosJerarquicos } from '@/lib/911/types'

type View = 'list' | 'form'

function ahoraLocal(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function RondinPageClient({
  rondines,
  catalogos,
  nombreOficial,
  folio,
  folioConsecutivo,
  folioNuevo,
}: {
  rondines: RondinOficialResumen[]
  catalogos: Pick<CatalogosJerarquicos, 'emergencias' | 'subtipos' | 'incidentes' | 'prioridades'>
  nombreOficial: string
  folio: string
  folioConsecutivo: number
  folioNuevo?: string
}) {
  const [view, setView] = useState<View>('list')

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
  const [posicion, setPosicion] = useState<{ lat: number; lng: number } | null>(null)

  const [selectedTipo, setSelectedTipo] = useState<string>(String(catalogos.emergencias[0]?.id ?? ''))
  const [selectedSubtipo, setSelectedSubtipo] = useState<string>('')
  const [selectedIncidente, setSelectedIncidente] = useState<string>('')
  const [prioridadManualId, setPrioridadManualId] = useState<string>('')
  const subTiposFiltrados = selectedTipo
    ? catalogos.subtipos.filter((s) => s.tipoEmergenciaId === Number(selectedTipo))
    : []
  const incidentesFiltrados = selectedSubtipo
    ? catalogos.incidentes.filter((i) => i.subtipoEmergenciaId === Number(selectedSubtipo))
    : []
  const prioridadAutocompletada = selectedIncidente
    ? catalogos.incidentes.find((i) => i.id === Number(selectedIncidente))?.prioridadCatalogo
    : null
  const esImprocedente = selectedTipo
    ? catalogos.emergencias.find((c) => c.id === Number(selectedTipo))?.codigo === '7'
    : false

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((g) => {
        if (!cancelled && g?.maps?.Geocoder) setMapsReady(true)
        else if (!cancelled) setMapsReady(false)
      })
      .catch(() => {
        if (!cancelled) setMapsReady(false)
      })
    return () => {
      cancelled = true
    }
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
        setPosicion({ lat: latitude, lng: longitude })

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

  if (view === 'form') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

        <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setView('list')}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#64748b', fontFamily: 'JetBrains Mono,monospace',
              fontSize: 11, textDecoration: 'none', marginBottom: 24,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <ArrowLeft size={13} /> VOLVER A REPORTES
          </button>

          <PageHeader
            title="Reporte de"
            accent="Rondín"
            subtitle="Nuevo avistamiento en rondín — escala a despacho"
          />
        </header>

        <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <form action={createRondinEscalado} style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <input type="hidden" name="anonimo" value={String(anonimo)} />
              <input type="hidden" name="latitud" value={posicion?.lat ?? ''} readOnly />
              <input type="hidden" name="longitud" value={posicion?.lng ?? ''} readOnly />
              <input type="hidden" name="folio" value={folio} />
              <input type="hidden" name="folioConsecutivo" value={folioConsecutivo} />

              <Seccion titulo="Origen">
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, padding: '6px 14px', background: '#eff1f3', border: '1px solid #c3c8d2', borderRadius: 2, color: '#1c3051' }}>
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

              <Seccion titulo="Avistamiento">
                <Campo label="Tipo de emergencia" requerido>
                  <select name="tipoEmergenciaId" required style={inputStyle} value={selectedTipo}
                    onChange={(e) => { setSelectedTipo(e.target.value); setSelectedSubtipo(''); setSelectedIncidente('') }}>
                    {catalogos.emergencias.map((c) => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
                  </select>
                  {esImprocedente && (
                    <span style={{ fontSize: 10, color: '#b45309', display: 'block', marginTop: 4 }}>
                      Tipo Improcedentes: el reporte se guarda pero no se canaliza a despacho
                    </span>
                  )}
                </Campo>
                <Campo label="Subtipo" requerido>
                  <select name="subtipoEmergenciaId" required style={inputStyle} value={selectedSubtipo}
                    onChange={(e) => { setSelectedSubtipo(e.target.value); setSelectedIncidente('') }}
                    disabled={!selectedTipo}>
                    <option value="">{selectedTipo ? 'Seleccionar subtipo...' : 'Primero seleccione tipo'}</option>
                    {subTiposFiltrados.map((item) => <option key={item.id} value={item.id}>{item.codigo} - {item.nombre}</option>)}
                  </select>
                </Campo>
                <Campo label="Incidente específico" requerido>
                  <select name="tipoIncidenteId" required style={inputStyle} value={selectedIncidente}
                    onChange={(e) => setSelectedIncidente(e.target.value)}
                    disabled={!selectedSubtipo}>
                    <option value="">{selectedSubtipo ? 'Seleccionar incidente...' : 'Primero seleccione subtipo'}</option>
                    {incidentesFiltrados.map((item) => (
                      <option key={item.id} value={item.id}>{item.codigoCatalogo && `${item.codigoCatalogo} - `}{item.nombre}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Prioridad (autocompletada)">
                  <input value={prioridadAutocompletada || '—'} disabled style={inputStyle} />
                </Campo>
                <Campo label="Ajuste manual de prioridad">
                  <select name="prioridadId" style={inputStyle} value={prioridadManualId} onChange={(e) => setPrioridadManualId(e.target.value)}>
                    <option value="">Automática (por catálogo)</option>
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
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Toca el mapa para fijar el punto, o arrastra el marcador para ajustarlo
                  </span>
                  <GoogleMapPicker
                    markerPosition={posicion}
                    onLocationSelect={(loc) => {
                      setPosicion({ lat: loc.lat, lng: loc.lng })
                      if (loc.calle && calleRef.current) calleRef.current.value = loc.calle
                      if (loc.colonia && coloniaRef.current) coloniaRef.current.value = loc.colonia
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button type="button" onClick={obtenerUbicacion} disabled={obteniendoUbicacion}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 18px', background: obteniendoUbicacion ? '#e2e8f0' : '#f8fafc', color: obteniendoUbicacion ? '#94a3b8' : '#1f355a', border: `1px solid ${obteniendoUbicacion ? '#e2e8f0' : '#1f355a'}`, borderRadius: 2, cursor: obteniendoUbicacion ? 'wait' : 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all .15s' }}>
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
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="Reportes de"
          accent="Rondín"
          subtitle="Avistamientos escalados a despacho"
          actions={<PageHeaderLink href="/oficial" variant="secondary">← Volver al panel</PageHeaderLink>}
        />
      </header>

      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Segmented control + action button */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{
              padding: '8px 20px',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: '#ffffff', color: '#0f172a',
              border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'default',
            }}>
              <FileText size={13} />
              Enviados
              <span style={{
                background: '#e2e8f0', color: '#475569',
                padding: '0 6px', fontSize: 10, borderRadius: 2,
                marginLeft: 2,
              }}>
                {rondines.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => setView('form')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#1f355a', color: '#ffffff', border: 'none',
              padding: '10px 22px',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 2,
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(31, 53, 90,0.2)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1c3051' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#1f355a' }}
          >
            <Plus size={15} />
            Nuevo Reporte
          </button>
        </div>

        {/* Table */}
        <div style={{
          flex: 1,
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: 2,
        }}>
          <RondinTabla rondines={rondines} folioNuevo={folioNuevo} />
        </div>
      </main>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', background: pending ? '#98a2b3' : '#1f355a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: pending ? 'wait' : 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {pending ? <><Loader2 size={15} /> ESCALANDO…</> : <><MapPin size={15} /> ESCALAR A DESPACHO</>}
    </button>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '20px 24px' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin size={14} color="#1f355a" /> {titulo}
      </h2>
      <div className="grid-2" style={{ gap: 14 }}>
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
  border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a',
  borderRadius: 2, background: '#ffffff', color: '#1e293b', outline: 'none', width: '100%',
}
