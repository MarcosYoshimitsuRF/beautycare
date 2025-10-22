package com.beautycare.inventory.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "consumo_insumo")
@Data
@NoArgsConstructor
public class ConsumoInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del servicio en la BD 'beautycare_db'.
     * NO es una FK, es un campo numérico desacoplado.
     * Esto es fundamental para la arquitectura de microservicios.
     */
    @Column(name = "servicio_id", nullable = false)
    private Long servicioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @Column(name = "cantidad_por_servicio", nullable = false)
    private BigDecimal cantidadPorServicio;
}