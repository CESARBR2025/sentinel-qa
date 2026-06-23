'use client';
import React, { useState } from 'react';
import {
    MessageSquare, User, AlertTriangle, MapPin,
    ClipboardCheck, Clock, Shield, Send
} from 'lucide-react';
import { RolField } from '@/components/rol_servicios/RolInputs';
import { FormSection } from '@/components/911/whatsapp/FormSection';
import { DashboardHeader } from "@/components/partials/Header"; // EL COMPONENTE CORRECTO

export default function RegistroIncidenteZen({ user }: { user: any }) {
    const [canal, setCanal] = useState('WHATSAPP');
    const [isAnonimo, setIsAnonimo] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            {/* Carga de fuentes idéntica al diseño Sentinel */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

            {/* HEADER ESTÁNDAR DEL PROYECTO */}
            <DashboardHeader user={user} />

            {/* CONTENIDO PRINCIPAL CON ESTILO ZEN */}
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>

                {/* TÍTULO DE MÓDULO ESTILO SENTINEL */}
                <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
                        Módulo de Operaciones
                    </span>
                    <h1 style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 800,
                        fontSize: 32,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        margin: '4px 0 0 0',
                        color: '#0f172a'
                    }}>
                        REGISTRO DE <span style={{ color: '#3b82f6' }}>INCIDENTES 911</span>
                    </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* SECCIÓN 01: ORIGEN */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Origen y Reportante</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>

                            {/* CANAL FIJO - NO MANIPULABLE */}
                            <RolField
                                label="Canal de Entrada"
                                icon={MessageSquare}
                                value="WHATSAPP"
                                disabled
                            />

                            {/* GRUPO DE WHATSAPP (SIEMPRE VISIBLE) */}
                            <RolField
                                label="Grupo de WhatsApp"
                                icon={MessageSquare}
                                placeholder="Nombre del grupo..."
                            />

                            {/* REPORTANTE Y TOGGLE ANÓNIMO */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                <div style={{ flexGrow: 1 }}>
                                    <RolField
                                        label="Nombre del Reportante"
                                        icon={User}
                                        placeholder={isAnonimo ? "MODO ANÓNIMO ACTIVO" : "Nombre del ciudadano"}
                                        disabled={isAnonimo}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAnonimo(!isAnonimo)}
                                    style={{
                                        height: '42px',
                                        padding: '0 16px',
                                        background: isAnonimo ? '#0f172a' : '#ffffff',
                                        color: isAnonimo ? '#ffffff' : '#64748b',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '2px',
                                        fontFamily: 'JetBrains Mono, monospace',
                                        fontSize: '9px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isAnonimo ? '[ ANÓNIMO: ON ]' : '[ ANÓNIMO: OFF ]'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 02: DETALLE */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Detalles del Suceso</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <RolField label="Tipo de Incidente" icon={AlertTriangle} as="select">
                                <option>DISTURBIO EN VÍA PÚBLICA</option>
                                <option>ROBO A TRANSEÚNTE</option>
                                <option>ACCIDENTE VIAL</option>
                                <option>VIOLENCIA FAMILIAR</option>
                            </RolField>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    Descripción de los Hechos
                                </label>
                                <textarea
                                    placeholder="Describa la situación reportada..."
                                    style={{
                                        width: '100%', height: '120px', padding: '16px', background: '#ffffff',
                                        border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '2px',
                                        fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none', resize: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 03: UBICACIÓN */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Ubicación</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <RolField label="Domicilio Exacto" icon={MapPin} placeholder="Calle, Colonia y Entre calles..." />
                            </div>
                            <RolField label="Punto de Referencia" icon={MapPin} placeholder="Ej: Portón café, frente a tienda..." />
                            <RolField label="Referencia Visual" icon={MapPin} placeholder="Fachada, color de casa..." />
                        </div>
                    </section>

                    {/* SECCIÓN 04: CONTROL */}
                    {/* SECCIÓN 04: CONTROL */}
                    <section className="sentinel-card">
                        <h2 className="sentinel-section-title">Despacho y Control</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)', // Forzamos 5 columnas para que nada se salga
                            gap: '16px', // Espaciado un poco más apretado para que quepa todo
                            alignItems: 'end'
                        }}>
                            <RolField
                                label="Operador"
                                icon={User}
                                defaultValue={user?.name || 'ALEXANDRA'}
                                disabled
                            />
                            <RolField
                                label="Unidad Asignada"
                                icon={Shield}
                                placeholder="CRP-XXX"
                            />
                            <RolField
                                label="Estatus Inicial"
                                icon={ClipboardCheck}
                                as="select"
                            >
                                <option>EN ESPERA</option>
                                <option>UNIDAD EN CAMINO</option>
                                <option>EN ATENCIÓN</option>
                            </RolField>

                            {/* Los pusimos como campos individuales en la misma fila */}
                            <RolField
                                label="Inicio"
                                icon={Clock}
                                type="time"
                            />
                            <RolField
                                label="Fin"
                                icon={Clock}
                                type="time"
                            />
                        </div>
                    </section>

                </div>

                {/* ACCIONES FINALES */}
                <div style={{
                    marginTop: '64px',
                    paddingTop: '32px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    <button style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        padding: '16px 48px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        <Send size={16} color="#3b82f6" />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            Registrar Incidente
                        </span>
                    </button>
                </div>
            </main>

            {/* FOOTER */}
            <footer style={{
                padding: '32px 48px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: '#94a3b8',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textAlign: 'center',
                borderTop: '1px solid #e2e8f0',
                background: '#ffffff',
                marginTop: '60px'
            }}>
                SSPM · SAN JUAN DEL RÍO · QRO · SISTEMA TÁCTICO v1.0
            </footer>

            {/* ESTILOS GLOBALES COMPLEMENTARIOS */}
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
          letter-spacing: 0.05em !important;
          color: #1e293b !important;
          margin-bottom: 24px !important;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sentinel-section-title::before {
          content: '';
          width: 4px;
          height: 18px;
          background: #3b82f6;
          display: inline-block;
        }
        label {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          color: #64748b !important;
          letter-spacing: 0.1em !important;
        }
      `}</style>
        </div>
    );
}