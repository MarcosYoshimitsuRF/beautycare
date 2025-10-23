package com.beautycare.inventory.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CompraDTO {

    private Long id;

    @NotNull(message = "El ID del proveedor es obligatorio")
    private Long proveedorId;

    // Opcional: para mostrar el nombre en el GET
    private String proveedorNombre;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "El total es obligatorio")
    @Min(value = 0, message = "El total no puede ser negativo")
    private BigDecimal total;


    @NotNull(message = "El ID del insumo a reponer es obligatorio")
    private Long insumoIdParaReponer;

    @NotNull(message = "La cantidad a reponer es obligatoria")
    @Min(value = 1, message = "Debe reponer al menos 1 unidad")
    private int cantidadRepuesta;
}