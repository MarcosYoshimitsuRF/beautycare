package com.beautycare.core.application;

import com.beautycare.core.config.security.JwtService;
import com.beautycare.core.config.security.payload.AuthRequest;
import com.beautycare.core.config.security.payload.AuthResponse;
import com.beautycare.core.config.security.payload.RegisterRequest;
import com.beautycare.core.domain.model.Rol;
import com.beautycare.core.domain.model.Usuario;
import com.beautycare.core.domain.repository.RolRepository;
import com.beautycare.core.domain.repository.UsuarioRepository;
import com.beautycare.core.presentation.dto.UsuarioDTO;
import com.beautycare.core.presentation.exception.BusinessRuleException;
import com.beautycare.core.presentation.mapper.UsuarioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );
        UserDetails userDetails = (Usuario) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token);
    }

    @Transactional
    public UsuarioDTO register(RegisterRequest registerRequest) {
        //Validar si el username ya existe
        if (usuarioRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new BusinessRuleException("El nombre de usuario ya está en uso.");
        }

        //Buscar el rol CLIENTE
        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new BusinessRuleException("Rol CLIENTE no encontrado. Contacte al administrador."));

        //Crear el nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(registerRequest.getUsername());
        nuevoUsuario.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Encriptar password
        nuevoUsuario.setEnabled(true);
        nuevoUsuario.setRoles(Set.of(rolCliente));

        // Guardar en la BD
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        //Devolver DTO del usuario creado (sin contraseña)
        return usuarioMapper.toDTO(usuarioGuardado);
    }
}