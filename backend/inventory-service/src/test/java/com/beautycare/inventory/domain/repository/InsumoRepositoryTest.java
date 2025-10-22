package com.beautycare.inventory.domain.repository;

import com.beautycare.inventory.domain.model.Insumo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de persistencia para la entidad Insumo.
 */
@DataJpaTest
public class InsumoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private InsumoRepository insumoRepository;

    @Test
    public void whenSaveInsumo_thenShouldFindById() {
        // 1. Arrange
        Insumo nuevoInsumo = new Insumo();
        nuevoInsumo.setNombre("Shampoo Hidratante");
        nuevoInsumo.setStock(100);
        nuevoInsumo.setStockMinimo(20);
        nuevoInsumo.setUnidad("ml");

        Insumo insumoGuardado = entityManager.persistAndFlush(nuevoInsumo);

        // 2. Act
        Insumo insumoEncontrado = insumoRepository.findById(insumoGuardado.getId()).orElse(null);

        // 3. Assert
        assertThat(insumoEncontrado).isNotNull();
        assertThat(insumoEncontrado.getNombre()).isEqualTo("Shampoo Hidratante");
        assertThat(insumoEncontrado.getStock()).isEqualTo(100);
    }

    @Test
    public void whenUpdateStock_thenShouldReflectChanges() {
        // 1. Arrange
        Insumo insumo = new Insumo();
        insumo.setNombre("Acondicionador");
        insumo.setStock(50);
        insumo.setStockMinimo(10);
        insumo.setUnidad("ml");
        Insumo insumoPersistido = entityManager.persistAndFlush(insumo);

        // 2. Act
        Insumo insumoAActualizar = insumoRepository.findById(insumoPersistido.getId()).get();
        insumoAActualizar.setStock(45); // Simulamos un consumo
        insumoRepository.save(insumoAActualizar);

        entityManager.flush();
        entityManager.clear();

        Insumo insumoActualizado = insumoRepository.findById(insumoPersistido.getId()).get();

        // 3. Assert
        assertThat(insumoActualizado.getId()).isEqualTo(insumoPersistido.getId());
        assertThat(insumoActualizado.getStock()).isEqualTo(45);
    }

    @Test
    public void whenDeleteInsumo_thenShouldNotExist() {
        // 1. Arrange
        Insumo insumo = new Insumo();
        insumo.setNombre("Tinte Rojo");
        insumo.setStock(30);
        insumo.setStockMinimo(5);
        Insumo insumoPersistido = entityManager.persistAndFlush(insumo);

        Long idInsumo = insumoPersistido.getId();
        assertThat(insumoRepository.existsById(idInsumo)).isTrue();

        // 2. Act
        insumoRepository.deleteById(idInsumo);
        entityManager.flush();

        // 3. Assert
        assertThat(insumoRepository.existsById(idInsumo)).isFalse();
    }
}