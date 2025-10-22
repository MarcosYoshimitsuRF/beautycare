package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
}