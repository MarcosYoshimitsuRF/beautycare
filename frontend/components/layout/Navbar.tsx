'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
// Importa Menu si vas a implementar sidebar móvil
// import { Menu } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Para sidebar móvil

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between"> {/* Cambiado a justify-between */}

        {/* Lado Izquierdo: Logo/Nombre y Menú Móvil (opcional) */}
        <div className="flex items-center">
          {/* Botón para Sidebar Móvil (Implementación pendiente) */}
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden mr-4">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-10 w-64">
               {/* Aquí podrías reusar <Sidebar /> o una versión móvil */}
               {/* <Sidebar /> */}
            {/* </SheetContent>
          </Sheet> */}

          {/* Nombre de la Aplicación */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold">BeautyCare</span>
          </Link>
        </div>

        {/* Lado Derecho: Botón Logout */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

      </div>
    </header>
  );
}