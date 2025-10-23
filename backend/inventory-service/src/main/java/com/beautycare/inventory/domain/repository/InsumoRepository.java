package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    /**
     * Query para reporte de stock bajo [fuente: 86].
     * Busca insumos donde el stock actual es menor o igual al stock mínimo.
     */
    @Query("SELECT i FROM Insumo i WHERE i.stock <= i.stockMinimo")
    List<Insumo> findInsumosBajoStock();
}