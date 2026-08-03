'use client'
import { useEffect, useState } from 'react'

// Niveles alineados con los breakpoints de la app:
//   móvil   → max-width: 720px    (mismo que .fk-grid)
//   tablet  → 721px – 1200px      (mismo que .dashboard-grid)
//   desktop → min-width: 1201px
// SSR-safe: arranca en desktop y se ajusta tras el hidratado.
const QUERIES = {
  movil: '(max-width: 720px)',
  tablet: '(min-width: 721px) and (max-width: 1200px)',
  desktop: '(min-width: 1201px)',
}

export interface ResponsiveFlags {
  esMovil: boolean
  esTablet: boolean
  esDesktop: boolean
}

export function useResponsive(): ResponsiveFlags {
  const [matches, setMatches] = useState({
    esMovil: false,
    esTablet: false,
    esDesktop: true,
  })

  useEffect(() => {
    const mq = {
      esMovil: window.matchMedia(QUERIES.movil),
      esTablet: window.matchMedia(QUERIES.tablet),
      esDesktop: window.matchMedia(QUERIES.desktop),
    }
    const update = () =>
      setMatches({
        esMovil: mq.esMovil.matches,
        esTablet: mq.esTablet.matches,
        esDesktop: mq.esDesktop.matches,
      })
    update()
    mq.esMovil.addEventListener('change', update)
    mq.esTablet.addEventListener('change', update)
    mq.esDesktop.addEventListener('change', update)
    return () => {
      mq.esMovil.removeEventListener('change', update)
      mq.esTablet.removeEventListener('change', update)
      mq.esDesktop.removeEventListener('change', update)
    }
  }, [])

  return matches
}
