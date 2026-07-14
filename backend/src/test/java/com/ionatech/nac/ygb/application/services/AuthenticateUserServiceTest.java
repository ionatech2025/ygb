package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticateUserServiceTest {

    @Mock
    private UserRepositoryPort userRepositoryPort;
    @Mock
    private PasswordEncoderPort passwordEncoderPort;
    @Mock
    private TokenProviderPort tokenProviderPort;

    private AuthenticateUserService authenticateUserService;

    @BeforeEach
    void setUp() {
        authenticateUserService = new AuthenticateUserService(userRepositoryPort, passwordEncoderPort,
                tokenProviderPort);
    }

    @Test
    void shouldAuthenticateSuccessfully() {
        UUID userId = UUID.randomUUID();
        User user = new User(userId, "Test User", "0770000000", "hashed", Role.DATA_COLLECTOR, true,
                LocalDateTime.now());

        when(userRepositoryPort.findByPhoneNumber("0770000000")).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches("rawpassword", "hashed")).thenReturn(true);
        when(tokenProviderPort.generateToken(userId, Role.DATA_COLLECTOR)).thenReturn("jwt.token.here");

        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "rawpassword");
        AuthenticationResult result = authenticateUserService.authenticate(command);

        assertThat(result.token()).isEqualTo("jwt.token.here");
        assertThat(result.userId()).isEqualTo(userId);
        assertThat(result.name()).isEqualTo("Test User");
        assertThat(result.phoneNumber()).isEqualTo("0770000000");
        assertThat(result.role()).isEqualTo("DATA_COLLECTOR");
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepositoryPort.findByPhoneNumber("0770000000")).thenReturn(Optional.empty());

        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "rawpassword");

        assertThatThrownBy(() -> authenticateUserService.authenticate(command))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");

        verifyNoInteractions(passwordEncoderPort, tokenProviderPort);
    }

    @Test
    void shouldThrowWhenUserIsInactive() {
        User user = new User(UUID.randomUUID(), "Test User", "0770000000", "hashed", Role.DATA_COLLECTOR, false,
                LocalDateTime.now());
        when(userRepositoryPort.findByPhoneNumber("0770000000")).thenReturn(Optional.of(user));

        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "rawpassword");

        assertThatThrownBy(() -> authenticateUserService.authenticate(command))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");

        verifyNoInteractions(passwordEncoderPort, tokenProviderPort);
    }

    @Test
    void shouldThrowWhenPasswordDoesNotMatch() {
        User user = new User(UUID.randomUUID(), "Test User", "0770000000", "hashed", Role.DATA_COLLECTOR, true,
                LocalDateTime.now());
        when(userRepositoryPort.findByPhoneNumber("0770000000")).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches("wrongpassword", "hashed")).thenReturn(false);

        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "wrongpassword");

        assertThatThrownBy(() -> authenticateUserService.authenticate(command))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid credentials");

        verifyNoInteractions(tokenProviderPort);
    }
}
