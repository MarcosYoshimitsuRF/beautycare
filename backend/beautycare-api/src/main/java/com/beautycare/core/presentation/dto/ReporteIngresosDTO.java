package com.beautycare.core.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ReporteIngresosDTO {
    private BigDecimal ingresosTotales;
    private Long numeroDePagos;
}