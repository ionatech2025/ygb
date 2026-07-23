package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;

import java.util.Optional;
import java.util.UUID;

public interface LgoBudgetAllocationRepositoryPort {

    LgoBudgetAllocation save(LgoBudgetAllocation allocation);

    Optional<LgoBudgetAllocation> findById(UUID lbaId);

    Optional<LgoBudgetAllocation> findBySubmissionId(UUID submissionId);
}
