package com.beautycare.core.config.security;

import com.beautycare.core.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Requerido para seguridad a nivel de método (si se usa)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UsuarioRepository usuarioRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitamos CSRF (Cross-Site Request Forgery) para APIs stateless
                .csrf(AbstractHttpConfigurer::disable)

                // Definición de reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos (Login y WSDL de SOAP)
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/soap-ws/**").permitAll()

                        // Endpoints de Administración (según documentación)
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/clientes/**").hasRole("ADMIN")
                        .requestMatchers("/profesionales/**").hasRole("ADMIN")
                        .requestMatchers("/servicios/**").hasRole("ADMIN")

                        // Endpoints operativos (requieren autenticación)
                        .requestMatchers("/citas/**").authenticated()
                        .requestMatchers("/pagos/**").authenticated()
                        .requestMatchers("/reportes/**").authenticated()

                        // Cualquier otra petición debe ser autenticada
                        .anyRequest().authenticated()
                )

                // Configuración de la sesión como STATELESS (sin estado)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Añadimos el filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- Beans requeridos por Spring Security ---

    @Bean
    public UserDetailsService userDetailsService() {
        // Implementación de UserDetailsService usando el repositorio
        return username -> usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Bean para BCrypt (requerido por la documentación)
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Proveedor de autenticación que usa UserDetailsService y PasswordEncoder
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Exponemos el AuthenticationManager (necesario para el endpoint de Login)
        return config.getAuthenticationManager();
    }
}