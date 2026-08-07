'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { useUbicacionOficial } from './OficialUbicacionTracker'
import { MapaMiUbicacion } from './MapaMiUbicacion'

export function MiUbicacionSection() {
  const { posicionActual, ultimoEnvio, segundosParaProximoEnvio, permisoDenegado, soportado } = useUbicacionOficial()
  const [direccion, setDireccion] = useState<{ calle: string; colonia: string }>({ calle: '', colonia: '' })

  const estado = !soportado || permisoDenegado
    ? { texto: 'No disponible', color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' }
    : posicionActual
      ? { texto: 'Activo', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' }
      : { texto: 'Buscando señal...', color: '#94a3b8', bg: '#f1f5f9', dot: '#94a3b8' }

  return (
    <>
      <div className="pf-head">
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(31,53,90,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MapPin size={18} color="#1f355a" strokeWidth={1.5} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, textTransform: 'none', margin: 0, color: '#0f172a', letterSpacing: 'normal' }}>
            Mi Ubicación
          </h2>
          <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
            Reporte de geolocalización al despacho
          </p>
        </div>
      </div>

      {!soportado || permisoDenegado ? (
        <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', margin: '20px 0 0', lineHeight: 1.5 }}>
          {permisoDenegado
            ? 'Bloqueaste el permiso de ubicación en el navegador — el despachador no podrá verte en el mapa de cercanía.'
            : 'Tu navegador no soporta geolocalización.'}
        </p>
      ) : (
        <>
          <div className="pf-row">
            <span className="pf-label">Estatus</span>
            <span className="pf-badge" style={{ background: estado.bg, color: estado.color }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: estado.dot }} />
              {estado.texto}
            </span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Calle</span>
            <span className="pf-value">{direccion.calle || (posicionActual ? 'Detectando...' : '—')}</span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Colonia</span>
            <span className="pf-value">{direccion.colonia || (posicionActual ? 'Detectando...' : '—')}</span>
          </div>

          <MapaMiUbicacion lat={posicionActual?.lat ?? null} lng={posicionActual?.lng ?? null} onDireccion={setDireccion} />

          <div className="pf-row">
            <span className="pf-label">Próxima actualización</span>
            <span className="pf-value">en {segundosParaProximoEnvio}s</span>
          </div>
          <div className="pf-row">
            <span className="pf-label">Último envío confirmado</span>
            <span className="pf-value">
              {ultimoEnvio
                ? `${ultimoEnvio.en.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                : 'Aún no se ha enviado ningún reporte'}
            </span>
          </div>
        </>
      )}
    </>
  )
}
