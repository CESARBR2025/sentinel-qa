import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * FormKit — primitivas de formulario con el diseño de Seguridad Pública.
 * Layout de 2 columnas responsive, secciones con más aire, foco azul de marca.
 * Componentes presentacionales (server-safe): funcionan dentro de <form action={...}>.
 * Estilos en app/globals.css (prefijo .fk-*).
 */

export function FormHeader({ kicker, title, accent, subtitle }: {
  kicker?: string; title: string; accent?: string; subtitle?: string
}) {
  return (
    <div className="fk-head">
      {kicker && <div className="fk-head-kicker">{kicker}</div>}
      <h2 className="fk-head-title">
        {title} {accent && <span className="accent">{accent}</span>}
      </h2>
      {subtitle && <p className="fk-head-sub">{subtitle}</p>}
    </div>
  )
}

export function Section({ title, num, children }: { title: string; num?: string; children: ReactNode }) {
  return (
    <section className="fk-section">
      <div className="fk-section-head">
        <span className="fk-section-bar" />
        <span className="fk-section-title">{title}</span>
        {num && <span className="fk-section-num">{num}</span>}
      </div>
      <div className="fk-grid">{children}</div>
    </section>
  )
}

function Label({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="fk-label">
      {label}{required && <span className="req">*</span>}
    </span>
  )
}

export function Field({ label, name, type = 'text', required, placeholder, defaultValue, full }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string; full?: boolean
}) {
  return (
    <label className={`fk-field${full ? ' fk-col-full' : ''}`}>
      <Label label={label} required={required} />
      <input className="fk-input" type={type} name={name} required={required} placeholder={placeholder} defaultValue={defaultValue} />
    </label>
  )
}

export function Select({ label, name, options, required, defaultValue = '', full }: {
  label: string; name: string; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string; full?: boolean
}) {
  return (
    <label className={`fk-field${full ? ' fk-col-full' : ''}`}>
      <Label label={label} required={required} />
      <select className="fk-input" name={name} required={required} defaultValue={defaultValue}>
        <option value="">— Seleccionar —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

export function Textarea({ label, name, rows = 3, required, placeholder, full = true }: {
  label: string; name: string; rows?: number; required?: boolean; placeholder?: string; full?: boolean
}) {
  return (
    <label className={`fk-field${full ? ' fk-col-full' : ''}`}>
      <Label label={label} required={required} />
      <textarea className="fk-input" name={name} rows={rows} required={required} placeholder={placeholder} />
    </label>
  )
}

export function FormActions({ submitLabel, cancelHref, cancelLabel = '← Cancelar' }: {
  submitLabel: string; cancelHref: string; cancelLabel?: string
}) {
  return (
    <div className="fk-actions">
      <Link href={cancelHref} className="fk-btn-cancel">{cancelLabel}</Link>
      <button type="submit" className="fk-btn-submit">{submitLabel}</button>
    </div>
  )
}
