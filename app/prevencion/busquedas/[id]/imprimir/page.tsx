import { db } from '@/lib/db/index'
import { fichasBusqueda } from '@/lib/db/schema'
import { eq }          from 'drizzle-orm'
import { notFound }    from 'next/navigation'
import { format }      from 'date-fns'
import { es }          from 'date-fns/locale'
import { PrintButton } from '@/components/prevencion/PrintButton'

function fmtDT(v: Date | string | null): string {
  if (!v) return '—'
  return format(v instanceof Date ? v : new Date(String(v)), "dd 'de' MMMM yyyy, HH:mm", { locale: es })
}

export default async function ImprimirFichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [ficha] = await db
    .select()
    .from(fichasBusqueda)
    .where(eq(fichasBusqueda.id, id))
    .limit(1)

  if (!ficha) notFound()

  const esDifusion = ficha.tipo === 'PROTOCOLO_ALBA'

  return (
    <>
      {/* CSS impresión — oculta el layout de la app */}
      <style>{`
        @media print {
          header, nav, footer { display: none !important; }
          main { padding: 0 !important; }
          #print-hide { display: none !important; }
          body { background: white !important; color: black !important; }
        }
        @media screen {
          #ficha-print { background: white; color: #111; max-width: 700px; margin: 0 auto; padding: 40px; }
        }
      `}</style>

      {/* Botones (solo pantalla) */}
      <div id="print-hide" style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <a
          href={`/prevencion/busquedas/${id}`}
          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
        >
          ← Regresar
        </a>
        <PrintButton />
      </div>

      {/* Ficha imprimible */}
      <div id="ficha-print">
        {/* Encabezado institucional */}
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>
              SSPM — San Juan del Río, Qro.
            </div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Dirección de Prevención del Delito
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#666' }}>
              Folio: <strong>{ficha.folio ?? 'S/F'}</strong>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#888', marginTop: 2 }}>
              {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111' }}>
            {esDifusion ? 'FICHA DE DIFUSIÓN — PROTOCOLO ALBA' : 'FICHA DE BÚSQUEDA DE PERSONA'}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#555', marginTop: 4, fontWeight: 700 }}>
            {esDifusion ? '⚠ ACTIVACIÓN INMEDIATA — DIFUNDIR A TODAS LAS UNIDADES' : ''}
          </div>
        </div>

        {/* Datos de la persona */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontFamily: 'sans-serif', fontSize: 12 }}>
          <tbody>
            <PrintRow label="Nombre completo"   value={ficha.nombreDesaparecida} bold />
            <PrintRow label="Edad"               value={ficha.edad != null ? `${ficha.edad} años` : '—'} />
            <PrintRow label="Carpeta de investigación" value={ficha.carpetaInvestigacion} />
          </tbody>
        </table>

        {/* Datos operativos */}
        <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: 4, marginBottom: 12, color: '#444' }}>
          Datos Operativos
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontFamily: 'sans-serif', fontSize: 12 }}>
          <tbody>
            <PrintRow label="Fecha y hora de activación" value={fmtDT(ficha.fechaActivacion)} bold />
            <PrintRow label="Fecha y hora de aceptación" value={fmtDT(ficha.fechaAceptacion)} />
            <PrintRow label="Enlace asignado"            value={ficha.enlace} />
            <PrintRow label="RT que atiende"             value={ficha.rtAtiende} />
            <PrintRow label="Elemento de novedades"      value={ficha.elementoNovedades} />
          </tbody>
        </table>

        {/* Plazos reglamentarios */}
        {esDifusion && (
          <>
            <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: 4, marginBottom: 12, color: '#444' }}>
              Plazos Reglamentarios de Seguimiento
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontFamily: 'sans-serif', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc', background: '#f5f5f5' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Informe</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fecha / hora esperada</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enviado por</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fecha / hora envío</th>
                </tr>
              </thead>
              <tbody>
                {['Contestación inicial', '24 horas', '48 horas', '72 horas'].map(label => (
                  <tr key={label} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px 8px' }}>{label}</td>
                    <td style={{ padding: '6px 8px', color: '#888' }}> </td>
                    <td style={{ padding: '6px 8px', color: '#888' }}> </td>
                    <td style={{ padding: '6px 8px', color: '#888' }}> </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Firma */}
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', width: '40%' }}>
            <div style={{ borderTop: '1px solid #111', paddingTop: 8, fontFamily: 'sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
              Enlace Asignado
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '40%' }}>
            <div style={{ borderTop: '1px solid #111', paddingTop: 8, fontFamily: 'sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
              Jefe de Área
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid #eee', fontFamily: 'monospace', fontSize: 9, color: '#bbb', textAlign: 'center' }}>
          SENTINEL v0.1 · SSPM San Juan del Río · ID: {id}
        </div>
      </div>

    </>
  )
}

function PrintRow({ label, value, bold }: { label: string; value?: string | number | null; bold?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '6px 8px', fontWeight: 700, color: '#444', width: '35%', fontSize: 11, fontFamily: 'sans-serif' }}>{label}</td>
      <td style={{ padding: '6px 8px', fontWeight: bold ? 700 : 400, fontFamily: 'sans-serif' }}>{value ?? '—'}</td>
    </tr>
  )
}
