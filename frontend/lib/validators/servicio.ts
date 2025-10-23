import z from "zod/v3";

export const ServicioSchema = z.object({
  id: z.number().optional().nullable(),
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }).max(255),
  // Usamos z.coerce para asegurar que el input (que es string) se convierta a número
  precio: z.coerce.number({ invalid_type_error: "Debe ser un número" })
                  .min(0, { message: "El precio no puede ser negativo" }),
  duracionMin: z.coerce.number({ invalid_type_error: "Debe ser un número entero" })
                      .int({ message: "Debe ser un número entero" })
                      .min(1, { message: "La duración debe ser al menos 1 minuto" }),
});

export type ServicioFormData = z.infer<typeof ServicioSchema>;

// Tipo para el servicio que viene de la API
export interface Servicio {
  id: number;
  nombre: string;
  // El backend devuelve BigDecimal, pero en frontend lo manejamos como number
  precio: number;
  duracionMin: number;
}