import z from "zod/v3";
import { Cliente } from "./cliente";
import { Profesional } from "./profesional";
import { Servicio } from "./servicio";

// Schema para el FORMULARIO de creación de citas
export const CitaFormSchema = z.object({
  clienteId: z.coerce.number().int().positive({ message: "ID Cliente inválido"}),
  profesionalId: z.coerce.number({ required_error: "Selecciona un profesional" }).int().positive(),
  servicioId: z.coerce.number({ required_error: "Selecciona un servicio" }).int().positive(),
  fechaHoraInicio: z.date({ required_error: "Selecciona fecha y hora" })
                     .min(new Date(new Date().toDateString()), { message: "La fecha no puede ser pasada" }), // Permitir día actual
});

export type CitaFormData = z.infer<typeof CitaFormSchema>;

// Tipo para la CITA que viene de la API (GET /citas - CitaResponseDTO)
export interface Cita {
  id: number;
  fechaHoraInicio: string; // ISO String
  fechaHoraFin: string;    // ISO String
  estado: string;
  cliente: Cliente;
  profesional: Profesional;
  servicio: Servicio;
}

// Payload para POST /citas
export interface CitaCreatePayload {
  clienteId: number;
  profesionalId: number;
  servicioId: number;
  fechaHoraInicio: string; // ISO String
}

// Payload para PUT /citas/{id}/estado
export interface CitaUpdateEstadoPayload {
    estado: string;
}