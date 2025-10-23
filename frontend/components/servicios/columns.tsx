"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Servicio } from "@/lib/validators/servicio";

export interface ServicioActionsProps {
  servicio: Servicio;
  onEdit: (servicio: Servicio) => void;
  onDelete: (servicio: Servicio) => void;
}

// Helper para formatear precio
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
};


export const columns = (actions: ServicioActionsProps): ColumnDef<Servicio>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
   {
    accessorKey: "precio",
    header: ({ column }) => (
      <div className="text-right"> {/* Alinear a la derecha */}
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Precio <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("precio"))}</div>, // Formatear como moneda
  },
   {
    accessorKey: "duracionMin",
    header: ({ column }) => (
       <div className="text-right"> {/* Alinear a la derecha */}
         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
           Duración (min) <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       </div>
    ),
    cell: ({ row }) => <div className="text-right">{row.getValue("duracionMin")} min</div>,
  },
  {
    id: "actions",
     header: () => <div className="text-right">Acciones</div>, // Alinear cabecera
    cell: ({ row }) => {
      const servicio = row.original;
      return (
         <div className="text-right"> {/* Alinear contenido */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(servicio.id.toString())}>Copiar ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onEdit(servicio)}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onDelete(servicio)} className="text-red-600">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
    },
  },
];