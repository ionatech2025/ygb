package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDateTime;
import java.util.UUID;

/** Read model for public export/query paths — whitelisted non-PII columns only. */
public record PublicAnonymisedRecord(
        UUID id,
        FormType formType,
        UUID districtId,
        String districtName,
        String gender,
        String ageGroup,
        LocalDateTime formCompletedAt,
        String status,
        String financialYearPeriod
) {
    public PublicAnonymisedRecord {
        if (id == null) {
            throw new IllegalArgumentException("PublicAnonymisedRecord id must not be null.");
        }
        if (formType == null) {
            throw new IllegalArgumentException("PublicAnonymisedRecord formType must not be null.");
        }
        if (districtId == null || districtName == null) {
            throw new IllegalArgumentException("PublicAnonymisedRecord district must not be null.");
        }
        if (formCompletedAt == null || status == null || financialYearPeriod == null) {
            throw new IllegalArgumentException("PublicAnonymisedRecord timestamps and status must not be null.");
        }
    }
}
