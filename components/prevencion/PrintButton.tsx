'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ padding: '9px 18px', background: '#d4a43a', color: '#070b16', border: 'none', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
    >
      Imprimir / Guardar PDF
    </button>
  )
}
