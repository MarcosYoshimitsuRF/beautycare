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
import { Insumo } from "@/lib/validators/insumo";
import { Badge } from "@/components/ui/badge"; // Importar Badge
import { cn } from "@/lib/utils";

export interface InsumoActionsProps {
  insumo: Insumo;
  onEdit: (insumo: Insumo) => void;
  onDelete: (insumo: Insumo) => void;
}

export const columns = (actions: InsumoActionsProps): ColumnDef<Insumo>[] => [
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
    accessorKey: "stock",
    header: ({ column }) => (
      <div className="text-right">
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const stock = row.original.stock;
      const stockMinimo = row.original.stockMinimo;
      const bajoStock = stock <= stockMinimo;

      return (
        <div className={cn("text-right", bajoStock ? "text-destructive font-semibold" : "")}>
           {stock} {row.original.unidad || ''}
           {bajoStock && <Badge variant="destructive" className="ml-2">Bajo</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "stockMinimo",
    header: () => <div className="text-right">Stock Mínimo</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("stockMinimo")} {row.original.unidad || ''}</div>,
  },
  {
    accessorKey: "unidad",
    header: "Unidad",
    cell: ({ row }) => <div>{row.getValue("unidad") || '-'}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const insumo = row.original;
      return (
         <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(insumo.id.toString())}>Copiar ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onEdit(insumo)}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onDelete(insumo)} className="text-red-600">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
    },
  },
];