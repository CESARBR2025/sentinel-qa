'use client'

import { useEffect, useState, useTransition } from 'react'
import { createDespacho, enviarRefuerzos } from '@/lib/incidentes/actions'
import { Loader2, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react'
import type { UnidadParaDespacho } from '@/lib/flota/types'
import { UnidadResumenCard, UnidadCardsStyles } from './UnidadCards'
import { SeleccionarUnidadesModal } from './SeleccionarUnidadesModal'

const BTN: React.CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#1f355a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: 6, boxShadow: '0 2px 8px rgba(31,53,90,0.25)' }
const ERR: React.CSSProperties    = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#dc2626', marginTop: 4 }
const LBL: React.CSSProperties    = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 8 }

export function DespachoForm({ incidenteId, incidenteLat = null, incidenteLng = null, onDespachado, modo = 'despacho', prioritario, prioritarioPatrullaId = null }: {
  incidenteId: string
  incidenteLat?: number | null
  incidenteLng?: number | null
  onDespachado?: () => void
  modo?: 'despacho' | 'refuerzo'
  prioritario?: { nombre: string; nomina: string } | null
  prioritarioPatrullaId?: string | null
}) {
  const esRefuerzo = modo === 'refuerzo'

  const [unidadesDisponibles, setUnidadesDisponibles] = useState<UnidadParaDespacho[]>([])
  const [cargandoUnidades,    setCargandoUnidades]    = useState(true)
  const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState<UnidadParaDespacho[]>([])
  const [unidadPrioritaria, setUnidadPrioritaria] = useState<UnidadParaDespacho | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const [exito,        setExito]        = useState(false)
  const [errorForm,    setErrorForm]    = useState<string | null>(null)
  const [isPending,    startTransition] = useTransition()

  useEffect(() => {
    const params = new URLSearchParams()
    if (incidenteLat != null) params.set('lat', String(incidenteLat))
    if (incidenteLng != null) params.set('lng', String(incidenteLng))
    if (prioritarioPatrullaId) params.set('prioritarioPatrullaId', prioritarioPatrullaId)
    fetch(`/api/despacho/unidades-cercanas?${params.toString()}`)
      .then(res => res.json())
      .then((data: UnidadParaDespacho[]) => {
        // La unidad del oficial que levantó el rondín ya está en el lugar (es la prioritaria) —
        // se saca de "cercanas" para no ofrecerla de nuevo, y se guarda aparte para mostrar
        // su tripulación completa en "Personal prioritario".
        setUnidadPrioritaria(prioritarioPatrullaId ? (data.find(u => u.id === prioritarioPatrullaId) ?? null) : null)
        setUnidadesDisponibles(prioritarioPatrullaId ? data.filter(u => u.id !== prioritarioPatrullaId) : data)
      })
      .catch(() => setUnidadesDisponibles([]))
      .finally(() => setCargandoUnidades(false))
  }, [incidenteLat, incidenteLng, prioritarioPatrullaId])

  const quitarUnidad = (u: UnidadParaDespacho) => {
    setUnidadesSeleccionadas(prev => prev.filter(x => x.id !== u.id))
  }

  const tienePrioritario = !!(prioritario?.nombre || prioritario?.nomina)
  const noEsDuplicadoDePrioritario = (nomina: string | null) => !tienePrioritario || !nomina || nomina !== prioritario?.nomina
  const totalOficiales = unidadesSeleccionadas.reduce((n, u) => n + u.oficiales.filter(o => noEsDuplicadoDePrioritario(o.noNomina)).length, 0)

  const handleSubmit = () => {
    if (esRefuerzo) {
      if (unidadesSeleccionadas.length === 0) { setErrorForm('Agrega al menos una unidad de refuerzo'); return }
    } else {
      if (unidadesSeleccionadas.length === 0) { setErrorForm('Selecciona al menos una unidad'); return }
      if (totalOficiales === 0 && !tienePrioritario) { setErrorForm('La unidad seleccionada no tiene oficiales'); return }
    }
    setErrorForm(null)
    startTransition(async () => {
      try {
        const elementos = unidadesSeleccionadas.flatMap(u => u.oficiales
          .filter(o => noEsDuplicadoDePrioritario(o.noNomina)) // el prioritario ya viene insertado por createRondinEscalado
          .map(o => ({ extId: o.noNomina ?? o.id, nomina: o.noNomina ?? '', nombre: o.nombre })))
        const fd = new FormData()
        fd.set('incidenteId', incidenteId)
        fd.set('unidades',  JSON.stringify(unidadesSeleccionadas.map(u => ({ extId: u.id, placa: u.placas }))))
        fd.set('elementos', JSON.stringify(elementos))
        if (esRefuerzo) await enviarRefuerzos(fd)
        else            await createDespacho(fd)
        setExito(true)
        onDespachado?.()
      } catch (e) {
        setErrorForm(e instanceof Error ? e.message : (esRefuerzo ? 'Error al enviar refuerzos' : 'Error al despachar'))
      }
    })
  }

  if (exito) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
        <CheckCircle size={18} color="#16a34a" />
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#15803d', fontWeight: 700 }}>
          {esRefuerzo ? 'REFUERZOS ENVIADOS — Actualizando tablón...' : tienePrioritario ? 'DESPACHADO CON PRIORITARIO — Actualizando tablón...' : 'DESPACHADO — Actualizando tablón...'}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* UNIDADES: el picker vive en un modal (SeleccionarUnidadesModal) — con
            listas reales de 100+ patrullas, un scroll anidado dentro del acordeón del
            tablón no escalaba; el modal le da su propio scroll de nivel superior. */}
        <div>
          <label style={LBL}>Unidades cercanas al hecho</label>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            disabled={cargandoUnidades}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '12px 14px', borderRadius: 8, cursor: cargandoUnidades ? 'default' : 'pointer',
              border: `1.5px solid ${unidadesSeleccionadas.length > 0 ? '#1f355a' : '#e2e8f0'}`,
              background: unidadesSeleccionadas.length > 0 ? '#eff6ff' : '#fff',
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter,sans-serif', fontSize: 12.5, fontWeight: 600, color: '#0f172a' }}>
              {cargandoUnidades
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Cargando unidades cercanas...</>
                : <><ShieldCheck size={16} color="#1f355a" />
                  {unidadesSeleccionadas.length > 0
                    ? `${unidadesSeleccionadas.length} unidad${unidadesSeleccionadas.length !== 1 ? 'es' : ''} seleccionada${unidadesSeleccionadas.length !== 1 ? 's' : ''}`
                    : 'Elegir unidades cercanas'}</>}
            </span>
            {!cargandoUnidades && <ChevronRight size={16} color="#94a3b8" />}
          </button>
          {!cargandoUnidades && unidadesDisponibles.length === 0 && (
            <div style={{ marginTop: 8, fontFamily: 'Inter,sans-serif', fontSize: 11.5, color: '#94a3b8' }}>
              No hay unidades activas registradas.
            </div>
          )}
        </div>

        {/* PERSONAL PRIORITARIO: unidad del oficial que reportó (si aplica) + unidades
            seleccionadas en el modal, cada una con su tripulación. */}
        <div>
          <label style={LBL}>Personal prioritario</label>

          {tienePrioritario && (
            unidadPrioritaria ? (
              <div style={{ marginBottom: 10 }}>
                <UnidadResumenCard unidad={unidadPrioritaria} esPrioritaria />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                  {prioritario!.nombre}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#16a34a' }}>
                  ({prioritario!.nomina})
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '1px 6px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 999, marginLeft: 'auto' }}>
                  PRIORITARIO
                </span>
              </div>
            )
          )}

          {unidadesSeleccionadas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {unidadesSeleccionadas.map(u => (
                <UnidadResumenCard key={u.id} unidad={u} prioritarioNomina={prioritario?.nomina} onQuitar={() => quitarUnidad(u)} />
              ))}
            </div>
          ) : !tienePrioritario && (
            <div style={{ padding: '16px 12px', border: '1px dashed #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11.5, color: '#94a3b8' }}>
                Elige unidades arriba para ver aquí su tripulación
              </span>
            </div>
          )}
        </div>
      </div>

      {errorForm && <div style={{ ...ERR, fontSize: 12 }}>{errorForm}</div>}

      <div>
        <button onClick={handleSubmit} disabled={isPending} style={{ ...BTN, opacity: isPending ? 0.7 : 1, background: esRefuerzo ? '#c2410c' : (tienePrioritario ? '#16a34a' : '#1f355a') }}>
          {isPending
            ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> {esRefuerzo ? 'ENVIANDO...' : 'DESPACHANDO...'}</>
            : (esRefuerzo ? 'ENVIAR REFUERZOS' : tienePrioritario ? 'DESPACHAR Y ASIGNAR' : 'DESPACHAR INCIDENTE')}
        </button>
      </div>

      <UnidadCardsStyles />

      {modalAbierto && (
        <SeleccionarUnidadesModal
          unidades={unidadesDisponibles}
          seleccionadas={unidadesSeleccionadas}
          prioritarioNomina={prioritario?.nomina}
          incidenteLat={incidenteLat}
          incidenteLng={incidenteLng}
          prioritarioPatrullaId={prioritarioPatrullaId}
          onConfirmar={sel => { setUnidadesSeleccionadas(sel); setModalAbierto(false) }}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  )
}
