package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;

import java.util.Optional;
import java.util.UUID;

public class SaveLgoBudgetAllocationService {

    private final LgoBudgetAllocationRepositoryPort repositoryPort;

    public SaveLgoBudgetAllocationService(LgoBudgetAllocationRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    public LgoBudgetAllocation save(LgoBudgetAllocation allocation) {
        return repositoryPort.save(allocation);
    }

    public Optional<LgoBudgetAllocation> findBySubmissionId(UUID submissionId) {
        return repositoryPort.findBySubmissionId(submissionId);
    }
}
