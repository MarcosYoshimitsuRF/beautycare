package com.beautycare.inventory.application;

import com.beautycare.inventory.domain.repository.InsumoRepository;
import com.beautycare.inventory.presentation.dto.InsumoDTO;
import com.beautycare.inventory.presentation.mapper.InsumoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteInsumoService {

    private final InsumoRepository insumoRepository;
    private final InsumoMapper insumoMapper;

    @Transactional(readOnly = true)
    public List<InsumoDTO> generarReporteStockBajo() {
        return insumoRepository.findInsumosBajoStock().stream()
                .map(insumoMapper::toDTO)
                .collect(Collectors.toList());
    }
}