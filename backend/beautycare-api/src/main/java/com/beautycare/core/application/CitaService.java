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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // Añadimos Logger para ver la llamada interna
public class CitaService {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ProfesionalRepository profesionalRepository;
    private final ServicioRepository servicioRepository;
    private final CitaMapper citaMapper;

    // Inyección del WebClient (configurado en WebClientConfig)
    private final WebClient inventoryWebClient;

    @Transactional
    public CitaResponseDTO crearCita(CitaRequestDTO requestDTO) {

        Cliente cliente = clienteRepository.findById(requestDTO.getClienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        Profesional profesional = profesionalRepository.findById(requestDTO.getProfesionalId())
                .orElseThrow(() -> new EntityNotFoundException("Profesional no encontrado"));
        Servicio servicio = servicioRepository.findById(requestDTO.getServicioId())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado"));

        LocalDateTime inicio = requestDTO.getFechaHoraInicio();
        LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMin());

        List<Cita> solapamientos = citaRepository.findOverlappingCitas(
                profesional.getId(), inicio, fin
        );

        if (!solapamientos.isEmpty()) {
            throw new BusinessRuleException("El profesional ya tiene una cita agendada en ese horario.");
        }

        Cita nuevaCita = new Cita();
        nuevaCita.setCliente(cliente);
        nuevaCita.setProfesional(profesional);
        nuevaCita.setServicio(servicio);
        nuevaCita.setFechaHoraInicio(inicio);
        nuevaCita.setFechaHoraFin(fin);
        nuevaCita.setEstado("PENDIENTE");

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
    public CitaResponseDTO actualizarEstadoCita(Long id, String nuevoEstado, String authHeader) {

        // 1. Actualizar la cita en la BD local
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con ID: " + id));

        cita.setEstado(nuevoEstado);
        Cita citaActualizada = citaRepository.save(cita);
        log.info("Cita {} actualizada al estado {}", id, nuevoEstado);

        // 2. FLUJO DE MICROSERVICIO [fuente: 91]
        // Si el estado es "REALIZADA", llamar a inventory-service
        if (nuevoEstado.equalsIgnoreCase("REALIZADA")) {

            Long servicioId = citaActualizada.getServicio().getId();
            log.info("Iniciando llamada a inventory-service para descontar stock del servicio ID: {}", servicioId);

            try {
                // 3. Realizar la llamada interna con WebClient [fuente: 94, 130]
                String responseBody = inventoryWebClient.post()
                        .uri("/api/inventory/consumo/registrar-por-servicio/" + servicioId)
                        .header(HttpHeaders.AUTHORIZATION, authHeader) // Reenviamos el JWT
                        .retrieve()
                        .bodyToMono(String.class) // Esperamos una respuesta (ej. el ConsumoResponseDTO como JSON)
                        .block(); // Hacemos la llamada síncrona/bloqueante

                log.info("Respuesta de inventory-service: {}", responseBody);

            } catch (Exception e) {
                // Si el microservicio falla (ej. 400 por falta de stock),
                // lanzamos una excepción para revertir la transacción (Rollback)
                log.error("Error al llamar a inventory-service: {}", e.getMessage());
                throw new BusinessRuleException("Error al descontar stock: " + e.getMessage());
            }
        }

        return citaMapper.toDTO(citaActualizada);
    }
}