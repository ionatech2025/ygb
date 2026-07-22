package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
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
    public static final String[] EXPORT_HEADERS = {
            "ID",
            "Form Type",
            "District ID",
            "District",
            "Gender",
            "Age Group",
            "Form Completed At",
            "Status",
            "Financial Year Period"
    };

    public static List<String> exportHeaderKeys() {
        return Arrays.stream(EXPORT_HEADERS)
                .map(PublicAnonymisedRecord::normalizeExportHeader)
                .toList();
    }

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

    private static String normalizeExportHeader(String header) {
        return header.replace(" ", "").toLowerCase(Locale.ROOT);
    }
}
