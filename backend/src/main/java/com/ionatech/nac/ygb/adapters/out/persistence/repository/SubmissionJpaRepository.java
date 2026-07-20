package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.SubmissionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubmissionJpaRepository extends JpaRepository<SubmissionJpaEntity, UUID> {
    long countByCollectorIdAndFormCompletedAtBetween(UUID collectorId, java.time.LocalDateTime start, java.time.LocalDateTime end);

    boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
            String respondentPhone, String formType, String financialYearPeriod, String status
    );

    long countByCollectorIdAndStatus(UUID collectorId, String status);

    java.util.Optional<SubmissionJpaEntity> findFirstByCollectorIdAndStatusOrderBySyncedAtDesc(UUID collectorId, String status);
}
