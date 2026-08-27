import React from 'react'

const appleFont = 'var(--apple-font-display)'

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  border: '1px solid #e2e8f0',
  borderRadius: 'var(--radius-lg)',
  fontFamily: appleFont,
  fontSize: 14,
  color: '#1e293b',
  boxSizing: 'border-box',
  outline: 'none',
  background: '#ffffff',
  transition: 'border-color .15s, box-shadow .15s, background .15s',
}

export const btnSecundario: React.CSSProperties = {
  fontFamily: appleFont,
  fontSize: 14,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 'normal',
  padding: '10px 18px',
  background: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0',
  borderRadius: 'var(--radius-lg)',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
}

export const btnPrimario = (disabled: boolean): React.CSSProperties => ({
  fontFamily: appleFont,
  fontSize: 14,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 'normal',
  padding: '10px 20px',
  background: disabled ? '#94a3b8' : '#0f172a',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-lg)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

export const btnTiny: React.CSSProperties = {
  fontFamily: appleFont,
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 'normal',
  padding: '7px 12px',
  background: '#eff1f3',
  color: '#1f355a',
  border: '1px solid #c3c8d2',
  borderRadius: 'var(--radius-lg)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

export const btnTinyDanger: React.CSSProperties = {
  fontFamily: appleFont,
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 'normal',
  padding: '7px 10px',
  background: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fecaca',
  borderRadius: 'var(--radius-lg)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}

export function Label({ children }: { children: React.ReactNode }) {
  return React.createElement('label', {
    style: {
      fontFamily: appleFont,
      fontSize: 12,
      color: '#64748b',
      textTransform: 'none',
      letterSpacing: 'normal',
      fontWeight: 500,
      display: 'block',
      marginBottom: 6,
    },
  }, children)
}

export const sectionCard: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 'var(--radius-lg)',
  marginBottom: 24,
  overflow: 'hidden',
  boxShadow: 'var(--shadow-card)',
}

export const sectionHeader: React.CSSProperties = {
  borderBottom: '1px solid #e2e8f0',
  padding: '14px 22px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
}

export const sectionTitleStyle: React.CSSProperties = {
  fontFamily: appleFont,
  fontSize: 16,
  fontWeight: 600,
  color: '#1f355a',
  textTransform: 'none',
  letterSpacing: 'normal',
}

export const sectionBody: React.CSSProperties = {
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

export const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  color: '#1e293b',
  fontFamily: appleFont,
}
