'use client'

import { useEffect, useState, useTransition } from 'react'
import { createDespacho, enviarRefuerzos } from '@/lib/incidentes/actions'
import { Loader2, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react'
import type { UnidadParaDespacho } from '@/lib/flota/types'
import { UnidadResumenCard, UnidadCardsStyles } from './UnidadCards'
import { SeleccionarUnidadesModal } from './SeleccionarUnidadesModal'

const BTN: React.CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 22px', background: '#1f355a', color: '#fff', fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14, textTransform: 'none', letterSpacing: 'normal', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)', boxShadow: '0 3px 10px rgba(31,53,90,0.28)' }
const ERR: React.CSSProperties    = { fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#dc2626', marginTop: 4 }
const LBL: React.CSSProperties    = { fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500, display: 'block', marginBottom: 8 }

export function DespachoForm({ incidenteId, incidenteLat = null, incidenteLng = null, onDespachado, modo = 'despacho', prioritario, prioritarioPatrullaId = null, incidentePrioridad = null }: {
  incidenteId: string
  incidenteLat?: number | null
  incidenteLng?: number | null
  onDespachado?: () => void
  modo?: 'despacho' | 'refuerzo'
  prioritario?: { nombre: string; nomina: string } | null
  prioritarioPatrullaId?: string | null
  incidentePrioridad?: string | null
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
    params.set('incidenteId', incidenteId)
    fetch(`/api/despacho/unidades-cercanas?${params.toString()}`)
      .then(res => res.json())
      .then((data: UnidadParaDespacho[]) => {
        const prioritaria = prioritarioPatrullaId ? (data.find(u => u.id === prioritarioPatrullaId) ?? null) : null
        setUnidadPrioritaria(prioritaria)
        setUnidadesDisponibles(data)
        if (prioritaria) {
          setUnidadesSeleccionadas([prioritaria])
        }
      })
      .catch(() => setUnidadesDisponibles([]))
      .finally(() => setCargandoUnidades(false))
  }, [incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId])

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
      if (unidadesSeleccionadas.length === 0 && !tienePrioritario) { setErrorForm('Selecciona al menos una unidad'); return }
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
        fd.set('unidades',  JSON.stringify(unidadesSeleccionadas.map(u => ({ extId: u.id, placa: u.placa }))))
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-lg)' }}>
        <CheckCircle size={18} color="#16a34a" />
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          {esRefuerzo ? 'Refuerzos enviados — actualizando tablón...' : tienePrioritario ? 'Despachado con prioritario — actualizando tablón...' : 'Despachado — actualizando tablón...'}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="grid-2" style={{ gap: 24 }}>

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
              padding: '12px 14px', borderRadius: 'var(--radius-lg)', cursor: cargandoUnidades ? 'default' : 'pointer',
              border: `1.5px solid ${unidadesSeleccionadas.length > 0 ? '#1f355a' : '#e2e8f0'}`,
              background: unidadesSeleccionadas.length > 0 ? '#f1f5f9' : '#fff',
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
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
            <div style={{ marginTop: 8, fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
              No hay unidades activas registradas.
            </div>
          )}
        </div>

        {/* PERSONAL PRIORITARIO: unidad del oficial que reportó (si aplica) + unidades
            seleccionadas en el modal, cada una con su tripulación. */}
        <div>
          <label style={LBL}>Personal prioritario</label>

          {tienePrioritario && (
            unidadPrioritaria ? null : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                  {prioritario!.nombre}
                </span>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#16a34a' }}>
                  ({prioritario!.nomina})
                </span>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, padding: '1px 8px', background: '#f1f5f9', color: '#1f355a', borderRadius: 'var(--radius-full)', marginLeft: 'auto' }}>
                  Prioritario
                </span>
              </div>
            )
          )}

          {unidadesSeleccionadas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {unidadesSeleccionadas.map(u => (
                <UnidadResumenCard key={u.id} unidad={u} prioritarioNomina={prioritario?.nomina} esPrioritaria={u.id === prioritarioPatrullaId} onQuitar={() => quitarUnidad(u)} />
              ))}
            </div>
          ) : !tienePrioritario && (
            <div style={{ padding: '16px 12px', border: '1px dashed #e2e8f0', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
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
            ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> {esRefuerzo ? 'Enviando...' : 'Despachando...'}</>
            : (esRefuerzo ? 'Enviar refuerzos' : tienePrioritario ? 'Despachar y asignar' : 'Despachar incidente')}
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
          incidenteId={incidenteId}
          incidentePrioridad={incidentePrioridad}
          onConfirmar={sel => { setUnidadesSeleccionadas(sel); setModalAbierto(false) }}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  )
}
