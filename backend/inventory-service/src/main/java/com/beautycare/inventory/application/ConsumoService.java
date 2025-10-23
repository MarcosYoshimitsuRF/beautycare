package com.beautycare.inventory.application;

import com.beautycare.inventory.domain.model.ConsumoInsumo;
import com.beautycare.inventory.domain.model.Insumo;
import com.beautycare.inventory.domain.repository.ConsumoInsumoRepository;
import com.beautycare.inventory.domain.repository.InsumoRepository;
import com.beautycare.inventory.presentation.dto.ConsumoResponseDTO;
import com.beautycare.inventory.presentation.exception.BusinessRuleException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsumoService {

    private final ConsumoInsumoRepository consumoInsumoRepository;
    private final InsumoRepository insumoRepository;

    /**
     * Lógica de negocio para descontar stock [fuente: 131].
     * Busca las reglas de consumo para un servicio y descuenta
     * el stock de los insumos correspondientes.
     */
    @Transactional
    public ConsumoResponseDTO registrarConsumoPorServicio(Long servicioId) {

        // 1. Buscar las reglas de consumo para este servicio
        List<ConsumoInsumo> reglasDeConsumo = consumoInsumoRepository.findByServicioId(servicioId);

        if (reglasDeConsumo.isEmpty()) {
            // No es un error, simplemente este servicio no consume insumos
            return new ConsumoResponseDTO("OK", "El servicio no tiene insumos configurados.", 0);
        }

        // 2. Iterar y descontar stock
        for (ConsumoInsumo regla : reglasDeConsumo) {
            Insumo insumo = regla.getInsumo();
            if (insumo == null) {
                throw new EntityNotFoundException("Insumo asociado a la regla " + regla.getId() + " no encontrado.");
            }

            // Convertimos la cantidad (BigDecimal) a int para el stock (asumiendo stock en unidades)
            // (Si el stock fuera decimal, se ajustaría Insumo.stock)
            int cantidadADescontar = regla.getCantidadPorServicio().intValue();

            // 3. Validación de Stock
            if (insumo.getStock() < cantidadADescontar) {
                throw new BusinessRuleException("Stock insuficiente para el insumo: " + insumo.getNombre() +
                        ". Stock actual: " + insumo.getStock() + ", Requerido: " + cantidadADescontar);
            }

            // 4. Descontar y guardar
            insumo.setStock(insumo.getStock() - cantidadADescontar);
            insumoRepository.save(insumo);
        }

        return new ConsumoResponseDTO("OK", "Stock descontado exitosamente.", reglasDeConsumo.size());
    }
}