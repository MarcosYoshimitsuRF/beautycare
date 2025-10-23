package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.AuthService; // Importar AuthService
import com.beautycare.core.config.security.payload.AuthRequest;
import com.beautycare.core.config.security.payload.AuthResponse;
import com.beautycare.core.config.security.payload.RegisterRequest; // Importar RegisterRequest
import com.beautycare.core.presentation.dto.UsuarioDTO; // Importar UsuarioDTO
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // Importar HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    // Inyectamos el servicio en lugar del AuthenticationManager y JwtService directamente
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        AuthResponse response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UsuarioDTO usuarioCreado = authService.register(registerRequest);
        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    }
}