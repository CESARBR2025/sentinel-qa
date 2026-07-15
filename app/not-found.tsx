import { redirect } from 'next/navigation'

/**
 * Cualquier ruta que no exista (404) redirige a /dashboard en vez de
 * mostrar la página 404 por defecto — evita exponer estructura de rutas
 * y fuerza al usuario de vuelta a una zona controlada (protegida por
 * proxy.ts / cada layout, que a su vez exige sesión válida).
 */
export default function NotFound() {
  redirect('/dashboard')
}
