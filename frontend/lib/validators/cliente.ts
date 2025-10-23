import * as z from "zod";

export const ClienteSchema = z.object({
  id: z.number().optional().nullable(), // ID es opcional (para creación)
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).max(255),
  celular: z.string().max(20).optional().nullable(),
  email: z.string().email({ message: "Email inválido" }).max(100).optional().nullable(),
});

export type ClienteFormData = z.infer<typeof ClienteSchema>;

// Tipo para el cliente que viene de la API (asumiendo que siempre tiene ID)
export interface Cliente {
  id: number;
  nombre: string;
  celular?: string | null;
  email?: string | null;
}