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

        // 1. VALIDACIÓN DE DOBLE PAGO [fuente: 71]
        if (pagoRepository.existsByCitaId(requestDTO.getCitaId())) {
            throw new BusinessRuleException("Ya existe un pago registrado para la cita ID: " + requestDTO.getCitaId());
        }

        // 2. Buscar Cita
        Cita cita = citaRepository.findById(requestDTO.getCitaId())
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + requestDTO.getCitaId()));

        // (Opcional: Validar que el monto del pago coincida con el precio del servicio de la cita)
        // if (requestDTO.getMonto().compareTo(cita.getServicio().getPrecio()) != 0) {
        //    throw new BusinessRuleException("El monto del pago no coincide con el precio del servicio.");
        // }

        // 3. Crear y guardar el Pago
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