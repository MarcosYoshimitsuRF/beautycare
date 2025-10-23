package com.beautycare.core.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Importar Slf4j
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Importar
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.ExpiredJwtException; // Importar
import io.jsonwebtoken.JwtException; // Importar

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j // Añadir Logger
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String requestURI = request.getRequestURI(); // Obtener URI para logs
        log.debug("JwtFilter: Procesando request para {}", requestURI); // Log inicial

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Si no hay token o no es Bearer, pasar al siguiente filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("JwtFilter: No se encontró Bearer token en cabecera para {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extraer token y username
        jwt = authHeader.substring(7);
        log.debug("JwtFilter: Token extraído: {}...", jwt.substring(0, Math.min(jwt.length(), 10))); // Log seguro del inicio del token

        try {
            username = jwtService.extractUsername(jwt);
            log.debug("JwtFilter: Username extraído '{}' del token para {}", username, requestURI);

            // 3. Si tenemos username y NO está autenticado en el contexto actual
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("JwtFilter: Intentando cargar UserDetails para {}", username);
                UserDetails userDetails;
                try {
                    userDetails = this.userDetailsService.loadUserByUsername(username);
                    log.debug("JwtFilter: UserDetails cargado exitosamente para {}", username);
                } catch (UsernameNotFoundException e) {
                    log.warn("JwtFilter: Usuario '{}' no encontrado en la BD.", username);
                    filterChain.doFilter(request, response); // Usuario no existe, denegar silenciosamente
                    return;
                }


                // 4. Validar el token contra UserDetails
                log.debug("JwtFilter: Validando token para {}", username);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.info("JwtFilter: Token VÁLIDO para usuario '{}' en request {}", username, requestURI); // Log éxito validación
                    // Crear token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Actualizar SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("JwtFilter: SecurityContextHolder actualizado para {}", username);
                } else {
                    log.warn("JwtFilter: Token INVÁLIDO (posiblemente firma/expiración) para usuario '{}' en request {}", username, requestURI);
                }
            } else {
                log.debug("JwtFilter: Username nulo o usuario ya autenticado en el contexto para {}", requestURI);
            }
            // Capturar excepciones específicas de JWT
        } catch (ExpiredJwtException e) {
            log.warn("JwtFilter: Token JWT expirado: {}", e.getMessage());
            // Podríamos enviar un 401 explícito aquí si quisiéramos
        } catch (JwtException e) {
            log.warn("JwtFilter: Error al procesar token JWT: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JwtFilter: Error inesperado al procesar token para {}", requestURI, e);
        }

        // Continuar la cadena de filtros SIEMPRE
        filterChain.doFilter(request, response);
        log.debug("JwtFilter: Finalizado procesamiento para {}", requestURI);
    }
}