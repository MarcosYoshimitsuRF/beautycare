import * as z from "zod";

export const ProveedorSchema = z.object({
  id: z.number().optional().nullable(),
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }).max(255),
  ruc: z.string().max(20).optional().nullable(),
  telefono: z.string().max(20).optional().nullable(),
});

export type ProveedorFormData = z.infer<typeof ProveedorSchema>;

// Tipo para el proveedor que viene de la API
export interface Proveedor {
  id: number;
  nombre: string;
  ruc?: string | null;
  telefono?: string | null;
}