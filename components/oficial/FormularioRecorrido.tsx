'use client'

import React, { useRef, useEffect } from 'react'
import {
  MessageSquare, User, AlertTriangle, MapPin,
  ClipboardCheck, Clock, Shield, Send, Search,
  FileText, Gavel, Car, Hash, Archive, ArrowLeft
} from 'lucide-react'
import { crearReporteCampoOficial } from "@/lib/oficial/actions"
import { MapaUbicacion } from './MapaUbicacion'
import { SelectorDestinoLegal } from './SelectorDestinoLegal'
import { useOficialFormStore } from '@/lib/oficial/store'

const STEPS = [
  'Origen',
  'Incidente',
  'Ubicación',
  'Intervención',
  'Aseguramientos',
  'Seguimientos',
  'Resumen',
]

const SentinelField = ({ label, icon: Icon, as = 'input', name, fullWidth = false, ...props }: any) => {
  const Component = as
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: fullWidth ? 'span 3' : 'span 1' }}>
      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: '12px', color: '#94a3b8', zIndex: 1 }} />}
        <Component
          {...props}
          name={name}
          style={{
            width: '100%',
            padding: `12px 12px 12px ${Icon ? '40px' : '12px'}`,
            background: props.disabled ? '#f8fafc' : '#ffffff',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #1f355a',
            borderRadius: '2px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            outline: 'none',
            minHeight: as === 'textarea' ? '120px' : 'auto',
            ...props.style
          }}
        />
      </div>
    </div>
  )
}

interface PrefillDespacho {
  folioCad?: string
  descripcion?: string
  calle?: string
  colonia?: string
  tipoEmergenciaId?: number
  tipoIncidenteId?: number
  prioridadId?: number
}

