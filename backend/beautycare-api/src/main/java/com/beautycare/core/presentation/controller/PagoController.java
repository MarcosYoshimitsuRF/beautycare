package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.PagoService;
import com.beautycare.core.presentation.dto.PagoRequestDTO;
import com.beautycare.core.presentation.dto.PagoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos") // Protegido por SecurityConfig (Autenticado)
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @PostMapping
    public ResponseEntity<PagoResponseDTO> registrarPago(@Valid @RequestBody PagoRequestDTO requestDTO) {
        PagoResponseDTO nuevoPago = pagoService.registrarPago(requestDTO);
        return new ResponseEntity<>(nuevoPago, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PagoResponseDTO>> listarPagos() {
        // (Filtros GET no especificados, se listan todos) [fuente: 71]
        return ResponseEntity.ok(pagoService.listarPagos());
    }
}