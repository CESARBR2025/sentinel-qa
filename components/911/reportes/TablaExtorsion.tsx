'use client'
import { useMemo, useState } from 'react'
import {
  FileText, Phone, CalendarDays, Search, Inbox, MapPin, Users, Radio,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'

interface ExtorsionRow {
  folio: string
  folioReporte: string
  telefono: string
  fecha: string
  hora: string
  lugar: string
  grupoDelictivo: string
  modusOperandi: string
  unidad: string
  resultado: string
}

const ITEMS_PER_PAGE = 10

export function TablaExtorsion({ data }: { data: ExtorsionRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(r =>
      r.telefono.toLowerCase().includes(q) ||
      r.lugar.toLowerCase().includes(q) ||
      r.grupoDelictivo.toLowerCase().includes(q) ||
      r.unidad.toLowerCase().includes(q) ||
      r.folioReporte.toLowerCase().includes(q)
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  const pageRows = filtered.slice(start, start + ITEMS_PER_PAGE)

  const th: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
    color: '#64748b', textAlign: 'left', padding: '12px 16px',
    background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontWeight: 400, fontSize: 13,
    color: '#1e293b', padding: '13px 16px', borderBottom: '1px solid #f1f5f9',
  }
  const pillBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 'var(--radius-md)', background: '#fff',
    border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 20px', borderBottom: '1px solid #eef2f7', background: 'linear-gradient(180deg,#f8fafc,#f1f5f9)' }}>
        <span style={{ width: 3, height: 18, background: '#dc2626', borderRadius: 'var(--radius-full)' }} />
        <FileText size={16} color="#dc2626" />
        <h3 style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16, color: '#0f172a', margin: 0 }}>Llamadas de extorsión</h3>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, padding: '2px 10px', borderRadius: 'var(--radius-full)', background: '#fee2e2', color: '#dc2626' }}>
          {filtered.length} registro{filtered.length === 1 ? '' : 's'}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar teléfono, lugar, grupo, unidad…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: 280, maxWidth: '100%', padding: '9px 12px 9px 34px', background: '#fff',
              border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#1e293b', outline: 'none',
            }}
          />
        </div>
      </div>

      <div className="tabla-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400 }}>
          <thead>
            <tr>
              <th style={th}>Fecha</th>
              <th style={th}>Hora</th>
              <th style={th}>Lugar</th>
              <th style={th}>Teléfono de Extorsión</th>
              <th style={th}>Grupo Delictivo</th>
              <th style={th}>Modus Operandi</th>
              <th style={th}>Unidad</th>
              <th style={th}>Resultado</th>
              <th style={th}>Folio de Reporte</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? pageRows.map((r, i) => {
              const base = (start + i) % 2 === 0 ? '#fff' : '#f8fafc'
              return (
                <tr key={`${r.folio}-${start + i}`} style={{ background: base, transition: 'background .15s ease' }}>
                  <td style={{ ...td, color: '#475569' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <CalendarDays size={13} color="#94a3b8" />
                      {r.fecha}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{r.hora}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={13} color="#94a3b8" />
                      {r.lugar}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 600, color: '#1f355a' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'rgba(31,53,90,0.08)' }}>
                        <Phone size={12} color="#1f355a" />
                      </span>
                      {r.telefono}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: '#f1f5f9', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: 12, color: '#334155' }}>
                      <Users size={11} color="#64748b" />
                      {r.grupoDelictivo}
                    </span>
                  </td>
                  <td style={td}>{r.modusOperandi}</td>
                  <td style={{ ...td, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 12, color: '#64748b' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Radio size={12} color="#94a3b8" />
                      {r.unidad}
                    </span>
                  </td>
                  <td style={td}>{r.resultado}</td>
                  <td style={{ ...td, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 12, color: '#64748b' }}>{r.folioReporte}</td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={9}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 20px' }}>
                    <Inbox size={36} color="#cbd5e1" strokeWidth={1.5} />
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 14, color: '#94a3b8' }}>
                      {search ? 'Sin coincidencias con la búsqueda' : 'No hay registros en el rango de fechas seleccionado'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '12px 20px', borderTop: '1px solid #eef2f7', background: '#fff' }}>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>
          {filtered.length > 0
            ? `Mostrando ${start + 1}–${Math.min(start + ITEMS_PER_PAGE, filtered.length)} de ${filtered.length}`
            : 'Sin resultados'}
        </span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <button disabled={safePage === 1} onClick={() => setPage(1)} style={{ ...pillBtn, opacity: safePage === 1 ? 0.35 : 1 }}><ChevronsLeft size={15} /></button>
          <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)} style={{ ...pillBtn, opacity: safePage === 1 ? 0.35 : 1 }}><ChevronLeft size={15} /></button>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12, color: '#0f172a', margin: '0 10px', whiteSpace: 'nowrap' }}>
            Página {safePage} de {totalPages}
          </span>
          <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} style={{ ...pillBtn, opacity: safePage === totalPages ? 0.35 : 1 }}><ChevronRight size={15} /></button>
          <button disabled={safePage === totalPages} onClick={() => setPage(totalPages)} style={{ ...pillBtn, opacity: safePage === totalPages ? 0.35 : 1 }}><ChevronsRight size={15} /></button>
        </div>
      </div>
    </div>
  )
}
