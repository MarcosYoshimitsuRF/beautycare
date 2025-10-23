package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    boolean existsByCitaId(Long citaId);

    /**
     * Query para reporte de ingresos [fuente: 73].
     * Suma los montos y cuenta los pagos en un rango de fechas.
     */
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