"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pago } from "@/lib/validators/pago";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
};

// Helper para formatear fecha y hora
const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    try { return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es }); }
    catch { return dateString; }
};

// No hay acciones Edit/Delete para Pagos
// export interface PagoActionsProps { ... }

export const columns: ColumnDef<Pago>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID Pago <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "citaId",
    header: "ID Cita",
     cell: ({ row }) => <div className="text-center">{row.getValue("citaId")}</div>, // Centrar ID Cita
  },
  {
    accessorKey: "fechaHora",
    header: ({ column }) => (
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha y Hora <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => formatDateTime(row.getValue("fechaHora")),
  },
  {
    accessorKey: "monto",
    header: ({ column }) => (
      <div className="text-right">
       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Monto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.getValue("monto"))}</div>,
  },
    {
    accessorKey: "metodo",
    header: "Método",
  },
  // No hay columna de acciones
];