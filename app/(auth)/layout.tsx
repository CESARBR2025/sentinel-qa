import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SENTINEL · SSPM San Juan del Río',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
