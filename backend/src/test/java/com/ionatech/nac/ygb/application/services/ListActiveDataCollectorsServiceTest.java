package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.UserPage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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
    void shouldReturnPagedActiveDataCollectorsFromRepository() {
        User collector = new User(
                UUID.randomUUID(),
                "Jane Doe",
                "0771234567",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
        PageRequest pageRequest = PageRequest.of(0, 25);
        UserPage page = new UserPage(List.of(collector), 1L, 0, 25);

        when(userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR, pageRequest)).thenReturn(page);

        UserPage result = service.listActiveDataCollectors(pageRequest);

        assertThat(result.items()).containsExactly(collector);
        assertThat(result.totalElements()).isEqualTo(1L);
        assertThat(result.totalPages()).isEqualTo(1);
        verify(userRepositoryPort).findActiveByRole(Role.DATA_COLLECTOR, pageRequest);
    }

    @Test
    void shouldDefaultPageRequestWhenNull() {
        PageRequest defaults = PageRequest.of(0, 25);
        when(userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR, defaults))
                .thenReturn(new UserPage(List.of(), 0L, 0, 25));

        UserPage result = service.listActiveDataCollectors(null);

        assertThat(result.page()).isZero();
        assertThat(result.size()).isEqualTo(25);
        verify(userRepositoryPort).findActiveByRole(Role.DATA_COLLECTOR, defaults);
    }
}
