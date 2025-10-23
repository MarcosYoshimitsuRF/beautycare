package com.beautycare.inventory.presentation.controller;

import com.beautycare.inventory.application.ConsumoService;
import com.beautycare.inventory.presentation.dto.ConsumoResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory/consumo")
@RequiredArgsConstructor
public class ConsumoController {

    private final ConsumoService consumoService;

    @PostMapping("/registrar-por-servicio/{servicio_id}")
    public ResponseEntity<ConsumoResponseDTO> registrarConsumo(@PathVariable("servicio_id") Long servicioId) {

        ConsumoResponseDTO response = consumoService.registrarConsumoPorServicio(servicioId);
        return ResponseEntity.ok(response);
    }
}