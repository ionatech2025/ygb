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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DeactivateUserServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private DeactivateUserService service;

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        service = new DeactivateUserService(userRepositoryPort);
    }

    @Test
    void shouldDeactivateActiveDataCollector() {
        UUID userId = UUID.randomUUID();
        User collector = collector(userId, true);

        when(userRepositoryPort.findById(userId)).thenReturn(Optional.of(collector));
        when(userRepositoryPort.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = service.deactivate(userId);

        assertThat(result.isActive()).isFalse();
        verify(userRepositoryPort).save(argThat(saved -> !saved.isActive()));
    }

    @Test
    void shouldRejectAdminDeactivation() {
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

        assertThatThrownBy(() -> service.deactivate(userId))
                .isInstanceOf(InvalidUserOperationException.class);
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepositoryPort.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deactivate(userId))
                .isInstanceOf(UserNotFoundException.class);
    }

    private User collector(UUID userId, boolean active) {
        return new User(
                userId,
                "Jane Doe",
                "0771111111",
                "hash",
                Role.DATA_COLLECTOR,
                active,
                LocalDateTime.now()
        );
    }
}
