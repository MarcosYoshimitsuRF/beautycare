package com.beautycare.inventory.presentation.controller;

import com.beautycare.inventory.application.InsumoService;
import com.beautycare.inventory.presentation.dto.InsumoDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/insumos") // [fuente: 80]
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService insumoService;

    @GetMapping
    public ResponseEntity<List<InsumoDTO>> listarInsumos() {
        return ResponseEntity.ok(insumoService.listarInsumos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsumoDTO> obtenerInsumoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(insumoService.obtenerInsumoPorId(id));
    }

    @PostMapping
    public ResponseEntity<InsumoDTO> crearInsumo(@Valid @RequestBody InsumoDTO insumoDTO) {
        InsumoDTO nuevoInsumo = insumoService.crearInsumo(insumoDTO);
        return new ResponseEntity<>(nuevoInsumo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsumoDTO> actualizarInsumo(@PathVariable Long id, @Valid @RequestBody InsumoDTO insumoDTO) {
        return ResponseEntity.ok(insumoService.actualizarInsumo(id, insumoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInsumo(@PathVariable Long id) {
        insumoService.eliminarInsumo(id);
        return ResponseEntity.noContent().build();
    }
}