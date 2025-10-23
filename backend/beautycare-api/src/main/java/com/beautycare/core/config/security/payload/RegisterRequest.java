package com.beautycare.core.config.security.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 100, message = "El username debe tener entre 3 y 100 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

}