package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.AdminLocationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class GetAdminLocationDatasetServiceTest {

    private AdminLocationRepositoryPort repositoryPort;
    private GetAdminLocationDatasetService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(AdminLocationRepositoryPort.class);
        service = new GetAdminLocationDatasetService(repositoryPort);
    }

    @Test
    void shouldRetrieveAllLocationsFromRepositoryPort() {
        AdminLocation district = new AdminLocation(UUID.randomUUID(), "Kampala", null, AdminLocationLevel.DISTRICT);
        AdminLocation subcounty = new AdminLocation(UUID.randomUUID(), "Central", district.id(), AdminLocationLevel.SUBCOUNTY);
        List<AdminLocation> expectedDataset = List.of(district, subcounty);

        when(repositoryPort.findAll()).thenReturn(expectedDataset);

        List<AdminLocation> result = service.getDataset();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactlyInAnyOrder(district, subcounty);
        verify(repositoryPort, times(1)).findAll();
    }
}
