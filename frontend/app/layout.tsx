import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/use-toast";
// *** PASO 1: Importa TU ToastProvider ***
// Ajusta la ruta si guardaste tu archivo en otro lugar (ej. '@/lib/toast')

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BeautyCare App",
  description: "Gestión para Centro de Belleza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* *** PASO 2: Envuelve children con TU Provider *** */}
        <ToastProvider>
          {children}
          {/* El Toaster visual (si usas una librería como react-hot-toast) iría aquí dentro */}
        </ToastProvider>
      </body>
    </html>
  );
}