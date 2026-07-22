package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.Submission;

import java.time.LocalDateTime;

public record AdminSubmissionDetail(
        Submission submission,
        LocalDateTime syncedAt,
        String financialYearPeriod
) {
    public AdminSubmissionDetail {
        if (submission == null) {
            throw new IllegalArgumentException("AdminSubmissionDetail submission must not be null.");
        }
        if (financialYearPeriod == null) {
            throw new IllegalArgumentException("AdminSubmissionDetail financialYearPeriod must not be null.");
        }
    }
}
