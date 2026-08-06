'use client'

import { useEffect, useState } from 'react'
import { MapPin, MapPinOff, BellRing, BellOff, RefreshCw } from 'lucide-react'
import { useUbicacionOficial } from './OficialUbicacionTracker'
import { usePushSubscription } from '@/hooks/usePushSubscription'

const botonPrimario: React.CSSProperties = {
  marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#fff', color: '#0f172a', border: 'none',
  padding: '9px 16px', borderRadius: 3, cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
}

const botonSecundario: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
  padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
}

function FilaEstado({
  icono, label, ok, children,
}: { icono: React.ReactNode; label: string; ok: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <span style={{ flexShrink: 0, color: ok ? '#4ade80' : '#fca5a5', marginTop: 2 }}>{icono}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: ok ? '#4ade80' : '#fca5a5' }}>
          {label} — {ok ? 'Activo' : 'Pendiente'}
        </div>
        {children}
      </div>
    </div>
  )
}

export function GuardiaPermisosOficial({ children }: { children: React.ReactNode }) {
  const { posicionActual, permisoDenegado, soportado: ubicacionSoportada } = useUbicacionOficial()
  const { estado: estadoPush, activar } = usePushSubscription()

  // Colchón de seguridad: si por lo que sea el hook de push se queda pegado
  // en 'cargando' (ya pasó una vez en producción), este guard NO puede dejar
  // al oficial atrapado sin salida. A los 8s se ofrece "Activar" igual y un
  // botón de recargar.
  const [tiempoExcedido, setTiempoExcedido] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTiempoExcedido(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const ubicacionOk = ubicacionSoportada && !permisoDenegado && posicionActual !== null
  const pushOk = estadoPush === 'activo'
  const bloqueado = !ubicacionOk || !pushOk

  // En cuanto ambos permisos quedan OK, entra directo — sin paso de
  // confirmación intermedio. (Se probó un modal de "Bienvenido" con botón
  // "Entrar al sistema" antes de esto; se quitó porque el usuario lo pidió
  // automático, sin click extra.)
  if (!bloqueado) return <>{children}</>

  return (
    <>
      {children}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2147483647,
        background: 'rgba(15, 23, 42, 0.97)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{ width: '100%', maxWidth: 420, maxHeight: '90vh', overflow: 'auto' }}>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
            Permisos obligatorios
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#cbd5e1', margin: '0 0 20px', lineHeight: 1.5 }}>
            Para operar como Oficial de Campo, este dispositivo necesita compartir tu ubicación con el despacho y tener las notificaciones activas. No puedes continuar sin ambos.
          </p>

          <FilaEstado icono={ubicacionOk ? <MapPin size={18} /> : <MapPinOff size={18} />} label="Ubicación" ok={ubicacionOk}>
            {!ubicacionSoportada && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                Tu navegador no soporta geolocalización — usa un navegador compatible (Chrome, Safari, Edge actualizados).
              </p>
            )}
            {ubicacionSoportada && permisoDenegado && (
              <>
                <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#cbd5e1' }}>
                  Bloqueaste el permiso de ubicación. Ábrelo desde el ícono de sitio junto a la barra de direcciones → Ubicación → Permitir, y recarga.
                </p>
                <button type="button" onClick={() => location.reload()} style={botonSecundario}>
                  <RefreshCw size={13} /> Ya lo activé, recargar
                </button>
              </>
            )}
            {ubicacionSoportada && !permisoDenegado && !posicionActual && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>Obteniendo señal GPS…</p>
            )}
          </FilaEstado>

          <FilaEstado icono={pushOk ? <BellRing size={18} /> : <BellOff size={18} />} label="Notificaciones" ok={pushOk}>
            {estadoPush === 'no-soportado' && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                Tu navegador no soporta notificaciones push — usa un navegador compatible.
              </p>
            )}
            {estadoPush === 'denegado' && (
              <>
                <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#cbd5e1' }}>
                  Bloqueaste las notificaciones. Actívalas desde la configuración del sitio en tu navegador y recarga.
                </p>
                <button type="button" onClick={() => location.reload()} style={botonSecundario}>
                  <RefreshCw size={13} /> Ya las activé, recargar
                </button>
              </>
            )}
            {(estadoPush === 'inactivo' || (estadoPush === 'cargando' && tiempoExcedido)) && (
              <button type="button" onClick={() => void activar()} style={botonPrimario}>
                Activar notificaciones
              </button>
            )}
            {estadoPush === 'cargando' && !tiempoExcedido && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>Comprobando…</p>
            )}
          </FilaEstado>

          {tiempoExcedido && (
            <button type="button" onClick={() => location.reload()} style={{ ...botonSecundario, marginTop: 16 }}>
              <RefreshCw size={13} /> Recargar página
            </button>
          )}
        </div>
      </div>
    </>
  )
}
