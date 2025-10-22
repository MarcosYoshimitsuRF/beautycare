package com.beautycare.core.config.security.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la solicitud de Login (POST /auth/login)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    @NotBlank(message = "El username no puede estar vacío")
    private String username;

    @NotBlank(message = "El password no puede estar vacío")
    private String password;
}