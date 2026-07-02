import React from 'react'

export function IncidenteStat({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e2e8f0', 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '8px',
      borderLeft: '4px solid #2563eb' // El sello de tu diseño
    }}>
      <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <span style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontSize: '10px', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {label}
        </span>
      </div>
      <div style={{ 
        fontFamily: 'Barlow Condensed, sans-serif', 
        fontSize: '28px', 
        fontWeight: 800, 
        color: '#0f172a' 
      }}>
        {value}
      </div>
    </div>
  )
}