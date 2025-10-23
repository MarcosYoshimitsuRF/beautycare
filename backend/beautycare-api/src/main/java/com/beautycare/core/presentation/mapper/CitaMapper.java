package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Cita;
import com.beautycare.core.presentation.dto.CitaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CitaMapper {

    // Inyectamos los mappers de las entidades anidadas (creados en Fase 3)
    private final ClienteMapper clienteMapper;
    private final ProfesionalMapper profesionalMapper;
    private final ServicioMapper servicioMapper;

    public CitaResponseDTO toDTO(Cita cita) {
        CitaResponseDTO dto = new CitaResponseDTO();
        dto.setId(cita.getId());
        dto.setFechaHoraInicio(cita.getFechaHoraInicio());
        dto.setFechaHoraFin(cita.getFechaHoraFin());
        dto.setEstado(cita.getEstado());

        // Mapeo anidado
        dto.setCliente(clienteMapper.toDTO(cita.getCliente()));
        dto.setProfesional(profesionalMapper.toDTO(cita.getProfesional()));
        dto.setServicio(servicioMapper.toDTO(cita.getServicio()));

        return dto;
    }


}