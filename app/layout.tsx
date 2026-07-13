import type { Metadata } from "next";
import "./globals.css";
import LoadingProvider from "@/components/LoadingProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SSPM San Juan del Río - SENTINEL",
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
        <LoadingProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              style: {
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                borderRadius: '2px',
                borderLeft: '4px solid',
              },
            }}
          />
        </LoadingProvider>
      </body>
    </html>
  );
}