package com.beautycare.core.presentation.mapper;

import com.beautycare.core.domain.model.Pago;
import com.beautycare.core.presentation.dto.PagoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class PagoMapper {

    public PagoResponseDTO toDTO(Pago pago) {
        PagoResponseDTO dto = new PagoResponseDTO();
        dto.setId(pago.getId());
        dto.setCitaId(pago.getCita().getId());
        dto.setMonto(pago.getMonto());
        dto.setMetodo(pago.getMetodo());
        dto.setFechaHora(pago.getFechaHora());
        return dto;
    }
}