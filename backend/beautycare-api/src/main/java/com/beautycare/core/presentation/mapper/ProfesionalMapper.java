package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Profesional;
import com.beautycare.core.presentation.dto.ProfesionalDTO;
import org.springframework.stereotype.Component;

@Component
public class ProfesionalMapper {

    public ProfesionalDTO toDTO(Profesional profesional) {
        ProfesionalDTO dto = new ProfesionalDTO();
        dto.setId(profesional.getId());
        dto.setNombre(profesional.getNombre());
        dto.setEspecialidad(profesional.getEspecialidad());
        return dto;
    }

    public Profesional toEntity(ProfesionalDTO dto) {
        Profesional profesional = new Profesional();
        profesional.setNombre(dto.getNombre());
        profesional.setEspecialidad(dto.getEspecialidad());
        return profesional;
    }

    public void updateEntityFromDTO(ProfesionalDTO dto, Profesional entity) {
        entity.setNombre(dto.getNombre());
        entity.setEspecialidad(dto.getEspecialidad());
    }
}