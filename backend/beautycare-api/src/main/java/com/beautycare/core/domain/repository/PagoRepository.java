package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    boolean existsByCitaId(Long citaId);


    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p " +
            "WHERE p.fechaHora BETWEEN :desde AND :hasta")
    BigDecimal sumIngresosBetweenDates(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );

    @Query("SELECT COUNT(p) FROM Pago p " +
            "WHERE p.fechaHora BETWEEN :desde AND :hasta")
    Long countPagosBetweenDates(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );
}