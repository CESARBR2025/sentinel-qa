'use client'

import { useRef, useState } from "react"
import { FileText, Upload, User, ArrowRight, CheckCircle2 } from "lucide-react"
import { useToastStore } from "@/lib/fiscalia/useToastStore"
import { guardarOficioAction } from "@/lib/fiscalia/actions"

const inputClass = "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"

interface CargarOficioSectionProps {
    idInfraccion: string
    folio?: string
    noOficioActual?: string
    noCarpetaActual?: string
    nombreInfractor?: string
    appaternoInfractor?: string
    apmaternoInfractor?: string
    correoInfractor?: string
    curpInfractor?: string
    onSuccess?: () => void
    onClose?: () => void
}

export default function CargarOficioSection({
    idInfraccion,
    folio,
    noOficioActual,
    noCarpetaActual,
    nombreInfractor,
    appaternoInfractor,
    apmaternoInfractor,
    correoInfractor,
    curpInfractor,
    onSuccess,
    onClose,
}: CargarOficioSectionProps) {
    const [paso, setPaso] = useState(1)
    const [numeroOficio, setNumeroOficio] = useState(noOficioActual && noOficioActual !== 'NO_DATA' ? noOficioActual : '')
    const [noCarpeta, setNoCarpeta] = useState(noCarpetaActual && noCarpetaActual !== 'NO_DATA' ? noCarpetaActual : '')
    const [archivo, setArchivo] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const [errores, setErrores] = useState<Record<string, string>>({})
    const fileRef = useRef<HTMLInputElement>(null)
    const addToast = useToastStore((s) => s.addToast)

    // Infractor capture (when curp === NO_DATA)
    const [infractorNombre, setInfractorNombre] = useState('')
    const [infractorAppaterno, setInfractorAppaterno] = useState('')
    const [infractorApmaterno, setInfractorApmaterno] = useState('')
    const [infractorCorreo, setInfractorCorreo] = useState('')
    const [infractorCurp, setInfractorCurp] = useState('')

    const necesitaCapturaInfractor = !curpInfractor || curpInfractor === 'NO_DATA'
    const pasoInfractorOffset = necesitaCapturaInfractor ? 1 : 0
    const totalPasos = 3 + pasoInfractorOffset

    function validarInfractor(): boolean {
        const e: Record<string, string> = {}
        if (!infractorNombre.trim()) e.infractorNombre = 'Requerido'
        if (!infractorAppaterno.trim()) e.infractorAppaterno = 'Requerido'
        if (!infractorCorreo.trim()) e.infractorCorreo = 'Requerido'
        if (!infractorCurp.trim()) {
            e.infractorCurp = 'Requerido'
        } else if (infractorCurp.trim().length !== 18) {
            e.infractorCurp = 'Debe tener 18 caracteres'
        }
        setErrores(e)
        return Object.keys(e).length === 0
    }

    function validarOficio(): boolean {
        const e: Record<string, string> = {}
        if (!numeroOficio.trim()) e.numeroOficio = 'Requerido'
        if (!noCarpeta.trim()) e.noCarpeta = 'Requerido'
        setErrores(e)
        return Object.keys(e).length === 0
    }

    function validarArchivo(): boolean {
        const e: Record<string, string> = {}
        if (!archivo) e.archivo = 'Debe seleccionar un archivo'
        setErrores(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validarOficio()) return
        if (!archivo) { setErrores({ archivo: 'Debe seleccionar un archivo' }); return }
        setSaving(true)
        try {
            const fd = new FormData()
            fd.append('folio', idInfraccion)
            fd.append('numero_oficio', numeroOficio.trim())
            fd.append('archivoIne', archivo)
            if (noCarpeta.trim()) fd.append('no_carpeta_investigacion', noCarpeta.trim())

            // Enviar datos del infractor cuando fueron capturados (CURP era NO_DATA)
            if (necesitaCapturaInfractor) {
                fd.append('nombre_infractor', infractorNombre.trim().toUpperCase())
                fd.append('apellido_paterno_infractor', infractorAppaterno.trim().toUpperCase())
                fd.append('apellido_materno_infractor', infractorApmaterno.trim().toUpperCase())
                fd.append('correo_infractor', infractorCorreo.trim())
                fd.append('curp_infractor', infractorCurp.trim().toUpperCase())
            }

            const result = await guardarOficioAction(fd)
            if (!result.success) throw new Error(result.error)

            addToast('Oficio registrado correctamente', 'success')
            onSuccess?.()
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al guardar el oficio'
            addToast(msg, 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-primary/20 bg-primary-muted rounded-t-lg">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-primary">
                        <FileText size={14} strokeWidth={2.2} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-wider text-primary">Registrar Oficio </h3>
                        <p className="text-[10px] text-primary/70 mt-0.5">Folio: {folio || idInfraccion}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-500 transition-colors bg-white border border-slate-200 shrink-0" aria-label="Cerrar">
                        ✕
                    </button>
                )}
            </div>

            <div className="p-5 space-y-5">
                <>
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-primary-muted text-primary text-[11px] font-medium px-2.5 py-1 rounded">
                            <span className="w-1.5 h-1.5 rounded-sm bg-primary" />
                            Paso {paso} de {totalPasos}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPasos }).map((_, i) => {
                                const stepNum = i + 1
                                return (
                                    <span key={stepNum} className={stepNum === paso ? 'h-[7px] w-5 rounded-full bg-primary' : stepNum < paso ? 'h-[7px] w-[7px] rounded-full bg-primary opacity-35' : 'h-[7px] w-[7px] rounded-full bg-slate-200'} />
                                )
                            })}
                        </div>
                    </div>

                    {/* Paso 1: Datos del oficio */}
                    {paso === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium tracking-wider uppercase text-slate-500">Número de Oficio <span className="text-red-600" aria-hidden="true">*</span></label>
                                <input type="text" value={numeroOficio} onChange={e => { setNumeroOficio(e.target.value); setErrores(p => ({ ...p, numeroOficio: '' })) }} placeholder="Escriba el número de oficio" className={`${inputClass} ${errores.numeroOficio ? 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-200/50' : ''}`} />
                                {errores.numeroOficio && <p className="text-xs font-medium text-red-600">{errores.numeroOficio}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium tracking-wider uppercase text-slate-500">No. Carpeta de Investigación <span className="text-red-600" aria-hidden="true">*</span></label>
                                <input type="text" value={noCarpeta} onChange={e => { setNoCarpeta(e.target.value); setErrores(p => ({ ...p, noCarpeta: '' })) }} placeholder="Ej: C-2025-00123" className={`${inputClass} ${errores.noCarpeta ? 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-200/50' : ''}`} />
                                {errores.noCarpeta && <p className="text-xs font-medium text-red-600">{errores.noCarpeta}</p>}
                            </div>
                            <button onClick={() => { if (validarOficio()) setPaso(2) }} className="w-full inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark active:bg-primary-dark active:scale-[0.99] shadow-sm transition-all duration-150">
                                <span>Continuar</span>
                                <ArrowRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}

                    {/* Paso 2: Capturar datos del infractor (solo si curp === NO_DATA) */}
                    {paso === 2 && necesitaCapturaInfractor && (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-primary-muted"><User size={11} strokeWidth={2.5} className="text-primary" /></div>
                                    <p className="text-xs font-medium text-primary">Datos del infractor</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <Campo label="Nombre(s)" value={infractorNombre} onChange={setInfractorNombre} error={errores.infractorNombre} limpiarError={() => setErrores(p => ({ ...p, infractorNombre: '' }))} required />
                                    <Campo label="A. Paterno" value={infractorAppaterno} onChange={setInfractorAppaterno} error={errores.infractorAppaterno} limpiarError={() => setErrores(p => ({ ...p, infractorAppaterno: '' }))} required />
                                    <Campo label="A. Materno" value={infractorApmaterno} onChange={setInfractorApmaterno} error={errores.infractorApmaterno} limpiarError={() => setErrores(p => ({ ...p, infractorApmaterno: '' }))} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-medium tracking-wider uppercase text-slate-500">Correo Electrónico <span className="text-red-600" aria-hidden="true">*</span></label>
                                        <input type="text" value={infractorCorreo} onChange={e => { setInfractorCorreo(e.target.value); setErrores(p => ({ ...p, infractorCorreo: '' })) }} placeholder="correo@ejemplo.com" className={`${inputClass} ${errores.infractorCorreo ? 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-200/50' : ''}`} />
                                        {errores.infractorCorreo && <p className="text-xs font-medium text-red-600">{errores.infractorCorreo}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-medium tracking-wider uppercase text-slate-500">CURP <span className="text-red-600" aria-hidden="true">*</span></label>
                                        <input type="text" value={infractorCurp} onChange={e => { setInfractorCurp(e.target.value.toUpperCase()); setErrores(p => ({ ...p, infractorCurp: '' })) }} placeholder="CURP (18 caracteres)" maxLength={18} className={`${inputClass} font-mono tracking-wider ${errores.infractorCurp ? 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-200/50' : ''}`} />
                                        {errores.infractorCurp && <p className="text-xs font-medium text-red-600">{errores.infractorCurp}</p>}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { if (validarInfractor()) setPaso(3) }} className="w-full inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark active:bg-primary-dark active:scale-[0.99] shadow-sm transition-all duration-150">
                                <span>Continuar</span><ArrowRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}

                    {/* Paso 3 (o 2 si no hay captura infractor): Archivo */}
                    {paso === (2 + pasoInfractorOffset) && (
                        <div className="space-y-4">
                            <FileUpload archivo={archivo} setArchivo={setArchivo} fileRef={fileRef} error={errores.archivo} setError={setErrores} />
                            <div className="flex items-center gap-3">
                                <button onClick={() => setPaso(p => p - 1)} className="inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13px] font-medium text-slate-600 bg-transparent border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-colors duration-150">
                                    <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" /><span>Regresar</span>
                                </button>
                                <button onClick={() => { if (validarArchivo()) setPaso(3 + pasoInfractorOffset) }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark active:bg-primary-dark active:scale-[0.99] shadow-sm transition-all duration-150">
                                    <span>Continuar</span><ArrowRight size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso resumen */}
                    {paso === (3 + pasoInfractorOffset) && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary" />
                                <p className="text-sm font-medium text-slate-900">Revise la información antes de guardar</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                                <div className="p-3 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Número de Oficio</span>
                                    <span className="text-xs font-medium text-slate-900">{numeroOficio}</span>
                                </div>
                                <div className="p-3 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">No. Carpeta Investigación</span>
                                    <span className="text-xs font-medium text-slate-900">{noCarpeta}</span>
                                </div>
                                {necesitaCapturaInfractor && (
                                    <div className="divide-y divide-slate-100">
                                        <div className="p-3 flex items-center justify-between">
                                            <span className="text-xs text-slate-500">Infractor</span>
                                            <span className="text-xs font-medium text-slate-900">{[infractorNombre, infractorAppaterno, infractorApmaterno].filter(Boolean).join(' ')}</span>
                                        </div>
                                        <div className="p-3 flex items-center justify-between">
                                            <span className="text-xs text-slate-500">Correo infractor</span>
                                            <span className="text-xs font-medium text-slate-900">{infractorCorreo || '—'}</span>
                                        </div>
                                        <div className="p-3 flex items-center justify-between">
                                            <span className="text-xs text-slate-500">CURP infractor</span>
                                            <span className="text-xs font-medium text-slate-900 font-mono">{infractorCurp || '—'}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-3 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Archivo</span>
                                    <span className="text-xs font-medium text-slate-900">{archivo?.name || '—'}</span>
                                </div>
                            </div>
                            {errores.archivo && <p className="text-xs font-medium text-red-600">{errores.archivo}</p>}
                            <div className="flex items-center gap-3">
                                <button onClick={() => setPaso(p => p - 1)} className="inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13px] font-medium text-slate-600 bg-transparent border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-colors duration-150">
                                    <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" /><span>Regresar</span>
                                </button>
                                <button onClick={handleSubmit} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark active:bg-primary-dark active:scale-[0.99] shadow-sm transition-all duration-150 disabled:bg-primary/30 disabled:cursor-not-allowed">
                                    {saving ? 'Guardando…' : 'Guardar Documentos'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            </div>
        </div>
    )
}

function Campo({ label, value, onChange, error, limpiarError, required }: {
    label: string; value: string; onChange: (v: string) => void; error?: string; limpiarError: () => void; required?: boolean
}) {
    const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
        <div className="space-y-1">
            <label htmlFor={fieldId} className="text-[10px] font-medium tracking-wider uppercase text-slate-500">
                {label}{required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
            </label>
            <input id={fieldId} type="text" value={value} onChange={e => { onChange(e.target.value); limpiarError() }} placeholder={label} className={`${inputClass} ${error ? 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-200/50' : ''}`} />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
    )
}

function FileUpload({ archivo, setArchivo, fileRef, error, setError }: {
    archivo: File | null; setArchivo: (f: File | null) => void; fileRef: React.RefObject<HTMLInputElement | null>; error?: string; setError: (e: Record<string, string>) => void
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium tracking-wider uppercase text-slate-500">
                Archivo del Oficio <span className="text-red-600" aria-hidden="true">*</span>
                <span className="text-slate-400 font-normal normal-case"> (PDF o imagen)</span>
            </label>
            <button
                onClick={() => fileRef.current?.click()}
                className={`w-full rounded-md border-2 border-dashed p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer ${archivo ? 'bg-primary-muted border-primary/30' : error ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
            >
                {archivo ? (
                    <>
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary"><FileText size={16} strokeWidth={2} className="text-white" /></div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{archivo.name}</p>
                            <p className="text-[11px] text-slate-500">{(archivo.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setArchivo(null); if (fileRef.current) fileRef.current.value = ''; setError({ archivo: '' }) }} className="text-[11px] text-red-600 font-medium hover:underline">Quitar archivo</button>
                    </>
                ) : (
                    <>
                        <Upload size={20} strokeWidth={1.5} className="text-slate-400" />
                        <p className="text-sm font-medium text-slate-500">Seleccionar archivo</p>
                        <p className="text-xs text-slate-400">PDF o imagen &middot; Máx 10 MB</p>
                        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                    </>
                )}
            </button>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { setArchivo(e.target.files?.[0] ?? null); setError({ archivo: '' }) }} />
        </div>
    )
}
