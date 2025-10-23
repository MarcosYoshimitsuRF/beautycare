package com.beautycare.core.presentation.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;


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

}