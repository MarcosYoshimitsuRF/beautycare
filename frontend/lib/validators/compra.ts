import z from "zod/v3";

// Schema for the form used to REGISTER a new purchase AND replenish stock
export const CompraRegisterSchema = z.object({
  // No ID for creation form
  proveedorId: z.coerce.number({ required_error: "Selecciona un proveedor", invalid_type_error: "ID de proveedor inválido"})
                       .int().positive({ message: "ID de proveedor inválido" }),
  fecha: z.date({ required_error: "La fecha es obligatoria"}), // Using date type for better input handling
  total: z.coerce.number({ required_error: "El total es obligatorio", invalid_type_error: "Debe ser un número" })
                 .min(0, { message: "El total no puede ser negativo" }),

  // Details for stock replenishment (required by backend POST /compras)
  insumoIdParaReponer: z.coerce.number({ required_error: "Selecciona un insumo", invalid_type_error: "ID de insumo inválido" })
                               .int().positive({ message: "ID de insumo inválido" }),
  cantidadRepuesta: z.coerce.number({ required_error: "La cantidad es obligatoria", invalid_type_error: "Debe ser un número entero" })
                           .int({ message: "Debe ser un número entero" })
                           .min(1, { message: "Debe reponer al menos 1 unidad" }),
});

export type CompraRegisterFormData = z.infer<typeof CompraRegisterSchema>;

// Type for the purchase data coming FROM the API (GET /compras)
export interface Compra {
  id: number;
  proveedorId?: number | null; // Optional if provider was deleted?
  proveedorNombre?: string | null; // Backend might send this
  fecha: string; // Backend likely sends ISO date string
  total: number; // Backend sends BigDecimal, frontend uses number
  // Note: The API GET response doesn't include replenishment details
}