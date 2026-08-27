// components/reportes/deteccion_camara/ReportStat.tsx
export function ReportStat({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: '12px', fontWeight: 500, textTransform: 'none', letterSpacing: 'normal' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '28px', fontWeight: 600, color: '#0f172a', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  )
}
