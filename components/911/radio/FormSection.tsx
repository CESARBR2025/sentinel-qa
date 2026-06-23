'use client';
import React, { useState } from 'react';
import {
  MessageSquare, User, AlertTriangle, MapPin,
  ClipboardCheck, Clock, Shield, Send, Search,
  FileText, Gavel, Car, Hash, Archive
} from 'lucide-react';
import { DashboardHeader } from "@/components/partials/Header";

// COMPONENTE DE CAMPO INTERNO (Reemplaza a RolField para evitar errores)
const SentinelField = ({ label, icon: Icon, as = 'input', fullWidth = false, ...props }: any) => {
  const Component = as;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: fullWidth ? 'span 3' : 'span 1' }}>
      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: '12px', color: '#94a3b8', zIndex: 1 }} />}
        <Component
          {...props}
          style={{
            width: '100%',
            padding: `12px 12px 12px ${Icon ? '40px' : '12px'}`,
            background: props.disabled ? '#f8fafc' : '#ffffff',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '2px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            outline: 'none',
            minHeight: as === 'textarea' ? '120px' : 'auto',
            ...props.style
          }}
        />
      </div>
    </div>
  );
};

export default function ReporteRecorridoZen({ user }: { user: any }) {
  const [isAnonimo, setIsAnonimo] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader user={user} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>

        {/* ENCABEZADO */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
            Plataforma de Prevención
          </span>
          <h1 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800, fontSize: 32, letterSpacing: '0.02em',
            textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a'
          }}>
            REPORTES DENTRO DE <span style={{ color: '#3b82f6' }}>RECORRIDOS</span>
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* SECCIÓN 01: ORIGEN */}
          <section className="sentinel-card">
            <h2 className="sentinel-section-title">Origen e Identificación</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <SentinelField label="Canal de Origen" icon={MessageSquare} value="RADIO" disabled />
              <SentinelField label="Nombre del Oficial" icon={Shield} placeholder="Oficial responsable" />
              <SentinelField label="Tipo de Reporte" value="RECORRIDO" disabled />

              <SentinelField label="Folio CAD" icon={Hash} placeholder="Número CAD..." />

              {/* Se eliminó la referencia a user?.name */}
              <SentinelField
                label="Quien Capturó"
                icon={User}
                defaultValue={`${user?.name || ''} ${user?.apellido || ''}`.trim()}
                disabled
              />

              {/* Estatus usando el componente con as="select" */}
              <SentinelField label="Estatus" icon={ClipboardCheck} as="select">
                <option value="DESPACHO">DESPACHO</option>
                <option value="SIN DESPACHO">SIN DESPACHO</option>
              </SentinelField>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', gridColumn: 'span 3' }}>
                <div style={{ flexGrow: 1 }}>
                  <SentinelField
                    label="Nombre del Reportante"
                    icon={User}
                    placeholder={isAnonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre del ciudadano..."}
                    disabled={isAnonimo}
                  />
                </div>
                <button type="button" onClick={() => setIsAnonimo(!isAnonimo)} className="sentinel-btn-toggle">
                  {isAnonimo ? '[ ANÓNIMO: ON ]' : '[ ANÓNIMO: OFF ]'}
                </button>
              </div>
            </div>
          </section>

          {/* SECCIÓN 02: EL INCIDENTE */}
          <section className="sentinel-card">
            <h2 className="sentinel-section-title">Detalles del Incidente</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <SentinelField label="Tipo de Incidente" icon={AlertTriangle} as="select">
                <option>SELECCIONE...</option>
                <option>ROBO</option>
                <option>DISTURBIO</option>
                <option>OTRO</option>
              </SentinelField>
              <SentinelField label="Fecha y Hora de Inicio" icon={Clock} type="datetime-local" />
              <SentinelField label="Fecha y Hora de Fin" icon={Clock} type="datetime-local" />

              <SentinelField label="Incidente (Descripción)" as="textarea" fullWidth placeholder="Descripción breve..." />
              <SentinelField label="Contenido del Reporte" as="textarea" fullWidth placeholder="Relatoría extensa de los hechos..." />
            </div>
          </section>

          {/* SECCIÓN 03: UBICACIÓN */}
          <section className="sentinel-card">
            <h2 className="sentinel-section-title">Ubicación</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <SentinelField label="Lugar de los Hechos" icon={MapPin} placeholder="Calle, Colonia, Entre que calles..." />
              </div>
              <SentinelField label="Referencia de Ubicación" icon={MapPin} placeholder="Referencias visuales..." />
              <SentinelField label="Datos Positivos/Negativos" icon={Search} placeholder="Resultados de inspección..." />
            </div>
          </section>

          {/* SECCIÓN 04: OPERATIVIDAD */}
          <section className="sentinel-card">
            <h2 className="sentinel-section-title">Intervención y Detenciones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <SentinelField label="Acciones Realizadas" as="textarea" fullWidth placeholder="Acciones tácticas..." />
              <SentinelField label="Detención" as="select">
                <option>NO</option>
                <option>SÍ</option>
              </SentinelField>
              <div style={{ gridColumn: 'span 2' }}>
                <SentinelField label="Nombre de los Detenidos" icon={User} placeholder="Nombres..." />
              </div>
              <SentinelField label="Autoridad que recibe" icon={Shield} placeholder="MP, Juzgado..." />
              <SentinelField label="Expediente CI" icon={FileText} placeholder="Carpeta de investigación..." />
              <SentinelField label="Delito / Falta" icon={AlertTriangle} placeholder="Clasificación..." />
              <SentinelField label="Monto de Delito" type="number" placeholder="0.00" />
            </div>
          </section>

          {/* SECCIÓN 05: BIENES Y CATEOS */}<section className="sentinel-card">
            <h2 className="sentinel-section-title">Aseguramientos y Cateos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

              {/* Fila 1: Objetos (Ocupa todo el ancho para que el textarea luzca bien) */}
              <div style={{ gridColumn: 'span 3' }}>
                <SentinelField label="Objetos Recuperados" as="textarea" fullWidth placeholder="Lista de objetos detallada..." />
              </div>

              {/* Fila 2: Vehículos */}
              <SentinelField label="Vehículos Recuperados" icon={Car} placeholder="Placas / Modelo..." />
              <SentinelField label="Tipo de Vehículo" placeholder="Ej: Sedán" />
              <SentinelField label="Destino de Vehículo" placeholder="Corralón, etc." />

              {/* Fila 3: Cateo */}
              <SentinelField label="Cateo" as="select">
                <option value="NO">NO</option>
                <option value="SI">SÍ</option>
              </SentinelField>
              <div style={{ gridColumn: 'span 2' }}>
                <SentinelField label="Domicilio Cateado" icon={MapPin} placeholder="Dirección del inmueble..." />
              </div>

              {/* Fila 4: Resultado y Mando Responsable */}
              <SentinelField label="Resultado Cateo" placeholder="Hallazgos..." />

              {/* Aplicamos la lógica de Nómina para el Policía a Cargo */}
              <SentinelField
                label="No. Nómina (Mando)"
                icon={Hash}
                placeholder="Escriba nómina..."
              />
              <SentinelField
                label="Policía a Cargo"
                icon={Shield}
                placeholder="Nombre automático..."
                disabled
              />

              {/* Fila 5: Personal CI */}
              <SentinelField
                label="Personal ingreso CI"
                icon={User}
                placeholder="Nombre del agente"
              />
            </div>
          </section>

        </div>

        {/* ACCIONES FINALES */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
          <button style={{
            background: '#0f172a', color: '#ffffff', padding: '16px 48px',
            borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '12px',
            border: 'none', cursor: 'pointer'
          }}>
            <Send size={16} color="#3b82f6" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Registrar Reporte de Recorrido
            </span>
          </button>
        </div>
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff', marginTop: '60px' }}>
        SSPM · SAN JUAN DEL RÍO · SENTINEL v1.0
      </footer>

      <style jsx global>{`
                .sentinel-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    padding: 32px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                .sentinel-section-title {
                    font-family: 'Barlow Condensed', sans-serif !important;
                    font-size: 18px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    color: #1e293b !important;
                    margin-bottom: 24px !important;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sentinel-section-title::before {
                    content: '';
                    width: 4px; height: 18px;
                    background: #3b82f6;
                    display: inline-block;
                }
                .sentinel-btn-toggle {
                    height: 46px; padding: 0 16px;
                    background: #ffffff; color: #64748b;
                    border: 1px solid #e2e8f0; border-radius: 2px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s;
                }
                .sentinel-btn-toggle:hover { background: #f8fafc; border-color: #3b82f6; }
                input:focus, textarea:focus, select:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
                }
            `}</style>
    </div>
  );
}