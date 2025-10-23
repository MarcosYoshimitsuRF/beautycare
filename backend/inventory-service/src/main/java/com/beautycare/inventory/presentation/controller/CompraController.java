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
        CompraDTO compraRegistrada = compraService.registrarCompraYReponerStock(compraDTO);
        return new ResponseEntity<>(compraRegistrada, HttpStatus.CREATED);
    }

}