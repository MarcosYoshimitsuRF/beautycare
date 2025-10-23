'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para saber la ruta activa
import { cn } from '@/lib/utils'; // Utilidad shadcn
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  Package, // (Insumos)
  Truck,
  Workflow,
  Settings,
  ShoppingCart, // (Proveedores)
} from 'lucide-react';
import { buttonVariants } from '../ui/button';

// Define los links de navegación
const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CLIENTE', 'STAFF'] },
  { href: '/clientes', label: 'Clientes', icon: Users, roles: ['ADMIN'] },
  { href: '/profesionales', label: 'Profesionales', icon: Workflow, roles: ['ADMIN'] }, // Añadir si es necesario
  { href: '/servicios', label: 'Servicios', icon: Settings, roles: ['ADMIN'] }, // Añadir si es necesario
  { href: '/citas', label: 'Citas', icon: Calendar, roles: ['ADMIN', 'CLIENTE', 'STAFF'] },
  { href: '/pagos', label: 'Pagos', icon: ShoppingCart, roles: ['ADMIN', 'STAFF'] }, // Añadir si es necesario
  { href: '/inventario/insumos', label: 'Insumos', icon: Package, roles: ['ADMIN'] },
  { href: '/inventario/proveedores', label: 'Proveedores', icon: Truck, roles: ['ADMIN'] },
  { href: '/inventario/compras', label: 'Compras', icon: ShoppingCart, roles: ['ADMIN'] }, // Añadir si es necesario
  { href: '/reportes', label: 'Reportes', icon: BarChart2, roles: ['ADMIN'] }, // O definir reportes específicos por rol
];

export default function Sidebar() {
  const pathname = usePathname(); // Obtiene la ruta actual

  // TODO: Obtener roles del usuario (ej. ['ROLE_ADMIN']) desde el contexto o props
  const userRoles = ['ROLE_ADMIN']; // Placeholder - ¡Reemplazar con lógica real!

  // Filtrar links basado en roles (quitar el prefijo ROLE_ para comparar)
  const filteredLinks = navLinks.filter(link =>
    link.roles.some(requiredRole => userRoles.includes(`ROLE_${requiredRole}`))
  );

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      {/* Podríamos añadir un logo pequeño o título aquí si se desea */}
      {/* <div className="h-14 border-b flex items-center justify-center">
        <span className="font-bold">Menú</span>
      </div> */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }), // Estilo de botón activo/inactivo
                'w-full justify-start' // Alinear texto e icono a la izquierda
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {/* Podríamos añadir info del usuario o links extra al final */}
      {/* <div className="p-4 border-t"> User Info </div> */}
    </aside>
  );
}