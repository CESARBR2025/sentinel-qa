'use client';
import React, { useState } from 'react';
import { Shield, Clock, User, LayoutGrid, Send, ArrowLeft } from 'lucide-react';
import { RolField } from '@/components/rol_servicios/RolInputs';
import { ServiceTable } from '@/components/rol_servicios/ServiceTable';
import { ServiceFooter } from '@/components/rol_servicios/ServiceFooter';
import { ServiceRow } from '@/lib/rol_servicios/rol';
import Link from 'next/link';

export default function ModuloRolZen() {
  const [quadrants, setQuadrants] = useState<ServiceRow[]>([{ id: '1', unidad: '', nomina: '', nombre: '', zona: '', gpsRadio: '', bodyCam: '' }]);
  const [extraordinary, setExtraordinary] = useState<ServiceRow[]>([]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Carga de fuentes idéntica al diseño Sentinel */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* BARRA SUPERIOR (ESTILO SENTINEL - LIGHT VERSION) */}
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff' }}>
        <Link
          href="/dashboard"
          style={{ 
            fontFamily: 'JetBrains Mono, monospace', 
            fontSize: 10, 
            letterSpacing: '0.25em', 
            color: '#64748b', 
            textTransform: 'uppercase', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        
        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
        
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
            Seguridad Pública Municipal
          </span>
          <span style={{ 
            fontFamily: 'Barlow Condensed, sans-serif', 
            fontWeight: 800, 
            fontSize: 22, 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase', 
            marginLeft: 12, 
            color: '#0f172a' 
          }}>
            ROL DE <span style={{ color: '#3b82f6' }}>SERVICIOS</span>
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8', margin: 0, letterSpacing: '0.1em' }}>REGISTRO DE CONTROL</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#1e40af', margin: 0 }}>SSPM/SS/000/2026</p>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: '40px 48px' }}>
        
        {/* SECCIÓN DE CONFIGURACIÓN (REDISEÑADA TÉCNICA) */}
        <section style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          padding: '32px', 
          borderRadius: '4px', // Esquinas más rectas para look técnico
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '32px' 
          }}>
            <RolField label="Turno Operativo" icon={LayoutGrid} as="select">
              <option>Primer Turno</option>
              <option>Segundo Turno</option>
              <option>Tercer Turno</option>
            </RolField>
            <RolField label="Hora Inicio" icon={Clock} type="time" />
            <RolField label="Hora Cierre" icon={Clock} type="time" />
            <RolField label="Mando a Cargo" icon={User} placeholder="Nombre del oficial" />
          </div>
        </section>

        {/* TABLAS DE SERVICIO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <div className="sentinel-table-container">
            <ServiceTable title="Cuadrantes CRP" data={quadrants} setData={setQuadrants} />
          </div>
          <div className="sentinel-table-container">
            <ServiceTable title="Servicios Especiales" data={extraordinary} setData={setExtraordinary} />
          </div>
        </div>

        {/* OBSERVACIONES Y FIRMAS */}
        <div style={{ marginTop: '48px' }}>
          <ServiceFooter />
        </div>

        {/* ACCIONES FINALES */}
        <div style={{ 
          marginTop: '64px', 
          paddingTop: '32px', 
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <button style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: 11, 
              fontWeight: 600, 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '0.2em',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Guardar Borrador
            </button>
            
            <button style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '14px 40px',
              borderRadius: '2px', // Botón cuadrado/técnico
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Send size={16} className="text-blue-400" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Publicar Rol de Servicio
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER (IDÉNTICO AL DISEÑO SENTINEL) */}
      <footer style={{ 
        padding: '32px 48px', 
        fontFamily: 'JetBrains Mono, monospace', 
        fontSize: 10, 
        color: '#94a3b8', 
        letterSpacing: '0.18em', 
        textTransform: 'uppercase', 
        textAlign: 'center', 
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff'
      }}>
        SSPM · SAN JUAN DEL RÍO · QRO · ROL DIGITAL v0.1
      </footer>

      {/* Estilos adicionales para que las tablas encajen en el diseño técnico */}
      <style jsx global>{`
        .sentinel-table-container h2 {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #1e293b !important;
          margin-bottom: 16px !important;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sentinel-table-container h2::before {
          content: '';
          width: 4px;
          height: 18px;
          background: #3b82f6;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}