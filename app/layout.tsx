import type { Metadata } from "next";
import "./globals.css";
import LoadingProvider from "@/components/LoadingProvider";

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
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}