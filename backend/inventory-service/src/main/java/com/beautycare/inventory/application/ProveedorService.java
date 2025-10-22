package com.beautycare.inventory.application;

import com.beautycare.inventory.domain.model.Proveedor;
import com.beautycare.inventory.domain.repository.ProveedorRepository;
import com.beautycare.inventory.presentation.dto.ProveedorDTO;
import com.beautycare.inventory.presentation.mapper.ProveedorMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    @Transactional(readOnly = true)
    public List<ProveedorDTO> listarProveedores() {
        return proveedorRepository.findAll().stream()
                .map(proveedorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProveedorDTO obtenerProveedorPorId(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con ID: " + id));
        return proveedorMapper.toDTO(proveedor);
    }

    @Transactional
    public ProveedorDTO crearProveedor(ProveedorDTO proveedorDTO) {
        Proveedor proveedor = proveedorMapper.toEntity(proveedorDTO);
        Proveedor proveedorGuardado = proveedorRepository.save(proveedor);
        return proveedorMapper.toDTO(proveedorGuardado);
    }

    @Transactional
    public ProveedorDTO actualizarProveedor(Long id, ProveedorDTO proveedorDTO) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con ID: " + id));

        proveedorMapper.updateEntityFromDTO(proveedorDTO, proveedor);

        Proveedor proveedorActualizado = proveedorRepository.save(proveedor);
        return proveedorMapper.toDTO(proveedorActualizado);
    }

    @Transactional
    public void eliminarProveedor(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new EntityNotFoundException("Proveedor no encontrado con ID: " + id);
        }
        proveedorRepository.deleteById(id);
    }
}