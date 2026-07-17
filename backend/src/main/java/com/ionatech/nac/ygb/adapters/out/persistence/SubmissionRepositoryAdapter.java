package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.SubmissionJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionRepositoryAdapter implements SubmissionRepositoryPort {
    private final SubmissionJpaRepository jpaRepository;
    private final SubmissionMapper mapper;

    public SubmissionRepositoryAdapter(SubmissionJpaRepository jpaRepository, SubmissionMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Submission save(Submission submission) {
        try {
            SubmissionJpaEntity entity = mapper.toEntity(submission);
            SubmissionJpaEntity saved = jpaRepository.saveAndFlush(entity);
            return mapper.toDomain(saved);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            String msg = ex.getMessage();
            if (msg != null && msg.contains("idx_unique_synced_respondent")) {
                throw new com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException(
                        "A synced submission for this respondent and form type already exists in the current financial year period.",
                        ex
                );
            }
            throw ex;
        }
    }

    @Override
    public long countByCollectorIdAndFormCompletedAtBetween(java.util.UUID collectorId, java.time.LocalDateTime start, java.time.LocalDateTime end) {
        return jpaRepository.countByCollectorIdAndFormCompletedAtBetween(collectorId, start, end);
    }

    @Override
    public boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
            String phone,
            com.ionatech.nac.ygb.domain.model.FormType formType,
            String financialYearPeriod,
            com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status
    ) {
        return jpaRepository.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                phone,
                formType.name(),
                financialYearPeriod,
                status.name()
        );
    }
}
