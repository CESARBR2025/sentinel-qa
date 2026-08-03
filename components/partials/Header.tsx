'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignOutButton } from '@/app/dashboard/sign-out-button';
import { CampanillaNotificaciones } from '@/components/notificaciones/CampanillaNotificaciones';
import { useResponsive } from '@/hooks/useResponsive';

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
  // Texto sobre el nombre del operador (ej. "Agente Fiscalía", "Juez Cívico") —
  // reemplaza el genérico "Operador Identificado" cuando la página lo necesita.
  roleLabel?: string;
}

// Header único de referencia — mismo diseño exacto que app/dashboard/page.tsx
// (sticky, blur, logo grande, animación de entrada). Toda página del sistema
// debe usar este componente en vez de reimplementar su propio header.
export function DashboardHeader({
  user,
  children,
  backHref,
  backLabel = 'Dashboard',
  roleLabel = 'Operador Identificado',
}: DashboardHeaderProps) {
  const { esMovil, esTablet } = useResponsive()
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
        height: esMovil ? 72 : esTablet ? 88 : 104,
        padding: esMovil ? '0 16px' : esTablet ? '0 32px' : '0 64px',
        borderBottom: '1px solid #e2e8f0',
        background: esMovil ? '#f8fafc' : 'rgba(248,250,252,0.85)',
        // En móvil se quita el blur: el backdrop-filter sobre un sticky con
        // contenido que desborda es el origen del "cuadro negro" en Safari/Chrome.
        backdropFilter: esMovil ? 'none' : 'blur(10px)',
      }}
    >
      {/* Corner Decorator */}
      <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 2, background: '#1f355a' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: esMovil ? 12 : esTablet ? 16 : 24, minWidth: 0 }}>
        <img
          src="/chaleco.png"
          alt="S"
          style={{ height: esMovil ? 32 : esTablet ? 48 : 64, flexShrink: 0, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(31, 53, 90, 0.55))' }}
        />

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: '#3e5171',
              textTransform: 'uppercase',
              marginBottom: 4,
              display: esMovil ? 'none' : 'flex',
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
              fontSize: esMovil ? 24 : esTablet ? 40 : 56,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#0f172a',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            CENTINELA
          </h1>
        </div>

        {/* BOTÓN REGRESAR — solo si la página pasó un destino real */}
        {backHref && (
          <>
            <div style={{ width: 1, height: esMovil ? 28 : esTablet ? 32 : 40, background: '#e2e8f0', flexShrink: 0 }} />
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
                whiteSpace: 'nowrap',
              }}
            >
              <ArrowLeft size={14} /> {esMovil ? null : backLabel}
            </Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: esMovil ? 10 : esTablet ? 16 : 32 }}>
        {esMovil || esTablet ? null : (
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
            {roleLabel}
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
        )}

        <div style={{ width: 1, height: esMovil || esTablet ? 0 : 48, background: '#e2e8f0', flexShrink: 0 }} />

        {/* Va dentro del header, no en `children`: así las 76 páginas que usan
            este componente tienen campanita sin tener que editarlas una por una.
            Se auto-abastece por API, no necesita props. */}
        <CampanillaNotificaciones />

        {/* La navegación pasada como children (ej. nav de /admin) no cabe en
            móvil/tablet: se oculta y la página mantiene su propio contenido. */}
        <div style={{ display: esMovil || esTablet ? 'none' : 'contents' }}>{children}</div>

        <SignOutButton />
      </div>
    </div>
  );
}
