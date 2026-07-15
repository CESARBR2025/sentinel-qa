'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button onClick={() => window.print()} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
      background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0',
      fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
    }}>
      <Printer size={13} /> Imprimir
    </button>
  )
}
