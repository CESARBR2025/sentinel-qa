'use client'
import { useEffect, useState } from 'react'

// Detecta media queries desde React con render inicial seguro para SSR
// (arranca en desktop y se ajusta tras el hidratado). El breakpoint de la app
// es 720px (mismo que .fk-grid); usarlo con '(max-width: 720px)'.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}
