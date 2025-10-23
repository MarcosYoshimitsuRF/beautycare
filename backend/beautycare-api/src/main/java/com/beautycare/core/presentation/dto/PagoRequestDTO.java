package com.beautycare.core.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO para crear un Pago (POST)
 */
@Data
public class PagoRequestDTO {

    @NotNull(message = "El ID de la cita es obligatorio")
    private Long citaId;

    @NotNull(message = "El monto es obligatorio")
    @Min(value = 0, message = "El monto no puede ser negativo")
    private BigDecimal monto;

    @NotBlank(message = "El método de pago es obligatorio")
    private String metodo; // Ej. "Efectivo", "Tarjeta"

}