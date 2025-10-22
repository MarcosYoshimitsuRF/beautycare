package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {
}