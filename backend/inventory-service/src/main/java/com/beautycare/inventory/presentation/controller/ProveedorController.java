package com.beautycare.inventory.presentation.controller;

import com.beautycare.inventory.application.ProveedorService;
import com.beautycare.inventory.presentation.dto.ProveedorDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/proveedores") // [fuente: 80]
@RequiredArgsConstructor
public class ProveedorController {

    private final ProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> listarProveedores() {
        return ResponseEntity.ok(proveedorService.listarProveedores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorDTO> obtenerProveedorPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.obtenerProveedorPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProveedorDTO> crearProveedor(@Valid @RequestBody ProveedorDTO proveedorDTO) {
        ProveedorDTO nuevoProveedor = proveedorService.crearProveedor(proveedorDTO);
        return new ResponseEntity<>(nuevoProveedor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> actualizarProveedor(@PathVariable Long id, @Valid @RequestBody ProveedorDTO proveedorDTO) {
        return ResponseEntity.ok(proveedorService.actualizarProveedor(id, proveedorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
        return ResponseEntity.noContent().build();
    }
}