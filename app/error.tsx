'use client'

import { useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'

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
      <main className="err-card">
        <div className="err-icon">
          <ShieldAlert size={28} strokeWidth={1.5} />
        </div>

        <p className="err-kicker">SSPM · San Juan del Río · Centinela</p>
        <h1 className="err-title">Error de sistema</h1>
        <p className="err-sub">
          Ocurrió un problema inesperado. Puedes reintentar o volver al inicio.
        </p>
        {error.digest ? <p className="err-digest">REF: {error.digest}</p> : null}

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
          background: #f1f5f9;
          color: #0f172a;
          font-family: var(--apple-font-display);
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
          padding: 24px;
          box-sizing: border-box;
        }
        .err-card {
          position: relative;
          z-index: 1;
          width: min(440px, 100%);
          background: var(--apple-glass-bg);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--apple-glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--apple-shadow-glass);
          padding: clamp(28px, 6vw, 48px);
          text-align: center;
          box-sizing: border-box;
        }
        .err-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 18px;
          border-radius: var(--radius-full);
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .err-kicker {
          margin: 0 0 10px;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0;
          text-transform: none;
          color: #64748b;
        }
        .err-title {
          margin: 0 0 12px;
          font-weight: 600;
          font-size: clamp(24px, 5vw, 30px);
          letter-spacing: 0;
          text-transform: none;
          line-height: 1.1;
          color: #0f172a;
        }
        .err-sub {
          margin: 0 auto;
          max-width: 320px;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.5;
          color: #64748b;
        }
        .err-digest {
          margin: 14px 0 0;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 0;
          color: #94a3b8;
        }
        .err-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .err-btn {
          font-family: var(--apple-font-display);
          font-weight: 600;
          font-size: 14px;
          text-transform: none;
          letter-spacing: 0;
          padding: 10px 20px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: transform .3s ease-out, box-shadow .3s ease-out;
        }
        .err-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22); }
        .err-btn:active { transform: scale(0.97); box-shadow: none; transition: transform .12s ease-out, box-shadow .12s ease-out; }
        .err-link {
          display: inline-flex;
          align-items: center;
          font-family: var(--apple-font-display);
          font-weight: 600;
          font-size: 14px;
          text-transform: none;
          letter-spacing: 0;
          padding: 10px 18px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: transform .3s ease-out, box-shadow .3s ease-out, border-color .3s ease-out;
        }
        .err-link:hover { transform: translateY(-1px); border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.10); }
        .err-link:active { transform: scale(0.97); transition: transform .12s ease-out, box-shadow .12s ease-out; }
        @media (prefers-reduced-transparency: reduce) {
          .err-card {
            background: #ffffff;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .err-btn, .err-btn:hover, .err-btn:active,
          .err-link, .err-link:hover, .err-link:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
        }
      `}</style>
    </div>
  )
}
