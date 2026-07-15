/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Eye, AlertTriangle, Search, Download, FileDown } from 'lucide-react'; // Añadido Download
import { analistaService } from '@/services/analistaService';
import Link from 'next/link';

export default function BitacoraIPH() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await analistaService.getListaIPH();
        setRegistros(Array.isArray(data) ? data : []);
      } catch (error) {
        setRegistros([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return <div style={{ padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11 }}>CARGANDO MATRIZ...</div>;
console.log(registros);
  return (
    <div style={containerStyle}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={thStyle}>FOLIO IPH</th>
            <th style={thStyle}>SUJETO / ALIAS</th>
            <th style={thStyle}>DELITO</th>
            <th style={thStyle}>FECHA</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>ACCIONES TÁCTICAS</th>
          </tr>
        </thead>
        <tbody>
          {registros.length > 0 ? registros.map((r) => (
            
            <tr key={r.id} style={trStyle}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#1f355a' }}>{r.folioIPH}</div>
              </td>
              <td style={tdStyle}>
                <div style={{ fontWeight: 600 }}>{r.alias || 'SIN ALIAS'}</div>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={12} color="#dc2626" />
                  <span>{r.delito || 'N/E'}</span>
                </div>
              </td>
              <td style={tdStyle}>
                <div style={{ fontSize: 12 }}>
                  {r.fechaEvento ? new Date(r.fechaEvento).toLocaleDateString() : 'S/F'}
                </div>
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>

                  {/* BOTÓN GENERAR PPT (NUEVO) */}
                  <Link href={`/analisis/generar-ppt?id=${r.id}`} style={btnPPTStyle}>
                    <Download size={14} /> PPT
                  </Link>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                NO HAY REGISTROS DISPONIBLES
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' };
const headerRowStyle = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle: React.CSSProperties = { padding: '16px 24px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontSize: 13 };
const trStyle = { transition: 'all 0.2s' };

// Botón Negro (Analizar)
const btnStyle = { 
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
  background: '#0f172a', color: 'white', borderRadius: 2, fontSize: 10, 
  fontWeight: 700, textDecoration: 'none', fontFamily: 'JetBrains Mono' 
};

// Botón Dorado (PPT)
const btnPPTStyle = { 
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
  background: '#d4a43a', color: 'white', borderRadius: 2, fontSize: 10, 
  fontWeight: 700, textDecoration: 'none', fontFamily: 'JetBrains Mono',
  boxShadow: '0 2px 4px rgba(212, 164, 58, 0.2)'
};