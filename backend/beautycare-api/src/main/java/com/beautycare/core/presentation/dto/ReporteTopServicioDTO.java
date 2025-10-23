package com.beautycare.core.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporteTopServicioDTO {
    private Long servicioId;
    private String nombreServicio;
    private Long cantidadSolicitada;
}