package com.beautycare.core.application;

import com.beautycare.core.domain.model.Servicio;
import com.beautycare.core.domain.repository.ServicioRepository;
import com.beautycare.core.presentation.dto.ServicioDTO;
import com.beautycare.core.presentation.mapper.ServicioMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final ServicioMapper servicioMapper;

    @Transactional(readOnly = true)
    public List<ServicioDTO> listarServicios() {
        return servicioRepository.findAll().stream()
                .map(servicioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServicioDTO obtenerServicioPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado con ID: " + id));
        return servicioMapper.toDTO(servicio);
    }

    @Transactional
    public ServicioDTO crearServicio(ServicioDTO servicioDTO) {
        Servicio servicio = servicioMapper.toEntity(servicioDTO);
        Servicio servicioGuardado = servicioRepository.save(servicio);
        return servicioMapper.toDTO(servicioGuardado);
    }

    @Transactional
    public ServicioDTO actualizarServicio(Long id, ServicioDTO servicioDTO) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado con ID: " + id));

        servicioMapper.updateEntityFromDTO(servicioDTO, servicio);

        Servicio servicioActualizado = servicioRepository.save(servicio);
        return servicioMapper.toDTO(servicioActualizado);
    }

    @Transactional
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new EntityNotFoundException("Servicio no encontrado con ID: " + id);
        }
        servicioRepository.deleteById(id);
    }
}