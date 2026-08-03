import Link from 'next/link'
import { query } from '@/lib/db'

type CatalogoCard = {
  id: string
  label: string
  sub: string
  href: string
  color: string
  count: number
  countLabel: string
}

async function contarCatalogo(tabla: 'ofi_oficiales' | 'via.v2_patrullas'): Promise<number> {
  const r = await query<{ n: string }>(`SELECT COUNT(*)::text AS n FROM ${tabla}`)
  return Number(r.rows[0]?.n ?? 0)
}

export default async function CatalogosIndexPage() {
  const [nOficiales, nPatrullas] = await Promise.all([
    contarCatalogo('ofi_oficiales'),
    contarCatalogo('via.v2_patrullas'),
  ])

  const cards: CatalogoCard[] = [
    {
      id: 'oficiales',
      label: 'Oficiales',
      sub: 'Nómina · departamento · patrulla asignada',
      href: '/dashboard/catalogos/oficiales',
      color: '#1f355a',
      count: nOficiales,
      countLabel: 'Registrados',
    },
    {
      id: 'patrullas',
      label: 'Patrullas',
      sub: 'Parque vehicular · placa · serie · características',
      href: '/dashboard/catalogos/patrullas',
      color: '#c0223a',
      count: nPatrullas,
      countLabel: 'En catálogo',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: '0 0 4px',
          }}
        >
          Catálogos{' '}
          <span style={{ color: '#1f355a' }}>SSPM</span>
        </h2>
        <p
          style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Selecciona un catálogo para administrarlo
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {cards.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 200,
              padding: 24,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transition: 'all 0.4s cubic-bezier(0.2,0.8,0.2,1)',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: c.color }} />
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#0f172a',
                }}
              >
                {c.label}
                <span
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 30,
                    color: c.color,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.count}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 9,
                  color: '#64748b',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                {c.countLabel}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: 16,
                  lineHeight: 1.4,
                }}
              >
                {c.sub}
              </div>
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: 16,
              }}
            >
              ADMINISTRAR →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
