package com.beautycare.inventory.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProveedorDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255)
    private String nombre;

    @Size(max = 20)
    private String ruc;

    @Size(max = 20)
    private String telefono;
}