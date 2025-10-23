package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Rol;
import com.beautycare.core.domain.model.Usuario;
import com.beautycare.core.presentation.dto.UsuarioDTO;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEnabled(usuario.isEnabled());
        dto.setRoles(usuario.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toSet()));
        return dto;
    }
}