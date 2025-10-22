package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {
}