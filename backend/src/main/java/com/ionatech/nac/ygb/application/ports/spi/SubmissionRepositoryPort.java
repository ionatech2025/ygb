package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.Submission;

public interface SubmissionRepositoryPort {
    Submission save(Submission submission);
    long countByCollectorIdAndFormCompletedAtBetween(java.util.UUID collectorId, java.time.LocalDateTime start, java.time.LocalDateTime end);
    boolean existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
            String phone,
            com.ionatech.nac.ygb.domain.model.FormType formType,
            String financialYearPeriod,
            com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus status
    );
}
