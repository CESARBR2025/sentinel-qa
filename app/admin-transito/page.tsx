import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

export default async function AdminTransitoDashboardPage() {
  return (
    <div>
      <style>{`
        .at-card:hover {
          border-color: #2563eb !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(37,99,235,0.1) !important;
        }
      `}</style>

      <div
        style={{
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#2563eb',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: '#2563eb',
              display: 'inline-block',
            }}
          />
          Panel de Control
        </div>
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
          Módulos{' '}
          <span style={{ color: '#2563eb' }}>Administrativos</span>
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
          Seleccione un módulo para gestionar
        </p>
      </div>

      <Link
        href="/admin-transito/oficiales"
        className="at-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: 32,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          maxWidth: 520,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Users size={28} color="#2563eb" strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 22,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#0f172a',
              marginBottom: 4,
              letterSpacing: '0.04em',
            }}
          >
            Gestión de Oficiales
          </div>
          <div
            style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 13,
              color: '#64748b',
            }}
          >
            Alta, edición, destitución y reactivación de oficiales de tránsito
          </div>
        </div>
        <ArrowRight size={20} color="#94a3b8" />
      </Link>
    </div>
  )
}
