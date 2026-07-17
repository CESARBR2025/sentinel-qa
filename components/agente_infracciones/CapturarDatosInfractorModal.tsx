'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { User, CheckCircle2, Loader2, AlertCircle, ArrowRight, X, Info } from 'lucide-react'
import { useCapturaInfractorStore } from '@/lib/agente_infracciones/storeCapturaInfractor'
import { capturarInfractorInfraccionesAction } from '@/lib/agente_infracciones/actions'

interface Props {
  infraccionId: string
  onSuccess: () => void
  onClose: () => void
}

type FieldName = 'infrNombre' | 'infrAppaterno' | 'infrApmaterno' | 'infrCurp' | 'infrCorreo' | 'nombre' | 'appaterno' | 'apmaterno' | 'curp' | 'correo'

function isNoData(v: string | null | undefined): boolean {
  return !v || v === 'NO_DATA' || v.trim() === ''
}

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Requerido'
  if (name === 'infrCurp' || name === 'curp') {
    if (trimmed.length !== 18) return 'Debe tener 18 caracteres'
  }
  if (name === 'infrCorreo' || name === 'correo') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Correo inválido'
  }
  return undefined
}

export default function CapturarDatosInfractorModal({ infraccionId, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-md shadow-2xl border border-slate-200 overflow-hidden">
          {/* ─── Header ─── */}
          <div className="bg-primary-muted px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary">
                <User size={13} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm text-primary tracking-wider uppercase font-semibold" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>
                  Capturar datos del infractor
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                  REGISTRA LOS DATOS DEL TITULAR DE LA INFRACCIÓN
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white border border-slate-200 text-slate-400 hover:text-slate-600"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* ─── Body ─── */}
          <div className="p-5" style={{ fontFamily: "'Inter',sans-serif" }}>
            <DatosForm infraccionId={infraccionId} onSuccess={onSuccess} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DatosForm({ infraccionId, onSuccess, onClose }: Props) {
  const {
    paso, esTitular,
    infrNombre, infrAppaterno, infrApmaterno, infrCurp, infrCorreo,
    nombre, appaterno, apmaterno, curp, correo,
    setPaso, setEsTitular,
    setInfrNombre, setInfrAppaterno, setInfrApmaterno, setInfrCurp, setInfrCorreo,
    setNombre, setAppaterno, setApmaterno, setCurp, setCorreo,
    reset,
  } = useCapturaInfractorStore()

  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [touched, setTouched] = useState<Set<FieldName>>(new Set())

  const firstErrorRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const markTouched = useCallback((name: FieldName) => {
    setTouched(prev => new Set(prev).add(name))
  }, [])

  const validateAndSet = useCallback((name: FieldName, value: string) => {
    const err = validateField(name, value)
    setFieldErrors(prev => {
      const next = { ...prev }
      if (err) next[name] = err
      else delete next[name]
      return next
    })
  }, [])

  const handleBlur = useCallback((name: FieldName, value: string) => {
    markTouched(name)
    const trimmed = value.trim()
    if (!trimmed && name !== 'infrApmaterno' && name !== 'apmaterno' && name !== 'infrCorreo') {
      validateAndSet(name, value)
    } else if (trimmed) {
      validateAndSet(name, value)
    }
  }, [markTouched, validateAndSet])

  const clearFieldError = useCallback((name: FieldName) => {
    setFieldErrors(prev => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleFieldChange = useCallback((name: FieldName, setter: (v: string) => void, value: string) => {
    setter(value)
    clearFieldError(name)
  }, [clearFieldError])

  function irAResumen() {
    const errors: Partial<Record<FieldName, string>> = {}
    for (const fn of ['nombre', 'appaterno', 'curp', 'correo'] as FieldName[]) {
      const val = fn === 'nombre' ? nombre : fn === 'appaterno' ? appaterno : fn === 'curp' ? curp : correo
      const err = validateField(fn, val)
      if (err) errors[fn] = err
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const allNames = new Set<FieldName>(touched)
      Object.keys(errors).forEach(k => allNames.add(k as FieldName))
      setTouched(allNames)
      return
    }
    setPaso(4)
  }

  const handleSubmit = async () => {
    setSubmitError('')
    setSaving(true)
    try {
      const result = await capturarInfractorInfraccionesAction({
        id: infraccionId,
        es_titular: esTitular,
        nombre_infractor: infrNombre.trim().toUpperCase(),
        appaterno_infractor: infrAppaterno.trim().toUpperCase(),
        apmaterno_infractor: infrApmaterno.trim().toUpperCase(),
        curp_infractor: infrCurp.trim().toUpperCase(),
        correo_infractor: infrCorreo.trim(),
        nombre_titular: esTitular ? infrNombre.trim().toUpperCase() : nombre.trim().toUpperCase(),
        appaterno_titular: esTitular ? infrAppaterno.trim().toUpperCase() : appaterno.trim().toUpperCase(),
        apmaterno_titular: esTitular ? infrApmaterno.trim().toUpperCase() : apmaterno.trim().toUpperCase(),
        curp_titular: esTitular ? infrCurp.trim().toUpperCase() : curp.trim().toUpperCase(),
        correo_titular: esTitular ? infrCorreo.trim() : correo.trim(),
      })
      if (!result.success) {
        throw new Error(result.error || 'Error al guardar')
      }
      setSubmitted(true)
      onSuccess()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos'
      setSubmitError(msg)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    return () => { reset() }
  }, [reset])

  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [fieldErrors])

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-primary-muted">
          <CheckCircle2 size={28} strokeWidth={2} className="text-primary" />
        </div>
        <p className="text-base font-semibold text-slate-900 st-title">Datos guardados</p>
        <p className="mt-1 text-sm text-slate-500">El proceso ha sido iniciado correctamente.</p>
      </div>
    )
  }

  const totalPasos = esTitular && paso === 2 ? 2 : 3
  const inputClass = "w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"

  function avanzarPaso() {
    const errors: Partial<Record<FieldName, string>> = {}
    for (const fn of ['infrNombre', 'infrAppaterno', 'infrCurp'] as FieldName[]) {
      const val = fn === 'infrNombre' ? infrNombre : fn === 'infrAppaterno' ? infrAppaterno : infrCurp
      const err = validateField(fn, val)
      if (err) errors[fn] = err
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const allNames = new Set<FieldName>(touched)
      Object.keys(errors).forEach(k => allNames.add(k as FieldName))
      setTouched(allNames)
      return
    }
    setPaso(paso + 1)
  }

  return (
    <div ref={formRef} className="space-y-5">
      {/* ─── Stepper ─── */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary-muted text-primary"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          PASO {paso} DE {totalPasos}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPasos }).map((_, i) => {
            const stepNum = i + 1
            return (
              <span
                key={stepNum}
                className={`rounded-full transition-all duration-300 ${
                  stepNum === paso
                    ? 'h-[7px] w-5'
                    : stepNum < paso
                      ? 'h-[7px] w-[7px] opacity-40'
                      : 'h-[7px] w-[7px] bg-slate-200'
                } ${stepNum <= paso ? 'bg-primary' : ''}`}
              />
            )
          })}
        </div>
      </div>

      {/* ═══ Paso 1: Datos del infractor ═══ */}
      {paso === 1 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white bg-primary" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>1</span>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Datos del infractor</p>
          </div>

          <div className="border border-slate-200 rounded-md p-4 space-y-3" style={{ background: '#fafafa' }}>
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-primary-muted border border-primary/20">
              <AlertCircle size={12} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-primary leading-relaxed">
                Captura los datos del infractor registrados en la infracción.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Field
                name="infrNombre" label="Nombre(s)" value={infrNombre}
                onChange={v => handleFieldChange('infrNombre', setInfrNombre, v)}
                onBlur={() => handleBlur('infrNombre', infrNombre)}
                placeholder="Nombre(s)"
                error={touched.has('infrNombre') ? fieldErrors.infrNombre : undefined}
                required
              />
              <Field
                name="infrAppaterno" label="A. Paterno" value={infrAppaterno}
                onChange={v => handleFieldChange('infrAppaterno', setInfrAppaterno, v)}
                onBlur={() => handleBlur('infrAppaterno', infrAppaterno)}
                placeholder="Paterno"
                error={touched.has('infrAppaterno') ? fieldErrors.infrAppaterno : undefined}
                required
              />
              <Field
                name="infrApmaterno" label="A. Materno" value={infrApmaterno}
                onChange={v => handleFieldChange('infrApmaterno', setInfrApmaterno, v)}
                onBlur={() => markTouched('infrApmaterno')}
                placeholder="Materno"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Field
                name="infrCurp" label="CURP" value={infrCurp}
                onChange={v => handleFieldChange('infrCurp', setInfrCurp, v)}
                onBlur={() => handleBlur('infrCurp', infrCurp)}
                placeholder="CURP (18 caracteres)" maxLength={18} uppercase
                error={touched.has('infrCurp') ? fieldErrors.infrCurp : undefined}
                required
              />
              <Field
                name="infrCorreo" label="Correo" value={infrCorreo}
                onChange={v => handleFieldChange('infrCorreo', setInfrCorreo, v)}
                onBlur={() => handleBlur('infrCorreo', infrCorreo)}
                placeholder="correo@ejemplo.com" type="email"
                error={touched.has('infrCorreo') ? fieldErrors.infrCorreo : undefined}
              />
            </div>
          </div>

          <button
            onClick={avanzarPaso}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark transition-all duration-150 active:scale-[0.99] shadow-sm"
          >
            <span>Continuar</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ═══ Paso 2: Relación titular ═══ */}
      {paso === 2 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white bg-primary" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>2</span>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>El infractor es el titular</p>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-primary-muted">
              <p className="text-[11px] font-medium text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>¿El infractor es el propietario?</p>
              <div className="inline-flex items-center rounded-md p-0.5 bg-white border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setEsTitular(true); setPaso(4) }}
                  className="px-3.5 py-1.5 rounded text-[11px] font-medium text-white bg-primary hover:bg-primary-dark transition-all duration-150 shadow-sm"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setEsTitular(false); setPaso(3) }}
                  className="px-3.5 py-1.5 rounded text-[11px] font-medium transition-all duration-150 text-slate-500 hover:text-slate-900"
                >
                  No
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 p-3 rounded-md" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium text-amber-800">El infractor y el titular son personas distintas</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Capture los datos del propietario del vehículo para continuar el proceso.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPaso(1)}
                    className="inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                  >
                    <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" />
                    <span>Regresar</span>
                  </button>
                <button
                  onClick={() => { setEsTitular(false); setPaso(3) }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark transition-all duration-150 active:scale-[0.99] shadow-sm"
                >
                  <span>No, capturar datos</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Paso 3: Datos del titular ═══ */}
      {paso === 3 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white bg-primary" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>3</span>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Datos del titular</p>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-200 bg-primary-muted">
              <p className="text-[11px] font-medium text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Complete los datos del propietario</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-md" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-amber-800">El infractor y el titular son personas distintas</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">Capture los datos del propietario del vehículo para continuar el proceso.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Field name="nombre" label="Nombre(s)" value={nombre} onChange={v => handleFieldChange('nombre', setNombre, v)} onBlur={() => handleBlur('nombre', nombre)} placeholder="Nombre(s)" error={touched.has('nombre') ? fieldErrors.nombre : undefined} required />
                <Field name="appaterno" label="A. Paterno" value={appaterno} onChange={v => handleFieldChange('appaterno', setAppaterno, v)} onBlur={() => handleBlur('appaterno', appaterno)} placeholder="Paterno" error={touched.has('appaterno') ? fieldErrors.appaterno : undefined} required />
                <Field name="apmaterno" label="A. Materno" value={apmaterno} onChange={v => handleFieldChange('apmaterno', setApmaterno, v)} onBlur={() => markTouched('apmaterno')} placeholder="Materno" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Field name="curp" label="CURP" value={curp} onChange={v => handleFieldChange('curp', setCurp, v)} onBlur={() => handleBlur('curp', curp)} placeholder="CURP (18 caracteres)" maxLength={18} uppercase error={touched.has('curp') ? fieldErrors.curp : undefined} required />
                <Field name="correo" label="Correo" value={correo} onChange={v => handleFieldChange('correo', setCorreo, v)} onBlur={() => handleBlur('correo', correo)} placeholder="correo@ejemplo.com" type="email" error={touched.has('correo') ? fieldErrors.correo : undefined} required />
              </div>
              <div className="flex items-start gap-1.5 px-0.5">
                <Info size={12} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-primary leading-relaxed">
                  Estos datos deben coincidir con los del propietario registrados en la tarjeta de circulación.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setPaso(2)}
              className="inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
            >
              <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" />
              <span>Regresar</span>
            </button>
            <button
              onClick={irAResumen}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark transition-all duration-150 active:scale-[0.99] shadow-sm"
            >
              <span>Continuar</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Paso 4: Resumen ═══ */}
      {paso === 4 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white bg-primary" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>4</span>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Resumen</p>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-200 bg-primary-muted">
              <p className="text-[11px] font-medium text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Confirme los datos antes de iniciar el proceso</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="rounded-md border border-slate-200 divide-y divide-slate-100">
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Es titular</span>
                  <span className="text-[13px] font-medium text-slate-900">{esTitular ? 'Sí' : 'No'}</span>
                </div>
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Infractor</p>
                  <p className="text-[13px] font-medium text-slate-900">{[infrNombre, infrAppaterno, infrApmaterno].filter(Boolean).join(' ')}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{infrCurp}</p>
                  {infrCorreo && <p className="text-[11px] text-slate-500">{infrCorreo}</p>}
                </div>
                {!esTitular && (
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Titular</p>
                    <p className="text-[13px] font-medium text-slate-900">{[nombre, appaterno, apmaterno].filter(Boolean).join(' ')}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{curp}</p>
                    <p className="text-[11px] text-slate-500">{correo}</p>
                  </div>
                )}
              </div>

              {submitError && (
                <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-50 border border-red-200" role="alert">
                  <AlertCircle size={12} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-red-600">{submitError}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaso(esTitular ? 2 : 3)}
                  className="inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                >
                  <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" />
                  <span>Regresar</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white transition-all duration-150 active:scale-[0.99] shadow-sm ${
                    saving ? 'opacity-60 cursor-not-allowed bg-slate-400' : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {saving ? (
                    <><Loader2 size={14} className="animate-spin" /><span>Iniciando proceso…</span></>
                  ) : (
                    <><span>Iniciar proceso</span><ArrowRight size={14} strokeWidth={2.5} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error (fallback) ── */}
      {submitError && (
        <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-50 border border-red-200" role="alert">
          <AlertCircle size={12} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-red-600">{submitError}</p>
        </div>
      )}

      <div ref={firstErrorRef} />
    </div>
  )
}

function Field({
  name, label, value, onChange, onBlur, placeholder, maxLength, type, uppercase, error, required,
}: {
  name: string; label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  placeholder?: string; maxLength?: number; type?: string; uppercase?: boolean
  error?: string; required?: boolean
}) {
  const fieldId = `field-${name}`
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="text-[10px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={type ?? 'text'}
          value={value}
          onChange={e => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          aria-invalid={!!error}
          className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-300 focus:ring-red-200/50'
              : 'border-slate-200 focus:border-primary focus:ring-primary/10'
          }`}
          style={{
            fontFamily: uppercase ? "'JetBrains Mono',monospace" : "'Inter',sans-serif",
            letterSpacing: uppercase ? '0.05em' : undefined,
          }}
        />
      </div>
      <div className="flex items-center justify-between min-h-[16px]">
        {error ? (
          <p role="alert" className="text-[10px] font-medium text-red-600">{error}</p>
        ) : <span />}
        {maxLength && (
          <p className={`text-[10px] ml-auto ${value.length >= maxLength ? 'text-red-600' : 'text-slate-400'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
