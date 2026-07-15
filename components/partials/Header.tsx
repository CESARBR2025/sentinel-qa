'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignOutButton } from '@/app/dashboard/sign-out-button';

interface DashboardHeaderProps {
  user: {
    name: string;
    apellido?: string;
    email: string;
  };
  children?: React.ReactNode;
  // Sin backHref no se muestra ningún botón de "volver" — cada página decide si
  // tiene un destino real al que regresar (nunca "/dashboard" a ciegas: para la
  // mayoría de los roles ese redirect solo rebota de vuelta a su propio hub).
  backHref?: string;
  backLabel?: string;
}

// Header único de referencia — mismo diseño exacto que app/dashboard/page.tsx
// (sticky, blur, logo grande, animación de entrada). Toda página del sistema
// debe usar este componente en vez de reimplementar su propio header.
export function DashboardHeader({
  user,
  children,
  backHref,
  backLabel = 'Dashboard',
}: DashboardHeaderProps) {
  return (
    <div
      className="app-header-reveal"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 104,
        padding: '0 64px',
        borderBottom: '1px solid #e2e8f0',
        background: 'rgba(248,250,252,0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Corner Decorator */}
      <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 2, background: '#1f355a' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img
          src="/chaleco.png"
          alt="S"
          style={{ height: 64, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(31, 53, 90, 0.55))' }}
        />

        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: '#3e5171',
              textTransform: 'uppercase',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 8, height: 8, background: '#3e5171', display: 'inline-block' }} />
            Sistema Táctico
          </div>

          <h1
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontWeight: 800,
              fontSize: 56,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            CENTINELA
          </h1>
        </div>

        {/* BOTÓN REGRESAR — solo si la página pasó un destino real */}
        {backHref && (
          <>
            <div style={{ width: 1, height: 40, background: '#e2e8f0' }} />
            <Link
              href={backHref}
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                letterSpacing: '0.25em',
                color: '#64748b',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ArrowLeft size={14} /> {backLabel}
            </Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#64748b',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Operador Identificado
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 13,
              color: '#1f355a',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {user.name} {user.apellido ?? ''}
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#94a3b8',
              letterSpacing: '0.08em',
            }}
          >
            {user.email.toLowerCase()}
          </div>
        </div>

        <div style={{ width: 1, height: 48, background: '#e2e8f0' }} />

        {children}

        <SignOutButton />
      </div>
    </div>
  );
}
