package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordCommand;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ResetUserPasswordServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private PasswordEncoderPort passwordEncoderPort;
    private ResetUserPasswordService service;

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        passwordEncoderPort = mock(PasswordEncoderPort.class);
        service = new ResetUserPasswordService(userRepositoryPort, passwordEncoderPort);
    }

    @Test
    void shouldReplacePasswordHashWithNewEncodedValue() {
        UUID userId = UUID.randomUUID();
        User collector = new User(
                userId,
                "Jane Doe",
                "0771111111",
                "old-hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        when(userRepositoryPort.findById(userId)).thenReturn(Optional.of(collector));
        when(passwordEncoderPort.encode("new-password")).thenReturn("new-hash");
        when(userRepositoryPort.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.resetPassword(userId, new ResetUserPasswordCommand("new-password"));

        assertThat(result.temporaryPassword()).isEqualTo("new-password");
        verify(passwordEncoderPort).encode("new-password");

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepositoryPort).save(savedUser.capture());
        assertThat(savedUser.getValue().getPasswordHash()).isEqualTo("new-hash");
    }

    @Test
    void shouldGenerateTemporaryPasswordWhenNoneProvided() {
        UUID userId = UUID.randomUUID();
        User collector = new User(
                userId,
                "Jane Doe",
                "0771111111",
                "old-hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        when(userRepositoryPort.findById(userId)).thenReturn(Optional.of(collector));
        when(passwordEncoderPort.encode(any())).thenReturn("generated-hash");
        when(userRepositoryPort.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.resetPassword(userId, new ResetUserPasswordCommand(null));

        assertThat(result.temporaryPassword()).hasSize(12);
        verify(passwordEncoderPort).encode(eq(result.temporaryPassword()));
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepositoryPort.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.resetPassword(userId, new ResetUserPasswordCommand("pw")))
                .isInstanceOf(UserNotFoundException.class);
    }
}
