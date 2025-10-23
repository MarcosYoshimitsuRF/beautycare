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
import { Proveedor } from "@/lib/validators/proveedor";

export interface ProveedorActionsProps {
  proveedor: Proveedor;
  onEdit: (proveedor: Proveedor) => void;
  onDelete: (proveedor: Proveedor) => void;
}

export const columns = (actions: ProveedorActionsProps): ColumnDef<Proveedor>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    accessorKey: "ruc",
    header: "RUC",
    cell: ({ row }) => <div>{row.getValue("ruc") || '-'}</div>,
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
     cell: ({ row }) => <div>{row.getValue("telefono") || '-'}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const proveedor = row.original;
      return (
         <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(proveedor.id.toString())}>Copiar ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onEdit(proveedor)}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onDelete(proveedor)} className="text-red-600">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
    },
  },
];