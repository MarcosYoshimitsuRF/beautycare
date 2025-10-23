package com.beautycare.core.application;

import com.beautycare.core.domain.model.Cita;
import com.beautycare.core.domain.model.Pago;
import com.beautycare.core.domain.repository.CitaRepository;
import com.beautycare.core.domain.repository.PagoRepository;
import com.beautycare.core.presentation.dto.PagoRequestDTO;
import com.beautycare.core.presentation.dto.PagoResponseDTO;
import com.beautycare.core.presentation.exception.BusinessRuleException;
import com.beautycare.core.presentation.mapper.PagoMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final CitaRepository citaRepository;
    private final PagoMapper pagoMapper;

    @Transactional
    public PagoResponseDTO registrarPago(PagoRequestDTO requestDTO) {

        //VALIDACIÓN DE DOBLE PAGO [fuente: 71]
        if (pagoRepository.existsByCitaId(requestDTO.getCitaId())) {
            throw new BusinessRuleException("Ya existe un pago registrado para la cita ID: " + requestDTO.getCitaId());
        }

        //Buscar Cita
        Cita cita = citaRepository.findById(requestDTO.getCitaId())
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + requestDTO.getCitaId()));

        Pago nuevoPago = new Pago();
        nuevoPago.setCita(cita);
        nuevoPago.setMonto(requestDTO.getMonto());
        nuevoPago.setMetodo(requestDTO.getMetodo());
        nuevoPago.setFechaHora(LocalDateTime.now()); // Fecha actual

        Pago pagoGuardado = pagoRepository.save(nuevoPago);

        return pagoMapper.toDTO(pagoGuardado);
    }

    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPagos() {
        return pagoRepository.findAll().stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }
}