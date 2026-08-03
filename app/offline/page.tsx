'use client'

import { useEffect, useState } from 'react'

/**
 * Página de "sin conexión" (PWA offline).
 * Se sirve desde el cache del service worker cuando la red falla
 * (sin señal, servidor caído o 5xx). Es 100% autocontenida: estilos
 * inline, sin dependencias de red, para que siempre se vea bien.
 */
export default function OfflinePage() {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [now, setNow] = useState<string>('')

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    const t0 = setTimeout(() => setNow(fmt()), 0)
    const t = setInterval(() => setNow(fmt()), 1000)

    const onOnline = () => {
      setOnline(true)
      setTimeout(() => window.location.reload(), 600)
    }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      clearTimeout(t0)
      clearInterval(t)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <div className="off-scope">
      <div className="off-bg" />
      <div className="off-corner tl" />
      <div className="off-corner tr" />
      <div className="off-corner bl" />
      <div className="off-corner br" />

      <main className="off-card">
        <div className="off-shield">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M24 3l17 6.4v12.2c0 10.1-7 17.3-17 20.4-10-3.1-17-10.3-17-20.4V9.4L24 3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 24l5 5 10-10"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="17.5" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
            <circle cx="24" cy="24" r="11.5" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
          </svg>
          <span className="off-scan" />
        </div>

        <p className="off-kicker">SSPM SAN JUAN DEL RÍO · CENTINELA</p>
        <h1 className="off-title">
          CONEXIÓN <span className="off-title-accent">PERDIDA</span>
        </h1>
        <p className="off-sub">
          {online
            ? 'El servicio no está respondiendo en este momento.'
            : 'No hay señal de internet. Revisa tu conexión y vuelve a intentarlo.'}
        </p>

        <div className={`off-pill ${online ? 'is-server' : 'is-offline'}`}>
          <span className="off-dot" />
          {online ? 'Servicio sin respuesta' : 'Sin conexión a internet'}
        </div>

        <button type="button" className="off-btn" onClick={() => window.location.reload()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reintentar conexión
        </button>

        <p className="off-meta">
          CENTINELA v1 · {now}
          {online ? '' : ' · se reintentará automáticamente al volver la señal'}
        </p>
      </main>

      <style>{`
        .off-scope {
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
        .off-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(31,53,90,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31,53,90,.06) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
        }
        .off-corner {
          position: absolute;
          width: 26px;
          height: 26px;
          border: 0 solid #1f355a;
          opacity: .55;
          z-index: 1;
        }
        .off-corner.tl { top: 18px; left: 18px; border-top-width: 1px; border-left-width: 1px; }
        .off-corner.tr { top: 18px; right: 18px; border-top-width: 1px; border-right-width: 1px; }
        .off-corner.bl { bottom: 18px; left: 18px; border-bottom-width: 1px; border-left-width: 1px; }
        .off-corner.br { bottom: 18px; right: 18px; border-bottom-width: 1px; border-right-width: 1px; }
        .off-card {
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
        .off-shield {
          position: relative;
          width: 76px;
          height: 76px;
          margin: 0 auto 18px;
          color: #1f355a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .off-shield svg { width: 76px; height: 76px; }
        .off-scan {
          position: absolute;
          left: 6px;
          right: 6px;
          bottom: 6px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f0be4c, transparent);
          animation: off-scan 2.6s ease-in-out infinite;
        }
        @keyframes off-scan {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(58px); opacity: 0; }
        }
        .off-kicker {
          margin: 0 0 10px;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 10px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: #64748b;
        }
        .off-title {
          margin: 0 0 14px;
          font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: clamp(30px, 5vw, 42px);
          letter-spacing: .05em;
          text-transform: uppercase;
          line-height: 1;
          color: #0f172a;
        }
        .off-title-accent { color: #1f355a; }
        .off-sub {
          margin: 0 auto 22px;
          max-width: 340px;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 12px;
          line-height: 1.7;
          color: #64748b;
        }
        .off-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 999px;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 10.5px;
          letter-spacing: .12em;
          text-transform: uppercase;
          border: 1px solid;
        }
        .off-pill.is-offline { color: #b45309; background: #fef3c7; border-color: #fde68a; }
        .off-pill.is-server  { color: #1e40af; background: #dbeafe; border-color: #bfdbfe; }
        .off-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          animation: off-blink 1s step-end infinite;
        }
        @keyframes off-blink { 50% { opacity: .25; } }
        .off-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 26px;
          padding: 13px 30px;
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
          transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
        }
        .off-btn svg { width: 15px; height: 15px; }
        .off-btn:hover { filter: brightness(1.08); box-shadow: 0 6px 20px rgba(31,53,90,.25); transform: translateY(-1px); }
        .off-btn:active { transform: translateY(0); }
        .off-meta {
          margin: 22px 0 0;
          font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
          font-size: 9.5px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        @media (max-width: 480px) {
          .off-corner { display: none; }
        }
      `}</style>
    </div>
  )
}
