package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    /**
     * Query para validación de doble pago [fuente: 71].
     */
    boolean existsByCitaId(Long citaId);
}