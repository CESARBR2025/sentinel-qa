'use client'

import React from 'react'
import { inputStyle, Label, sectionBody, sectionCard, sectionHeader, sectionTitleStyle } from '@/components/reportes/form-styles'
import { useNovedadesStore } from '@/lib/novedades/store'
import type { FilaNovedad } from '@/lib/novedades/types'

// ─────────────────────────────────────────────────────────────────────────────
// PasoView del Parte de Novedades. Tres componentes genéricos reutilizados por
// las 11 secciones:
//   MatrizContadores   — matrices etiqueta → número (T0, T5, T7, T14, T32)
//   TablaEditable      — listados con alta/baja/edición de filas (T8-T11, T20-T24)
//   TablaSoloLectura   — lo autollenado que solo se revisa (T3, T4, T9, T15, T26)
// ─────────────────────────────────────────────────────────────────────────────

export interface CampoContador {
  name: string
  label: string
  auto?: boolean
}

export function MatrizContadores({ seccion, titulo, campos, nota }: {
  seccion: string
  titulo: string
  campos: CampoContador[]
  nota?: string
}) {
  const vals = useNovedadesStore(s => s.secciones[seccion as keyof typeof s.secciones]) as Record<string, unknown> | undefined
  const calculado = useNovedadesStore(s => s.calculado[seccion as keyof typeof s.calculado]) as Record<string, unknown> | undefined
  const setCampo = useNovedadesStore(s => s.setCampo)

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>{titulo}</div></div>
      <div style={sectionBody}>
        {nota && <div style={{ padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#92400e' }}>{nota}</div>}
        <div className="grid-2">
          {campos.map(c => (
            <div key={c.name}>
              <Label>{c.label}{c.auto ? ' · automático' : ''}</Label>
              <input
                type="number"
                min={0}
                style={{ ...inputStyle, background: c.auto ? '#f8fafc' : '#ffffff' }}
                value={String(vals?.[c.name] ?? calculado?.[c.name] ?? 0)}
                onChange={e => setCampo(seccion as never, c.name, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TablaSoloLectura({ filas, columnas, titulo, vacio }: {
  filas: Record<string, unknown>[]
  columnas: { key: string; label: string }[]
  titulo: string
  vacio?: string
}) {
  const thStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap' }
  const tdStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px', verticalAlign: 'top' }

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>{titulo}</div></div>
      <div style={sectionBody}>
        {filas.length === 0 ? (
          <div style={{ padding: '24px 22px', textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
            {vacio ?? 'Sin registros para esta fecha.'}
          </div>
        ) : (
          <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {columnas.map(c => <th key={c.key} style={thStyle}>{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eef2f7' }}>
                    {columnas.map(c => (
                      <td key={c.key} style={{ ...tdStyle, fontWeight: c.key === 'nombre' ? 500 : 400, color: c.key === 'nombre' ? '#0f172a' : '#334155' }}>
                        {fila[c.key] != null && String(fila[c.key]) !== '' ? String(fila[c.key]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export function TablaEditable({ clave, titulo, columnas, nota }: {
  clave: string
  titulo: string
  columnas: { key: string; label: string }[]
  nota?: string
}) {
  const filas = useNovedadesStore(s => s.filas[clave] ?? [])
  const agregarFila = useNovedadesStore(s => s.agregarFila)
  const editarFila = useNovedadesStore(s => s.editarFila)
  const eliminarFila = useNovedadesStore(s => s.eliminarFila)
  const [nueva, setNueva] = React.useState<Record<string, string>>({})
  const [editando, setEditando] = React.useState<string | null>(null)
  const [edicion, setEdicion] = React.useState<Record<string, string>>({})

  const thStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap' }
  const tdStyle: React.CSSProperties = { fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px', verticalAlign: 'top' }

  const empieza = (): Record<string, string> => {
    const init: Record<string, string> = {}
    for (const c of columnas) init[c.key] = ''
    return init
  }

  const agregar = () => {
    const datos: Record<string, unknown> = {}
    for (const c of columnas) datos[c.key] = nueva[c.key]?.trim() || null
    agregarFila(clave, datos)
    setNueva(empieza())
  }

  const comenzarEdicion = (f: FilaNovedad) => {
    setEditando(f.id)
    const init: Record<string, string> = {}
    for (const c of columnas) init[c.key] = f.datos[c.key] != null ? String(f.datos[c.key]) : ''
    setEdicion(init)
  }

  const guardarEdicion = (f: FilaNovedad) => {
    const datos: Record<string, unknown> = {}
    for (const c of columnas) datos[c.key] = edicion[c.key]?.trim() || null
    editarFila(clave, f.id, datos)
    setEditando(null)
  }

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>{titulo}</div></div>
      <div style={sectionBody}>
        {nota && <div style={{ padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#92400e' }}>{nota}</div>}
        <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {columnas.map(c => <th key={c.key} style={thStyle}>{c.label}</th>)}
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filas.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #eef2f7' }}>
                  {columnas.map(c => (
                    <td key={c.key} style={tdStyle}>
                      {editando === f.id ? (
                        <input style={{ ...inputStyle, minWidth: 120 }} value={edicion[c.key] ?? ''} onChange={e => setEdicion(x => ({ ...x, [c.key]: e.target.value }))} />
                      ) : (
                        f.datos[c.key] != null && String(f.datos[c.key]) !== '' ? String(f.datos[c.key]) : '—'
                      )}
                    </td>
                  ))}
                  <td style={tdStyle}>
                    {editando === f.id ? (
                      <button type="button" onClick={() => guardarEdicion(f)} style={{ ...inputStyle, width: 'auto', padding: '7px 12px', background: '#0f172a', color: '#fff', border: 'none' }}>Guardar</button>
                    ) : (
                      <button type="button" onClick={() => comenzarEdicion(f)} style={{ ...inputStyle, width: 'auto', padding: '7px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>Editar</button>
                    )}
                    <button type="button" onClick={() => eliminarFila(clave, f.id)} style={{ ...inputStyle, width: 'auto', padding: '7px 10px', marginLeft: 6, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>✕</button>
                  </td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr><td colSpan={columnas.length + 1} style={{ padding: 24, textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>Sin registros. Agrega el primero abajo.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {columnas.map(c => (
            <div key={c.key} style={{ flex: 1, minWidth: 140 }}>
              <Label>{c.label}</Label>
              <input style={inputStyle} value={nueva[c.key] ?? ''} onChange={e => setNueva(x => ({ ...x, [c.key]: e.target.value }))} />
            </div>
          ))}
          <button type="button" onClick={agregar} style={{ ...inputStyle, width: 'auto', padding: '11px 18px', background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Agregar fila</button>
        </div>
      </div>
    </div>
  )
}

// ==================== Los 11 pasos ====================

export function PasoPeriodo() {
  const fecha = useNovedadesStore(s => s.fecha)
  const vals = useNovedadesStore(s => s.secciones.periodo) as Record<string, unknown> | undefined
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Periodo y encabezado</div></div>
      <div style={sectionBody}>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
          Fecha del parte: <strong>{fecha}</strong><br />
          Ventana operativa: del <strong>{String(vals?.inicio ?? '').slice(0, 16)}</strong> al <strong>{String(vals?.fin ?? '').slice(0, 16)}</strong><br />
          Las novedades correspondientes de las 06:00 horas del día anterior a las 06:00 horas del día de la fecha.
        </div>
      </div>
    </div>
  )
}

export function PasoResumen() {
  const vals = useNovedadesStore(s => s.secciones.resumen) as { aseguramientos?: { concepto: string; oriente: number; poniente: number; centro: number; sin_asignar: number; total: number }[] } | undefined
  const infracciones = vals?.aseguramientos ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TablaSoloLectura
        titulo="T0 · Aseguramientos"
        filas={infracciones.map(f => ({ ...f }))}
        columnas={[
          { key: 'concepto', label: 'Concepto' },
          { key: 'oriente', label: 'Oriente' },
          { key: 'poniente', label: 'Poniente' },
          { key: 'centro', label: 'Centro' },
          { key: 'sin_asignar', label: 'Sin asignar' },
          { key: 'total', label: 'Total' },
        ]}
      />
      <MatrizContadores seccion="resumen" titulo="T1/T2 · Infracciones y corralón" campos={[]} nota="Infracciones y vehículos a corralón — pendiente de captura por columna operativa." />
    </div>
  )
}

export function PasoSubsecretaria() {
  const vals = useNovedadesStore(s => s.secciones.subsecretaria) as { pd_fiscalia?: Record<string, unknown>[]; juzgado_civico?: Record<string, unknown>[] } | undefined
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TablaSoloLectura
        titulo="T3 · Puestas a disposición de la Fiscalía"
        filas={vals?.pd_fiscalia ?? []}
        columnas={[{ key: 'hora', label: 'Hora' }, { key: 'lugar', label: 'Lugar' }, { key: 'nombre', label: 'Nombre' }, { key: 'fiscal', label: 'Fiscal' }, { key: 'motivo', label: 'Motivo' }, { key: 'ci', label: 'CI' }, { key: 'rnd', label: 'RND' }]}
      />
      <TablaSoloLectura
        titulo="T4 · Remitidos a Juzgado Cívico"
        filas={vals?.juzgado_civico ?? []}
        columnas={[{ key: 'hora', label: 'Hora' }, { key: 'lugar', label: 'Lugar' }, { key: 'nombre', label: 'Nombre' }, { key: 'marco_legal', label: 'Marco legal' }, { key: 'oficial', label: 'Oficial' }, { key: 'unidad', label: 'Unidad' }, { key: 'sija', label: 'SIJA' }, { key: 'remision', label: 'Remisión' }, { key: 'iph', label: 'IPH' }, { key: 'rnd', label: 'RND' }]}
      />
    </div>
  )
}

export function PasoAnalisis() {
  return <MatrizContadores seccion="analisis" titulo="T5 · Plataforma México (06:00 a 06:00)" campos={[
    { name: 'consultas_personas', label: 'Consultas — Total de personas' },
    { name: 'ordenes_aprehension', label: 'Órdenes de aprehensión vigentes' },
    { name: 'consultas_vehiculos', label: 'Consultas — Total de vehículos' },
    { name: 'vehiculos_reporte_robo', label: 'Vehículos con reporte de robo' },
    { name: 'detenidos_carcel', label: 'Detenidos a Cárcel Municipal' },
    { name: 'detenidos_fiscalia', label: 'Detenidos a FGE/FGR', auto: true },
  ]} nota="Los cinco primeros son captura manual (no hay integración con Plataforma México). Detenidos a FGE/FGR se prellena con el conteo de puestas a disposición." />
}

export function PasoC4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MatrizContadores seccion="c4" titulo="T6a · Línea 9-1-1" campos={[
        { name: 'llamadas_recibidas', label: 'Total de llamadas recibidas', auto: true },
        { name: 'improcedentes', label: 'Improcedentes', auto: true },
        { name: 'medico', label: 'Médico', auto: true },
        { name: 'proteccion_civil', label: 'Protección Civil', auto: true },
        { name: 'seguridad', label: 'Seguridad', auto: true },
        { name: 'servicios_publicos', label: 'Servicios Públicos', auto: true },
        { name: 'asistencia', label: 'Asistencia', auto: true },
        { name: 'otros_servicios', label: 'Otros Servicios', auto: true },
        { name: 'canalizadas', label: 'Llamadas canalizadas', auto: true },
      ]} nota="T6a es 100% automático desde incidentes (canal=911) en la ventana 06:00 a 06:00." />
      <MatrizContadores seccion="c4" titulo="T6b · C-4 Cámaras" campos={[
        { name: 'personas_sin_novedad', label: 'Personas revisadas sin novedad', auto: true },
        { name: 'personas_con_antecedentes', label: 'Personas con antecedentes', auto: true },
        { name: 'vehiculos_revisar', label: 'Vehículos mandados a revisar', auto: true },
        { name: 'vehiculos_repuve', label: 'Vehículos checados en REPUVE', auto: true },
        { name: 'persecuciones', label: 'Persecuciones captadas', auto: true },
        { name: 'asegurados_camara', label: 'Aseguramientos captados', auto: true },
        { name: 'vehiculos_recuperados', label: 'Vehículos recuperados', auto: true },
        { name: 'incendios', label: 'Incendios captados', auto: true },
        { name: 'hechos_transito_camara', label: 'Hechos de tránsito captados', auto: true },
      ]} nota="T6b es 100% automático: suma de los 3 turnos de fecha = día anterior." />
    </div>
  )
}

export function PasoTransito() {
  const filasHechos = useNovedadesStore(s => s.filas['transito.hechos'] ?? [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TablaEditable clave="transito.hechos" titulo="T8 · Hechos de tránsito (detalle)" columnas={[
        { key: 'hecho', label: 'Hecho' },
        { key: 'hora', label: 'Hora' },
        { key: 'lugar', label: 'Lugar' },
        { key: 'vehiculo', label: 'Vehículo' },
        { key: 'conductor', label: 'Conductor(es)' },
      ]} nota={`Se prellenan ${filasHechos.length} incidentes de tránsito de la ventana; completa vehículo y conductor.`} />
      <TablaEditable clave="transito.corralon" titulo="T9 · Vehículos a corralón" columnas={[
        { key: 'folio_motivo', label: 'Folio / Motivo' },
        { key: 'hora', label: 'Hora' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'lugar', label: 'Lugar' },
        { key: 'vehiculo', label: 'Vehículo' },
        { key: 'grua', label: 'Grúa' },
      ]} />
    </div>
  )
}

export function PasoPrevencion() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MatrizContadores seccion="prevencion" titulo="T14 · Atención a Víctimas" campos={[
        { name: 'medidas_realizadas', label: 'Medidas realizadas', auto: true },
        { name: 'baesvim', label: 'BAESVIM', auto: true },
        { name: 'persona_no_localizada', label: 'Persona no localizada', auto: true },
      ]} nota="Algunos contadores se autollenan (medidas, BAESVIM, persona no localizada); el resto es captura manual." />
      <TablaEditable clave="prevencion.convenios" titulo="T20 · Convenios de mediación" columnas={[
        { key: 'fecha', label: 'Fecha' },
        { key: 'lugar', label: 'Lugar' },
        { key: 'involucrados', label: 'Involucrados' },
        { key: 'policia', label: 'Policía' },
        { key: 'unidad', label: 'Unidad' },
        { key: 'convenio', label: 'Convenio' },
      ]} />
      <TablaEditable clave="prevencion.platicas" titulo="T22 · Pláticas de vinculación" columnas={[
        { key: 'fecha', label: 'Fecha' },
        { key: 'platicas', label: 'Pláticas' },
        { key: 'tema', label: 'Tema' },
        { key: 'lugar', label: 'Lugar' },
        { key: 'elemento', label: 'Elemento' },
        { key: 'aforo', label: 'Aforo' },
        { key: 'unidad', label: 'Unidad' },
      ]} />
      <TablaEditable clave="prevencion.jornadas_trabajo" titulo="T23 · Jornadas de trabajo a favor de la comunidad" columnas={[
        { key: 'fecha', label: 'Fecha' },
        { key: 'hora', label: 'Hora' },
        { key: 'lugar', label: 'Lugar' },
        { key: 'elemento', label: 'Elemento' },
        { key: 'unidad', label: 'Unidad' },
        { key: 'complementarios', label: 'Complementarios' },
      ]} />
    </div>
  )
}

export function PasoDelictivos() {
  const vals = useNovedadesStore(s => s.secciones.delictivos) as { delitos?: { familia: string; delito: string; delitos: number; detenidos: number }[] } | undefined
  const delitos = vals?.delitos ?? []
  const familias = ['DELITOS PATRIMONIALES CU', 'CONTRA LA SOCIEDAD', 'CONTRA LAS PERSONAS', 'OTROS']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {familias.map(fam => (
        <TablaSoloLectura
          key={fam}
          titulo={`T25 · ${fam}`}
          filas={delitos.filter(d => d.familia === fam).map(d => ({ ...d }))}
          columnas={[{ key: 'delito', label: 'Tipo' }, { key: 'delitos', label: 'Delitos' }, { key: 'detenidos', label: 'Detenidos' }]}
        />
      ))}
      <TablaSoloLectura
        titulo="T26 · Denuncias digitales (D1)"
        filas={[]}
        columnas={[{ key: 'tipo_delito', label: 'Tipo de delito' }, { key: 'ubicacion', label: 'Ubicación' }, { key: 'nombre_denunciante', label: 'Denunciante' }, { key: 'crp', label: 'C.R.P.' }, { key: 'cuestionario_unico', label: 'Cuestionario único' }]}
        vacio="Sin denuncias digitales para esta fecha."
      />
    </div>
  )
}

export function PasoOperativos() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MatrizContadores seccion="operativos" titulo="T30 · Operativos" campos={[
        { name: 'eco8', label: 'Operativo Eco 8', auto: true },
        { name: 'metropolitano', label: 'Metropolitano II', auto: true },
        { name: 'interinstitucional', label: 'Interinstitucional' },
      ]} nota="Personas puestas a disposición por operativo se autollenan desde ofi_reportes_campo; el estado de fuerza es manual." />
    </div>
  )
}

export function PasoResumenNovedades() {
  return <MatrizContadores seccion="resumen_nov" titulo="T31 · Resumen de novedades" campos={[]} nota="Filas de la tabla RESUMEN DE NOVEDADES y plantillas INFORMATIVOS — captura en el generador." />
}

export function PasoFuerza() {
  const vals = useNovedadesStore(s => s.secciones.fuerza) as { conceptos?: { concepto: string; cantidad: number }[] } | undefined
  const conceptos = vals?.conceptos ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MatrizContadores seccion="fuerza" titulo="T32 · Estado de fuerza" campos={conceptos.map(c => ({ name: `cantidad_${c.concepto}`, label: c.concepto, auto: true }))} nota="Estado de fuerza por concepto, autollenado desde Rol de Servicios (roles_servicio + rol_estado_fuerza)." />
    </div>
  )
}
