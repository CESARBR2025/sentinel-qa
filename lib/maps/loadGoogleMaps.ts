'use client'

type GoogleMapsNamespace = typeof google

interface GoogleMapsWindow extends Window {
  google?: GoogleMapsNamespace
  __googleMapsPromise?: Promise<GoogleMapsNamespace | null> | null
}

const SCRIPT_SRC_FRAGMENT = 'maps.googleapis.com/maps/api/js'

function getMapsWindow(): GoogleMapsWindow {
  return window as unknown as GoogleMapsWindow
}

function waitForGoogle(
  script: HTMLScriptElement,
  w: GoogleMapsWindow,
): Promise<GoogleMapsNamespace | null> {
  return new Promise((resolve, reject) => {
    const onLoad = () => {
      cleanup()
      if (w.google?.maps) resolve(w.google)
      else reject(new Error('Google Maps cargó pero no está disponible'))
    }
    const onError = () => {
      cleanup()
      reject(new Error('No se pudo cargar Google Maps'))
    }
    const cleanup = () => {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
    }

    const rs = (script as HTMLScriptElement & { readyState?: string }).readyState
    if (rs === 'complete' || rs === 'loaded') {
      onLoad()
      return
    }
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
  })
}

/**
 * Carga la Google Maps JavaScript API una sola vez por página.
 * - Si ya está cargada, resuelve de inmediato.
 * - Si ya hay un <script> de Maps en el DOM, se reutiliza (evita "loaded multiple times").
 * - Si no hay API key, resuelve null (sin crashear).
 * Devuelve la namespace `google` o null si no está disponible.
 */
export function loadGoogleMaps(): Promise<GoogleMapsNamespace | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  const w = getMapsWindow()

  if (w.google?.maps) {
    return Promise.resolve(w.google)
  }

  if (w.__googleMapsPromise) {
    return w.__googleMapsPromise
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src*="${SCRIPT_SRC_FRAGMENT}"]`,
  )

  if (existing) {
    w.__googleMapsPromise = waitForGoogle(existing, w).catch((err) => {
      console.warn('[loadGoogleMaps]', err.message)
      w.__googleMapsPromise = null
      return null
    })
    return w.__googleMapsPromise
  }

  if (!apiKey) {
    console.warn('[loadGoogleMaps] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no configurada')
    return Promise.resolve(null)
  }

  const script = document.createElement('script')
  script.src = `https://${SCRIPT_SRC_FRAGMENT}?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true

  w.__googleMapsPromise = waitForGoogle(script, w)
    .then((g) => g)
    .catch((err) => {
      console.warn('[loadGoogleMaps]', err.message)
      w.__googleMapsPromise = null
      return null
    })

  document.head.appendChild(script)

  return w.__googleMapsPromise
}
