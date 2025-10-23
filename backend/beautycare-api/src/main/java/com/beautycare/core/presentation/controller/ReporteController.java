package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.ReporteService;
import com.beautycare.core.presentation.dto.ReporteIngresosDTO;
import com.beautycare.core.presentation.dto.ReporteTopServicioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/ingresos")
    public ResponseEntity<ReporteIngresosDTO> getReporteIngresos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        return ResponseEntity.ok(reporteService.generarReporteIngresos(desde, hasta));
    }

    @GetMapping("/top-servicios")
    public ResponseEntity<List<ReporteTopServicioDTO>> getReporteTopServicios(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        return ResponseEntity.ok(reporteService.generarReporteTopServicios(desde, hasta));
    }
}