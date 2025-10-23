package com.beautycare.inventory.presentation.controller;

import com.beautycare.inventory.application.ReporteInsumoService;
import com.beautycare.inventory.presentation.dto.InsumoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/reportes") // Protegido por SecurityConfig (ADMIN)
@RequiredArgsConstructor
public class ReporteInsumoController {

    private final ReporteInsumoService reporteInsumoService;

    @GetMapping("/insumos-bajo-stock")
    public ResponseEntity<List<InsumoDTO>> getReporteStockBajo() {
        return ResponseEntity.ok(reporteInsumoService.generarReporteStockBajo());
    }
}