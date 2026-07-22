package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.SubmissionJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetrics;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class SubmissionRepositoryAdapter implements SubmissionRepositoryPort {
    private final SubmissionJpaRepository jpaRepository;
    private final SubmissionMapper mapper;
    private final AdminSubmissionQueryJpaRepository adminSubmissionQueryJpaRepository;
    private final AdminReceiptStatusQueryJpaRepository adminReceiptStatusQueryJpaRepository;

    public SubmissionRepositoryAdapter(
            SubmissionJpaRepository jpaRepository,
            SubmissionMapper mapper,
            AdminSubmissionQueryJpaRepository adminSubmissionQueryJpaRepository,
            AdminReceiptStatusQueryJpaRepository adminReceiptStatusQueryJpaRepository
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
        this.adminSubmissionQueryJpaRepository = adminSubmissionQueryJpaRepository;
        this.adminReceiptStatusQueryJpaRepository = adminReceiptStatusQueryJpaRepository;
    }

    @Override
    public Submission save(Submission submission) {
        try {
            SubmissionJpaEntity entity = mapper.toEntity(submission);
            if (submission.getStatus() == com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus.SYNCED) {
                entity.setSyncedAt(java.time.LocalDateTime.now());
            }
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

    @Override
    public long countByCollectorIdAndStatus(java.util.UUID collectorId, com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status) {
        return jpaRepository.countByCollectorIdAndStatus(collectorId, status.name());
    }

    @Override
    public java.util.Optional<java.time.LocalDateTime> findLatestSyncedAtByCollectorIdAndStatus(
            java.util.UUID collectorId, com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status) {
        return jpaRepository.findFirstByCollectorIdAndStatusOrderBySyncedAtDesc(collectorId, status.name())
                .map(SubmissionJpaEntity::getSyncedAt);
    }

    @Override
    public long countByStatus(com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status) {
        return jpaRepository.countByStatus(status.name());
    }

    @Override
    public java.util.List<CollectorReceiptMetrics> findReceiptMetricsByCollector() {
        return adminReceiptStatusQueryJpaRepository.findReceiptMetricsByCollector();
    }

    @Override
    public SubmissionPage findSummariesByFilter(DashboardFilter filter, PageRequest pageRequest) {
        return adminSubmissionQueryJpaRepository.findSummaries(filter, pageRequest);
    }

    @Override
    public Optional<AdminSubmissionDetail> findDetailById(UUID id) {
        return jpaRepository.findById(id)
                .map(entity -> new AdminSubmissionDetail(
                        mapper.toDomain(entity),
                        entity.getSyncedAt(),
                        entity.getFinancialYearPeriod()
                ));
    }
}
