package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.CitaService;
import com.beautycare.core.presentation.dto.CitaRequestDTO;
import com.beautycare.core.presentation.dto.CitaResponseDTO;
import com.beautycare.core.presentation.exception.BusinessRuleException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @PostMapping
    public ResponseEntity<CitaResponseDTO> crearCita(@Valid @RequestBody CitaRequestDTO requestDTO) {
        CitaResponseDTO nuevaCita = citaService.crearCita(requestDTO);
        return new ResponseEntity<>(nuevaCita, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CitaResponseDTO>> listarCitas() {
        return ResponseEntity.ok(citaService.listarCitas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> obtenerCitaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.obtenerCitaPorId(id));
    }

    /**
     * Endpoint para actualizar estado
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<CitaResponseDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            // 1. Capturamos el encabezado Authorization (JWT)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new BusinessRuleException("El 'estado' es obligatorio en el body.");
        }

        // Pasamos el token al servicio
        CitaResponseDTO citaActualizada = citaService.actualizarEstadoCita(id, nuevoEstado.toUpperCase(), authHeader);
        return ResponseEntity.ok(citaActualizada);
    }
}