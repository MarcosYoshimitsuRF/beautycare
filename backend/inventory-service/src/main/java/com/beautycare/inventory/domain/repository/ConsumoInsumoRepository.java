package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.ConsumoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumoInsumoRepository extends JpaRepository<ConsumoInsumo, Long> {
}