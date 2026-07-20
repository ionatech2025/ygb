package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ListActiveDataCollectorsServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private ListActiveDataCollectorsService service;

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        service = new ListActiveDataCollectorsService(userRepositoryPort);
    }

    @Test
    void shouldReturnActiveDataCollectorsFromRepository() {
        User collector = new User(
                UUID.randomUUID(),
                "Jane Doe",
                "0771234567",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        when(userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR)).thenReturn(List.of(collector));

        List<User> result = service.listActiveDataCollectors();

        assertThat(result).containsExactly(collector);
    }
}
