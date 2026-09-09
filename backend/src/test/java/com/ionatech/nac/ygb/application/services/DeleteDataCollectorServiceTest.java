package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DeleteDataCollectorServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private DeleteDataCollectorService service;

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        service = new DeleteDataCollectorService(userRepositoryPort);
    }

    @Test
    void shouldDeleteDataCollector() {
        UUID userId = UUID.randomUUID();
        when(userRepositoryPort.findById(userId)).thenReturn(Optional.of(collector(userId)));

        service.delete(userId);

        verify(userRepositoryPort).deleteById(userId);
    }

    @Test
    void shouldRejectAdminDeletion() {
        UUID userId = UUID.randomUUID();
        User admin = new User(
                userId,
                "Admin",
                "0770000000",
                "hash",
                Role.ADMIN,
                true,
                LocalDateTime.now()
        );
        when(userRepositoryPort.findById(userId)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> service.delete(userId))
                .isInstanceOf(InvalidUserOperationException.class)
                .hasMessageContaining("data collector");
        verify(userRepositoryPort, never()).deleteById(userId);
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepositoryPort.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(userId))
                .isInstanceOf(UserNotFoundException.class);
        verify(userRepositoryPort, never()).deleteById(userId);
    }

    private User collector(UUID userId) {
        return new User(
                userId,
                "Jane Doe",
                "0771111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
    }
}
