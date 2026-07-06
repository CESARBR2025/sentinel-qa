import React from 'react'

export const pageWrap: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }
export const fontsImport = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`

export const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
  color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8,
}
export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#ffffff',
  border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'Inter,sans-serif',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
}
export const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }
export const btnPrimario: React.CSSProperties = {
  padding: '10px 24px', background: '#0f172a', color: '#fff',
  fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
  fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
  border: 'none', cursor: 'pointer',
}
export const btnSecundario: React.CSSProperties = {
  padding: '10px 20px', background: '#f1f5f9', color: '#475569',
  fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
  fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
  textDecoration: 'none', border: '1px solid #e2e8f0', cursor: 'pointer',
}
export const cardStyle: React.CSSProperties = { border: '1px solid #e2e8f0', background: '#ffffff', overflow: 'hidden', borderRadius: 2 }
