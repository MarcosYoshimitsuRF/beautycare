package com.beautycare.inventory.presentation.controller;

import com.beautycare.inventory.application.CompraService;
import com.beautycare.inventory.presentation.dto.CompraDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/compras") // [fuente: 82]
@RequiredArgsConstructor
public class CompraController {

    private final CompraService compraService;

    @GetMapping
    public ResponseEntity<List<CompraDTO>> listarCompras() {
        return ResponseEntity.ok(compraService.listarCompras());
    }

    @PostMapping
    public ResponseEntity<CompraDTO> registrarCompra(@Valid @RequestBody CompraDTO compraDTO) {
        // Este método cumple el requisito de "registra compra y repone stock" [fuente: 82]
        CompraDTO compraRegistrada = compraService.registrarCompraYReponerStock(compraDTO);
        return new ResponseEntity<>(compraRegistrada, HttpStatus.CREATED);
    }

    // NOTA: Los endpoints PUT y DELETE para 'Compra' no están especificados
    // en los requisitos de la Fase 3, por lo que solo se implementa GET y POST.
}