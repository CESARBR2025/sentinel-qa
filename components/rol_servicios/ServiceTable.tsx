'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Database } from 'lucide-react';
import { ServiceRow } from '@/lib/rol-servicios/types';

interface Props {
  title: string;
  data: ServiceRow[];
  setData: React.Dispatch<React.SetStateAction<ServiceRow[]>>;
}

export const ServiceTable = ({ title, data, setData }: Props) => {
  const addRow = () => {
    const newRow: ServiceRow = {
      id: crypto.randomUUID(),
      unidad: '', nomina: '', nombre: '', zona: '', gpsRadio: '', bodyCam: ''
    };
    setData([...data, newRow]);
  };

  return (
    <div style={{ marginTop: '40px' }}>
      {/* HEADER DE TABLA TÉCNICO */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'between', 
        alignItems: 'center', 
        marginBottom: '16px',
        borderBottom: '2px solid #0f172a',
        paddingBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
          <div style={{ width: '4px', height: '24px', background: '#1f355a' }} />
          <h3 style={{ 
            fontFamily: 'Barlow Condensed, sans-serif', 
            fontSize: '20px', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            margin: 0,
            color: '#0f172a'
          }}>
            {title}
          </h3>
          <span style={{ 
            fontFamily: 'JetBrains Mono, monospace', 
            fontSize: '10px', 
            background: '#eff1f3', 
            color: '#1f355a', 
            padding: '2px 8px', 
            borderRadius: '2px',
            border: '1px solid #dbdfe5'
          }}>
            {data.length} REGISTROS
          </span>
        </div>

        <button 
          onClick={addRow}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            fontWeight: 600,
            background: '#0f172a',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.1em'
          }}
        >
          <Plus size={14} /> ADICIONAR ENTRADA
        </button>
      </div>

      {/* CONTENEDOR DE TABLA */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid #e2e8f0', 
        overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}>Unidad</th>
              <th style={thStyle}>Personal Operativo</th>
              <th style={thStyle}>Zona / Sector</th>
              <th style={thStyle}>Dispositivos Tácticos</th>
              <th style={{ ...thStyle, width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {data.map((row) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  {/* UNIDAD */}
                  <td style={tdStyle}>
                    <input 
                      style={inputStyle} 
                      className="placeholder:text-slate-300 focus:text-blue-600 font-bold" 
                      placeholder="UNIDAD CRP" 
                    />
                  </td>

                  {/* PERSONAL */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <input 
                        style={{ ...inputStyle, fontSize: '13px', fontWeight: 500 }} 
                        placeholder="Nombre del Oficial" 
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={labelMono}>ID:</span>
                        <input 
                          style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#64748b' }} 
                          placeholder="Nómina" 
                        />
                      </div>
                    </div>
                  </td>

                  {/* ZONA */}
                  <td style={tdStyle}>
                    <input 
                      style={{ ...inputStyle, textTransform: 'uppercase' }} 
                      placeholder="Sector de vigilancia" 
                    />
                  </td>

                  {/* DISPOSITIVOS */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={deviceBox}>
                        <span style={labelMono}>RADIO</span>
                        <select style={selectStyle}>
                          <option>NO ASIGNADO</option>
                          <option>MOTOROLA G1</option>
                        </select>
                      </div>
                      <div style={deviceBox}>
                        <span style={labelMono}>BODYCAM</span>
                        <select style={selectStyle}>
                          <option>NO ASIGNADO</option>
                          <option>AXON BODY 3</option>
                        </select>
                      </div>
                    </div>
                  </td>

                  {/* ACCIÓN ELIMINAR */}
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button 
                      onClick={() => setData(data.filter(r => r.id !== row.id))} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#cbd5e1', 
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ESTILOS EN OBJETOS PARA MANTENER LA LÍNEA DE DISEÑO
const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 600
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  verticalAlign: 'middle'
};

const inputStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  outline: 'none',
  width: '100%',
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  color: '#0f172a',
};

const labelMono: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '9px',
  color: '#94a3b8',
  fontWeight: 600
};

const selectStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '9px',
  fontWeight: 600,
  color: '#1f355a',
  outline: 'none',
  cursor: 'pointer',
  textTransform: 'uppercase'
};

const deviceBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: '4px 8px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '2px'
};