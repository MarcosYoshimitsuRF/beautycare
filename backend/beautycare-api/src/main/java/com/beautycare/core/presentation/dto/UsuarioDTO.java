package com.beautycare.core.presentation.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UsuarioDTO {
    private Long id;
    private String username;
    private boolean enabled;
    private Set<String> roles; // Devolvemos solo los nombres de los roles
}