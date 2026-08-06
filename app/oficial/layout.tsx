import { OficialUbicacionProvider } from '@/components/oficial/OficialUbicacionTracker'

export default function OficialLayout({ children }: { children: React.ReactNode }) {
  return (
    <OficialUbicacionProvider>
      {children}
    </OficialUbicacionProvider>
  )
}
