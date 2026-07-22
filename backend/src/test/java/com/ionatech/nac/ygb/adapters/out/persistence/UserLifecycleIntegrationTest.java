package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.UserMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.UserJpaRepository;
import com.ionatech.nac.ygb.adapters.out.security.PasswordEncoderAdapter;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordCommand;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.application.services.AuthenticateUserService;
import com.ionatech.nac.ygb.application.services.DeactivateUserService;
import com.ionatech.nac.ygb.application.services.ResetUserPasswordService;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserLifecycleIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private UserJpaRepository userJpaRepository;

    private UserRepositoryPort userRepositoryPort;
    private DeactivateUserService deactivateUserService;
    private ResetUserPasswordService resetUserPasswordService;
    private AuthenticateUserService authenticateUserService;
    private PasswordEncoderPort passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepositoryPort = new UserRepositoryAdapter(userJpaRepository, UserMapper.INSTANCE);
        passwordEncoder = new PasswordEncoderAdapter(new BCryptPasswordEncoder());
        deactivateUserService = new DeactivateUserService(userRepositoryPort);
        resetUserPasswordService = new ResetUserPasswordService(userRepositoryPort, passwordEncoder);
        TokenProviderPort tokenProvider = mock(TokenProviderPort.class);
        when(tokenProvider.generateToken(any(UUID.class), any(Role.class))).thenReturn("token");
        authenticateUserService = new AuthenticateUserService(
                userRepositoryPort,
                passwordEncoder,
                tokenProvider
        );
    }

    @Test
    void deactivatedCollectorShouldFailLogin() {
        UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        User collector = userRepositoryPort.findById(collectorId).orElseThrow();
        User reloadedCollector = new User(
                collector.getId(),
                collector.getName(),
                collector.getPhoneNumber(),
                passwordEncoder.encode("password"),
                collector.getRole(),
                collector.isActive(),
                collector.getCreatedAt()
        );
        userRepositoryPort.save(reloadedCollector);

        deactivateUserService.deactivate(collectorId);

        assertThatThrownBy(() -> authenticateUserService.authenticate(
                new AuthenticateUserCommand("0771111111", "password")
        )).isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void shouldPersistDeactivatedStatus() {
        User collector = new User(
                UUID.randomUUID(),
                "Temp Collector",
                "0772999888",
                passwordEncoder.encode("password"),
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
        User saved = userRepositoryPort.save(collector);

        deactivateUserService.deactivate(saved.getId());

        User reloaded = userRepositoryPort.findById(saved.getId()).orElseThrow();
        org.assertj.core.api.Assertions.assertThat(reloaded.isActive()).isFalse();
    }

    @Test
    void passwordResetShouldInvalidatePreviousPassword() {
        User collector = new User(
                UUID.randomUUID(),
                "Reset Collector",
                "0772888777",
                passwordEncoder.encode("old-password"),
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
        User saved = userRepositoryPort.save(collector);

        resetUserPasswordService.resetPassword(saved.getId(), new ResetUserPasswordCommand("new-password"));

        assertThatThrownBy(() -> authenticateUserService.authenticate(
                new AuthenticateUserCommand("0772888777", "old-password")
        )).isInstanceOf(InvalidCredentialsException.class);

        org.assertj.core.api.Assertions.assertThat(
                authenticateUserService.authenticate(new AuthenticateUserCommand("0772888777", "new-password")).token()
        ).isEqualTo("token");
    }
}