export function FormularioRecorrido({ user, catalogos, incidenteId, prefill, embedded = false }: { user: any, catalogos: any, incidenteId?: string, prefill?: PrefillDespacho, embedded?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)
  const store = useOficialFormStore()
  const s = useOficialFormStore.getState()
  const step = store.step
  const setStep = store.setStep
  const isAnonimo = store.isAnonimo
  const tipoEmergenciaId = store.tipoEmergenciaId
  const subtipoEmergenciaId = store.subtipoEmergenciaId
  const tipoIncidenteId = store.tipoIncidenteId
  const prioridadId = store.prioridadId
  const descripcion = store.descripcion
  const contenidoReporte = store.contenidoReporte
  const datosPositivosNegativos = store.datosPositivosNegativos
  const accionesRealizadas = store.accionesRealizadas
  const objetosRecuperados = store.objetosRecuperados
  const resultadoCateo = store.resultadoCateo
  const tieneDetencion = store.tieneDetencion
  const autoridadRecibe = store.autoridadRecibe
  const tieneCateo = store.tieneCateo
  const domicilioCateado = store.domicilioCateado
  const detenidos = store.detenidos
  const numVehiculos = store.numVehiculos
  const vehiculos = store.vehiculos
  const tieneVehiculo = store.tieneVehiculo
  const folioCad = store.folioCad
  const nombreReportante = store.nombreReportante
  const montoRobo = store.montoRobo
  const currentLocDisplay = store.calle ? `${store.calle}${store.colonia ? `, ${store.colonia}` : ''}` : ''
  const $ = store.setField

  // Clasificación jerárquica (Tipo -> Subtipo -> Incidente), igual que 911/whatsapp/rondín
  const subTiposFiltrados = tipoEmergenciaId
    ? catalogos.subtipos.filter((s: any) => s.tipoEmergenciaId === Number(tipoEmergenciaId))
    : []
  const incidentesFiltrados = subtipoEmergenciaId
    ? catalogos.incidentes.filter((i: any) => i.subtipoEmergenciaId === Number(subtipoEmergenciaId))
    : []
  const prioridadAutocompletada = tipoIncidenteId
    ? catalogos.incidentes.find((i: any) => i.id === Number(tipoIncidenteId))?.prioridadCatalogo
    : null
  const esImprocedente = tipoEmergenciaId
    ? catalogos.emergencias.find((c: any) => c.id === Number(tipoEmergenciaId))?.codigo === '7'
    : false
  const nombreTipoEmergencia = tipoEmergenciaId ? catalogos.emergencias.find((c: any) => c.id === Number(tipoEmergenciaId))?.nombre ?? '' : ''
  const nombreTipoIncidente = tipoIncidenteId ? catalogos.incidentes.find((c: any) => c.id === Number(tipoIncidenteId))?.nombre ?? '' : ''
  const nombrePrioridad = prioridadId ? catalogos.prioridades.find((c: any) => c.id === Number(prioridadId))?.nombre ?? '' : ''

  const resolverPrioridadIdPorCatalogo = (incidenteIdSel: string): string => {
    const inc = catalogos.incidentes.find((i: any) => i.id === Number(incidenteIdSel))
    const match = inc ? catalogos.prioridades.find((p: any) => p.nombre?.toUpperCase() === inc.prioridadCatalogo) : null
    return match ? String(match.id) : ''
  }

  console.log(store)

  const primerIncidente = catalogos.incidentes[0]
  const primerSubtipo = primerIncidente
    ? catalogos.subtipos.find((s: any) => s.id === primerIncidente.subtipoEmergenciaId)
    : catalogos.subtipos[0]
  const defaults = {
    dTipoEmergenciaId: String(primerSubtipo?.tipoEmergenciaId ?? catalogos.emergencias[0]?.id ?? ''),
    dSubtipoEmergenciaId: String(primerSubtipo?.id ?? ''),
    dTipoIncidenteId: String(primerIncidente?.id ?? ''),
    dPrioridadId: primerIncidente ? resolverPrioridadIdPorCatalogo(String(primerIncidente.id)) : '',
    dDescripcion: 'Reporte generado por oficial en campo — sin descripción detallada.',
    dContenido: 'Sin contenido adicional registrado en este reporte.',
    dDatosPN: 'Sin datos positivos o negativos registrados.',
    dAcciones: 'Se realizó recorrido de vigilancia en el sector asignado sin novedades.',
    dObjetos: 'Sin objetos asegurados en este reporte.',
    dResultado: 'Sin resultado registrado.',
  }

  useEffect(() => {
    // Si viene un incidente prellenado (cierre de despacho), derivar SU subtipo real —
    // nunca el subtipo del default, o la cascada no encontraría el incidente en la lista filtrada.
    const incidentePrefill = prefill?.tipoIncidenteId != null
      ? catalogos.incidentes.find((i: any) => i.id === prefill.tipoIncidenteId)
      : null
    const subtipoPrefillId = incidentePrefill
      ? String(incidentePrefill.subtipoEmergenciaId ?? '')
      : defaults.dSubtipoEmergenciaId

    store.reset()
    store.setField('tipoEmergenciaId', prefill?.tipoEmergenciaId != null ? String(prefill.tipoEmergenciaId) : defaults.dTipoEmergenciaId)
    store.setField('subtipoEmergenciaId', subtipoPrefillId)
    store.setField('tipoIncidenteId', prefill?.tipoIncidenteId != null ? String(prefill.tipoIncidenteId) : defaults.dTipoIncidenteId)
    store.setField('prioridadId', prefill?.prioridadId != null ? String(prefill.prioridadId) : defaults.dPrioridadId)
    store.setField('descripcion', prefill?.descripcion ?? defaults.dDescripcion)
    store.setField('contenidoReporte', defaults.dContenido)
    store.setField('datosPositivosNegativos', defaults.dDatosPN)
    store.setField('accionesRealizadas', defaults.dAcciones)
    store.setField('objetosRecuperados', defaults.dObjetos)
    store.setField('resultadoCateo', defaults.dResultado)
    if (prefill?.folioCad) store.setField('folioCad', prefill.folioCad)
    if (prefill?.calle) store.setField('calle', prefill.calle)
    if (prefill?.colonia) store.setField('colonia', prefill.colonia)

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        store.reset()
        store.setField('tipoEmergenciaId', defaults.dTipoEmergenciaId)
        store.setField('subtipoEmergenciaId', defaults.dSubtipoEmergenciaId)
        store.setField('tipoIncidenteId', defaults.dTipoIncidenteId)
        store.setField('prioridadId', defaults.dPrioridadId)
        store.setField('descripcion', defaults.dDescripcion)
        store.setField('contenidoReporte', defaults.dContenido)
        store.setField('datosPositivosNegativos', defaults.dDatosPN)
        store.setField('accionesRealizadas', defaults.dAcciones)
        store.setField('objetosRecuperados', defaults.dObjetos)
        store.setField('resultadoCateo', defaults.dResultado)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const handleSubmit = () => {
    const fd = new FormData()
    const st = useOficialFormStore.getState()

    fd.set('ofi_folio_cad', st.folioCad)
    fd.set('ofi_nombre_reportante', st.isAnonimo ? '' : st.nombreReportante)
    fd.set('ofi_anonimo', String(st.isAnonimo))
    fd.set('ofi_tipo_emergencia_id', st.tipoEmergenciaId)
    fd.set('ofi_tipo_incidente_id', st.tipoIncidenteId)
    fd.set('ofi_prioridad_id', st.prioridadId)
    fd.set('ofi_descripcion', st.descripcion)
    fd.set('ofi_contenido_reporte', st.contenidoReporte)
    fd.set('ofi_datos_pn', st.datosPositivosNegativos)
    fd.set('ofi_acciones', st.accionesRealizadas)
    fd.set('ofi_hay_detencion', st.tieneDetencion)
    fd.set('ofi_autoridad_recibe', st.autoridadRecibe)
    fd.set('ofi_monto_robo', st.montoRobo)
    fd.set('ofi_hay_robo', st.hayRobo)
    fd.set('ofi_objetos_recuperados', st.objetosRecuperados)
    fd.set('ofi_hay_vehiculo', st.tieneVehiculo)
    fd.set('ofi_hay_cateo', st.tieneCateo)
    fd.set('ofi_resultado_cateo', st.resultadoCateo)
    fd.set('ofi_quiere_denuncia', String(st.quiereDenuncia))

    // Ubicación desde store (persiste aunque el mapa se desmonte)
    fd.set('ofi_calle', st.calle)
    fd.set('ofi_colonia', st.colonia)
    fd.set('ofi_latitud', st.latitud)
    fd.set('ofi_longitud', st.longitud)

    // Cateo desde store
    fd.set('ofi_cateo_calle', st.cateoCalle)
    fd.set('ofi_cateo_colonia', st.cateoColonia)
    fd.set('ofi_cateo_numero', st.cateoNumero)
    fd.set('ofi_cateo_latitud', st.cateoLat)
    fd.set('ofi_cateo_longitud', st.cateoLng)

    // Detenidos desde store
    fd.set('ofi_detenidos', JSON.stringify(st.detenidos))

    fd.set('ofi_hay_orden_aprehension', String(st.hayOrdenAprehension))
    fd.set('ofi_ordenes_aprehension', JSON.stringify(st.ordenesAprehension))
    fd.set('ofi_hay_hidrocarburo', String(st.hayHidrocarburo))
    fd.set('ofi_hidrocarburos', JSON.stringify(st.hidrocarburos))
    fd.set('ofi_hay_arma_fuego', String(st.hayArmaFuego))
    fd.set('ofi_armas_fuego', JSON.stringify(st.armasFuego))
    fd.set('ofi_hay_droga', String(st.hayDroga))
    fd.set('ofi_drogas', JSON.stringify(st.drogas))

    fd.set('ofi_telefono_reportante', st.telefonoReportante)
    fd.set('ofi_observaciones', st.observaciones)

    fd.set('ofi_apoyo_fiestas_patronales', String(st.apoyoFiestasPatronales))
    fd.set('ofi_operativos_metropolitano', String(st.operativosMetropolitano))
    fd.set('ofi_eco8', String(st.eco8))
    fd.set('ofi_alcoholimetria', String(st.alcoholimetria))
    fd.set('ofi_motocicletas', String(st.motocicletas))
    fd.set('ofi_apoyo_actuarios', String(st.apoyoActuarios))
    fd.set('ofi_apoyo_cateos_fgr', String(st.apoyo_cateosFgr))
    fd.set('ofi_apoyo_cateos_fge', String(st.apoyo_cateosFge))

    // Vehiculos desde store
    const partes: string[] = []
    st.vehiculos.forEach(v => {
      if (v.placas || v.serie || v.color) {
        partes.push(`Tipo:${v.tipo}, Placas:${v.placas}, Serie:${v.serie}, Color:${v.color}, Destino:${v.destino}`)
      }
    })
    fd.set('ofi_vehiculos', partes.join('|'))

    // Reporte vinculado a solicitud de despacho: su registro cierra el incidente
    if (incidenteId) fd.set('incidente_id', incidenteId)

    // Validar destino legal obligatorio si hay detención
    if (st.tieneDetencion === 'true' && !st.autoridadRecibe) {
      alert('Debes seleccionar el destino legal del detenido (FGE, FGR o Juzgado Cívico)')
      return
    }

    crearReporteCampoOficial(fd)
  }

  const Wrapper: any = embedded ? 'div' : 'main'
  const wrapperStyle = embedded
    ? { paddingTop: 32 }
    : { maxWidth: '900px', margin: '0 auto', padding: '40px 48px' }

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()} style={embedded ? { color: '#1e293b' } : { minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <Wrapper style={wrapperStyle}>

        {!embedded && (
          <div style={{ marginBottom: '32px' }}>
            <a href="/oficial" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, textDecoration: 'none', marginBottom: 16 }}>
              <ArrowLeft size={14} /> Volver al panel
            </a>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600 }}>
              Oficial en Campo
            </span>
            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800, fontSize: 32, letterSpacing: '0.02em',
              textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a'
            }}>
              Reporte de <span style={{ color: '#1f355a' }}>Recorrido</span>
            </h1>
          </div>
        )}

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, padding: '0 4px' }}>
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <button type="button" onClick={() => setStep(i)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
                  background: i === step ? '#1f355a' : i < step ? '#1f355a' : '#e2e8f0',
                  color: i <= step ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s',
                }}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 600,
                  color: i === step ? '#1f355a' : i < step ? '#1f355a' : '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 1,
                  background: i < step ? '#1f355a' : '#e2e8f0',
                  margin: '0 12px',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* STEP 0: ORIGEN */}
          {step === 0 && (
            <section className="of-card">
              <h2 className="of-section-title">Origen e Identificación</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField label="Canal de Origen" icon={MessageSquare} value="Sistema" disabled />
                <SentinelField label="Folio CAD" name="ofi_folio_cad" icon={Hash} placeholder="Número CAD..." value={folioCad} onChange={(e: any) => $('folioCad', e.target.value)} />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', gridColumn: 'span 2' }}>
                  <div style={{ flexGrow: 1 }}>
                    <SentinelField
                      label="Nombre del Reportante (Si aplica)"
                      name="ofi_nombre_reportante"
                      icon={User}
                      value={nombreReportante}
                      onChange={(e: any) => $('nombreReportante', e.target.value)}
                      placeholder={isAnonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre del ciudadano..."}
                      disabled={isAnonimo}
                    />
                  </div>
                  {!isAnonimo && (
                    <SentinelField label="Teléfono del Reportante" name="ofi_telefono_reportante"
                      value={store.telefonoReportante}
                      onChange={(e: any) => $('telefonoReportante', e.target.value)}
                      placeholder="10 dígitos" type="tel" />
                  )}
                  <input type="hidden" name="ofi_anonimo" value={isAnonimo ? "true" : "false"} />
                  <button type="button" onClick={() => $('isAnonimo', !isAnonimo)} className="of-btn-toggle">
                    {isAnonimo ? '[ ANÓNIMO: ON ]' : '[ ANÓNIMO: OFF ]'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* STEP 1: INCIDENTE */}
          {step === 1 && (
            <section className="of-card">
              <h2 className="of-section-title">Detalles del Incidente</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <SentinelField label="Tipo de Emergencia" name="ofi_tipo_emergencia_id" as="select" required
                  value={tipoEmergenciaId}
                  onChange={(e: any) => { $('tipoEmergenciaId', e.target.value); $('subtipoEmergenciaId', ''); $('tipoIncidenteId', '') }}>
                  {catalogos.emergencias.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>
                  ))}
                </SentinelField>
                <SentinelField label="Subtipo" name="ofi_subtipo_emergencia_id" as="select" required
                  value={subtipoEmergenciaId} disabled={!tipoEmergenciaId}
                  onChange={(e: any) => { $('subtipoEmergenciaId', e.target.value); $('tipoIncidenteId', '') }}>
                  <option value="">{tipoEmergenciaId ? 'Seleccionar subtipo...' : 'Primero seleccione tipo'}</option>
                  {subTiposFiltrados.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.codigo} - {item.nombre}</option>
                  ))}
                </SentinelField>
                <SentinelField label="Incidente Específico" name="ofi_tipo_incidente_id" as="select" required
                  value={tipoIncidenteId} disabled={!subtipoEmergenciaId}
                  onChange={(e: any) => { $('tipoIncidenteId', e.target.value); $('prioridadId', resolverPrioridadIdPorCatalogo(e.target.value)) }}>
                  <option value="">{subtipoEmergenciaId ? 'Seleccionar incidente...' : 'Primero seleccione subtipo'}</option>
                  {incidentesFiltrados.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.codigoCatalogo && `${item.codigoCatalogo} - `}{item.nombre}</option>
                  ))}
                </SentinelField>
                {esImprocedente && (
                  <div style={{ gridColumn: 'span 3', fontSize: 11, color: '#b45309' }}>
                    Tipo Improcedentes según el Catálogo Nacional.
                  </div>
                )}
                <SentinelField label="Prioridad (autocompletada)" value={prioridadAutocompletada || '—'} disabled />
                <SentinelField label="Ajuste manual de prioridad" name="ofi_prioridad_id" as="select" value={prioridadId} onChange={(e: any) => $('prioridadId', e.target.value)}>
                  <option value="">Automática (por catálogo)</option>
                  {catalogos.prioridades.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </SentinelField>
                <SentinelField name="ofi_descripcion" label="Incidente (Descripción)" as="textarea" fullWidth placeholder="Descripción breve..." value={descripcion} onChange={(e: any) => $('descripcion', e.target.value)} />
                <SentinelField label="Contenido del Reporte" as="textarea" fullWidth placeholder="Relatoría extensa de los hechos..." name="ofi_contenido_reporte" value={contenidoReporte} onChange={(e: any) => $('contenidoReporte', e.target.value)} />
              </div>
            </section>
          )}

          {/* STEP 2: UBICACIÓN */}
          {step === 2 && (
            <section className="of-card">
              <h2 className="of-section-title">Ubicación</h2>
              <MapaUbicacion onLocationSelect={(loc) => store.setLocation({ calle: loc.calle, colonia: loc.colonia, lat: String(loc.lat), lng: String(loc.lng) })} />
              <div style={{ marginTop: 16 }}>
                <SentinelField label="Datos Positivos/Negativos" name="ofi_datos_pn" icon={Search} placeholder="¿Se encontró lo reportado?" value={datosPositivosNegativos} onChange={(e: any) => $('datosPositivosNegativos', e.target.value)} />
              </div>
            </section>
          )}

          {/* STEP 3: INTERVENCIÓN Y DETENCIONES */}
          {step === 3 && (
            <section className="of-card">
              <h2 className="of-section-title">Intervención y Detenciones</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <div style={{ gridColumn: 'span 3' }}>
                  <SentinelField label="Acciones Realizadas" name="ofi_acciones" as="textarea" placeholder="¿Qué hizo la unidad al llegar?" value={accionesRealizadas} onChange={(e: any) => $('accionesRealizadas', e.target.value)} />
                </div>
                <SentinelField label="¿Hubo Detención?" name="ofi_hay_detencion" as="select" value={tieneDetencion} onChange={(e: any) => $('tieneDetencion', e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneDetencion === "true" && (
                  <>
                    <div style={{ gridColumn: 'span 3' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Detenidos
                        </span>
                        <button type="button" onClick={() => store.setDetenidos([...detenidos, { nombre: '', apellidoPaterno: '', apellidoMaterno: '' }])} className="of-btn-toggle" style={{ fontSize: 10 }}>
                          + AGREGAR DETENIDO
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {detenidos.map((d, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              data-det-nombre
                              value={d.nombre}
                              onChange={(e) => {
                                const next = [...detenidos]
                                next[i] = { ...next[i], nombre: e.target.value }
                                store.setDetenidos(next)
                              }}
                              placeholder="Nombre(s)"
                              style={{
                                flex: 1, padding: '10px 12px', background: '#ffffff',
                                border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a',
                                borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 13,
                                outline: 'none',
                              }}
                            />
                            <input
                              value={d.apellidoPaterno}
                              onChange={(e) => {
                                const next = [...detenidos]
                                next[i] = { ...next[i], apellidoPaterno: e.target.value }
                                store.setDetenidos(next)
                              }}
                              placeholder="Ap. Paterno"
                              style={{
                                flex: 1, padding: '10px 12px', background: '#ffffff',
                                border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a',
                                borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 13,
                                outline: 'none',
                              }}
                            />
                            <input
                              value={d.apellidoMaterno}
                              onChange={(e) => {
                                const next = [...detenidos]
                                next[i] = { ...next[i], apellidoMaterno: e.target.value }
                                store.setDetenidos(next)
                              }}
                              placeholder="Ap. Materno"
                              style={{
                                flex: 1, padding: '10px 12px', background: '#ffffff',
                                border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a',
                                borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 13,
                                outline: 'none',
                              }}
                            />
                            {detenidos.length > 1 && (
                              <button type="button" onClick={() => store.setDetenidos(detenidos.filter((_, j) => j !== i))}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <input type="hidden" name="ofi_detenidos" value="" />
                    </div>
                    <SelectorDestinoLegal value={autoridadRecibe} onChange={(v) => $('autoridadRecibe', v)} />

                  </>
                )}
              </div>
            </section>
          )}

          {/* STEP 4: ASEGURAMIENTOS Y CATEOS */}
          {step === 4 && (
            <section className="of-card">
              <h2 className="of-section-title">Aseguramientos y Cateos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

                {/* Objetos recuperados */}
                <div style={{ gridColumn: 'span 3' }}>
                  <SentinelField label="Objetos Recuperados" name="ofi_objetos_recuperados" as="textarea"
                    placeholder="Descripción de bienes asegurados..."
                    value={objetosRecuperados} onChange={(e: any) => $('objetosRecuperados', e.target.value)} />
                </div>

                {/* ¿Hubo Robo? */}
                <SentinelField label="¿Hubo Robo?" name="ofi_hay_robo" as="select"
                  value={store.hayRobo} onChange={(e: any) => $('hayRobo', e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {store.hayRobo === 'true' && (
                  <SentinelField label="Monto de lo Robado (Solo números)" name="ofi_monto_robo"
                    type="number" placeholder="0"
                    value={montoRobo} onChange={(e: any) => $('montoRobo', e.target.value)} />
                )}

                {/* ¿Aseguró Vehículo? */}
                <SentinelField label="¿Aseguró Vehículo?" name="ofi_hay_vehiculo" as="select"
                  value={tieneVehiculo} onChange={(e: any) => $('tieneVehiculo', e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneVehiculo === 'true' && (
                  <div style={{ gridColumn: 'span 3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Cantidad de Vehículos Asegurados
                      </span>
                      <select
                        value={numVehiculos}
                        onChange={(e) => {
                          const n = Number(e.target.value)
                          store.setNumVehiculos(n)
                          store.setVehiculos(Array.from({ length: n }, (_, i) => vehiculos[i] ?? { placas: '', serie: '', color: '', tipo: '', destino: '' }))
                        }}
                        style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a', borderRadius: 2, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, background: '#ffffff', outline: 'none', minWidth: 60 }}
                      >
                        <option value={0}>0</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {vehiculos.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {vehiculos.map((v, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 600, minWidth: 20 }}>#{i + 1}</span>
                            <select value={v.tipo} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], tipo: e.target.value }; store.setVehiculos(next) }}
                              style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', background: '#fff' }}>
                              <option value="">Tipo</option>
                              <option value="automovil">Automóvil</option>
                              <option value="camioneta">Camioneta</option>
                              <option value="trans. publico">Trans. Público</option>
                              <option value="trans. carga">Trans. Carga</option>
                              <option value="motocicleta">Motocicleta</option>
                            </select>
                            <input value={v.placas} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], placas: e.target.value }; store.setVehiculos(next) }}
                              placeholder="Placas" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                            <input value={v.serie} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], serie: e.target.value }; store.setVehiculos(next) }}
                              placeholder="Núm. Serie" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                            <input value={v.color} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], color: e.target.value }; store.setVehiculos(next) }}
                              placeholder="Color" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none' }} />
                            <select value={v.destino} onChange={(e) => { const next = [...vehiculos]; next[i] = { ...next[i], destino: e.target.value }; store.setVehiculos(next) }}
                              style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', background: '#fff' }}>
                              <option value="">Destino</option>
                              <option value="CORRALON MW">CORRALON MW</option>
                              <option value="CORRALON MEJIA">CORRALON MEJIA</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ¿Hubo Cateo? */}
                <SentinelField label="¿Hubo Cateo?" name="ofi_hay_cateo" as="select"
                  value={tieneCateo} onChange={(e: any) => $('tieneCateo', e.target.value)}>
                  <option value="false">NO</option>
                  <option value="true">SÍ</option>
                </SentinelField>

                {tieneCateo === 'true' && (
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
                      Domicilio Cateado — Marcar en el mapa
                    </label>
                    <MapaUbicacion namePrefix="ofi_cateo" onLocationSelect={(loc) => {
                      $('domicilioCateado', loc.referenciaUbicacion)
                      store.setCateoLocation({ calle: loc.calle, colonia: loc.colonia, numero: loc.numero, lat: String(loc.lat), lng: String(loc.lng) })
                    }} />
                    <div style={{ marginTop: 16 }}>
                      <SentinelField label="Resultado del Cateo" name="ofi_resultado_cateo"
                        placeholder="¿Qué se encontró?"
                        value={resultadoCateo} onChange={(e: any) => $('resultadoCateo', e.target.value)} />
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* STEP 5: SEGUIMIENTOS */}
          {step === 5 && (
            <section className="of-card">
              <h2 className="of-section-title">Seguimientos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* ÓRDENES DE APREHENSIÓN */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Órdenes de Aprehensión?
                    </span>
                    <button type="button" onClick={() => $('hayOrdenAprehension', !store.hayOrdenAprehension)} className="of-btn-toggle"
                      style={{ background: store.hayOrdenAprehension ? '#1f355a' : '#ffffff', color: store.hayOrdenAprehension ? '#ffffff' : '#64748b', borderColor: store.hayOrdenAprehension ? '#1f355a' : '#e2e8f0' }}>
                      {store.hayOrdenAprehension ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {store.hayOrdenAprehension && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {store.ordenesAprehension.map((o, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'nombrePersona', 'estatus', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'nombrePersona' ? 'Nombre Persona' : campo === 'estatus' ? 'Estatus' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={o[campo]}
                                onChange={(e) => { const next = [...store.ordenesAprehension]; next[i][campo] = e.target.value; store.setOrdenesAprehension(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={o.observaciones} onChange={(e) => { const next = [...store.ordenesAprehension]; next[i].observaciones = e.target.value; store.setOrdenesAprehension(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => store.setOrdenesAprehension(store.ordenesAprehension.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => store.setOrdenesAprehension([...store.ordenesAprehension, { fecha: '', nombrePersona: '', observaciones: '', estatus: '', nombreSeguimiento: '' }])}
                        className="of-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR ORDEN
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* HIDROCARBUROS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Detención Delito Hidrocarburo?
                    </span>
                    <button type="button" onClick={() => $('hayHidrocarburo', !store.hayHidrocarburo)} className="of-btn-toggle"
                      style={{ background: store.hayHidrocarburo ? '#1f355a' : '#ffffff', color: store.hayHidrocarburo ? '#ffffff' : '#64748b', borderColor: store.hayHidrocarburo ? '#1f355a' : '#e2e8f0' }}>
                      {store.hayHidrocarburo ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {store.hayHidrocarburo && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {store.hidrocarburos.map((h, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'nombrePersona', 'datosVehiculo', 'litrosExtraccion', 'nombreToma', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'nombrePersona' ? 'Nombre Persona' : campo === 'datosVehiculo' ? 'Datos Vehículo' : campo === 'litrosExtraccion' ? 'Litros Extracción' : campo === 'nombreToma' ? 'Nombre Toma Clandestina' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={h[campo]}
                                onChange={(e) => { const next = [...store.hidrocarburos]; next[i][campo] = e.target.value; store.setHidrocarburos(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={h.observaciones} onChange={(e) => { const next = [...store.hidrocarburos]; next[i].observaciones = e.target.value; store.setHidrocarburos(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => store.setHidrocarburos(store.hidrocarburos.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => store.setHidrocarburos([...store.hidrocarburos, { fecha: '', nombrePersona: '', datosVehiculo: '', litrosExtraccion: '', nombreToma: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="of-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR REGISTRO
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* ARMAS DE FUEGO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Armas de Fuego?
                    </span>
                    <button type="button" onClick={() => $('hayArmaFuego', !store.hayArmaFuego)} className="of-btn-toggle"
                      style={{ background: store.hayArmaFuego ? '#1f355a' : '#ffffff', color: store.hayArmaFuego ? '#ffffff' : '#64748b', borderColor: store.hayArmaFuego ? '#1f355a' : '#e2e8f0' }}>
                      {store.hayArmaFuego ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {store.hayArmaFuego && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {store.armasFuego.map((a, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'datos', 'cartuchos', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'datos' ? 'Datos del Arma' : campo === 'cartuchos' ? 'Cartuchos' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={a[campo]}
                                onChange={(e) => { const next = [...store.armasFuego]; next[i][campo] = e.target.value; store.setArmasFuego(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={a.observaciones} onChange={(e) => { const next = [...store.armasFuego]; next[i].observaciones = e.target.value; store.setArmasFuego(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => store.setArmasFuego(store.armasFuego.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => store.setArmasFuego([...store.armasFuego, { fecha: '', datos: '', cartuchos: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="of-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR ARMA
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* DOSIS DE DROGA */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ¿Dosis de Droga?
                    </span>
                    <button type="button" onClick={() => $('hayDroga', !store.hayDroga)} className="of-btn-toggle"
                      style={{ background: store.hayDroga ? '#1f355a' : '#ffffff', color: store.hayDroga ? '#ffffff' : '#64748b', borderColor: store.hayDroga ? '#1f355a' : '#e2e8f0' }}>
                      {store.hayDroga ? '[ SÍ ]' : '[ NO ]'}
                    </button>
                  </div>
                  {store.hayDroga && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {store.drogas.map((d, i) => (
                        <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderLeft: '3px solid #1f355a', borderRadius: 2, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 700, gridColumn: 'span 3' }}>#{i + 1}</span>
                          {(['fecha', 'cantidad', 'nombre', 'nombreSeguimiento'] as const).map(campo => (
                            <div key={campo}>
                              <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                                {campo === 'fecha' ? 'Fecha' : campo === 'cantidad' ? 'Cantidad' : campo === 'nombre' ? 'Nombre Droga' : 'Nombre Seguimiento'}
                              </label>
                              <input type={campo === 'fecha' ? 'date' : 'text'}
                                value={d[campo]}
                                onChange={(e) => { const next = [...store.drogas]; next[i][campo] = e.target.value; store.setDrogas(next) }}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none' }} />
                            </div>
                          ))}
                          <div style={{ gridColumn: 'span 3' }}>
                            <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Observaciones</label>
                            <textarea value={d.observaciones} onChange={(e) => { const next = [...store.drogas]; next[i].observaciones = e.target.value; store.setDrogas(next) }}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter,sans-serif', fontSize: 12, outline: 'none', minHeight: 60, resize: 'vertical' }} />
                          </div>
                          <button type="button" onClick={() => store.setDrogas(store.drogas.filter((_, j) => j !== i))}
                            style={{ gridColumn: 'span 3', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textAlign: 'left' }}>
                            ✕ ELIMINAR
                          </button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => store.setDrogas([...store.drogas, { fecha: '', cantidad: '', nombre: '', observaciones: '', nombreSeguimiento: '' }])}
                        className="of-btn-toggle" style={{ alignSelf: 'flex-start' }}>
                        + AGREGAR DOSIS
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                  Apoyos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  {([
                    { key: 'apoyoFiestasPatronales', label: 'Apoyo a Fiestas Patronales' },
                    { key: 'operativosMetropolitano', label: 'Operativos / Metropolitano' },
                    { key: 'eco8', label: 'ECO 8' },
                    { key: 'alcoholimetria', label: 'Alcoholimetría' },
                    { key: 'motocicletas', label: 'Motocicletas' },
                    { key: 'apoyoActuarios', label: 'Apoyo a Actuarios' },
                    { key: 'apoyo_cateosFgr', label: 'Apoyo a Cateos FGR' },
                    { key: 'apoyo_cateosFge', label: 'Apoyo a Cateos FGE' },
                  ] as const).map(({ key, label }) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#1e293b' }}>{label}</span>
                      <button type="button"
                        onClick={() => $(key, !store[key])}
                        style={{ padding: '4px 14px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, border: '1px solid', borderRadius: 2, cursor: 'pointer', background: store[key] ? '#1f355a' : '#ffffff', color: store[key] ? '#ffffff' : '#64748b', borderColor: store[key] ? '#1f355a' : '#e2e8f0' }}>
                        {store[key] ? 'SÍ' : 'NO'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 6: RESUMEN */}
          {step === 6 && (
            <section className="of-card">
              <h2 className="of-section-title">Resumen del Reporte</h2>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#334155', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="of-resumen-block">
                  <span className="of-resumen-label">Origen</span>
                  <div className="of-resumen-grid">
                    <div><span>Folio CAD:</span> {folioCad}</div>
                    <div><span>Reportante:</span> {isAnonimo ? 'ANÓNIMO' : nombreReportante || '—'}</div>
                    <div><span>Anónimo:</span> {isAnonimo ? 'SÍ' : 'NO'}</div>
                  </div>
                </div>
                <div className="of-resumen-block">
                  <span className="of-resumen-label">Incidente</span>
                  <div className="of-resumen-grid">
                    <div><span>Tipo:</span> {nombreTipoIncidente}</div>
                    <div><span>Emergencia:</span> {nombreTipoEmergencia}</div>
                    <div><span>Prioridad:</span> {nombrePrioridad}</div>
                    <div style={{ gridColumn: '1 / -1' }}><span>Descripción:</span> {descripcion}</div>
                    <div style={{ gridColumn: '1 / -1' }}><span>Contenido:</span> {contenidoReporte}</div>
                  </div>
                </div>
                <div className="of-resumen-block">
                  <span className="of-resumen-label">Ubicación</span>
                  <div className="of-resumen-grid">
                    <div style={{ gridColumn: '1 / -1' }}><span>Dirección:</span> {currentLocDisplay || 'No seleccionada — se usará la ubicación actual automática'}</div>
                  </div>
                </div>
                <div className="of-resumen-block">
                  <span className="of-resumen-label">Intervención</span>
                  <div className="of-resumen-grid">
                    <div style={{ gridColumn: '1 / -1' }}><span>Acciones:</span> {accionesRealizadas}</div>
                    <div><span>Detención:</span> {tieneDetencion === 'true' ? 'SÍ' : 'NO'}</div>
                    {tieneDetencion === 'true' && <div><span>Detenidos:</span> {detenidos.map(d => [d.nombre, d.apellidoPaterno, d.apellidoMaterno].filter(Boolean).join(' ')).filter(Boolean).join(', ') || '—'}</div>}
                    {tieneDetencion === 'true' && <div><span>Autoridad:</span> {autoridadRecibe}</div>}
                    {montoRobo !== '0' && <div><span>Monto Robado:</span> ${montoRobo}</div>}
                  </div>
                </div>
                <div className="of-resumen-block">
                  <span className="of-resumen-label">Aseguramientos</span>
                  <div className="of-resumen-grid">
                    <div style={{ gridColumn: '1 / -1' }}><span>Objetos:</span> {objetosRecuperados}</div>
                    <div><span>Robo:</span> {store.hayRobo === 'true' ? `SÍ — $${montoRobo}` : 'NO'}</div>
                    <div><span>Vehículos:</span> {tieneVehiculo === 'true' ? `SÍ (${numVehiculos})` : 'NO'}</div>
                    {tieneCateo === 'true' && <div><span>Cateo:</span> {domicilioCateado || 'SÍ'}</div>}
                  </div>
                </div>
              </div>
              <SentinelField label="Observaciones / Conclusión" name="ofi_observaciones"
                as="textarea"
                value={store.observaciones}
                onChange={(e: any) => $('observaciones', e.target.value)}
                placeholder="Observaciones finales..." />
              <div style={{ marginTop: 24, padding: '20px 24px', background: '#eff1f3', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#1c3051', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  ¿La víctima desea hacer la denuncia?
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button"
                    onClick={() => $('quiereDenuncia', true)}
                    style={{ padding: '10px 28px', background: store.quiereDenuncia ? '#1f355a' : '#ffffff', color: store.quiereDenuncia ? '#ffffff' : '#1f355a', border: '1px solid #1f355a', borderRadius: 2, fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    SÍ, DESEA DENUNCIAR
                  </button>
                  <button type="button"
                    onClick={() => $('quiereDenuncia', false)}
                    style={{ padding: '10px 28px', background: !store.quiereDenuncia ? '#0f172a' : '#ffffff', color: !store.quiereDenuncia ? '#ffffff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    NO
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* NAVEGACIÓN */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: '12px 32px', background: step === 0 ? '#f1f5f9' : '#ffffff',
              color: step === 0 ? '#cbd5e1' : '#1e293b',
              border: '1px solid #e2e8f0', borderRadius: 2, cursor: step === 0 ? 'default' : 'pointer',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8,
            }}>
            ← ANTERIOR
          </button>

          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>
            {step + 1} / {STEPS.length}
          </div>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              style={{
                padding: '12px 32px', background: '#0f172a',
                color: '#ffffff', border: 'none', borderRadius: 2, cursor: 'pointer',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8,
              }}>
              SIGUIENTE →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} style={{
              padding: '12px 48px', background: '#1f355a',
              color: '#ffffff', border: 'none', borderRadius: 2, cursor: 'pointer',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Send size={14} />
              REGISTRAR REPORTE
            </button>
          )}
        </div>

   

      </Wrapper>

      <style>{`
        .of-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 32px;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .of-section-title {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          color: #1e293b !important;
          margin-bottom: 24px !important;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .of-section-title::before {
          content: '';
          width: 4px; height: 18px;
          background: #1f355a;
          display: inline-block;
        }
        .of-btn-toggle {
          height: 46px; padding: 0 16px;
          background: #ffffff; color: #64748b;
          border: 1px solid #e2e8f0; border-radius: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .of-btn-toggle:hover { background: #f8fafc; border-color: #1f355a; }
        input:focus, textarea:focus, select:focus {
          border-color: #1f355a !important;
          box-shadow: 0 0 0 1px rgba(31, 53, 90, 0.1);
        }
        .of-resumen-block {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-left: 3px solid #1f355a;
        }
        .of-resumen-label {
          font-size: 9px; font-weight: 600; color: #1f355a;
          text-transform: uppercase; letter-spacing: 0.15em;
          display: block; margin-bottom: 12px;
        }
        .of-resumen-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          font-size: 12px;
        }
        .of-resumen-grid span {
          color: #64748b;
        }
      `}</style>
    </form>
  )
}
