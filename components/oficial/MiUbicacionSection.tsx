'use client'

import { MapPin } from 'lucide-react'
import { useUbicacionOficial } from './OficialUbicacionTracker'

export function MiUbicacionSection() {
  const { posicionActual, ultimoEnvio, segundosParaProximoEnvio, permisoDenegado, soportado } = useUbicacionOficial()

  const estado = !soportado || permisoDenegado
    ? { texto: 'No disponible', color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' }
    : posicionActual
      ? { texto: 'Activo', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' }
      : { texto: 'Buscando señal...', color: '#94a3b8', bg: '#f1f5f9', dot: '#94a3b8' }

  return (
    <div style={{
      flex: '1 1 380px', background: '#fff', border: '1px solid #e2e8f0', padding: 32,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', alignSelf: 'flex-start',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '0.04em' }}>
          Mi Ubicación
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, fontFamily: 'JetBrains Mono,monospace', fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: estado.bg, color: estado.color }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: estado.dot }} />
          {estado.texto}
        </span>
      </div>

      {!soportado || permisoDenegado ? (
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b', textAlign: 'center', margin: 0 }}>
          {permisoDenegado
            ? 'Bloqueaste el permiso de ubicación en el navegador — el despachador no podrá verte en el mapa de cercanía.'
            : 'Tu navegador no soporta geolocalización.'}
        </p>
      ) : (
        <>
          <div className="up-placa-box">
            <div className="up-placa-header">
              <span>LAT</span>
              <span>LNG</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 18, fontWeight: 700, color: posicionActual ? '#0f172a' : '#cbd5e1', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.2 }}>
              {posicionActual ? `${posicionActual.lat.toFixed(5)}, ${posicionActual.lng.toFixed(5)}` : 'Esperando GPS...'}
            </div>
            <div className="up-placa-footer">
              <MapPin size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              POSICIÓN ACTUAL DEL NAVEGADOR
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div className="pf-label">Próxima actualización al despacho</div>
              <div className="pf-value" style={{ fontFamily: 'JetBrains Mono,monospace', color: segundosParaProximoEnvio <= 5 ? '#dc2626' : '#0f172a' }}>
                en {segundosParaProximoEnvio}s
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: segundosParaProximoEnvio <= 5 ? '#fef2f2' : '#f1f5f9',
              border: `2px solid ${segundosParaProximoEnvio <= 5 ? '#dc2626' : '#cbd5e1'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 700, color: segundosParaProximoEnvio <= 5 ? '#dc2626' : '#64748b' }}>
                {segundosParaProximoEnvio}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="pf-label">Último envío confirmado</div>
            <div className="pf-value">
              {ultimoEnvio
                ? `${ultimoEnvio.en.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} — ${ultimoEnvio.lat.toFixed(5)}, ${ultimoEnvio.lng.toFixed(5)}`
                : 'Aún no se ha enviado ningún reporte'}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
