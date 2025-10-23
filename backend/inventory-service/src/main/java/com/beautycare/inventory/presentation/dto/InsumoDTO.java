package com.beautycare.inventory.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InsumoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255)
    private String nombre;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private int stock;

    @NotNull(message = "El stock mínimo es obligatorio")
    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private int stockMinimo;

    @Size(max = 50)
    private String unidad;
}