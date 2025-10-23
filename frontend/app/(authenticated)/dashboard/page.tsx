'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Importar Button si no estaba
import { LogOut } from 'lucide-react'; // Importar LogOut si no estaba

// Opcional: import { jwtDecode } from 'jwt-decode';
// interface DecodedToken { sub: string; roles: string[]; iat: number; exp: number; }

export default function DashboardPage() {
  const router = useRouter();
  // **Asegúrate que esta línea esté presente y correcta**
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Iniciar como cargando

   useEffect(() => {
    console.log("Dashboard useEffect: Verificando token...");
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('jwtToken');
    }

    if (!token) {
      console.log("Dashboard useEffect: No hay token, redirigiendo a login.");
      router.replace('/login');
      return; // Salir del efecto si no hay token
    }

    try {
      console.log("Dashboard useEffect: Token encontrado, procesando...");
      // **Obtener username y roles** (Usaremos placeholder por ahora)
      // OPCIÓN 1: Decodificar token (requiere `npm install jwt-decode`)
      // import { jwtDecode } from 'jwt-decode';
      // interface DecodedToken { sub: string; roles: string[]; iat: number; exp: number; }
      // const decoded = jwtDecode<DecodedToken>(token);
      // setUsername(decoded.sub);
      // setRoles(decoded.roles || []);
      // console.log("Dashboard useEffect: Usuario decodificado:", decoded.sub);

      // OPCIÓN 2: Placeholder
       const placeholderUsername = "Usuario Autenticado"; // Placeholder
       setUsername(placeholderUsername);
       // Simular roles (quitar en producción)
       // setRoles(["ROLE_ADMIN"]);
       setRoles(["ROLE_CLIENTE"]); // Ejemplo rol cliente
       console.log("Dashboard useEffect: Usando placeholder:", placeholderUsername);

      // OPCIÓN 3 (Ideal): Llamar a un endpoint /api/me
      // ...

    } catch (error) {
      console.error("Dashboard useEffect: Error procesando token:", error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
      }
      router.replace('/login');
    } finally {
       console.log("Dashboard useEffect: Terminando carga.");
       setIsLoading(false); // Marcar como cargado (incluso si hubo error y se redirige)
    }
  }, [router]); // Incluir router en las dependencias del efecto


  // Mostrar pantalla de carga mientras isLoading es true
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.14))]"> {/* Altura menos el navbar */}
        {/* Puedes usar un componente Spinner de shadcn si lo instalaste */}
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }

  // Si después de cargar, username sigue siendo null (ej. error inesperado),
  // podríamos mostrar un mensaje o redirigir (aunque useEffect ya debería haberlo hecho).
  // Este caso es poco probable si isLoading funciona bien.


  // El Layout (`dashboard/layout.tsx`) ya incluye el Navbar y el <main> wrapper
  return (
    // Quitamos container y py-10, ya que el layout lo maneja con p-6
    <div>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>
            {/* **Verifica que 'username' se use aquí correctamente** */}
            Bienvenido/a de nuevo, <span className="font-semibold">{username ?? 'Usuario'}</span>!
            {/* Usar '??' como fallback por si acaso */}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Contenido principal del dashboard. Navega usando la barra lateral.
          </p>

          {/* Lógica condicional basada en roles */}
          {roles.includes('ROLE_ADMIN') && (
            <div className="p-4 border rounded bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-blue-800 dark:text-blue-300">Acciones de Administrador:</p>
              {/* Links/Botones Admin */}
            </div>
          )}
          {(roles.includes('ROLE_CLIENTE') || roles.includes('ROLE_STAFF')) && !roles.includes('ROLE_ADMIN') && (
            <div className="p-4 border rounded bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-800 dark:text-green-300">Acciones de Cliente/Staff:</p>
              {/* Links/Botones Cliente/Staff */}
            </div>
          )}
           {roles.length === 0 && !isLoading && ( // Mostrar solo si no está cargando y no hay roles
             <p className="text-sm text-muted-foreground">No se pudo determinar el rol del usuario.</p>
           )}
           {/* El botón de Logout está en el Navbar ahora */}
           {/* <Button onClick={handleLogout} variant="outline">Cerrar Sesión</Button> */}
        </CardContent>
      </Card>
    </div>
  );
}