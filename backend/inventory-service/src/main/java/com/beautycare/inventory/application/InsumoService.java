package com.beautycare.inventory.application;

import com.beautycare.inventory.domain.model.Insumo;
import com.beautycare.inventory.domain.repository.InsumoRepository;
import com.beautycare.inventory.presentation.dto.InsumoDTO;
import com.beautycare.inventory.presentation.mapper.InsumoMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsumoService {

    private final InsumoRepository insumoRepository;
    private final InsumoMapper insumoMapper;

    @Transactional(readOnly = true)
    public List<InsumoDTO> listarInsumos() {
        return insumoRepository.findAll().stream()
                .map(insumoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InsumoDTO obtenerInsumoPorId(Long id) {
        Insumo insumo = insumoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado con ID: " + id));
        return insumoMapper.toDTO(insumo);
    }

    @Transactional
    public InsumoDTO crearInsumo(InsumoDTO insumoDTO) {
        Insumo insumo = insumoMapper.toEntity(insumoDTO);
        Insumo insumoGuardado = insumoRepository.save(insumo);
        return insumoMapper.toDTO(insumoGuardado);
    }

    @Transactional
    public InsumoDTO actualizarInsumo(Long id, InsumoDTO insumoDTO) {
        Insumo insumo = insumoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado con ID: " + id));

        insumoMapper.updateEntityFromDTO(insumoDTO, insumo);

        Insumo insumoActualizado = insumoRepository.save(insumo);
        return insumoMapper.toDTO(insumoActualizado);
    }

    @Transactional
    public void eliminarInsumo(Long id) {
        if (!insumoRepository.existsById(id)) {
            throw new EntityNotFoundException("Insumo no encontrado con ID: " + id);
        }
        insumoRepository.deleteById(id);
    }
}