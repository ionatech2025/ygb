package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;

import java.util.Optional;
import java.util.UUID;

public interface SubmissionRepositoryPort {
    Submission save(Submission submission);
    long countByCollectorIdAndFormCompletedAtBetween(java.util.UUID collectorId, java.time.LocalDateTime start, java.time.LocalDateTime end);
    boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
            String phone,
            com.ionatech.nac.ygb.domain.model.FormType formType,
            String financialYearPeriod,
            com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status
    );
    long countByCollectorIdAndStatus(java.util.UUID collectorId, com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status);
    java.util.Optional<java.time.LocalDateTime> findLatestSyncedAtByCollectorIdAndStatus(java.util.UUID collectorId, com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status);

    SubmissionPage findSummariesByFilter(DashboardFilter filter, PageRequest pageRequest);

    Optional<AdminSubmissionDetail> findDetailById(UUID id);
}
