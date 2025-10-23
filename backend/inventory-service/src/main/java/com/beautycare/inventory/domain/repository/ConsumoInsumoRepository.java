package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.ConsumoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsumoInsumoRepository extends JpaRepository<ConsumoInsumo, Long> {

    /**
     * Busca todas las reglas de consumo asociadas a un ID de servicio.
     * El servicioId proviene de la base de datos 'beautycare_db'.
     */
    List<ConsumoInsumo> findByServicioId(Long servicioId);
}