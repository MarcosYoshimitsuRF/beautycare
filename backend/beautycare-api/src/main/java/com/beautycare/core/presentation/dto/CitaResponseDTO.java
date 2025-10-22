package com.beautycare.core.presentation.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO para responder en listados/detalles de Cita (GET)
 */
@Data
public class CitaResponseDTO {

    private Long id;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private String estado;

    // Devolvemos objetos anidados (simplificados) para el Frontend
    private ClienteDTO cliente;
    private ProfesionalDTO profesional;
    private ServicioDTO servicio;
}