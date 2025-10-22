package com.beautycare.core.application;

import com.beautycare.core.domain.model.Profesional;
import com.beautycare.core.domain.repository.ProfesionalRepository;
import com.beautycare.core.presentation.dto.ProfesionalDTO;
import com.beautycare.core.presentation.mapper.ProfesionalMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;
    private final ProfesionalMapper profesionalMapper;

    @Transactional(readOnly = true)
    public List<ProfesionalDTO> listarProfesionales() {
        return profesionalRepository.findAll().stream()
                .map(profesionalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProfesionalDTO obtenerProfesionalPorId(Long id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profesional no encontrado con ID: " + id));
        return profesionalMapper.toDTO(profesional);
    }

    @Transactional
    public ProfesionalDTO crearProfesional(ProfesionalDTO profesionalDTO) {
        Profesional profesional = profesionalMapper.toEntity(profesionalDTO);
        Profesional profesionalGuardado = profesionalRepository.save(profesional);
        return profesionalMapper.toDTO(profesionalGuardado);
    }

    @Transactional
    public ProfesionalDTO actualizarProfesional(Long id, ProfesionalDTO profesionalDTO) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profesional no encontrado con ID: " + id));

        profesionalMapper.updateEntityFromDTO(profesionalDTO, profesional);

        Profesional profesionalActualizado = profesionalRepository.save(profesional);
        return profesionalMapper.toDTO(profesionalActualizado);
    }

    @Transactional
    public void eliminarProfesional(Long id) {
        if (!profesionalRepository.existsById(id)) {
            throw new EntityNotFoundException("Profesional no encontrado con ID: " + id);
        }
        profesionalRepository.deleteById(id);
    }
}