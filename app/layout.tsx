import type { Metadata, Viewport } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import SwRegister from "@/components/sw-register";
import InstalarApp from "@/components/InstalarApp";
import { NotificacionesProvider } from "@/components/notificaciones/NotificacionesProvider";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CENTINELA",
  description: "Sistema de Gestión Seguridad Pública",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo_sentinel.png",
    shortcut: "/logo_sentinel.png",
    apple: "/logo_sentinel.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CENTINELA",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f355a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" style={{ background: '#070b16' }} className={cn("font-sans", geist.variable)}>
      <body style={{ margin: 0, background: '#070b16' }} suppressHydrationWarning>
        <PageTransition />
        <NotificacionesProvider>{children}</NotificacionesProvider>
        <SwRegister />
        <InstalarApp />
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