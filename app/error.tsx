'use client'

import { useEffect } from 'react'

/**
 * Fallback de error para rutas (crash de la app). Sustituye la página
 * genérica de Next por una propia, estilo CENTINELA.
 * Next 16.2+: el callback de reintento se llama `unstable_retry`.
 */
export default function Error({
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
    <div className="err-scope">
      <div className="err-bg" />
      <div className="err-corner tl" />
      <div className="err-corner tr" />
      <div className="err-corner bl" />
      <div className="err-corner br" />

      <main className="err-card">
        <div className="err-shield">
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

        <p className="err-kicker">SSPM SAN JUAN DEL RÍO · CENTINELA</p>
        <h1 className="err-title">
          ERROR <span className="err-title-accent">DE SISTEMA</span>
        </h1>
        <p className="err-sub">
          Ocurrió un problema inesperado. Puedes reintentar o volver al inicio.
        </p>
        {error.digest ? (
          <p className="err-digest">REF: {error.digest}</p>
        ) : null}

        <div className="err-actions">
          <button type="button" className="err-btn" onClick={() => unstable_retry()}>
            Reintentar
          </button>
          <a className="err-link" href="/dashboard">
            Volver al inicio
          </a>
        </div>
      </main>

      <style>{`
        .err-scope {
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
        .err-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(31,53,90,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31,53,90,.06) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
        }
        .err-corner {
          position: absolute;
          width: 26px;
          height: 26px;
          border: 0 solid #1f355a;
          opacity: .55;
          z-index: 1;
        }
        .err-corner.tl { top: 18px; left: 18px; border-top-width: 1px; border-left-width: 1px; }
        .err-corner.tr { top: 18px; right: 18px; border-top-width: 1px; border-right-width: 1px; }
        .err-corner.bl { bottom: 18px; left: 18px; border-bottom-width: 1px; border-left-width: 1px; }
        .err-corner.br { bottom: 18px; right: 18px; border-bottom-width: 1px; border-right-width: 1px; }
        .err-card {
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
        .err-shield { width: 64px; height: 64px; margin: 0 auto 16px; color: #1f355a; }
        .err-shield svg { width: 64px; height: 64px; }
        .err-kicker {
          margin: 0 0 10px;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 10px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: #64748b;
        }
        .err-title {
          margin: 0 0 14px;
          font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: clamp(30px, 5vw, 42px);
          letter-spacing: .05em;
          text-transform: uppercase;
          line-height: 1;
          color: #0f172a;
        }
        .err-title-accent { color: #1f355a; }
        .err-sub {
          margin: 0 auto;
          max-width: 340px;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 12px;
          line-height: 1.7;
          color: #64748b;
        }
        .err-digest {
          margin: 10px 0 0;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 9.5px;
          letter-spacing: .08em;
          color: #94a3b8;
        }
        .err-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 26px;
          flex-wrap: wrap;
        }
        .err-btn {
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
        .err-btn:hover { filter: brightness(1.08); box-shadow: 0 6px 20px rgba(31,53,90,.25); transform: translateY(-1px); }
        .err-btn:active { transform: translateY(0); }
        .err-link {
          color: #1f355a;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid rgba(31,53,90,.35);
          padding-bottom: 2px;
        }
        .err-link:hover { border-bottom-color: #1f355a; }
        @media (max-width: 480px) {
          .err-corner { display: none; }
        }
      `}</style>
    </div>
  )
}
