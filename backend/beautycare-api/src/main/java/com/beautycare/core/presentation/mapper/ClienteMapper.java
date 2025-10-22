package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Cliente;
import com.beautycare.core.presentation.dto.ClienteDTO;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public ClienteDTO toDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setEmail(cliente.getEmail());
        dto.setCelular(cliente.getCelular());
        return dto;
    }

    public Cliente toEntity(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        // No se mapea el ID en la creación/actualización
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setCelular(dto.getCelular());
        return cliente;
    }

    public void updateEntityFromDTO(ClienteDTO dto, Cliente entity) {
        entity.setNombre(dto.getNombre());
        entity.setEmail(dto.getEmail());
        entity.setCelular(dto.getCelular());
    }
}