'use client'

import { useRef, useState, useEffect } from 'react'
import {
  FileText, MapPin, Car, User, Gavel,
  FileSearch, Mail, Tag, Layers, Calendar, Palette,
  IdCard, BadgeCheck, Loader2,
  Navigation, Hash, Building2, Flag, Crosshair,
} from 'lucide-react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { abrirDocumento } from '@/lib/shared/abrirDocumento'

/* ─── INTERFACES ─── */

export interface InfraccionHeader {
  id_infraccion: string
  folio_de_infraccion: string
  fecha_de_registro_de_infraccion: string
  estatus_de_infraccion: string
  url_ine: string
  url_tarjeta_circulacion: string
  url_inapam: string
  url_evidencias: string[]
  no_oficio_fiscalia?: string
  url_oficio_fiscalia?: string
  url_orden_salida_liberaciones?: string
  url_oficio_pago_corralon?: string
  grua_nombre?: string
}

export interface InfraccionLegal {
  articulo_numero: string
  articulo_descripcion: string
  fraccion_numero: string
  fraccion_descripcion: string
  total_umas: string
  total_pesos: string
}

export interface InfraccionInfractor {
  nombre_infractor: string
  correo_infractor: string
  curp_infractor: string
}

export interface InfraccionOficial {
  numero_empleado: string
  nombre_completo: string
  patrulla_nombre: string
  activo: string | boolean
}

export interface InfraccionVehiculo {
  placa: string
  tipo: string
  marca: string
  modelo: string
  anio: string
  color: string
}

export interface InfraccionGarantia {
  garantia_retenida: string
}

export interface InfraccionUbicacion {
  latitud: string
  longitud: string
  calle: string
  cod_postal: string
  numero: string
  municipio: string
  estado: string
}

export interface InfraccionDetalle {
  Header: InfraccionHeader
  Infraccion: InfraccionLegal
  datos_infractor: InfraccionInfractor
  vehiculo: InfraccionVehiculo
  garantia: InfraccionGarantia
  ubicacion: InfraccionUbicacion
  oficial: InfraccionOficial
}

