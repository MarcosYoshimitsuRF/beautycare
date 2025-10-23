package com.beautycare.core.presentation.dto;

import lombok.Data;
import java.time.LocalDateTime;


@Data
public class CitaResponseDTO {

    private Long id;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private String estado;

    private ClienteDTO cliente;
    private ProfesionalDTO profesional;
    private ServicioDTO servicio;
}