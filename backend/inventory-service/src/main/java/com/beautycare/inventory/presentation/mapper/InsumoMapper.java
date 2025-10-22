package com.beautycare.inventory.presentation.mapper;

import com.beautycare.inventory.domain.model.Insumo;
import com.beautycare.inventory.presentation.dto.InsumoDTO;
import org.springframework.stereotype.Component;

@Component
public class InsumoMapper {

    public InsumoDTO toDTO(Insumo insumo) {
        InsumoDTO dto = new InsumoDTO();
        dto.setId(insumo.getId());
        dto.setNombre(insumo.getNombre());
        dto.setStock(insumo.getStock());
        dto.setStockMinimo(insumo.getStockMinimo());
        dto.setUnidad(insumo.getUnidad());
        return dto;
    }

    public Insumo toEntity(InsumoDTO dto) {
        Insumo insumo = new Insumo();
        insumo.setNombre(dto.getNombre());
        insumo.setStock(dto.getStock());
        insumo.setStockMinimo(dto.getStockMinimo());
        insumo.setUnidad(dto.getUnidad());
        return insumo;
    }

    public void updateEntityFromDTO(InsumoDTO dto, Insumo entity) {
        entity.setNombre(dto.getNombre());
        entity.setStock(dto.getStock());
        entity.setStockMinimo(dto.getStockMinimo());
        entity.setUnidad(dto.getUnidad());
    }
}