/* ─── STATUS CONFIG ─── */

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PAGADA: { bg: 'bg-green-50', text: 'text-green-800', dot: 'bg-green-500', label: 'Pagada' },
  PENDIENTE: { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pendiente' },
  REGISTRADA: { bg: 'bg-blue-50', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Registrada' },
  CANCELADA: { bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500', label: 'Cancelada' },
}

function getStatusStyle(status?: string) {
  return STATUS_STYLES[status ?? ''] ?? { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400', label: status ?? 'Desconocido' }
}

/* ─── UTILS ─── */

function formatDate(d: string): string {
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatCurrency(v: string): string {
  const num = parseFloat(v || '0')
  if (isNaN(num)) return v
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num)
}

function sanitize(value: string | null | undefined, fallback = '—'): string {
  if (!value || value === 'NO_DATA') return fallback
  return value
}

function mapGarantia(value: string): string {
  if (value === 'TRJ_CIRCULACION') return 'Tarjeta de Circulación'
  return sanitize(value, 'Ninguna')
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)
  if (diffMins < 1) return 'recién'
  if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  if (diffDays < 30) return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  return formatDate(dateStr)
}

/* ─── MAIN COMPONENT ─── */

interface Props {
  detalle: InfraccionDetalle | null
  error?: string
}

export function DetalleInfraccionView({ detalle, error }: Props) {
  console.log(detalle)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
          <FileSearch size={24} className="text-red-400" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-900">Error al cargar</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!detalle) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
          <Loader2 size={24} className="text-slate-400 animate-spin" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-900">Consultando infracción</p>
          <p className="text-xs text-slate-500 mt-1">Obteniendo información del registro…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .st-label { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .st-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; }
      `}</style>

      <SummaryBar detalle={detalle} />

      <div className="space-y-8">
        <InfractorVehiculoSection detalle={detalle} />

        <FundamentoLegalSection detalle={detalle} />

        {detalle.oficial?.numero_empleado !== 'NO_DATA' && (
          <OficialSection detalle={detalle} />
        )}

        <MapSection ubicacion={detalle.ubicacion} evidencias={detalle.Header.url_evidencias} />

        <DocumentacionSection detalle={detalle} />
      </div>
    </>
  )
}

/* ══ MAPA + STREET VIEW ══ */

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

function MapSection({ ubicacion, evidencias = [] }: { ubicacion: InfraccionUbicacion; evidencias?: string[] }) {
  const [view, setView] = useState<'map' | 'street'>('map')
  const [svStatus, setSvStatus] = useState<'unknown' | 'ok' | 'unavailable'>('unknown')

  const lat = Number(ubicacion.latitud)
  const lng = Number(ubicacion.longitud)
  const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GMAPS_KEY ?? '',
  })

  useEffect(() => {
    if (!isLoaded || !hasCoords || !window.google?.maps?.StreetViewService) return

    const svService = new window.google.maps.StreetViewService()
    svService.getPanorama({ location: { lat, lng }, radius: 50 }, (_, status) => {
      if (status === window.google.maps.StreetViewStatus.OK) {
        setView('street')
      }
    })
  }, [isLoaded, lat, lng, hasCoords])

  const toggleView = (v: 'map' | 'street') => {
    setView(v)
    if (v === 'street') setSvStatus('unknown')
  }

  const tabClass = (v: 'map' | 'street') =>
    `px-3 py-1 text-xs font-medium transition-colors duration-150 ${view === v ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base text-slate-900 flex items-center gap-2 st-title">
          <span className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
            <MapPin size={13} className="text-emerald-700" strokeWidth={1.5} />
          </span>
          Ubicación
        </h3>
        {hasCoords && isLoaded && !loadError && (
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button onClick={() => toggleView('street')} className={tabClass('street')}>Street View</button>
            <button onClick={() => toggleView('map')} className={tabClass('map')}>Mapa</button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex gap-4 p-4">
          <div className="w-72 sm:w-80 h-52 sm:h-56 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
            {!GMAPS_KEY ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[11px] text-slate-400">No configurado</p>
              </div>
            ) : loadError ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[11px] text-red-500">Error al cargar</p>
              </div>
            ) : !isLoaded ? (
              <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                <p className="text-[11px] text-slate-400">Cargando…</p>
              </div>
            ) : !hasCoords ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[11px] text-slate-400">Sin coordenadas</p>
              </div>
            ) : view === 'street' ? (
              svStatus === 'unavailable' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <MapPin size={16} className="text-slate-300" strokeWidth={1.5} />
                  <p className="text-[10px] text-slate-400">No disponible</p>
                  <button onClick={() => setView('map')} className="text-[10px] font-medium text-blue-700 hover:text-blue-800">
                    Ver mapa
                  </button>
                </div>
              ) : (
                <StreetViewMap lat={lat} lng={lng} onStatus={setSvStatus} />
              )
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat, lng }}
                zoom={16}
                options={{
                  fullscreenControl: false, mapTypeControl: false, streetViewControl: false,
                  zoomControl: false, clickableIcons: false, draggable: false,
                  scrollwheel: false, disableDoubleClickZoom: true,
                }}
              >
                <Marker position={{ lat, lng }} />
              </GoogleMap>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-xs text-slate-500 st-label"><Navigation size={12} className="inline mr-1 -mt-0.5" />Calle</p>
                <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(ubicacion.calle)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label"><Hash size={12} className="inline mr-1 -mt-0.5" />Número</p>
                <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(ubicacion.numero)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label"><Mail size={12} className="inline mr-1 -mt-0.5" />Código Postal</p>
                <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(ubicacion.cod_postal)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label"><Building2 size={12} className="inline mr-1 -mt-0.5" />Municipio</p>
                <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(ubicacion.municipio)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label"><Flag size={12} className="inline mr-1 -mt-0.5" />Estado</p>
                <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(ubicacion.estado)}</p>
              </div>
              {hasCoords && (
                <div>
                  <p className="text-xs text-slate-500 st-label"><Crosshair size={12} className="inline mr-1 -mt-0.5" />Coordenadas</p>
                  <p className="text-sm text-slate-900 mt-0.5 leading-snug font-mono text-[11px]">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            {hasCoords && (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 transition-colors mt-3"
              >
                ↗ Abrir en Google Maps
              </a>
            )}
          </div>
        </div>

        {evidencias.length > 0 && (
          <div className="border-t border-slate-100 p-4">
            <h4 className="text-xs text-slate-500 st-label flex items-center gap-1.5 mb-3">
              <FileText size={12} className="text-slate-400" strokeWidth={1.5} />
              Evidencias ({evidencias.length})
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {evidencias.map((url, i) => {
                const fullUrl = `${process.env.NEXT_PUBLIC_WS_EXPEDIENTE ?? ''}${url}`
                const ext = url.split('.').pop()?.toLowerCase() ?? ''
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
                return (
                  <div
                    key={url}
                    onClick={() => abrirDocumento(fullUrl)}
                    className="group cursor-pointer rounded-lg border border-slate-200 bg-white overflow-hidden hover:scale-[1.04] hover:shadow-md transition-all duration-200"
                  >
                    <div className="h-16 sm:h-20 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={`/api/expediente/proxy?url=${encodeURIComponent(fullUrl)}`}
                          alt={`Evidencia ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const t = e.currentTarget
                            t.style.display = 'none'
                            t.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="2.5"/></svg></div>`
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-0.5 text-slate-400">
                          <FileText size={16} strokeWidth={1.5} />
                          <span className="text-[8px] font-medium st-label">{ext.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="px-1.5 py-1 border-t border-slate-100">
                      <p className="text-[10px] font-medium text-slate-600 truncate text-center">Evidencia {i + 1}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══ STREET VIEW ══ */

function StreetViewMap({ lat, lng, onStatus }: { lat: number; lng: number; onStatus: (s: 'ok' | 'unavailable') => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.google?.maps?.StreetViewPanorama) {
      onStatus('unavailable')
      return
    }

    const panorama = new window.google.maps.StreetViewPanorama(el, {
      position: { lat, lng },
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false, fullscreenControl: false, zoomControl: true,
      motionTracking: false, clickToGo: false, scrollwheel: false,
      linksControl: false, visible: true,
    })

    const checkStatus = () => {
      const status = panorama.getStatus()
      if (status === 'OK') onStatus('ok')
      else if (status === 'UNKNOWN_ERROR' || status === 'ZERO_RESULTS') onStatus('unavailable')
    }

    const listener = panorama.addListener('status_changed', checkStatus)
    const timeout = setTimeout(checkStatus, 2000)

    return () => {
      clearTimeout(timeout)
      google.maps.event.removeListener(listener)
      panorama.setVisible(false)
    }
  }, [lat, lng])

  return <div ref={ref} className="w-full h-full" />
}

/* ══ SECTION ══ */

function Section({
  icon: Icon, title, iconBg, iconColor, children,
}: {
  icon: typeof User
  title: string
  iconBg: string
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-base text-slate-800 mb-3 flex items-center gap-2 st-title">
        <span className={`w-6 h-6 rounded-md ${iconBg} flex items-center justify-center`}>
          <Icon size={13} className={iconColor} strokeWidth={1.5} />
        </span>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/* ══ FIELD ══ */

function FieldWithIcon({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 st-label">{label}</p>
      <p className="text-sm text-slate-900 mt-0.5 leading-snug flex items-center gap-1.5">
        <Icon size={13} className="text-slate-400 shrink-0" strokeWidth={1.5} />
        {value}
      </p>
    </div>
  )
}

/* ══ SUMMARY BAR ══ */

function SummaryBar({ detalle }: { detalle: InfraccionDetalle }) {
  const h = detalle.Header

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800" />
      <div className="relative p-5 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl text-slate-900 st-title mt-2">
            Folio #{h.folio_de_infraccion}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {formatDate(h.fecha_de_registro_de_infraccion)} &middot; {timeAgo(h.fecha_de_registro_de_infraccion)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl text-slate-900 st-title">
            {formatCurrency(detalle.Infraccion.total_pesos)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {detalle.Infraccion.total_umas} UMAs
          </p>
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            ID: {h.id_infraccion}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ══ INFRACTOR + VEHÍCULO ══ */

function InfractorVehiculoSection({ detalle }: { detalle: InfraccionDetalle }) {
  return (
    <div>
      <h3 className="text-base text-slate-800 mb-3 flex items-center gap-2 st-title">
        <span className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
          <User size={13} className="text-slate-700" strokeWidth={1.5} />
        </span>
        Infractor y Vehículo
      </h3>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 st-label">Nombre completo</p>
                <p className="text-sm text-slate-900 mt-1 leading-snug flex items-center gap-1.5">
                  <User size={14} className="text-slate-400 shrink-0" strokeWidth={1.5} />
                  {sanitize(detalle.datos_infractor.nombre_infractor)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label">Correo electrónico</p>
                <p className="text-sm text-slate-900 mt-1 leading-snug flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400 shrink-0" strokeWidth={1.5} />
                  {sanitize(detalle.datos_infractor.correo_infractor, 'No registrado')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 st-label">CURP</p>
                <p className="text-sm text-slate-900 mt-1 leading-snug flex items-center gap-1.5 font-mono tracking-wide">
                  <IdCard size={14} className="text-slate-400 shrink-0" strokeWidth={1.5} />
                  {sanitize(detalle.datos_infractor.curp_infractor)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <p className="text-[10px] text-indigo-600 uppercase mb-0.5 st-label">Placa</p>
                <p className="text-xl font-semibold text-indigo-900 tracking-[0.2em] font-mono">
                  {sanitize(detalle.vehiculo.placa)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <FieldWithIcon icon={Tag} label="Marca" value={sanitize(detalle.vehiculo.marca)} />
                <FieldWithIcon icon={Layers} label="Modelo" value={sanitize(detalle.vehiculo.modelo)} />
                <FieldWithIcon icon={Calendar} label="Año" value={sanitize(detalle.vehiculo.anio, 'No especificado')} />
                <FieldWithIcon icon={Palette} label="Color" value={sanitize(detalle.vehiculo.color)} />
                <FieldWithIcon icon={Car} label="Tipo" value={sanitize(detalle.vehiculo.tipo, 'No especificado')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ FUNDAMENTO LEGAL + MONTO ══ */

function FundamentoLegalSection({ detalle }: { detalle: InfraccionDetalle }) {
  return (
    <div>
      <h3 className="text-base text-slate-800 mb-3 flex items-center gap-2 st-title">
        <span className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
          <Gavel size={13} className="text-slate-700" strokeWidth={1.5} />
        </span>
        Fundamento Legal
      </h3>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-slate-700 text-white text-xs font-medium st-label leading-none">
                Art. {sanitize(detalle.Infraccion.articulo_numero)}
              </span>
              <p className="text-sm text-slate-700 leading-snug">
                {detalle.Infraccion.articulo_descripcion}
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-slate-600 text-white text-xs font-medium st-label leading-none">
                Frac. {sanitize(detalle.Infraccion.fraccion_numero)}
              </span>
              <p className="text-sm text-slate-700 leading-snug">
                {detalle.Infraccion.fraccion_descripcion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ OFICIAL ══ */

function OficialSection({ detalle }: { detalle: InfraccionDetalle }) {
  return (
    <div>
      <h3 className="text-base text-slate-800 mb-3 flex items-center gap-2 st-title">
        <span className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
          <BadgeCheck size={13} className="text-emerald-700" strokeWidth={1.5} />
        </span>
        Oficial que registró
      </h3>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-xs text-slate-500 st-label"><User size={12} className="inline mr-1 -mt-0.5" />Nombre</p>
              <p className="text-sm text-slate-900 mt-0.5 leading-snug">{detalle.oficial.nombre_completo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 st-label"><BadgeCheck size={12} className="inline mr-1 -mt-0.5" />Número de nómina</p>
              <p className="text-sm text-slate-900 mt-0.5 leading-snug">{detalle.oficial.numero_empleado}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 st-label"><Car size={12} className="inline mr-1 -mt-0.5" />Patrulla</p>
              <p className="text-sm text-slate-900 mt-0.5 leading-snug">{sanitize(detalle.oficial.patrulla_nombre, 'No asignada')}</p>
            </div>
            {detalle.oficial.activo !== 'NO_DATA' && (
              <div>
                <p className="text-xs text-slate-500 st-label">Estado</p>
                <span className={`inline-block mt-0.5 text-xs font-medium px-2.5 py-0.5 rounded-full leading-none st-label ${String(detalle.oficial.activo) === 'true'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}>
                  {String(detalle.oficial.activo) === 'true' ? 'En servicio' : 'Con baja'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ DOCUMENTACIÓN ══ */

function DocumentacionSection({ detalle }: { detalle: InfraccionDetalle }) {
  const documentos: { nombre: string; ruta: string; ext: string }[] = [
    detalle.Header.url_ine && detalle.Header.url_ine !== 'NO_DATA'
      ? { nombre: 'INE', ruta: detalle.Header.url_ine, ext: detalle.Header.url_ine.split('.').pop()?.toLowerCase() ?? '' } : null,
    detalle.Header.url_inapam && detalle.Header.url_inapam !== 'NO_DATA'
      ? { nombre: 'INAPAM', ruta: detalle.Header.url_inapam, ext: detalle.Header.url_inapam.split('.').pop()?.toLowerCase() ?? '' } : null,
    detalle.Header.url_tarjeta_circulacion && detalle.Header.url_tarjeta_circulacion !== 'NO_DATA'
      ? { nombre: 'Tarjeta de Circulación', ruta: detalle.Header.url_tarjeta_circulacion, ext: detalle.Header.url_tarjeta_circulacion.split('.').pop()?.toLowerCase() ?? '' } : null,
  ].filter(Boolean) as { nombre: string; ruta: string; ext: string }[]

  const fiscaliaDoc = detalle.Header.url_oficio_fiscalia && detalle.Header.url_oficio_fiscalia !== 'NO_DATA'
    ? { nombre: 'Oficio Fiscalía', ruta: detalle.Header.url_oficio_fiscalia, ext: detalle.Header.url_oficio_fiscalia.split('.').pop()?.toLowerCase() ?? '' }
    : null

  const liberacionesDoc = detalle.Header.url_orden_salida_liberaciones && detalle.Header.url_orden_salida_liberaciones !== 'NO_DATA'
    ? { nombre: 'Orden de Salida (Liberaciones)', ruta: detalle.Header.url_orden_salida_liberaciones, ext: detalle.Header.url_orden_salida_liberaciones.split('.').pop()?.toLowerCase() ?? '' }
    : null

  const oficioCorralonDoc = detalle.Header.url_oficio_pago_corralon && detalle.Header.url_oficio_pago_corralon !== 'NO_DATA'
    ? { nombre: 'Oficio de Corralón', ruta: detalle.Header.url_oficio_pago_corralon, ext: detalle.Header.url_oficio_pago_corralon.split('.').pop()?.toLowerCase() ?? '' }
    : null

  const evidencias = (detalle.Header.url_evidencias ?? []).map((ruta: string, i: number) => ({
    nombre: `Evidencia ${i + 1}`,
    ruta,
    ext: ruta.split('.').pop()?.toLowerCase() ?? '',
  }))

  const viaItems = [...documentos, ...evidencias]
  const fiscaliaItems = fiscaliaDoc ? [fiscaliaDoc] : []
  const corralonItems = oficioCorralonDoc ? [oficioCorralonDoc] : []
  const liberacionesItems = liberacionesDoc ? [liberacionesDoc] : []

  const totalItems = viaItems.length + fiscaliaItems.length + corralonItems.length + liberacionesItems.length
  if (totalItems === 0) return null

  const fecha = formatDate(detalle.Header.fecha_de_registro_de_infraccion)

  return (
    <Section icon={FileText} title={`Documentación (${totalItems})`} iconBg="bg-slate-50" iconColor="text-slate-700">
      <div className="space-y-6">
        {viaItems.length > 0 && (
          <TimelineNode nombre="Documentación del Ciudadano" fecha={fecha} items={viaItems} />
        )}
        {fiscaliaItems.length > 0 && (
          <TimelineNode nombre="Departamento de Fiscalía" fecha={fecha} items={fiscaliaItems} />
        )}
        {liberacionesItems.length > 0 && (
          <TimelineNode nombre="Departamento de Liberaciones" fecha={fecha} items={liberacionesItems} />
        )}
        {corralonItems.length > 0 && (
          <TimelineNode nombre={`Resguardo Corralón${detalle.Header.grua_nombre ? ` — ${detalle.Header.grua_nombre}` : ''}`} fecha={fecha} items={corralonItems} />
        )}
        {/* ─── Finalizado ─── */}
        <div className="relative pl-9">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm st-title text-emerald-700">Finalizado</h4>
            <span className="text-xs text-slate-400">{fecha}</span>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ══ TIMELINE NODE ══ */

function TimelineNode({ nombre, fecha, items }: { nombre: string; fecha: string; items: { nombre: string; ruta: string; ext: string }[] }) {
  const isImageExt = (ext: string) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)

  return (
    <div className="relative pl-9">
      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200" />
      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
        <FileText size={10} className="text-slate-500" strokeWidth={2} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm st-title text-slate-800">{nombre}</h4>
        <span className="text-xs text-slate-400">{fecha}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {items.map((item) => {
          const fullUrl = `${process.env.NEXT_PUBLIC_WS_EXPEDIENTE ?? ''}${item.ruta}`
          const isImage = isImageExt(item.ext)

          return (
            <div
              key={item.ruta}
              onClick={() => abrirDocumento(fullUrl)}
              className="group cursor-pointer rounded-lg border border-slate-200 bg-white overflow-hidden hover:scale-[1.04] hover:shadow-lg transition-all duration-200"
            >
              <div className="h-20 bg-slate-50 flex items-center justify-center overflow-hidden">
                {isImage ? (
                  <img
                    src={`/api/expediente/proxy?url=${encodeURIComponent(fullUrl)}`}
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="2.5"/></svg></div>`
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <FileText size={20} strokeWidth={1.5} />
                    <span className="text-[9px] font-medium st-label">{item.ext.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="px-2 py-1.5 border-t border-slate-100">
                <p className="text-[11px] font-medium text-slate-700 truncate text-center">{item.nombre}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
