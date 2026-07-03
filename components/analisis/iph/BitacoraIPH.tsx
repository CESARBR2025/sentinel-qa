/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { FileText, Search, Download, Eye, Calendar, User, AlertTriangle, Loader2 } from 'lucide-react';
import { analistaService } from '@/services/analistaService';
import { generateDetenidoPPT } from '@/lib/utils/generatePPT'; // Tu utilidad de PPT
import Link from 'next/link';

export default function BitacoraIPH() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    analistaService.getListaIPH()
      .then(setRegistros)
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPPT = async (id: string) => {
    setGeneratingId(id);
    try {
      // 1. Obtenemos todos los datos del registro (los 63 campos)
      const fullData = await analistaService.getDetalleIPH(id);
      // 2. Generamos el PPT (Nota: las fotos deben venir en el fullData o manejarse aparte)
      await generateDetenidoPPT(fullData, { fotoFrontal: null, fotoObjetos: null });
    } catch (e) {
      alert("Error al generar presentación");
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) return <div style={loadingStyle}>CARGANDO BITÁCORA NACIONAL...</div>;

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
          {registros.map((r) => (
            <tr key={r.id} className="iph-row" style={trStyle}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#2563eb' }}>{r.folioIPH}</div>
                <div style={{ fontSize: 9, color: '#94a3b8' }}>SISTEMA IPH-SENTINEL</div>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={avatarStyle}><User size={14} /></div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.alias || 'SIN ALIAS'}</div>
                </div>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={12} color="#dc2626" />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{r.delito}</span>
                </div>
              </td>
              <td style={tdStyle}>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <Calendar size={12} style={{ marginRight: 4 }} />
                  {r.fechaEvento ? new Date(r.fechaEvento).toLocaleDateString() : 'S/F'}
                </div>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {/* BOTÓN PARA ABRIR EL FORMULARIO (PRELLENADO) */}
                  <Link href={`/analisis/detenidos/nuevo?id=${r.id}`} style={btnViewStyle}>
                    <Eye size={14} /> REVISAR
                  </Link>
                  
                  {/* BOTÓN PARA GENERAR PPT */}
                  <button 
                    onClick={() => handleDownloadPPT(r.id)} 
                    style={btnPPTStyle}
                    disabled={generatingId === r.id}
                  >
                    {generatingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    PPT
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ESTILOS TÁCTICOS ---
const containerStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' };
const headerRowStyle = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle: React.CSSProperties = { padding: '16px 24px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '16px 24px', borderBottom: '1px solid #f1f5f9' };
const trStyle = { transition: 'all 0.2s' };
const loadingStyle = { padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textAlign: 'center' as const };
const avatarStyle = { width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' };

const btnViewStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#0f172a', color: 'white', borderRadius: 2, fontSize: 10, fontWeight: 700, textDecoration: 'none', fontFamily: 'JetBrains Mono' };
const btnPPTStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#d4a43a', color: 'white', border: 'none', borderRadius: 2, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono' };