package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreateDataCollectorServiceTest {

    @Mock
    private UserRepositoryPort userRepositoryPort;
    
    @Mock
    private PasswordEncoderPort passwordEncoderPort;

    private CreateDataCollectorService createDataCollectorService;

    @BeforeEach
    void setUp() {
        createDataCollectorService = new CreateDataCollectorService(userRepositoryPort, passwordEncoderPort);
    }

    @Test
    void shouldCreateDataCollectorSuccessfully() {
        CreateDataCollectorCommand command = new CreateDataCollectorCommand("John Doe", "0770000001", "password123");
        
        when(userRepositoryPort.findByPhoneNumber("0770000001")).thenReturn(Optional.empty());
        when(passwordEncoderPort.encode("password123")).thenReturn("encodedPassword");
        
        User savedUser = new User(UUID.randomUUID(), "John Doe", "0770000001", "encodedPassword", Role.DATA_COLLECTOR, true, LocalDateTime.now());
        when(userRepositoryPort.save(any(User.class))).thenReturn(savedUser);

        User result = createDataCollectorService.createDataCollector(command);
        
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(savedUser.getId());
        assertThat(result.getPhoneNumber()).isEqualTo("0770000001");
        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepositoryPort).save(userCaptor.capture());
        
        User captured = userCaptor.getValue();
        assertThat(captured.getName()).isEqualTo("John Doe");
        assertThat(captured.getPhoneNumber()).isEqualTo("0770000001");
        assertThat(captured.getPasswordHash()).isEqualTo("encodedPassword");
        assertThat(captured.getRole()).isEqualTo(Role.DATA_COLLECTOR);
        assertThat(captured.isActive()).isTrue();
    }

    @Test
    void shouldThrowExceptionIfPhoneNumberAlreadyExists() {
        CreateDataCollectorCommand command = new CreateDataCollectorCommand("John Doe", "0770000001", "password123");
        User existingUser = new User(UUID.randomUUID(), "Jane Doe", "0770000001", "hashed", Role.DATA_COLLECTOR, true, LocalDateTime.now());
        
        when(userRepositoryPort.findByPhoneNumber("0770000001")).thenReturn(Optional.of(existingUser));

        assertThatThrownBy(() -> createDataCollectorService.createDataCollector(command))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("A user with phone number 0770000001 already exists.");
    }
}
