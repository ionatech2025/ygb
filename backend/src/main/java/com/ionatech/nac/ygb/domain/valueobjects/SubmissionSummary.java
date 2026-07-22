package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionSummary(
        UUID id,
        FormType formType,
        String respondentName,
        UUID districtId,
        String districtName,
        UUID collectorId,
        String collectorName,
        LocalDateTime formCompletedAt,
        LocalDateTime syncedAt,
        String status,
        String financialYearPeriod
) {
    public SubmissionSummary {
        if (id == null) {
            throw new IllegalArgumentException("SubmissionSummary id must not be null.");
        }
        if (formType == null) {
            throw new IllegalArgumentException("SubmissionSummary formType must not be null.");
        }
        if (respondentName == null) {
            throw new IllegalArgumentException("SubmissionSummary respondentName must not be null.");
        }
        if (districtId == null || districtName == null) {
            throw new IllegalArgumentException("SubmissionSummary district must not be null.");
        }
        if (collectorId == null || collectorName == null) {
            throw new IllegalArgumentException("SubmissionSummary collector must not be null.");
        }
        if (formCompletedAt == null || status == null || financialYearPeriod == null) {
            throw new IllegalArgumentException("SubmissionSummary timestamps and status must not be null.");
        }
    }
}
