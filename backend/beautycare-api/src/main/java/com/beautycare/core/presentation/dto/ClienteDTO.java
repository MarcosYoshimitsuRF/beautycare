package com.beautycare.core.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 255, message = "El nombre debe tener entre 3 y 255 caracteres")
    private String nombre;

    @Size(max = 20, message = "El celular no debe exceder los 20 caracteres")
    private String celular;

    @Email(message = "Debe ser un formato de email válido")
    @Size(max = 100, message = "El email no debe exceder los 100 caracteres")
    private String email;
}