package com.beautycare.inventory.application;

import com.beautycare.inventory.domain.model.Compra;
import com.beautycare.inventory.domain.model.Insumo;
import com.beautycare.inventory.domain.model.Proveedor;
import com.beautycare.inventory.domain.repository.CompraRepository;
import com.beautycare.inventory.domain.repository.InsumoRepository;
import com.beautycare.inventory.domain.repository.ProveedorRepository;
import com.beautycare.inventory.presentation.dto.CompraDTO;
import com.beautycare.inventory.presentation.mapper.CompraMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final InsumoRepository insumoRepository;
    private final CompraMapper compraMapper;

    @Transactional(readOnly = true)
    public List<CompraDTO> listarCompras() {
        return compraRepository.findAll().stream()
                .map(compraMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lógica de Negocio:
     * Al registrar una compra, reponemos el stock del insumo.
     */
    @Transactional
    public CompraDTO registrarCompraYReponerStock(CompraDTO compraDTO) {

        //Validar que el proveedor existe
        Proveedor proveedor = proveedorRepository.findById(compraDTO.getProveedorId())
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con ID: " + compraDTO.getProveedorId()));

        //Validar que el insumo existe
        Insumo insumo = insumoRepository.findById(compraDTO.getInsumoIdParaReponer())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado con ID: " + compraDTO.getInsumoIdParaReponer()));

        //Crear y guardar la entidad Compra
        Compra compra = compraMapper.toEntity(compraDTO);
        compra.setProveedor(proveedor);
        Compra compraGuardada = compraRepository.save(compra);

        //lógica de Reposición de Stock
        int stockActual = insumo.getStock();
        insumo.setStock(stockActual + compraDTO.getCantidadRepuesta());
        insumoRepository.save(insumo); // Actualiza el stock del insumo

        return compraMapper.toDTO(compraGuardada);
    }
}