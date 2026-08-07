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
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardHeader } from '@/components/partials/Header'
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
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>

        <DashboardHeader variant="apple" roleLabel="Rondín" backHref="/oficial" backLabel="Panel" />

        <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setView('list')}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#64748b', fontFamily: 'var(--apple-font-display)',
              fontSize: 13, fontWeight: 500, textDecoration: 'none', marginBottom: 24,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <ArrowLeft size={13} /> Volver a reportes
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--apple-font-display)', fontSize: 13, padding: '6px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', color: '#1f355a' }}>
                    <span style={{ fontWeight: 500 }}>Folio</span>
                    <span style={{ fontWeight: 600 }}>{folio}</span>
                  </div>
                </div>
                {nombreOficial ? (
                  <>
                    <input type="hidden" name="nombreOficial" value={nombreOficial} />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                          Reporta: {nombreOficial}
                        </span>
                        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#16a34a', marginLeft: 'auto' }}>
                          Oficial en rondín
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
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b', textTransform: 'none', letterSpacing: 'normal' }}>
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 18px', background: obteniendoUbicacion ? '#e2e8f0' : '#ffffff', color: obteniendoUbicacion ? '#94a3b8' : '#1f355a', border: `1px solid ${obteniendoUbicacion ? '#e2e8f0' : '#1f355a'}`, borderRadius: 'var(--radius-lg)', cursor: obteniendoUbicacion ? 'wait' : 'pointer', fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 13, letterSpacing: 'normal', textTransform: 'none', transition: 'all .15s' }}>
                    {obteniendoUbicacion ? <Loader2 size={14} /> : <Crosshair size={14} />}
                    {obteniendoUbicacion ? 'Obteniendo ubicación…' : 'Obtener ubicación actual'}
                  </button>
                  {errorUbicacion && (
                    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#dc2626' }}>{errorUbicacion}</div>
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>

      <DashboardHeader variant="apple" roleLabel="Rondín" backHref="/oficial" backLabel="Panel" />

      <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="Reportes de"
          accent="Rondín"
          subtitle="Avistamientos escalados a despacho"
        />
      </header>

      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Segmented control + action button */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              padding: '9px clamp(14px, 4vw, 20px)',
              fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600,
              letterSpacing: 'normal', textTransform: 'none',
              background: '#1f355a', color: '#ffffff',
              borderRadius: 'var(--radius-full)', border: 'none',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'default', whiteSpace: 'nowrap',
            }}>
              <FileText size={14} />
              Enviados
              <span style={{
                background: 'rgba(255,255,255,.22)', color: '#ffffff',
                padding: '0 7px', fontSize: 11, fontWeight: 600, borderRadius: 'var(--radius-full)',
                lineHeight: '18px',
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
              fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600,
              letterSpacing: 'normal', textTransform: 'none',
              cursor: 'pointer', borderRadius: 'var(--radius-lg)',
              transition: 'background 0.2s',
              boxShadow: '0 3px 10px rgba(31, 53, 90, 0.28)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#132138' }}
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
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden',
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
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', background: pending ? '#94a3b8' : '#1f355a', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: pending ? 'wait' : 'pointer', fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 15, textTransform: 'none', letterSpacing: 'normal', boxShadow: pending ? 'none' : '0 3px 10px rgba(31,53,90,0.28)' }}>
      {pending ? <><Loader2 size={15} /> Escalando…</> : <><MapPin size={15} /> Escalar a despacho</>}
    </button>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', padding: '20px 24px' }}>
      <h2 style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16, textTransform: 'none', letterSpacing: 'normal', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
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
      <label style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', fontWeight: 500, letterSpacing: 'normal', textTransform: 'none' }}>
        {label}{requerido && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 14, padding: '11px 13px',
  border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#ffffff', color: '#1e293b', outline: 'none', width: '100%',
}
