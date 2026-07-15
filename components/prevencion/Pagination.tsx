'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

/**
 * Paginación con animación moderna (pop al activar página) — mismo lenguaje
 * visual que el resto de prevención. 10 elementos por página por defecto.
 * Preserva cualquier otro filtro (?q=, ?estado=, ?autoridad=, etc.) en la URL.
 */
export function Pagination({ total, perPage = 10 }: { total: number; perPage?: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(totalPages, Math.max(1, Number(searchParams.get('page') ?? '1') || 1))

  if (total === 0) return null

  const goTo = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString())
    if (p <= 1) sp.delete('page')
    else sp.set('page', String(p))
    router.push(sp.toString() ? `${pathname}?${sp.toString()}` : pathname)
  }

  // Rango de páginas visibles con elipsis (ventana de 5 alrededor de la actual)
  const pages: (number | '…')[] = []
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(totalPages - 1, current + 1)
  pages.push(1)
  if (windowStart > 2) pages.push('…')
  for (let p = windowStart; p <= windowEnd; p++) pages.push(p)
  if (windowEnd < totalPages - 1) pages.push('…')
  if (totalPages > 1) pages.push(totalPages)

  const from = total === 0 ? 0 : (current - 1) * perPage + 1
  const to = Math.min(total, current * perPage)

  return (
    <div className="pg-wrap">
      <div className="pg-info">
        Mostrando <b>{from}–{to}</b> de <b>{total}</b>
      </div>
      <div className="pg-nav">
        <button className="pg-btn" onClick={() => goTo(current - 1)} disabled={current === 1} aria-label="Página anterior">‹</button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} className="pg-ellipsis">···</span>
            : (
              <button
                key={p}
                className={`pg-btn${p === current ? ' is-active' : ''}`}
                onClick={() => goTo(p)}
                aria-current={p === current ? 'page' : undefined}
              >
                {p}
              </button>
            )
        )}
        <button className="pg-btn" onClick={() => goTo(current + 1)} disabled={current === totalPages} aria-label="Página siguiente">›</button>
      </div>
    </div>
  )
}
