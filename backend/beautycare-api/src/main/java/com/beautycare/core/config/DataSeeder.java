package com.beautycare.core.config;

import com.beautycare.core.domain.model.Rol;
import com.beautycare.core.domain.model.Usuario;
import com.beautycare.core.domain.repository.RolRepository;
import com.beautycare.core.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder; // Inyectamos el BCryptPasswordEncoder

    @Override
    @Transactional // Es buena práctica envolver el seeder en una transacción
    public void run(String... args) throws Exception {
        log.info("Ejecutando DataSeeder...");

        // Crear/Verificar Roles ---
        // Aunque V2 los inserta
        Rol rolAdmin = findOrCreateRol("ADMIN");
        Rol rolCliente = findOrCreateRol("CLIENTE");
        Rol rolStaff = findOrCreateRol("STAFF");

        // --- Crear/Verificar Usuario Admin ---
        createUsuarioIfNotFound("admin", "admin123", Set.of(rolAdmin));

        // --- Crear/Verificar Usuario Cliente de Prueba ---
        createUsuarioIfNotFound("cliente_test", "cliente123", Set.of(rolCliente));

        // --- Crear/Verificar Usuario Staff de Prueba ---
        createUsuarioIfNotFound("staff_test", "staff123", Set.of(rolStaff));

        log.info("DataSeeder finalizado.");
    }

    private Rol findOrCreateRol(String nombreRol) {
        Optional<Rol> rolOpt = rolRepository.findByNombre(nombreRol);
        if (rolOpt.isPresent()) {
            return rolOpt.get();
        } else {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre(nombreRol);
            log.info("Creando rol: {}", nombreRol);
            return rolRepository.save(nuevoRol);
        }
    }

    private void createUsuarioIfNotFound(String username, String rawPassword, Set<Rol> roles) {
        Optional<Usuario> userOpt = usuarioRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Usuario newUser = new Usuario();
            newUser.setUsername(username);
            // Hasheamos la contraseña antes de guardarla
            newUser.setPassword(passwordEncoder.encode(rawPassword));
            newUser.setEnabled(true);
            newUser.setRoles(roles);
            log.info("Creando usuario: {}", username);
            usuarioRepository.save(newUser);
        } else {
            log.info("Usuario {} ya existe.", username);

        }
    }
}