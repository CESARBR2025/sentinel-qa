'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight, X,
  User, Hash, FileText, Tag, Gavel, ShieldAlert, Calendar, Inbox, ListChecks,
  ClipboardList, Scale, FileWarning,
} from 'lucide-react'
import type { DetenidoCompleto } from '@/lib/reporte-detenidos/types'

const PAGE_SIZE = 20

type ClaveSort = 'nombre' | 'folio' | 'evento' | 'delito' | 'fecha'
type DirSort = 'asc' | 'desc'
type TipoFiltro = 'todos' | 'delito' | 'falta'

const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontFamily: 'var(--apple-font-display)',
  fontSize: 12, fontWeight: 600, color: '#64748b',
  borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'var(--apple-font-display)', fontSize: 13,
  color: '#334155', borderBottom: '1px solid #f1f5f9',
}

function fechaCorta(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function esEsteMes(iso: string): boolean {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return false
  const ahora = new Date()
  return d.getFullYear() === ahora.getFullYear() && d.getMonth() === ahora.getMonth()
}

export function TablaDetenidosReporte({ detenidos }: { detenidos: DetenidoCompleto[] }) {
  const [sort, setSort] = useState<{ clave: ClaveSort; dir: DirSort }>({ clave: 'fecha', dir: 'desc' })
  const [query, setQuery] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [tipo, setTipo] = useState<TipoFiltro>('todos')
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = detenidos

    if (q) {
      lista = lista.filter(d =>
        [d.nombre, d.folioDenuncia, d.iph, d.evento, d.delito, d.faltaAdministrativa, d.modusOperandi]
          .filter(Boolean)
          .some(v => (v as string).toLowerCase().includes(q)),
      )
    }

    if (desde) lista = lista.filter(d => d.createdAt.slice(0, 10) >= desde)
    if (hasta) lista = lista.filter(d => d.createdAt.slice(0, 10) <= hasta)

    if (tipo === 'delito') lista = lista.filter(d => d.delito && d.delito !== '—')
    if (tipo === 'falta') lista = lista.filter(d => d.faltaAdministrativa && d.faltaAdministrativa !== '—')

    const dir = sort.dir === 'asc' ? 1 : -1
    return [...lista].sort((a, b) => {
      switch (sort.clave) {
        case 'nombre': return a.nombre.localeCompare(b.nombre, 'es') * dir
        case 'folio': return a.folioDenuncia.localeCompare(b.folioDenuncia) * dir
        case 'evento': return a.evento.localeCompare(b.evento, 'es') * dir
        case 'delito': return a.delito.localeCompare(b.delito, 'es') * dir
        default: return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }
    })
  }, [detenidos, query, desde, hasta, tipo, sort])

  const kpis = useMemo(() => {
    const conDelito = detenidos.filter(d => d.delito && d.delito !== '—').length
    const conFalta = detenidos.filter(d => d.faltaAdministrativa && d.faltaAdministrativa !== '—').length
    const esteMes = detenidos.filter(d => esEsteMes(d.createdAt)).length
    return { conDelito, conFalta, esteMes }
  }, [detenidos])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginaActual = Math.min(pagina, totalPaginas)
  const filas = filtrados.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE)

  const alternarSort = (clave: ClaveSort) => {
    setSort(prev => prev.clave === clave
      ? { clave, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { clave, dir: clave === 'fecha' ? 'desc' : 'asc' })
    setPagina(1)
  }

  const limpiarFiltros = () => {
    setQuery(''); setDesde(''); setHasta(''); setTipo('todos'); setPagina(1)
  }

  const hayFiltros = query !== '' || desde !== '' || hasta !== '' || tipo !== 'todos'

  const exportarCsv = () => {
    const encabezados = ['Nombre', 'Folio D1', 'IPH', 'Evento', 'Delito', 'Falta administrativa', 'Modus operandi', 'Fecha']
    const filasCsv = filtrados.map(d => [
      d.nombre, d.folioDenuncia, d.iph ?? '', d.evento, d.delito,
      d.faltaAdministrativa, d.modusOperandi, fechaCorta(d.createdAt),
    ])
    const csv = [encabezados, ...filasCsv]
      .map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-detenidos-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .det-kpi { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        @media (max-width: 900px) { .det-kpi { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .det-kpi-cnt { transition: all 0.3s ease-out; }
        .det-kpi-cnt:hover { transform: translateY(-2px); box-shadow: var(--shadow-elevated); }
        @media (prefers-reduced-motion: reduce) { .det-kpi-cnt:hover { transform: none; } }
        .det-tabla { width: 100%; border-collapse: collapse; }
        .det-tabla thead th { position: sticky; top: 0; background: #f8fafc; z-index: 1; }
        .det-tabla tbody tr { transition: background-color 0.15s; }
        .det-tabla tbody tr:hover { background-color: #f8fafc; }
        .det-tabla-scroll { max-height: 620px; overflow-y: auto; }
        .det-th-btn { display: inline-flex; align-items: center; gap: 5px; border: none; background: none; padding: 0; font-family: var(--apple-font-display); font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; transition: color 0.15s ease; }
        .det-th-btn:hover { color: #1f355a; }
        .det-th-btn:hover .det-th-ico { color: #1f355a; }
        .det-th-btn.det-th-activa { color: #1f355a; }
        .det-th-btn.det-th-activa .det-th-ico { color: #1f355a; }
        .det-th-ico { display: flex; color: #94a3b8; transition: color 0.15s ease; }
        .det-search { padding: 8px 32px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #f8fafc; font-family: var(--apple-font-display); font-size: 13px; color: #1e293b; min-width: 0; width: 100%; transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
        .det-search:hover { border-color: #cbd5e1; }
        .det-search:focus { outline: none; border-color: #1f355a; background: #fff; box-shadow: 0 0 0 3px rgba(31, 53, 90, 0.12); }
        .det-search-clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: none; border-radius: var(--radius-full); background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.15s ease; }
        .det-search-clear:hover { background: #e2e8f0; color: #475569; }
        .det-input { border: 1px solid #e2e8f0; background: #f8fafc; padding: 9px 12px; border-radius: var(--radius-lg); font-family: var(--apple-font-display); font-size: 13px; color: #1e293b; min-width: 0; width: 100%; transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
        .det-input:hover { border-color: #cbd5e1; }
        .det-input:focus { outline: none; border-color: #1f355a; background: #fff; box-shadow: 0 0 0 3px rgba(31, 53, 90, 0.12); }
        .det-btn-export { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #fff; color: #475569; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .det-btn-export:hover:not(:disabled) { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .det-btn-export:active:not(:disabled) { transform: scale(0.97); transition: transform 0.12s ease-out, border-color 0.12s ease-out; }
        .det-btn-export:disabled { opacity: 0.5; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .det-btn-export:active:not(:disabled) { transform: none; } }
        .det-btn-limpiar { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); background: #fff; color: #64748b; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .det-btn-limpiar:hover:not(:disabled) { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .det-btn-limpiar:active:not(:disabled) { transform: scale(0.97); transition: transform 0.12s ease-out, border-color 0.12s ease-out; }
        .det-btn-limpiar:disabled { opacity: 0.4; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .det-btn-limpiar:active:not(:disabled) { transform: none; } }
        .det-filtros { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 14px; align-items: end; }
        @media (max-width: 1000px) { .det-filtros { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .det-filtros { grid-template-columns: 1fr; } }
        .det-pag-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: var(--radius-md); background: #fff; color: #475569; cursor: pointer; transition: all 0.2s ease; }
        .det-pag-btn:hover:not(:disabled) { border-color: #1f355a; color: #1f355a; background: rgba(31, 53, 90, 0.05); }
        .det-pag-btn:active:not(:disabled) { transform: scale(0.94); }
        .det-pag-btn:disabled { opacity: 0.35; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .det-pag-btn:active:not(:disabled) { transform: none; } }
      `}} />

      {/* Resumen */}
      <section className="det-kpi" aria-label="Resumen del reporte">
        <div className="det-kpi-cnt" style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)', padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>Detenidos reportados</span>
            <span style={{ display: 'flex', color: '#94a3b8' }}><ClipboardList size={18} strokeWidth={1.5} /></span>
          </div>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 40, lineHeight: 1, color: '#1f355a' }}>{detenidos.length}</span>
        </div>
        <div className="det-kpi-cnt" style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)', padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>Con delito</span>
            <span style={{ display: 'flex', color: '#94a3b8' }}><Scale size={18} strokeWidth={1.5} /></span>
          </div>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1, color: '#0f172a' }}>{kpis.conDelito}</span>
        </div>
        <div className="det-kpi-cnt" style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)', padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>Con falta administrativa</span>
            <span style={{ display: 'flex', color: '#94a3b8' }}><FileWarning size={18} strokeWidth={1.5} /></span>
          </div>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1, color: '#0f172a' }}>{kpis.conFalta}</span>
        </div>
        <div className="det-kpi-cnt" style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)', padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b' }}>Este mes</span>
            <span style={{ display: 'flex', color: '#94a3b8' }}><Calendar size={18} strokeWidth={1.5} /></span>
          </div>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1, color: '#0f172a' }}>{kpis.esteMes}</span>
        </div>
      </section>

      {/* Filtros */}
      <section style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)', padding: '14px 18px',
      }}>
        <div className="det-filtros">
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <label style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b', marginBottom: 6 }}>
              Buscar detenido
            </label>
            <div style={{ position: 'relative', minWidth: 0 }}>
              <Search size={14} style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', pointerEvents: 'none',
              }} />
              <input
                className="det-search"
                type="search"
                placeholder="Nombre, folio, IPH, delito…"
                value={query}
                onChange={e => { setQuery(e.target.value); setPagina(1) }}
                aria-label="Buscar en detenidos"
              />
              {query && (
                <button
                  type="button" className="det-search-clear" aria-label="Limpiar búsqueda"
                  onClick={() => { setQuery(''); setPagina(1) }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <label style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b', marginBottom: 6 }}>Desde</label>
            <input type="date" className="det-input" value={desde} onChange={e => { setDesde(e.target.value); setPagina(1) }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <label style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b', marginBottom: 6 }}>Hasta</label>
            <input type="date" className="det-input" value={hasta} onChange={e => { setHasta(e.target.value); setPagina(1) }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <label style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12, color: '#64748b', marginBottom: 6 }}>Tipo</label>
            <select className="det-input" value={tipo} onChange={e => { setTipo(e.target.value as TipoFiltro); setPagina(1) }}>
              <option value="todos">Todos</option>
              <option value="delito">Solo con delito</option>
              <option value="falta">Solo falta administrativa</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tabla */}
      <section style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 3, height: 18, background: '#059669', borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16, color: '#0f172a', whiteSpace: 'nowrap' }}>
                Registros del reporte
              </h2>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 11,
              color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap',
            }}>
              <ListChecks size={12} strokeWidth={2} />
              {filtrados.length} de {detenidos.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="det-btn-limpiar" onClick={limpiarFiltros} disabled={!hayFiltros}>
              <X size={14} /> Limpiar
            </button>
            <button type="button" className="det-btn-export" onClick={exportarCsv} disabled={filtrados.length === 0}>
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        <div className="tabla-wrap det-tabla-scroll">
          <table className="det-tabla">
            <thead>
              <tr>
                <th style={th}>
                  <ColumnaBoton etiqueta="Nombre" icono={<User size={12} strokeWidth={2} />} clave="nombre" sort={sort} onClick={() => alternarSort('nombre')} />
                </th>
                <th style={th}>
                  <ColumnaBoton etiqueta="Folio D1" icono={<Hash size={12} strokeWidth={2} />} clave="folio" sort={sort} onClick={() => alternarSort('folio')} />
                </th>
                <th style={th}><EtiquetaColumna etiqueta="IPH" icono={<FileText size={12} strokeWidth={2} />} /></th>
                <th style={th}>
                  <ColumnaBoton etiqueta="Evento" icono={<Tag size={12} strokeWidth={2} />} clave="evento" sort={sort} onClick={() => alternarSort('evento')} />
                </th>
                <th style={th}>
                  <ColumnaBoton etiqueta="Delito" icono={<Gavel size={12} strokeWidth={2} />} clave="delito" sort={sort} onClick={() => alternarSort('delito')} />
                </th>
                <th style={th}><EtiquetaColumna etiqueta="Falta administrativa" icono={<ShieldAlert size={12} strokeWidth={2} />} /></th>
                <th style={th}><EtiquetaColumna etiqueta="Modus operandi" icono={<FileWarning size={12} strokeWidth={2} />} /></th>
                <th style={th}>
                  <ColumnaBoton etiqueta="Fecha" icono={<Calendar size={12} strokeWidth={2} />} clave="fecha" sort={sort} onClick={() => alternarSort('fecha')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td style={{ ...td, padding: '40px 12px', textAlign: 'center' }} colSpan={8}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#94a3b8' }}>
                      <Inbox size={22} strokeWidth={1.5} />
                      <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13 }}>
                        {detenidos.length === 0
                          ? 'No hay detenidos con las 3 fotos completadas'
                          : 'Sin resultados para los filtros aplicados'}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {filas.map(d => (
                <tr key={d.id}>
                  <td style={{ ...td, fontWeight: 600, color: '#0f172a' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'flex', color: '#94a3b8' }}><User size={13} strokeWidth={1.75} /></span>
                      {d.nombre}
                    </span>
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{d.folioDenuncia || '—'}</td>
                  <td style={td}>
                    {d.iph ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
                        color: '#0f766e', background: '#f0fdfa', padding: '3px 10px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
                      }}>
                        {d.iph}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={td}>{d.evento}</td>
                  <td style={td}>
                    <ChipRubro valor={d.delito} variante="delito" />
                  </td>
                  <td style={td}>
                    <ChipRubro valor={d.faltaAdministrativa} variante="falta" />
                  </td>
                  <td style={{ ...td, maxWidth: 220 }}>
                    <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, display: 'block' }}>
                      {d.modusOperandi !== '—' ? d.modusOperandi : '—'}
                    </span>
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{fechaCorta(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '12px 18px', borderTop: '1px solid #e2e8f0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        }}>
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b' }}>
            {filtrados.length === 0
              ? 'Sin resultados'
              : `${(paginaActual - 1) * PAGE_SIZE + 1}–${Math.min(paginaActual * PAGE_SIZE, filtrados.length)} de ${filtrados.length}`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button" className="det-pag-btn" aria-label="Página anterior"
              disabled={paginaActual <= 1} onClick={() => setPagina(p => p - 1)}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12, color: '#475569' }}>
              {paginaActual} / {totalPaginas}
            </span>
            <button
              type="button" className="det-pag-btn" aria-label="Página siguiente"
              disabled={paginaActual >= totalPaginas} onClick={() => setPagina(p => p + 1)}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ColumnaBoton({ etiqueta, icono, clave, sort, onClick }: {
  etiqueta: string
  icono: React.ReactNode
  clave: ClaveSort
  sort: { clave: ClaveSort; dir: DirSort }
  onClick: () => void
}) {
  const activa = sort.clave === clave
  return (
    <button
      type="button"
      className={`det-th-btn${activa ? ' det-th-activa' : ''}`}
      onClick={onClick}
      aria-label={`Ordenar por ${etiqueta}${activa ? `, actualmente ${sort.dir === 'asc' ? 'ascendente' : 'descendente'}` : ''}`}
    >
      <span className="det-th-ico">{icono}</span>
      {etiqueta}
      {activa && (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
    </button>
  )
}

function EtiquetaColumna({ etiqueta, icono }: { etiqueta: string; icono: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span className="det-th-ico">{icono}</span>
      {etiqueta}
    </span>
  )
}

function ChipRubro({ valor, variante }: { valor: string; variante: 'delito' | 'falta' }) {
  const esVacio = !valor || valor === '—'
  if (esVacio) return <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>

  const cfg = variante === 'delito'
    ? { bg: '#fee2e2', color: '#b91c1c', icono: <Gavel size={11} strokeWidth={2} /> }
    : { bg: '#fef3c7', color: '#b45309', icono: <ShieldAlert size={11} strokeWidth={2} /> }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
      background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
    }}>
      {cfg.icono}
      {valor}
    </span>
  )
}
