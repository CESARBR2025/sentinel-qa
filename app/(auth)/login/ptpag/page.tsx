import { Suspense } from 'react'
import { Pagination } from '@/components/prevencion/Pagination'
import { paginate } from '@/lib/prevencion/paginate'
import { SearchBox } from '@/components/prevencion/SearchBox'

export default async function PtPag({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const { page, q } = await searchParams
  let rows = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Expediente ${i + 1}` }))
  if (q) rows = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
  const total = rows.length
  const pageRows = paginate(rows, page)

  return (
    <div style={{ maxWidth: 900, padding: 40, background: '#f8fafc', minHeight: '100vh' }}>
      <Suspense><SearchBox placeholder="Buscar expediente..." /></Suspense>
      <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e8f0' }}>
        {pageRows.map(r => (
          <div key={r.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r.name}</div>
        ))}
      </div>
      <Suspense><Pagination total={total} /></Suspense>
    </div>
  )
}
