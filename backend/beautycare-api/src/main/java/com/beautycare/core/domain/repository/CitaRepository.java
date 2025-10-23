package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Cita;
import com.beautycare.core.presentation.dto.ReporteTopServicioDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    @Query("SELECT c FROM Cita c " +
            "WHERE c.profesional.id = :profesionalId " +
            "AND c.fechaHoraInicio < :nuevoFin " +
            "AND c.fechaHoraFin > :nuevoInicio")
    List<Cita> findOverlappingCitas(
            @Param("profesionalId") Long profesionalId,
            @Param("nuevoInicio") LocalDateTime nuevoInicio,
            @Param("nuevoFin") LocalDateTime nuevoFin
    );

    /**
     * Query para reporte top servicios [fuente: 74].
     * Agrupa por servicio y cuenta las citas (ej. PENDIENTE o REALIZADA).
     */
    @Query("SELECT new com.beautycare.core.presentation.dto.ReporteTopServicioDTO(s.id, s.nombre, COUNT(c)) " +
            "FROM Cita c JOIN c.servicio s " +
            "WHERE c.fechaHoraInicio BETWEEN :desde AND :hasta " +
            "AND (c.estado = 'PENDIENTE' OR c.estado = 'REALIZADA') " +
            "GROUP BY s.id, s.nombre " +
            "ORDER BY COUNT(c) DESC")
    List<ReporteTopServicioDTO> findTopServiciosBetweenDates(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );
}