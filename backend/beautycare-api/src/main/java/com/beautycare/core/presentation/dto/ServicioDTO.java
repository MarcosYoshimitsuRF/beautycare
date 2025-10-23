package com.beautycare.core.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServicioDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no debe exceder los 255 caracteres")
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precio;

    @NotNull(message = "La duración es obligatoria")
    @Min(value = 1, message = "La duración debe ser de al menos 1 minuto")
    private int duracionMin;
}