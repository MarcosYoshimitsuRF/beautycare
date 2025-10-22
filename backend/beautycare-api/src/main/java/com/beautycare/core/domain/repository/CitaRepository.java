package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    /**
     * Query para validación de solapamiento [fuente: 70].
     * Busca citas de un profesional donde el rango de tiempo (inicio, fin)
     * se solapa con el nuevo rango solicitado.
     *
     * Lógica: (NuevaCita.Inicio < CitaExistente.Fin) AND (NuevaCita.Fin > CitaExistente.Inicio)
     */
    @Query("SELECT c FROM Cita c " +
            "WHERE c.profesional.id = :profesionalId " +
            "AND c.fechaHoraInicio < :nuevoFin " +
            "AND c.fechaHoraFin > :nuevoInicio")
    List<Cita> findOverlappingCitas(
            @Param("profesionalId") Long profesionalId,
            @Param("nuevoInicio") LocalDateTime nuevoInicio,
            @Param("nuevoFin") LocalDateTime nuevoFin
    );
}