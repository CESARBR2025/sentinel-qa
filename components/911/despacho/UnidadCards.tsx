import { X, Users, MapPin, Navigation, ShieldCheck, Check, MapPinOff } from 'lucide-react'
import type { UnidadParaDespacho, OficialTripulacion } from '@/lib/flota/types'

// Tope de filas de tripulación visibles por card. Existe para que la altura de una
// card sea ACOTADA (0 a MAX_OFICIALES_VISIBLES filas), no ilimitada.
export const MAX_OFICIALES_VISIBLES = 3

export function formatDistancia(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

export function formatAntiguedad(iso: string): { texto: string; fresco: boolean } {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000)
  const texto = min < 1 ? 'hace un momento' : min < 60 ? `hace ${min} min` : `hace ${Math.floor(min / 60)} h`
  return { texto, fresco: min < 5 }
}

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || '?'
}

const AVATAR: React.CSSProperties = {
  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'Inter,sans-serif', fontSize: 9, fontWeight: 700,
  background: 'linear-gradient(135deg,#1f355a 0%,#33507e 100%)', color: '#fff',
  border: '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0',
}

// Única fuente de verdad para renderizar una lista de tripulación (avatar + nombre +
// badge de "ya asignado/prioritario"), usada por UnidadCard y UnidadResumenCard.
export function TripulacionList({ oficiales, prioritarioNomina, esPrioritaria = false, compacto = false, indentado = false }: {
  oficiales: OficialTripulacion[]
  prioritarioNomina?: string | null
  esPrioritaria?: boolean
  compacto?: boolean
  indentado?: boolean
}) {
  const yaPrioritario = (nomina: string | null) => !esPrioritaria && !!prioritarioNomina && !!nomina && nomina === prioritarioNomina
  const avatarSize = compacto ? 18 : 20
  const badgeLabel = esPrioritaria ? 'YA PRIORITARIO' : 'YA ASIGNADO'

  if (oficiales.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#94a3b8', fontStyle: 'italic',
        paddingLeft: indentado ? 34 : 0,
      }}>
        {!indentado && <Users size={12} />} Sin tripulación asignada
      </div>
    )
  }

  const visibles = oficiales.slice(0, MAX_OFICIALES_VISIBLES)
  const restantes = oficiales.length - visibles.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compacto ? 4 : 5, paddingLeft: indentado ? 34 : 0 }}>
      {visibles.map(o => (
        <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: compacto ? 6 : 7, fontFamily: 'Inter,sans-serif', fontSize: 11.5, opacity: yaPrioritario(o.noNomina) ? 0.5 : 1 }}>
          <span style={{
            ...AVATAR, width: avatarSize, height: avatarSize, fontSize: 8, flexShrink: 0,
            ...(compacto ? { border: 'none', boxShadow: 'none' } : {}),
            ...(esPrioritaria ? { background: 'linear-gradient(135deg,#16a34a 0%,#22c55e 100%)' } : {}),
          }}>
            {iniciales(o.nombre)}
          </span>
          <span style={{ color: '#334155', fontWeight: 500 }}>{o.nombre}</span>
          {yaPrioritario(o.noNomina) && (
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, fontWeight: 700, color: '#16a34a' }}>{badgeLabel}</span>
          )}
        </div>
      ))}
      {restantes > 0 && (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 10.5, color: '#94a3b8', paddingLeft: avatarSize + (compacto ? 6 : 7) }}>
          +{restantes} más
        </div>
      )}
    </div>
  )
}

// Card de unidad: unidad + tripulación + ubicación/distancia. Vive dentro del modal
// de selección (SeleccionarUnidadesModal) — seleccionar una unidad selecciona a toda
// su tripulación, porque las patrullas salen con su personal ya asignado arriba.
export function UnidadCard({ unidad, seleccionada, esMasCercana, prioritarioNomina, esPrioritaria = false, onToggle }: {
  unidad: UnidadParaDespacho; seleccionada: boolean; esMasCercana: boolean; prioritarioNomina?: string | null; esPrioritaria?: boolean; onToggle: () => void
}) {
  const antiguedad = unidad.ultimaUbicacionEn ? formatAntiguedad(unidad.ultimaUbicacionEn) : null
  const ocupada = unidad.ocupada

  return (
    <div
      onClick={ocupada ? undefined : onToggle}
      className={`dq-unidad-card${seleccionada ? ' dq-selected' : ''}`}
      style={{
        position: 'relative', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10,
        ...(ocupada ? { cursor: 'not-allowed', opacity: 0.6 } : {}),
      }}>

      <div className="dq-check">
        <Check size={12} strokeWidth={3} color="#fff" />
      </div>

      {esPrioritaria && (
        <span style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '2px 8px', borderRadius: 999,
          background: '#eef2ff', color: '#7c3aed',
          border: '1px solid #c7d2fe',
          fontFamily: 'Inter,sans-serif', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          PRIORITARIO
        </span>
      )}

      {esMasCercana && (
        <span style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '2px 8px', borderRadius: 999,
          background: '#16a34a', color: '#fff',
          fontFamily: 'Inter,sans-serif', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <Navigation size={9} /> Más cercana
        </span>
      )}

      {ocupada && (
        <span style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '2px 8px', borderRadius: 999,
          background: '#fef2f2', color: '#dc2626',
          border: '1px solid #fecaca',
          fontFamily: 'Inter,sans-serif', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          OCUPADA
        </span>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: seleccionada ? '#1f355a' : '#eef1f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .15s ease',
          }}>
            <ShieldCheck size={17} color={seleccionada ? '#fff' : '#5c7096'} />
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '0.03em', lineHeight: 1.1 }}>
              {unidad.etiqueta}
            </div>
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{unidad.placa || 'Sin placas'}</div>
          </div>
        </div>

        {unidad.distanciaKm != null && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700,
            color: esMasCercana ? '#16a34a' : '#1f355a',
            background: esMasCercana ? '#f0fdf4' : '#eff6ff',
            border: `1px solid ${esMasCercana ? '#bbf7d0' : '#dbeafe'}`,
            padding: '4px 9px', borderRadius: 999,
          }}>
            <Navigation size={10} />{formatDistancia(unidad.distanciaKm)}
          </span>
        )}
      </div>

      <div style={{ height: 1, background: '#f1f5f9' }} />

      <TripulacionList oficiales={unidad.oficiales} prioritarioNomina={prioritarioNomina} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Inter,sans-serif', fontSize: 10.5 }}>
        {antiguedad ? <MapPin size={11} color={antiguedad.fresco ? '#16a34a' : '#b45309'} /> : <MapPinOff size={11} color="#cbd5e1" />}
        {antiguedad
          ? <span style={{ color: antiguedad.fresco ? '#16a34a' : '#b45309', fontWeight: 600 }}>{antiguedad.texto}</span>
          : <span style={{ color: '#94a3b8' }}>sin ubicación reportada</span>}
      </div>
    </div>
  )
}

