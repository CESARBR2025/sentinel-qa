'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SignOutButton } from '@/app/dashboard/sign-out-button';
import { CampanillaNotificaciones } from '@/components/notificaciones/CampanillaNotificaciones';
import { CambiarSesionDev } from '@/components/dev/CambiarSesionDev';
import { useResponsive } from '@/hooks/useResponsive';
import { authClient } from '@/lib/auth-client';

interface DashboardHeaderProps {
  user?: {
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
  // Lenguaje visual (DESIGN.md). Default 'apple' — 'tactico' queda disponible
  // solo por si una vista puntual necesita revertir temporalmente.
  variant?: 'tactico' | 'apple';
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
  variant = 'apple',
}: DashboardHeaderProps) {
  const { esMovil, esTablet } = useResponsive()
  const isApple = variant === 'apple'
  // user es opcional: las páginas cliente (formularios) no resuelven la sesión
  // en el servidor, así que el header cae a la sesión del cliente (authClient),
  // igual que SubHeader. Las páginas servidor siguen pasando user explícito.
  const { data: session } = authClient.useSession()
  const currentUser = (user ?? session?.user) as { name: string; apellido?: string; email: string } | undefined
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
        height: esMovil ? 56 : esTablet ? 72 : 104,
        paddingLeft: esMovil ? 14 : esTablet ? 32 : 64,
        paddingRight: esMovil ? 14 : esTablet ? 32 : 64,
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: isApple ? '1px solid var(--apple-glass-border)' : '1px solid #e2e8f0',
        background: isApple ? 'rgba(255,255,255,0.72)' : (esMovil ? '#f8fafc' : 'rgba(248,250,252,0.85)'),
        // En móvil se quita el blur: el backdrop-filter sobre un sticky con
        // contenido que desborda es el origen del "cuadro negro" en Safari/Chrome.
        backdropFilter: isApple ? 'blur(20px) saturate(180%)' : (esMovil ? 'none' : 'blur(10px)'),
      }}
    >
      {/* Corner Decorator */}
      {!isApple && (
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 2, background: '#1f355a' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: esMovil ? 6 : esTablet ? 10 : 14, minWidth: 0 }}>
        {/* BOTÓN REGRESAR — icono solo, a la izquierda del logo (patrón nativo
            iOS/Android). Solo se renderiza si la página pasó un destino real. */}
        {backHref && (
          <Link
            href={backHref}
            aria-label={backLabel}
            title={backLabel}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, flexShrink: 0, marginLeft: -8,
              borderRadius: 'var(--radius-lg)',
              color: isApple ? '#475569' : '#64748b',
            }}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </Link>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: esMovil ? 10 : esTablet ? 16 : 24, minWidth: 0 }}>
          <img
            src="/chaleco.png"
            alt="S"
            style={{ height: esMovil ? 26 : esTablet ? 44 : 64, flexShrink: 0, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(31, 53, 90, 0.55))' }}
          />

          <div style={{ minWidth: 0 }}>
            {/* Kicker táctico — se oculta en el piloto Apple */}
            {!isApple && (
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
            )}

            <h1
              style={{
                fontFamily: isApple ? 'var(--apple-font-display)' : 'Barlow Condensed,sans-serif',
                fontWeight: isApple ? 600 : 800,
                fontSize: esMovil ? 20 : esTablet ? 36 : 56,
                letterSpacing: isApple ? 'normal' : '0.06em',
                textTransform: isApple ? 'none' : 'uppercase',
                margin: 0,
                color: '#0f172a',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {isApple ? 'Centinela' : 'CENTINELA'}
            </h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: esMovil ? 8 : esTablet ? 12 : 32 }}>
        {/* Temporal (dev): cambiar de usuario sin login. Se oculta en el chrome
            compacto de móvil/tablet (no estorba en la PWA); desktop lo conserva. */}
        {!currentUser || esMovil || esTablet ? null : (
          <CambiarSesionDev currentUser={currentUser} roleLabel={roleLabel} />
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
