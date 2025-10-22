package com.beautycare.core.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
public class Usuario implements UserDetails { // Implementamos UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_bcrypt", nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuarios_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<Rol> roles;

    // --- Métodos de UserDetails ---

    /**
     * Convierte nuestros Roles (ADMIN, CLIENTE) en GrantedAuthority
     * (requerido por Spring Security, ej. "ROLE_ADMIN")
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                // Spring Security requiere el prefijo "ROLE_"
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getNombre()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    /**
     * El plan no define expiración de cuentas.
     * Se retorna 'true' (cuenta activa).
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * El plan no define bloqueo de cuentas.
     * Se retorna 'true' (cuenta no bloqueada).
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * El plan no define expiración de credenciales.
     * Se retorna 'true' (credenciales activas).
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}