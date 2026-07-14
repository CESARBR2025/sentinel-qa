'use client'

import { useState, useTransition } from 'react'
import { useFlota }    from '@/hooks/useFlota'
import { useEmpleado } from '@/hooks/useEmpleado'
import { createDespacho, enviarRefuerzos } from '@/lib/incidentes/actions'
import { Plus, X, Search, Loader2, CheckCircle } from 'lucide-react'

interface Unidad   { extId: string; placa: string; label: string }
interface Elemento { extId: string; nomina: string; nombre: string; puesto: string }

const I: React.CSSProperties      = { width: '100%', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box', borderRadius: 2 }
const BTN: React.CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#2563eb', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: 2 }
const BTN_SM: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, cursor: 'pointer', borderRadius: 2 }
const TAG: React.CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#1d4ed8' }
const ERR: React.CSSProperties    = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#dc2626', marginTop: 4 }
const LBL: React.CSSProperties    = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }

export function DespachoForm({ incidenteId, onDespachado, modo = 'despacho', prioritario }: { incidenteId: string; onDespachado?: () => void; modo?: 'despacho' | 'refuerzo'; prioritario?: { nombre: string; nomina: string } | null }) {
  const esRefuerzo = modo === 'refuerzo'
  const flota = useFlota()
  const emp   = useEmpleado()

  const [unidades,     setUnidades]     = useState<Unidad[]>([])
  const [elementos,    setElementos]    = useState<Elemento[]>([])
  const [placaInput,   setPlacaInput]   = useState('')
  const [nominaInput,  setNominaInput]  = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [exito,        setExito]        = useState(false)
  const [errorForm,    setErrorForm]    = useState<string | null>(null)
  const [isPending,    startTransition] = useTransition()

  const agregarUnidad = (u: Unidad) => {
    if (unidades.find(x => x.extId === String(u.extId))) return
    setUnidades(prev => [...prev, u])
    setPlacaInput('')
    flota.limpiar()
    setShowDropdown(false)
  }

  const agregarElemento = () => {
    if (!emp.empleado) return
    if (elementos.find(x => x.extId === emp.empleado!.trabajadorId)) return
    setElementos(prev => [...prev, {
      extId:  emp.empleado!.trabajadorId,
      nomina: emp.empleado!.trabajadorId,
      nombre: emp.empleado!.nombre,
      puesto: emp.empleado!.puesto,
    }])
    setNominaInput('')
    emp.limpiar()
  }

  const tienePrioritario = !!(prioritario?.nombre || prioritario?.nomina)
  const elementosValidos = tienePrioritario ? elementos : null // prioritario cuenta como elemento

  const handleSubmit = () => {
    if (esRefuerzo) {
      if (unidades.length === 0 && elementos.length === 0) { setErrorForm('Agrega al menos una unidad o un elemento de refuerzo'); return }
    } else {
      if (unidades.length  === 0) { setErrorForm('Agrega al menos una unidad');   return }
      if (elementos.length === 0 && !tienePrioritario) { setErrorForm('Agrega al menos un elemento'); return }
    }
    setErrorForm(null)
    startTransition(async () => {
      try {
        const fd = new FormData()
        fd.set('incidenteId', incidenteId)
        fd.set('unidades',  JSON.stringify(unidades.map(u =>  ({ extId: u.extId,  placa: u.placa }))))
        fd.set('elementos', JSON.stringify(elementos.map(e => ({ extId: e.extId, nomina: e.nomina, nombre: e.nombre }))))
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
        <CheckCircle size={16} color="#16a34a" />
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#15803d', fontWeight: 700 }}>
          {esRefuerzo ? 'REFUERZOS ENVIADOS — Actualizando tablón...' : tienePrioritario ? 'DESPACHADO CON PRIORITARIO — Actualizando tablón...' : 'DESPACHADO — Actualizando tablón...'}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* BUSCADOR UNIDADES */}
        <div>
          <label style={LBL}>Unidades (patrullas)</label>
          <div style={{ position: 'relative' }}>
            <input
              value={placaInput}
              onChange={e => { setPlacaInput(e.target.value); flota.buscar({ placa: e.target.value }); setShowDropdown(true) }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Buscar por placa..."
              style={I}
            />
            {flota.cargando && <Loader2 size={14} style={{ position: 'absolute', right: 10, top: 10, color: '#94a3b8' }} />}
            {showDropdown && flota.resultados.length > 0 && (
              <div style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 2, maxHeight: 180, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {flota.resultados.map(v => (
                  <div key={v.id}
                    onMouseDown={() => agregarUnidad({ extId: String(v.id), placa: v.placa, label: v.label })}
                    style={{ padding: '8px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                    {v.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {unidades.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {unidades.map(u => (
                <span key={u.extId} style={TAG}>
                  {u.placa}
                  <button onClick={() => setUnidades(prev => prev.filter(x => x.extId !== u.extId))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3b82f6', display: 'flex' }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BUSCADOR ELEMENTOS */}
        <div>
          <label style={LBL}>{tienePrioritario ? 'Elementos (adicionales)' : 'Elementos (oficiales)'}</label>
          {tienePrioritario && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                {prioritario!.nombre}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#16a34a' }}>
                ({prioritario!.nomina})
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '1px 6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 2, marginLeft: 'auto' }}>
                PRIORITARIO
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={nominaInput}
              onChange={e => setNominaInput(e.target.value)}
              onBlur={() => { if (nominaInput) emp.buscarPorNomina(nominaInput) }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); emp.buscarPorNomina(nominaInput) } }}
              placeholder="Número de nómina..."
              style={{ ...I, flex: 1 }}
            />
            <button onClick={() => emp.buscarPorNomina(nominaInput)} style={{ ...BTN_SM, padding: '8px 12px' }}>
              {emp.cargando ? <Loader2 size={12} /> : <Search size={12} />}
            </button>
          </div>
          {emp.empleado && (
            <div style={{ marginTop: 6, padding: '8px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 600, color: '#15803d' }}>{emp.empleado.nombre}</div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#16a34a' }}>{emp.empleado.puesto}</div>
              </div>
              <button onClick={agregarElemento} style={{ ...BTN, padding: '5px 10px', fontSize: 11, background: '#16a34a' }}>
                <Plus size={11} /> Agregar
              </button>
            </div>
          )}
          {emp.error && <div style={ERR}>{emp.error}</div>}
          {elementos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {elementos.map(e => (
                <span key={e.extId} style={{ ...TAG, justifyContent: 'space-between' }}>
                  <span>{e.nombre}</span>
                  <button onClick={() => setElementos(prev => prev.filter(x => x.extId !== e.extId))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3b82f6', display: 'flex' }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {errorForm && <div style={{ ...ERR, fontSize: 12 }}>{errorForm}</div>}

      <div>
        <button onClick={handleSubmit} disabled={isPending} style={{ ...BTN, opacity: isPending ? 0.7 : 1, background: esRefuerzo ? '#c2410c' : (tienePrioritario ? '#16a34a' : '#2563eb') }}>
          {isPending
            ? <><Loader2 size={13} /> {esRefuerzo ? 'ENVIANDO...' : 'DESPACHANDO...'}</>
            : (esRefuerzo ? 'ENVIAR REFUERZOS' : tienePrioritario ? 'DESPACHAR Y ASIGNAR' : 'DESPACHAR INCIDENTE')}
        </button>
      </div>
    </div>
  )
}