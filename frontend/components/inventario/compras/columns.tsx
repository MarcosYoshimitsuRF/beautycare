"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Compra } from "@/lib/validators/compra";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper para formatear precio
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
};

// No hay acciones de Edit/Delete para Compras según el plan
// export interface CompraActionsProps { ... }

export const columns: ColumnDef<Compra>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    // Accedemos al nombre anidado si el backend lo envía
    accessorKey: "proveedorNombre",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.original.proveedorNombre || (row.original.proveedorId ? `ID: ${row.original.proveedorId}`: '-')}</div>,
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => (
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => {
       try {
         // Formatear la fecha que viene como string
         return format(new Date(row.getValue("fecha")), "dd MMM yyyy", { locale: es });
       } catch {
         return row.getValue("fecha"); // Mostrar string si falla el parseo
       }
     },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <div className="text-right">
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("total"))}</div>,
  },
  // No hay columna de acciones
];