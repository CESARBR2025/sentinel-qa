import type { Metadata } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SSPM San Juan del Río - CENTINELA",
  description: "Sistema de Gestión Seguridad Pública",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" style={{ background: '#070b16' }}>
      <body style={{ margin: 0, background: '#070b16' }} suppressHydrationWarning>
        <SmoothScroll />
        <PageTransition />
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          style={{ zIndex: 2147483647 }}
          toastOptions={{
            style: {
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              borderRadius: '2px',
              borderLeft: '4px solid',
            },
          }}
        />
      </body>
    </html>
  );
}