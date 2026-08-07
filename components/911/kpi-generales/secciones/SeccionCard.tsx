import { ACCENT } from '../formatos'

// Shell de sección del Panel911 — superficie plana (§6 contenido denso de
// datos: #fff + shadow-card), header con barra de acento (patrón fk-section-head).
// Clases CSS declaradas en Panel911.tsx (una sola hoja por página).
export function SeccionCard({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="kpi-seccion">
      <div className="kpi-seccion-head">
        <div className="kpi-seccion-bar" style={{ background: ACCENT }} />
        <h3 className="kpi-seccion-title">{titulo}</h3>
      </div>
      {children}
    </section>
  )
}

export function Subtitulo({ children }: { children: React.ReactNode }) {
  return (
    <div className="kpi-subtitulo">{children}</div>
  )
}
