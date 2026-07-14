import { Phone, Radio, Shield, ClipboardCheck, Gavel, MessageSquare } from 'lucide-react'
import type { HistorialIncidente as Historial } from '@/lib/incidentes/types'
import React from 'react'

function fmt(fecha: string | null): string {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function HistorialIncidente({ historial }: { historial: Historial }) {
  const { generacion, despacho, cierre, d1 } = historial

  const canalIcon = generacion.canal === 'whatsapp'
    ? <MessageSquare size={14} />
    : generacion.canal === 'radio' ? <Radio size={14} /> : <Phone size={14} />

  const pasos: { icono: React.ReactNode; titulo: string; fecha: string | null; activo: boolean; contenido: React.ReactNode }[] = [
    {
      icono: canalIcon,
      titulo: generacion.origenRondin ? 'RONDÍN ESCALADO' : `GENERACIÓN ${generacion.canal.toUpperCase()}`,
      fecha: generacion.fechaHoraInicio,
      activo: true,
      contenido: (
        <>
          <Dato label="Folio" valor={generacion.folio} mono />
          {generacion.tipoIncidente && <Dato label="Incidente" valor={generacion.tipoIncidente} />}
          {generacion.prioridad && <Dato label="Prioridad" valor={generacion.prioridad} />}
          {generacion.nombreReportante && <Dato label="Reportante" valor={generacion.nombreReportante} />}
          {(generacion.calle || generacion.colonia) && (
            <Dato label="Ubicación" valor={[generacion.calle, generacion.colonia].filter(Boolean).join(', ')} />
          )}
          {generacion.descripcion && <Dato label="Descripción" valor={generacion.descripcion} />}
          {generacion.capturadoPorNombre && <Dato label="Capturó" valor={generacion.capturadoPorNombre} />}
        </>
      ),
    },
    {
      icono: <Shield size={14} />,
      titulo: 'DESPACHO',
      fecha: despacho?.fechaHoraDespacho ?? null,
      activo: !!despacho,
      contenido: despacho ? (
        <>
          {despacho.despachadorNombre && <Dato label="Despachó" valor={despacho.despachadorNombre} />}
          {despacho.unidades.length > 0 && (
            <Dato label="Unidades" valor={despacho.unidades.map(u => u.unidadPlaca ?? '—').join(' · ')} mono />
          )}
          {despacho.elementos.length > 0 && (
            <Dato label="Elementos" valor={despacho.elementos.map(e => `${e.elementoNombre ?? '—'} (${e.elementoNomina ?? 's/n'})`).join(' · ')} />
          )}
        </>
      ) : <Pendiente texto="SIN DESPACHO ASIGNADO" />,
    },
    {
      icono: <ClipboardCheck size={14} />,
      titulo: 'REPORTE DE CAMPO',
      fecha: cierre?.fechaCierre ?? null,
      activo: !!cierre,
      contenido: cierre ? (
        <>
          {cierre.folioReporteCampo && <Dato label="Folio reporte" valor={cierre.folioReporteCampo} mono />}
          {cierre.oficialNombre && <Dato label="Oficial" valor={cierre.oficialNombre} />}
          {cierre.acciones && <Dato label="Acciones" valor={cierre.acciones} />}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {cierre.hayDetencion && <Badge texto="CON DETENCIÓN" color="#dc2626" bg="#fef2f2" border="#fecaca" />}
            {cierre.autoridadRecibe && <Badge texto={cierre.autoridadRecibe.toUpperCase()} color="#1c3051" bg="#eff1f3" border="#c3c8d2" />}
            {cierre.legacy && <Badge texto="REGISTRO LEGACY" color="#64748b" bg="#f8fafc" border="#e2e8f0" />}
          </div>
        </>
      ) : <Pendiente texto="PENDIENTE DE CIERRE EN CAMPO" />,
    },
  ]

  // Paso legal: solo si hubo detención o ya existe D1
  if (cierre?.hayDetencion || d1) {
    pasos.push({
      icono: <Gavel size={14} />,
      titulo: 'D1 / FLUJO LEGAL',
      fecha: d1?.fechaCreacion ?? null,
      activo: !!d1,
      contenido: d1 ? (
        <>
          <Dato label="Folio denuncia" valor={d1.folioDenuncia} mono />
          {d1.estadoTramite && <Dato label="Estado trámite" valor={d1.estadoTramite} />}
        </>
      ) : <Badge texto="D1 PENDIENTE" color="#c2410c" bg="#fff7ed" border="#fed7aa" />,
    })
  }

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '20px 24px' }}>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        HISTORIAL DEL INCIDENTE
      </span>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
        {pasos.map((paso, i) => (
          <div key={i} style={{ display: 'flex', gap: 16 }}>
            {/* Columna de línea + icono */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: paso.activo ? '#eff1f3' : '#f8fafc',
                border: `1px solid ${paso.activo ? '#c3c8d2' : '#e2e8f0'}`,
                color: paso.activo ? '#1f355a' : '#94a3b8', flexShrink: 0,
              }}>
                {paso.icono}
              </div>
              {i < pasos.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 16, background: paso.activo ? '#c3c8d2' : '#e2e8f0' }} />
              )}
            </div>
            {/* Contenido */}
            <div style={{ paddingBottom: i < pasos.length - 1 ? 20 : 0, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15, letterSpacing: '0.04em', color: paso.activo ? '#0f172a' : '#94a3b8' }}>
                  {paso.titulo}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>{fmt(paso.fecha)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{paso.contenido}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dato({ label, valor, mono }: { label: string; valor: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 110, paddingTop: 1 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'JetBrains Mono' : 'Inter', color: '#334155', fontWeight: mono ? 700 : 400 }}>{valor}</span>
    </div>
  )
}

function Badge({ texto, color, bg, border }: { texto: string; color: string; bg: string; border: string }) {
  return (
    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: bg, color, border: `1px solid ${border}`, borderRadius: 2 }}>
      {texto}
    </span>
  )
}

function Pendiente({ texto }: { texto: string }) {
  return <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.08em' }}>{texto}</span>
}
