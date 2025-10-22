package com.beautycare.core.presentation.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO para crear una Cita (POST)
 */
@Data
public class CitaRequestDTO {

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    @NotNull(message = "El ID del profesional es obligatorio")
    private Long profesionalId;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long servicioId;

    @NotNull(message = "La fecha y hora de inicio son obligatorias")
    @Future(message = "La cita debe ser en una fecha futura")
    private LocalDateTime fechaHoraInicio;

    // La fechaHoraFin y el estado se calculan/asignan en el servicio.
}