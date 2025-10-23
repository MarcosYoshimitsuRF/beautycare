"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cita } from "@/lib/validators/cita";
import { cn } from "@/lib/utils";

export interface CitaActionsProps {
  cita: Cita;
  onCancel: (cita: Cita) => void;
}

const formatDateTime = (dateString: string) => {
    try { return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es }); }
    catch { return dateString; }
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toUpperCase()) { // Añadir null check
        case 'REALIZADA': return 'default';
        case 'CANCELADA': return 'destructive';
        case 'PENDIENTE': return 'secondary';
        default: return 'outline';
    }
};

export const columns = (actions: CitaActionsProps): ColumnDef<Cita>[] => [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "fechaHoraInicio",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha y Hora
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDateTime(row.getValue("fechaHoraInicio")),
  },
  {
    accessorFn: (row) => row.servicio?.nombre,
    id: "servicio.nombre",
    header: "Servicio",
    cell: ({ row }) => row.original.servicio?.nombre || '-',
  },
  {
    accessorFn: (row) => row.profesional?.nombre,
    id: "profesional.nombre",
    header: "Profesional",
    cell: ({ row }) => row.original.profesional?.nombre || '-',
  },
  {
    accessorFn: (row) => row.cliente?.nombre,
    id: "cliente.nombre",
    header: "Cliente",
    cell: ({ row }) => row.original.cliente?.nombre || '-',
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      return <Badge variant={getStatusBadgeVariant(estado)}>{estado || 'N/A'}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const cita = row.original;
      const canCancel = cita.estado?.toUpperCase() === 'PENDIENTE';

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => actions.onCancel(cita)}
                disabled={!canCancel}
                className={cn(
                  !canCancel && "text-muted-foreground cursor-not-allowed",
                  canCancel && "text-red-600"
                )}
              >
                Cancelar Cita
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];