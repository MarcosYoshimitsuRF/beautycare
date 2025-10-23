import * as z from "zod";

export const ProfesionalSchema = z.object({
  id: z.number().optional().nullable(),
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).max(255),
  especialidad: z.string().max(150).optional().nullable(),
});

export type ProfesionalFormData = z.infer<typeof ProfesionalSchema>;

// Tipo para el profesional que viene de la API
export interface Profesional {
  id: number;
  nombre: string;
  especialidad?: string | null;
}