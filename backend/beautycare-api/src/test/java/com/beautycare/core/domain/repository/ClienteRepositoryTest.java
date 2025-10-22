package com.beautycare.core.domain.repository;

import com.beautycare.core.domain.model.Cliente;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de persistencia para la entidad Cliente.
 * @DataJpaTest configura una BBDD H2 en memoria y revierte transacciones.
 */
@DataJpaTest
public class ClienteRepositoryTest {

    @Autowired
    private TestEntityManager entityManager; // Utilidad para persistir datos en tests

    @Autowired
    private ClienteRepository clienteRepository; // El repositorio que estamos probando

    @Test
    public void whenSaveCliente_thenShouldFindById() {
        // 1. Arrange (Preparar)
        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setNombre("Ana Lopez");
        nuevoCliente.setEmail("ana.lopez@test.com");
        nuevoCliente.setCelular("987654321");

        // Persistimos la entidad y la guardamos en la BBDD
        Cliente clienteGuardado = entityManager.persistAndFlush(nuevoCliente);

        // 2. Act (Actuar)
        // Buscamos el cliente usando el repositorio
        Cliente clienteEncontrado = clienteRepository.findById(clienteGuardado.getId()).orElse(null);

        // 3. Assert (Verificar)
        assertThat(clienteEncontrado).isNotNull();
        assertThat(clienteEncontrado.getId()).isEqualTo(clienteGuardado.getId());
        assertThat(clienteEncontrado.getNombre()).isEqualTo("Ana Lopez");
    }

    @Test
    public void whenUpdateCliente_thenShouldReflectChanges() {
        // 1. Arrange (Preparar)
        Cliente cliente = new Cliente();
        cliente.setNombre("Carlos Ruiz");
        cliente.setEmail("carlos.ruiz@test.com");
        Cliente clientePersistido = entityManager.persistAndFlush(cliente);

        // 2. Act (Actuar)
        // Obtenemos el cliente, lo modificamos y guardamos
        Cliente clienteAActualizar = clienteRepository.findById(clientePersistido.getId()).get();
        clienteAActualizar.setNombre("Carlos Alberto Ruiz");
        clienteRepository.save(clienteAActualizar);

        // Limpiamos el caché de persistencia para asegurar que leemos desde la BBDD
        entityManager.flush();
        entityManager.clear();

        Cliente clienteActualizado = clienteRepository.findById(clientePersistido.getId()).get();

        // 3. Assert (Verificar)
        assertThat(clienteActualizado.getId()).isEqualTo(clientePersistido.getId());
        assertThat(clienteActualizado.getNombre()).isEqualTo("Carlos Alberto Ruiz");
    }

    @Test
    public void whenDeleteCliente_thenShouldNotExist() {
        // 1. Arrange (Preparar)
        Cliente cliente = new Cliente();
        cliente.setNombre("Usuario Borrar");
        cliente.setEmail("borrar@test.com");
        Cliente clientePersistido = entityManager.persistAndFlush(cliente);

        Long idCliente = clientePersistido.getId();
        assertThat(clienteRepository.existsById(idCliente)).isTrue();

        // 2. Act (Actuar)
        clienteRepository.deleteById(idCliente);
        entityManager.flush();

        // 3. Assert (Verificar)
        assertThat(clienteRepository.existsById(idCliente)).isFalse();
    }
}