package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionMetadata(
        UUID collectorId,
        UUID deviceSubmissionId,
        LocalDateTime formCompletedAt
) {
    public SubmissionMetadata {
        if (collectorId == null) {
            throw new IllegalArgumentException("Collector ID cannot be null");
        }
        if (deviceSubmissionId == null) {
            throw new IllegalArgumentException("Device submission ID cannot be null");
        }
        if (formCompletedAt == null) {
            throw new IllegalArgumentException("Form completed timestamp cannot be null");
        }
    }

    public FinancialYearPeriod financialYearPeriod() {
        return FinancialYearPeriod.from(formCompletedAt);
    }
}
