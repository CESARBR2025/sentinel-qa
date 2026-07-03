import React from 'react'

export const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }

export const btnSecundario: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer', textDecoration: 'none' }

export const btnPrimario = (disabled: boolean): React.CSSProperties => ({ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 24px', background: disabled ? '#94a3b8' : '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 })

export const btnTiny: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }

export const btnTinyDanger: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }

export function Label({ children }: { children: React.ReactNode }) {
  return React.createElement('label', {
    style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 },
  }, children)
}

export const sectionCard: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, marginBottom: 24 }
export const sectionHeader: React.CSSProperties = { borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }
export const sectionTitleStyle: React.CSSProperties = { fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }
export const sectionBody: React.CSSProperties = { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }

export const pageWrap: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }
export const fontsImport = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`
