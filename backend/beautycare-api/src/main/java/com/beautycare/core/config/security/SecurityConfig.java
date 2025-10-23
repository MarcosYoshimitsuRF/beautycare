package com.beautycare.core.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Importar HttpMethod
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandlerImpl; // Importar AccessDeniedHandlerImpl
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    // AuthenticationProvider se auto-configura

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // --- Rutas Públicas ---
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/soap-ws/**").permitAll()

                        // --- Rutas ADMIN (CRUD completo y otras) ---
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Permitir GET a todos, restringir escritura a ADMIN
                        .requestMatchers(HttpMethod.GET, "/clientes/**").authenticated() // Leer clientes (Quizás solo ADMIN?) - AJUSTAR SI ES NECESARIO
                        .requestMatchers(HttpMethod.POST, "/clientes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/clientes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("ADMIN")
                        // Permitir GET a todos, restringir escritura a ADMIN (NECESARIO PARA CITAS)
                        .requestMatchers(HttpMethod.GET, "/profesionales/**").authenticated() // <-- CORRECCIÓN
                        .requestMatchers(HttpMethod.POST, "/profesionales/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/profesionales/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/profesionales/**").hasRole("ADMIN")
                        // Permitir GET a todos, restringir escritura a ADMIN (NECESARIO PARA CITAS)
                        .requestMatchers(HttpMethod.GET, "/servicios/**").authenticated() // <-- CORRECCIÓN
                        .requestMatchers(HttpMethod.POST, "/servicios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/servicios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/servicios/**").hasRole("ADMIN")

                        // --- Rutas Autenticadas (Roles específicos se manejan en controladores si es necesario) ---
                        .requestMatchers("/citas/**").authenticated()
                        .requestMatchers("/pagos/**").authenticated()
                        .requestMatchers("/reportes/**").authenticated() // Podría restringirse más si es necesario

                        // --- Cualquier otra petición ---
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(e -> e
                        // Para fallos de AUTENTICACIÓN (token inválido/ausente) -> 401
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        // Para fallos de AUTORIZACIÓN (rol incorrecto) -> 403
                        .accessDeniedHandler(new AccessDeniedHandlerImpl()) // <-- CORRECCIÓN
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // ... (Configuración CORS igual que antes) ...
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}