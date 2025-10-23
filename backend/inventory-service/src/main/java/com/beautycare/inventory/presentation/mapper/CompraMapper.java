package com.beautycare.inventory.presentation.mapper;

import com.beautycare.inventory.domain.model.Compra;
import com.beautycare.inventory.presentation.dto.CompraDTO;
import org.springframework.stereotype.Component;

@Component
public class CompraMapper {

    // Mapeo para GET (mostrar Compra)
    public CompraDTO toDTO(Compra compra) {
        CompraDTO dto = new CompraDTO();
        dto.setId(compra.getId());
        dto.setFecha(compra.getFecha());
        dto.setTotal(compra.getTotal());
        if (compra.getProveedor() != null) {
            dto.setProveedorId(compra.getProveedor().getId());
            dto.setProveedorNombre(compra.getProveedor().getNombre());
        }
        // Los campos de reposición no se devuelven en el DTO de respuesta
        dto.setInsumoIdParaReponer(null);
        dto.setCantidadRepuesta(0);
        return dto;
    }

    // Mapeo para POST (Crear Compra)
    public Compra toEntity(CompraDTO dto) {
        Compra compra = new Compra();
        compra.setFecha(dto.getFecha());
        compra.setTotal(dto.getTotal());
        // El Proveedor se asignará en el Servicio
        return compra;
    }
}