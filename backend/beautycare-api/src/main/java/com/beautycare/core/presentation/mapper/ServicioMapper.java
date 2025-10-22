package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Servicio;
import com.beautycare.core.presentation.dto.ServicioDTO;
import org.springframework.stereotype.Component;

@Component
public class ServicioMapper {

    public ServicioDTO toDTO(Servicio servicio) {
        ServicioDTO dto = new ServicioDTO();
        dto.setId(servicio.getId());
        dto.setNombre(servicio.getNombre());
        dto.setPrecio(servicio.getPrecio());
        dto.setDuracionMin(servicio.getDuracionMin());
        return dto;
    }

    public Servicio toEntity(ServicioDTO dto) {
        Servicio servicio = new Servicio();
        servicio.setNombre(dto.getNombre());
        servicio.setPrecio(dto.getPrecio());
        servicio.setDuracionMin(dto.getDuracionMin());
        return servicio;
    }

    public void updateEntityFromDTO(ServicioDTO dto, Servicio entity) {
        entity.setNombre(dto.getNombre());
        entity.setPrecio(dto.getPrecio());
        entity.setDuracionMin(dto.getDuracionMin());
    }
}