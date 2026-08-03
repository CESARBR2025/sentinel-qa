'use client'

import { useEffect } from 'react'

/**
 * Fallback de error global (root layout). Sustituye la página genérica de
 * Next cuando el crash ocurre en el layout raíz. Debe incluir su propio
 * <html> y <body> y ser 100% autocontenido.
 * Next 16.2+: el callback de reintento se llama `unstable_retry`.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="es" style={{ background: '#f8fafc' }}>
      <body style={{ margin: 0 }}>
        <div className="gerr-scope">
          <div className="gerr-bg" />

          <main className="gerr-card">
            <div className="gerr-shield">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path
                  d="M24 3l17 6.4v12.2c0 10.1-7 17.3-17 20.4-10-3.1-17-10.3-17-20.4V9.4L24 3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 24l6.5 6.5L34 17.5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="gerr-kicker">SSPM SAN JUAN DEL RÍO · CENTINELA</p>
            <h1 className="gerr-title">
              ERROR <span className="gerr-title-accent">DE SISTEMA</span>
            </h1>
            <p className="gerr-sub">
              Ocurrió un problema inesperado en el sistema. Puedes reintentar o recargar.
            </p>
            {error.digest ? <p className="gerr-digest">REF: {error.digest}</p> : null}

            <div className="gerr-actions">
              <button type="button" className="gerr-btn" onClick={() => unstable_retry()}>
                Reintentar
              </button>
              <button type="button" className="gerr-link" onClick={() => window.location.reload()}>
                Recargar página
              </button>
            </div>
          </main>

          <style>{`
            .gerr-scope {
              position: relative;
              min-height: 100vh;
              min-height: 100dvh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8fafc;
              color: #0f172a;
              font-family: 'Inter', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
              overflow: hidden;
              padding: 24px;
              box-sizing: border-box;
            }
            .gerr-bg {
              position: absolute;
              inset: 0;
              background-image:
                linear-gradient(rgba(31,53,90,.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(31,53,90,.06) 1px, transparent 1px);
              background-size: 44px 44px;
              pointer-events: none;
            }
            .gerr-card {
              position: relative;
              z-index: 1;
              width: min(480px, 100%);
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-top: 3px solid #1f355a;
              border-radius: 4px;
              box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 12px rgba(15,23,42,.05);
              padding: clamp(28px, 6vw, 52px);
              text-align: center;
              box-sizing: border-box;
            }
            .gerr-shield { width: 64px; height: 64px; margin: 0 auto 16px; color: #1f355a; }
            .gerr-shield svg { width: 64px; height: 64px; }
            .gerr-kicker {
              margin: 0 0 10px;
              font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
              font-size: 10px;
              letter-spacing: .28em;
              text-transform: uppercase;
              color: #64748b;
            }
            .gerr-title {
              margin: 0 0 14px;
              font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
              font-weight: 800;
              font-size: clamp(30px, 5vw, 42px);
              letter-spacing: .05em;
              text-transform: uppercase;
              line-height: 1;
              color: #0f172a;
            }
            .gerr-title-accent { color: #1f355a; }
            .gerr-sub {
              margin: 0 auto;
              max-width: 340px;
              font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
              font-size: 12px;
              line-height: 1.7;
              color: #64748b;
            }
            .gerr-digest {
              margin: 10px 0 0;
              font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
              font-size: 9.5px;
              letter-spacing: .08em;
              color: #94a3b8;
            }
            .gerr-actions {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 16px;
              margin-top: 26px;
              flex-wrap: wrap;
            }
            .gerr-btn {
              padding: 12px 28px;
              background: linear-gradient(180deg, #274268 0%, #1f355a 100%);
              color: #fff;
              border: 1px solid #1f355a;
              border-radius: 3px;
              font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
              font-weight: 700;
              font-size: 15px;
              letter-spacing: .08em;
              text-transform: uppercase;
              cursor: pointer;
              transition: filter .12s ease, box-shadow .12s ease, transform .12s ease;
            }
            .gerr-btn:hover { filter: brightness(1.08); box-shadow: 0 6px 20px rgba(31,53,90,.25); transform: translateY(-1px); }
            .gerr-btn:active { transform: translateY(0); }
            .gerr-link {
              background: none;
              border: none;
              cursor: pointer;
              padding: 4px 2px;
              color: #1f355a;
              font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
              font-size: 11px;
              letter-spacing: .08em;
              text-transform: uppercase;
              border-bottom: 1px solid rgba(31,53,90,.35);
            }
            .gerr-link:hover { border-bottom-color: #1f355a; }
          `}</style>
        </div>
      </body>
    </html>
  )
}
