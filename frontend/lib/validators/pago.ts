import z from "zod/v3";

// Schema para el FORMULARIO de registro de pagos
export const PagoFormSchema = z.object({
  // No ID en creación
  citaId: z.coerce.number({ required_error: "El ID de la cita es obligatorio", invalid_type_error: "ID Cita inválido"})
                  .int().positive({ message: "ID Cita inválido" }),
  monto: z.coerce.number({ required_error: "El monto es obligatorio", invalid_type_error: "Debe ser un número" })
                 .min(0, { message: "El monto no puede ser negativo" }),
  metodo: z.string().min(1, { message: "El método de pago es obligatorio" }).max(50),
});

export type PagoFormData = z.infer<typeof PagoFormSchema>;

// Tipo para el PAGO que viene de la API (GET /pagos - PagoResponseDTO)
export interface Pago {
  id: number;
  citaId: number;       // ID de la cita pagada
  monto: number;        // BigDecimal se convierte a number
  metodo: string;
  fechaHora: string;    // Backend envía ISO String
}