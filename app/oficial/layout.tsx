import { OficialUbicacionProvider } from '@/components/oficial/OficialUbicacionTracker'
import { GuardiaPermisosOficial } from '@/components/oficial/GuardiaPermisosOficial'

export default function OficialLayout({ children }: { children: React.ReactNode }) {
  return (
    <OficialUbicacionProvider>
      <GuardiaPermisosOficial>
        {children}
      </GuardiaPermisosOficial>
    </OficialUbicacionProvider>
  )
}
