package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.LgoBudgetAllocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.LgoBudgetAllocationJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class LgoBudgetAllocationRepositoryAdapter implements LgoBudgetAllocationRepositoryPort {

    private final LgoBudgetAllocationJpaRepository jpaRepository;
    private final LgoBudgetAllocationMapper mapper;

    public LgoBudgetAllocationRepositoryAdapter(
            LgoBudgetAllocationJpaRepository jpaRepository,
            LgoBudgetAllocationMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public LgoBudgetAllocation save(LgoBudgetAllocation allocation) {
        return mapper.toDomain(jpaRepository.saveAndFlush(mapper.toEntity(allocation)));
    }

    @Override
    public Optional<LgoBudgetAllocation> findById(UUID lbaId) {
        return jpaRepository.findById(lbaId).map(mapper::toDomain);
    }

    @Override
    public Optional<LgoBudgetAllocation> findBySubmissionId(UUID submissionId) {
        return jpaRepository.findBySubmissionId(submissionId).map(mapper::toDomain);
    }
}
