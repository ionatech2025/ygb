package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthResponse;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AuthMapper;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final AuthMapper authMapper;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase, AuthMapper authMapper) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.authMapper = authMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthenticationResult result = authenticateUserUseCase.authenticate(authMapper.toCommand(request));
        return ResponseEntity.ok(new AuthResponse(
            result.token(),
            result.userId().toString(),
            result.name(),
            result.phoneNumber(),
            result.role()
        ));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Object> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
    }
}