// Card compacta de confirmación: refleja una unidad ya seleccionada junto con su
// tripulación, para que el despachador vea claramente qué personal va dentro de esa
// patrulla antes de despachar. El botón "Quitar" desmarca la unidad.
export function UnidadResumenCard({ unidad, prioritarioNomina, esPrioritaria = false, onQuitar }: {
  unidad: UnidadParaDespacho; prioritarioNomina?: string | null; esPrioritaria?: boolean; onQuitar?: () => void
}) {
  const iconBg = esPrioritaria ? '#16a34a' : '#1f355a'

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8,
      border: `1px solid ${esPrioritaria ? '#bbf7d0' : '#dbeafe'}`,
      background: esPrioritaria ? '#f0fdf4' : '#f8fafc',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={14} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>
              {unidad.etiqueta}
            </span>
            {unidad.placa && (
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 9.5, color: '#94a3b8', marginLeft: 6 }}>{unidad.placa}</span>
            )}
          </div>
        </div>
        {esPrioritaria && (
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, fontWeight: 700, padding: '2px 7px', background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 999, letterSpacing: '0.06em' }}>
            PRIORITARIO
          </span>
        )}
        {onQuitar && (
          <button onClick={onQuitar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8', display: 'flex' }} title="Quitar unidad">
            <X size={13} />
          </button>
        )}
      </div>

      <TripulacionList oficiales={unidad.oficiales} prioritarioNomina={prioritarioNomina} esPrioritaria={esPrioritaria} compacto indentado />
    </div>
  )
}

export function UnidadCardSkeleton() {
  return (
    <div style={{ padding: '14px 16px', border: '1px solid #f1f5f9', borderRadius: 10, background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="dq-skel" style={{ width: 34, height: 34, borderRadius: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="dq-skel" style={{ width: 90, height: 14, borderRadius: 4 }} />
          <div className="dq-skel" style={{ width: 60, height: 9, borderRadius: 4 }} />
        </div>
      </div>
      <div className="dq-skel" style={{ width: '70%', height: 11, borderRadius: 4 }} />
    </div>
  )
}

// Estilos compartidos por UnidadCard/UnidadCardSkeleton — se importa junto con los
// componentes de este archivo, se puede montar más de una vez sin problema (son
// solo reglas CSS por clase).
export function UnidadCardsStyles() {
  return (
    <style>{`
      .dq-unidad-card {
        border: 1.5px solid #e5e9f0; border-radius: 10px; background: #fff; cursor: pointer;
        box-shadow: 0 1px 2px rgba(15,23,42,0.04); transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
      }
      .dq-unidad-card:hover { border-color: #94a3b8; box-shadow: 0 4px 12px rgba(15,23,42,0.08); }
      .dq-unidad-card.dq-selected { border-color: #1f355a; background: linear-gradient(135deg,#eff6ff 0%,#f5f8ff 100%); box-shadow: 0 4px 14px rgba(31,53,90,0.16); }
      .dq-check {
        position: absolute; top: 10px; right: 10px; width: 18px; height: 18px; border-radius: 50%;
        background: #cbd5e1; display: flex; align-items: center; justify-content: center;
        opacity: 0; transform: scale(0.6); transition: all .15s ease;
      }
      .dq-selected .dq-check { opacity: 1; transform: scale(1); background: #1f355a; }
      .dq-skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 37%,#f1f5f9 63%); background-size: 400% 100%; animation: dqPulse 1.4s ease infinite; }
      @keyframes dqPulse { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
    `}</style>
  )
}
