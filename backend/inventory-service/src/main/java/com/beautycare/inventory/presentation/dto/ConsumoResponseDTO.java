package com.beautycare.inventory.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO para la respuesta del registro de consumo.
 */
@Data
@AllArgsConstructor
public class ConsumoResponseDTO {
    private String status;
    private String message;
    private int insumosAfectados;
}