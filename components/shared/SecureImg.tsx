'use client'

import { useState, useEffect, useRef } from 'react'

export function SecureImg({ ref: fileRef, alt, ...imgProps }: { ref: string; alt: string } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'ref'>) {
  const [src, setSrc] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    fetch('/api/expediente/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: fileRef }),
    })
      .then(r => r.json())
      .then(d => { if (mounted.current) setSrc(`/api/expediente/vista/${encodeURIComponent(d.token)}`) })
      .catch(() => { if (mounted.current) setSrc(`/api/expediente/proxy?ref=${encodeURIComponent(fileRef)}`) })
    return () => { mounted.current = false }
  }, [fileRef])

  if (!src) {
    return (
      <div style={{ width: imgProps.width || 56, height: imgProps.height || 56, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#999' }}>...</span>
      </div>
    )
  }

  return <img src={src} alt={alt} {...imgProps} />
}
