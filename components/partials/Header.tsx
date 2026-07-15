'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    name: string;
    apellido?: string;
    email: string;
  };
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function DashboardHeader({
  user,
  children,
  backHref = '/dashboard',
  backLabel = 'Dashboard',
}: DashboardHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '16px 48px 24px 48px', // Mismo padding que definimos
        borderBottom: '1px solid #e2e8f0', // Borde claro
        position: 'relative',
        background: '#ffffff', // Fondo claro
      }}
    >
      {/* LÍNEA DE ACENTO AZUL (ESTILO SENTINEL) */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: 48,
          width: 64,
          height: 2,
          background: '#1f355a', // Azul Royal
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        
        {/* BOTÓN REGRESAR */}
        <Link
          href={backHref}
          style={{ 
            fontFamily: 'JetBrains Mono,monospace', 
            fontSize: 10, 
            letterSpacing: '0.25em', 
            color: '#94a3b8', 
            textTransform: 'uppercase', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8
          }}
        >
          <ArrowLeft size={14} /> {backLabel}
        </Link>

        <div style={{ width: 1, height: 32, background: '#e2e8f0', marginBottom: 8 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img
            src="/chaleco.png"
            alt="S"
            style={{
              height: 54,
              objectFit: 'contain',
            }}
          />

          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                color: '#1f355a', // Azul para el label técnico
                textTransform: 'uppercase',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, background: '#1f355a', display: 'inline-block' }} />
              SISTEMA TÁCTICO
            </div>

            <h1
              style={{
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 800,
                fontSize: 48, // Ajustado ligeramente para navbar pero manteniendo el peso
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                margin: 0,
                color: '#0f172a', // Texto oscuro
                lineHeight: 1,
              }}
            >
              CENTINELA
            </h1>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE USUARIO (RESPETANDO TUS FUENTES EXACTAS) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#94a3b8',
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
              color: '#0f172a', // Nombre en oscuro para que resalte
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
              color: '#3e5171', // Email en azul técnico
            }}
          >
            {user.email.toLowerCase()}
          </div>
        </div>

        <div style={{ width: 1, height: 48, background: '#e2e8f0' }} />

        {/* Badge de seguridad opcional al final */}
        <div style={{ color: '#1f355a', opacity: 0.8 }}>
          <ShieldCheck size={28} strokeWidth={1.5} />
        </div>

        {children}
      </div>
    </div>
  );
}