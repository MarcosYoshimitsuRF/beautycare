package com.beautycare.core.application;

import com.beautycare.core.domain.repository.CitaRepository;
import com.beautycare.core.domain.repository.PagoRepository;
import com.beautycare.core.presentation.dto.ReporteIngresosDTO;
import com.beautycare.core.presentation.dto.ReporteTopServicioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final PagoRepository pagoRepository;
    private final CitaRepository citaRepository;

    @Transactional(readOnly = true)
    public ReporteIngresosDTO generarReporteIngresos(LocalDateTime desde, LocalDateTime hasta) {
        BigDecimal ingresos = pagoRepository.sumIngresosBetweenDates(desde, hasta);
        Long cantidad = pagoRepository.countPagosBetweenDates(desde, hasta);
        return new ReporteIngresosDTO(ingresos, cantidad);
    }

    @Transactional(readOnly = true)
    public List<ReporteTopServicioDTO> generarReporteTopServicios(LocalDateTime desde, LocalDateTime hasta) {
        return citaRepository.findTopServiciosBetweenDates(desde, hasta);
    }
}