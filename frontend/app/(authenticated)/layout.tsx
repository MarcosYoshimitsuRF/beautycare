import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar /> {/* Navbar se queda arriba */}
      <div className="flex flex-1"> {/* Contenedor principal ahora es flex horizontal */}
        <Sidebar /> {/* Sidebar a la izquierda */}
        {/* Área de contenido principal a la derecha */}
        <main className="flex-1 p-6 overflow-auto"> {/* flex-1 toma el espacio restante, p-6 para padding, overflow-auto para scroll */}
          {children} {/* Aquí se renderiza el page.tsx */}
        </main>
      </div>
    </div>
  );
}