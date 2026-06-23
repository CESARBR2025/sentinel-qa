'use client';
import { useState } from 'react';
import { Info, PenTool, CheckCircle2 } from 'lucide-react';
import { SignatureModal } from './SignatureModal';

export const ServiceFooter = () => {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: string; title: string }>({
    isOpen: false,
    type: '',
    title: ''
  });

  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});

  const openSignature = (type: string, title: string) => {
    setModalConfig({ isOpen: true, type, title });
  };

  const handleSaveSignature = (data: string) => {
    setSignatures(prev => ({ ...prev, [modalConfig.type]: data }));
  };

  const roles = [
    { id: 'elaboro', label: 'Elaboró', cargo: 'Responsable de Turno' },
    { id: 'reviso', label: 'Revisó', cargo: 'Comandancia de Zona' },
    { id: 'autorizo', label: 'Autorizó', cargo: 'Dirección de Operaciones' }
  ];

  return (
    <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* SECCIÓN DE OBSERVACIONES */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '4px', height: '16px', background: '#3b82f6' }} />
          <span style={{ 
            fontFamily: 'Barlow Condensed, sans-serif', 
            fontSize: '16px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: '#0f172a' 
          }}>
            Observaciones y Novedades del Turno
          </span>
        </div>
        <textarea 
          placeholder="Ingrese aquí notas adicionales, incidentes relevantes o información complementaria..."
          style={{ 
            width: '100%', 
            height: '120px', 
            padding: '16px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderLeft: '4px solid #cbd5e1',
            borderRadius: '2px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#1e293b',
            outline: 'none',
            resize: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderLeftColor = '#2563eb'}
          onBlur={(e) => e.currentTarget.style.borderLeftColor = '#cbd5e1'}
        />
      </section>

      {/* SECCIÓN DE VALIDACIÓN (FIRMAS) */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        background: '#f8fafc',
        padding: '32px',
        border: '1px solid #e2e8f0',
        borderRadius: '2px'
      }}>
        {roles.map((rol) => (
          <div key={rol.id} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Cabecera de la Firma */}
            <div style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '10px', 
              fontWeight: 600, 
              color: '#64748b', 
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>[{rol.label.toUpperCase()}]</span>
              {signatures[rol.id] && <CheckCircle2 size={12} className="text-blue-600" />}
            </div>

            {/* Área de Firma */}
            <button 
              onClick={() => openSignature(rol.id, rol.label)}
              style={{ 
                width: '100%', 
                height: '100px', 
                background: signatures[rol.id] ? '#ffffff' : '#f1f5f9',
                border: '1px dashed #cbd5e1',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!signatures[rol.id]) {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f1f5f9';
                }
              }}
            >
              {signatures[rol.id] ? (
                <img 
                  src={signatures[rol.id]} 
                  alt="Firma" 
                  style={{ height: '80%', objectFit: 'contain', filter: 'contrast(1.2)' }} 
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <PenTool size={18} style={{ margin: '0 auto 4px' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Requerir Firma Digital
                  </span>
                </div>
              )}
            </button>

            {/* Pie de Firma */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ 
                fontFamily: 'Barlow Condensed, sans-serif', 
                fontSize: '14px', 
                fontWeight: 700, 
                color: '#0f172a',
                textTransform: 'uppercase'
              }}>
                {rol.cargo}
              </div>
              <div style={{ 
                fontFamily: 'JetBrains Mono, monospace', 
                fontSize: '9px', 
                color: '#94a3b8' 
              }}>
                SSPM / UNIDAD DE CONTROL
              </div>
            </div>
          </div>
        ))}
      </section>

      <SignatureModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSave={handleSaveSignature}
      />
    </div>
  );
};