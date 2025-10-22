package com.beautycare.core.presentation;

import com.beautycare.core.config.security.JwtService;
import com.beautycare.core.config.security.payload.AuthRequest;
import com.beautycare.core.config.security.payload.AuthResponse;
import com.beautycare.core.domain.model.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    // (No necesitamos el UsuarioRepository aquí, el AuthManager usa el UserDetailsService)

    /**
     * Endpoint de Autenticación (Login)
     * Cumple el requisito de la documentación: POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {

        // 1. Autenticar usando Spring Security
        // Esto valida el username y el password (con BCrypt) usando el DaoAuthenticationProvider
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );

        // 2. Si la autenticación es exitosa, obtenemos el UserDetails
        UserDetails userDetails = (Usuario) authentication.getPrincipal();

        // 3. Generar el token JWT
        String token = jwtService.generateToken(userDetails);

        // 4. Devolver la respuesta
        return ResponseEntity.ok(new AuthResponse(token));
    }
}