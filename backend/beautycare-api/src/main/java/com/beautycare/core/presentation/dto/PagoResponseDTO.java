package com.beautycare.core.presentation.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para responder en listados/detalles de Pago (GET)
 */
@Data
public class PagoResponseDTO {

    private Long id;
    private Long citaId; // ID de la cita pagada
    private BigDecimal monto;
    private String metodo;
    private LocalDateTime fechaHora;
}