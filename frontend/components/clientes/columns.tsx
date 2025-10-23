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
import { Cliente } from "@/lib/validators/cliente"; // Importamos el tipo Cliente

// Definimos un tipo para las props de las acciones
export interface ClienteActionsProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

// Este tipo ColumnDef usa generics para saber qué tipo de dato maneja: Cliente
export const columns = (actions: ClienteActionsProps): ColumnDef<Cliente>[] => [
  // Columna ID (opcional, se puede ordenar)
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  // Columna Nombre (se puede ordenar)
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
  // Columna Email
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email") || '-'}</div>,
  },
  // Columna Celular
  {
    accessorKey: "celular",
    header: "Celular",
     cell: ({ row }) => <div>{row.getValue("celular") || '-'}</div>,
  },
  // Columna de Acciones
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const cliente = row.original; // Obtenemos el objeto Cliente completo

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cliente.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onEdit(cliente)}> {/* Llama a onEdit */}
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onDelete(cliente)} className="text-red-600"> {/* Llama a onDelete */}
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];