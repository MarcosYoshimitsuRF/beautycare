import z from "zod/v3";

export const InsumoSchema = z.object({
  id: z.number().optional().nullable(),
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }).max(255),
  stock: z.coerce.number({ invalid_type_error: "Debe ser un número entero" })
                 .int({ message: "Debe ser un número entero" })
                 .min(0, { message: "El stock no puede ser negativo" }),
  stockMinimo: z.coerce.number({ invalid_type_error: "Debe ser un número entero" })
                       .int({ message: "Debe ser un número entero" })
                       .min(0, { message: "El stock mínimo no puede ser negativo" }),
  unidad: z.string().max(50).optional().nullable(), // Ej. 'ml', 'gr', 'unidad'
});

export type InsumoFormData = z.infer<typeof InsumoSchema>;

// Tipo para el insumo que viene de la API
export interface Insumo {
  id: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
  unidad?: string | null;
}