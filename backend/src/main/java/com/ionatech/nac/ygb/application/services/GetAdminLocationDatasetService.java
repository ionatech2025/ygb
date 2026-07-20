package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetAdminLocationDatasetUseCase;
import com.ionatech.nac.ygb.application.ports.spi.AdminLocationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;

import java.util.List;

/**
 * Pure Java application service — no Spring annotations.
 * Wired programmatically in {@link com.ionatech.nac.ygb.configuration.UseCaseConfig}.
 */
public class GetAdminLocationDatasetService implements GetAdminLocationDatasetUseCase {

    private final AdminLocationRepositoryPort repositoryPort;

    public GetAdminLocationDatasetService(AdminLocationRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public List<AdminLocation> getDataset() {
        return repositoryPort.findAll();
    }
}
