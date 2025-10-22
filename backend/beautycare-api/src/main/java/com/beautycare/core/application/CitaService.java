package com.beautycare.core.application;

import com.beautycare.core.domain.model.Cita;
import com.beautycare.core.domain.model.Cliente;
import com.beautycare.core.domain.model.Profesional;
import com.beautycare.core.domain.model.Servicio;
import com.beautycare.core.domain.repository.CitaRepository;
import com.beautycare.core.domain.repository.ClienteRepository;
import com.beautycare.core.domain.repository.ProfesionalRepository;
import com.beautycare.core.domain.repository.ServicioRepository;
import com.beautycare.core.presentation.dto.CitaRequestDTO;
import com.beautycare.core.presentation.dto.CitaResponseDTO;
import com.beautycare.core.presentation.exception.BusinessRuleException;
import com.beautycare.core.presentation.mapper.CitaMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ProfesionalRepository profesionalRepository;
    private final ServicioRepository servicioRepository;
    private final CitaMapper citaMapper;

    @Transactional
    public CitaResponseDTO crearCita(CitaRequestDTO requestDTO) {

        // 1. Buscar entidades relacionadas
        Cliente cliente = clienteRepository.findById(requestDTO.getClienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        Profesional profesional = profesionalRepository.findById(requestDTO.getProfesionalId())
                .orElseThrow(() -> new EntityNotFoundException("Profesional no encontrado"));
        Servicio servicio = servicioRepository.findById(requestDTO.getServicioId())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado"));

        // 2. Calcular datos de la cita
        LocalDateTime inicio = requestDTO.getFechaHoraInicio();
        LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMin());

        // 3. VALIDACIÓN DE NO SOLAPAMIENTO [fuente: 70]
        List<Cita> solapamientos = citaRepository.findOverlappingCitas(
                profesional.getId(), inicio, fin
        );

        if (!solapamientos.isEmpty()) {
            throw new BusinessRuleException("El profesional ya tiene una cita agendada en ese horario.");
        }

        // 4. Crear y guardar la Cita
        Cita nuevaCita = new Cita();
        nuevaCita.setCliente(cliente);
        nuevaCita.setProfesional(profesional);
        nuevaCita.setServicio(servicio);
        nuevaCita.setFechaHoraInicio(inicio);
        nuevaCita.setFechaHoraFin(fin);
        nuevaCita.setEstado("PENDIENTE"); // Estado inicial

        Cita citaGuardada = citaRepository.save(nuevaCita);

        return citaMapper.toDTO(citaGuardada);
    }

    @Transactional(readOnly = true)
    public List<CitaResponseDTO> listarCitas() {
        return citaRepository.findAll().stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CitaResponseDTO obtenerCitaPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + id));
        return citaMapper.toDTO(cita);
    }

    @Transactional
    public CitaResponseDTO actualizarEstadoCita(Long id, String nuevoEstado) {
        // Este endpoint se usará en Fase 5
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + id));

        cita.setEstado(nuevoEstado); // Ej. "REALIZADA"
        Cita citaActualizada = citaRepository.save(cita);

        return citaMapper.toDTO(citaActualizada);
    }
}