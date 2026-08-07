'use client'

import { useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'

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
    <html lang="es" style={{ background: '#f1f5f9' }}>
      <body style={{ margin: 0 }}>
        <div className="gerr-scope">
          <main className="gerr-card">
            <div className="gerr-icon">
              <ShieldAlert size={28} strokeWidth={1.5} />
            </div>

            <p className="gerr-kicker">SSPM · San Juan del Río · Centinela</p>
            <h1 className="gerr-title">Error de sistema</h1>
            <p className="gerr-sub">
              Ocurrió un problema inesperado en el sistema. Puedes reintentar o recargar.
            </p>
            {error.digest ? <p className="gerr-digest">REF: {error.digest}</p> : null}

            <div className="gerr-actions">
              <button type="button" className="gerr-btn" onClick={() => unstable_retry()}>
                Reintentar
              </button>
              <button
                type="button"
                className="gerr-link"
                onClick={() => window.location.reload()}
              >
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
              background: #f1f5f9;
              color: #0f172a;
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
              -webkit-font-smoothing: antialiased;
              overflow: hidden;
              padding: 24px;
              box-sizing: border-box;
            }
            .gerr-card {
              position: relative;
              z-index: 1;
              width: min(440px, 100%);
              background: rgba(255, 255, 255, 0.72);
              backdrop-filter: blur(20px) saturate(180%);
              -webkit-backdrop-filter: blur(20px) saturate(180%);
              border: 1px solid rgba(255, 255, 255, 0.6);
              border-radius: 16px;
              box-shadow: 0 8px 30px rgba(31, 53, 90, 0.10), 0 1px 2px rgba(31, 53, 90, 0.06);
              padding: clamp(28px, 6vw, 48px);
              text-align: center;
              box-sizing: border-box;
            }
            .gerr-icon {
              width: 60px;
              height: 60px;
              margin: 0 auto 18px;
              border-radius: 9999px;
              background: rgba(239, 68, 68, 0.12);
              color: #ef4444;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .gerr-kicker {
              margin: 0 0 10px;
              font-weight: 500;
              font-size: 12px;
              letter-spacing: 0;
              text-transform: none;
              color: #64748b;
            }
            .gerr-title {
              margin: 0 0 12px;
              font-weight: 600;
              font-size: clamp(24px, 5vw, 30px);
              letter-spacing: 0;
              text-transform: none;
              line-height: 1.1;
              color: #0f172a;
            }
            .gerr-sub {
              margin: 0 auto;
              max-width: 320px;
              font-weight: 400;
              font-size: 14px;
              line-height: 1.5;
              color: #64748b;
            }
            .gerr-digest {
              margin: 14px 0 0;
              font-weight: 400;
              font-size: 12px;
              letter-spacing: 0;
              color: #94a3b8;
            }
            .gerr-actions {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-top: 28px;
              flex-wrap: wrap;
            }
            .gerr-btn {
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
              font-weight: 600;
              font-size: 14px;
              text-transform: none;
              letter-spacing: 0;
              padding: 10px 20px;
              background: #0f172a;
              color: #fff;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              transition: transform .3s ease-out, box-shadow .3s ease-out;
            }
            .gerr-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22); }
            .gerr-btn:active { transform: scale(0.97); box-shadow: none; transition: transform .12s ease-out, box-shadow .12s ease-out; }
            .gerr-link {
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
              font-weight: 600;
              font-size: 14px;
              text-transform: none;
              letter-spacing: 0;
              padding: 10px 18px;
              background: #f1f5f9;
              color: #475569;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              cursor: pointer;
              transition: transform .3s ease-out, box-shadow .3s ease-out, border-color .3s ease-out;
            }
            .gerr-link:hover { transform: translateY(-1px); border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.10); }
            .gerr-link:active { transform: scale(0.97); transition: transform .12s ease-out, box-shadow .12s ease-out; }
            @media (prefers-reduced-transparency: reduce) {
              .gerr-card {
                background: #ffffff;
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .gerr-btn, .gerr-btn:hover, .gerr-btn:active,
              .gerr-link, .gerr-link:hover, .gerr-link:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
            }
          `}</style>
        </div>
      </body>
    </html>
  )
}
