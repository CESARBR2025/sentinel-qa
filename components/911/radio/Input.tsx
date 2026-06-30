// components/rondin/SentinelInput.tsx
'use client'
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  isTextArea?: boolean;
  options?: string[]; // Para selects
}

export const SentinelInput = ({ label, isTextArea, options, ...props }: InputProps) => {
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontWeight: 600
  };

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '2px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select {...(props as any)} style={baseInputStyle}>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea {...(props as any)} style={{ ...baseInputStyle, minHeight: '100px', resize: 'vertical' }} />
      ) : (
        <input {...props} style={baseInputStyle} />
      )}
      <style jsx>{`
        input:focus, textarea:focus, select:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 1px #2563eb;
        }
      `}</style>
    </div>
  )
}