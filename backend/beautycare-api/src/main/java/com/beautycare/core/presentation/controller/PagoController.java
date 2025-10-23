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
@RequestMapping("/pagos")
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
        return ResponseEntity.ok(pagoService.listarPagos());
    }
}