package com.beautycare.inventory.presentation.mapper;

import com.beautycare.inventory.domain.model.Proveedor;
import com.beautycare.inventory.presentation.dto.ProveedorDTO;
import org.springframework.stereotype.Component;

@Component
public class ProveedorMapper {

    public ProveedorDTO toDTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setNombre(proveedor.getNombre());
        dto.setRuc(proveedor.getRuc());
        dto.setTelefono(proveedor.getTelefono());
        return dto;
    }

    public Proveedor toEntity(ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(dto.getNombre());
        proveedor.setRuc(dto.getRuc());
        proveedor.setTelefono(dto.getTelefono());
        return proveedor;
    }

    public void updateEntityFromDTO(ProveedorDTO dto, Proveedor entity) {
        entity.setNombre(dto.getNombre());
        entity.setRuc(dto.getRuc());
        entity.setTelefono(dto.getTelefono());
    }
}