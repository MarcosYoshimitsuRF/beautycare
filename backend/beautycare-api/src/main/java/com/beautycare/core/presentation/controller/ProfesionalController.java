package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.ProfesionalService;
import com.beautycare.core.presentation.dto.ProfesionalDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    @GetMapping
    public ResponseEntity<List<ProfesionalDTO>> listarProfesionales() {
        return ResponseEntity.ok(profesionalService.listarProfesionales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> obtenerProfesionalPorId(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.obtenerProfesionalPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProfesionalDTO> crearProfesional(@Valid @RequestBody ProfesionalDTO profesionalDTO) {
        ProfesionalDTO nuevoProfesional = profesionalService.crearProfesional(profesionalDTO);
        return new ResponseEntity<>(nuevoProfesional, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> actualizarProfesional(@PathVariable Long id, @Valid @RequestBody ProfesionalDTO profesionalDTO) {
        return ResponseEntity.ok(profesionalService.actualizarProfesional(id, profesionalDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProfesional(@PathVariable Long id) {
        profesionalService.eliminarProfesional(id);
        return ResponseEntity.noContent().build();
    }
}