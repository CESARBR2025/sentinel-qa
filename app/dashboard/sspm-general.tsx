import Link from 'next/link'
import { BookOpen, BarChart3 } from 'lucide-react'
import { FadeIn } from './fade-in'

// Sección "SSPM General" del dashboard: agrupa los catálogos base de la
// corporación (oficiales, patrullas) + KPIs Generales. Solo se muestra a
// esAdmin — ver el uso en app/dashboard/page.tsx.
// Piloto Apple-style (DESIGN.md §10) — cards alineadas al estilo de
// app/dashboard/module-cards.tsx (glass, hover/press por CSS sin hooks).
export function SspmGeneral() {
  return (
    <FadeIn>
      <style>{`
        .sspm-card {
          display: flex;
          flex-direction: column;
          min-height: 160px;
          padding: 24px;
          background: var(--apple-glass-bg);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--apple-glass-border);
          border-radius: var(--radius-xl);
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: var(--apple-shadow-glass);
          transition: all 0.3s ease-out;
        }
        .sspm-card:hover {
          border-color: rgba(31, 53, 90, 0.25);
          box-shadow: var(--apple-shadow-glass-hover);
          transform: translateY(-2px);
        }
        .sspm-card:active {
          transform: scale(0.97);
          box-shadow: var(--apple-shadow-glass);
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out;
        }
        .sspm-card-icon { color: #64748b; transform: scale(1); transform-origin: top left; transition: all 0.3s ease-out; }
        .sspm-card:hover .sspm-card-icon { color: #1f355a; transform: scale(1.1); }
        .sspm-card-title {
          font-family: var(--apple-font-display);
          font-weight: 600;
          font-size: 26px;
          letter-spacing: normal;
          text-transform: none;
          color: #0f172a;
          margin: 0;
          transition: color 0.3s ease-out;
        }
        .sspm-card:hover .sspm-card-title { color: #1f355a; }
        .sspm-card-sub {
          font-family: var(--apple-font-display);
          font-size: 13px;
          color: #64748b;
          margin-top: 6px;
          line-height: 1.4;
          transition: color 0.3s ease-out;
        }
        .sspm-card:hover .sspm-card-sub { color: #475569; }
        .sspm-card-cta {
          font-family: var(--apple-font-display);
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s ease-out;
        }
        .sspm-card:hover .sspm-card-cta { color: #1f355a; }
        .sspm-card-cta-arrow { transition: transform 0.3s ease-out; }
        .sspm-card:hover .sspm-card-cta-arrow { transform: translateX(4px); }
        @media (prefers-reduced-motion: reduce) {
          .sspm-card, .sspm-card:hover, .sspm-card:active,
          .sspm-card-icon, .sspm-card-title, .sspm-card-sub,
          .sspm-card-cta, .sspm-card-cta-arrow {
            transform: none;
            transition: box-shadow 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 4, height: 16, background: '#c0223a' }} />
        <h2
          style={{
            fontFamily: 'var(--apple-font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: '#0f172a',
            margin: 0,
          }}
        >
          SSPM General
        </h2>
        <span
          style={{
            fontFamily: 'var(--apple-font-display)',
            fontSize: 13,
            color: '#64748b',
          }}
        >
          Administración de catálogos
        </span>
      </div>

      <div className="cat-cards-grid">
        <Link href="/dashboard/catalogos" className="sspm-card">
          <div style={{ marginBottom: 16 }}>
            <div className="sspm-card-icon">
              <BookOpen size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="sspm-card-title">Catálogos</div>
            <div className="sspm-card-sub">Oficiales y patrullas del parque vehicular</div>
          </div>
          <div className="sspm-card-cta">
            Acceder <span className="sspm-card-cta-arrow">→</span>
          </div>
        </Link>

        <Link href="/dashboard/kpis" className="sspm-card">
          <div style={{ marginBottom: 16 }}>
            <div className="sspm-card-icon">
              <BarChart3 size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="sspm-card-title">KPIs Generales</div>
            <div className="sspm-card-sub">Indicadores operativos SSPM e Infracciones</div>
          </div>
          <div className="sspm-card-cta">
            Acceder <span className="sspm-card-cta-arrow">→</span>
          </div>
        </Link>
      </div>
    </FadeIn>
  )
}
