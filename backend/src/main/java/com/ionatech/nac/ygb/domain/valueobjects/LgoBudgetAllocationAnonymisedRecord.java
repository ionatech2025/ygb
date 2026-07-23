package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/** Read model for LGO budget allocation public CSV export — whitelisted non-PII columns only. */
public record LgoBudgetAllocationAnonymisedRecord(
        UUID id,
        String financialYearPeriod,
        UUID districtId,
        String districtName,
        String gender,
        String ageGroup,
        String previousFyAllocations,
        LocalDateTime submittedAt
) {
    public static final String[] EXPORT_HEADERS = {
            "ID",
            "Financial Year Period",
            "District ID",
            "District",
            "Gender",
            "Age Group",
            "Previous FY Allocations",
            "Submitted At"
    };

    public static List<String> exportHeaderKeys() {
        return Arrays.stream(EXPORT_HEADERS)
                .map(LgoBudgetAllocationAnonymisedRecord::normalizeExportHeader)
                .toList();
    }

    public LgoBudgetAllocationAnonymisedRecord {
        if (id == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord id must not be null.");
        }
        if (financialYearPeriod == null || financialYearPeriod.isBlank()) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord financialYearPeriod must not be blank.");
        }
        if (districtId == null || districtName == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord district must not be null.");
        }
        if (previousFyAllocations == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord previousFyAllocations must not be null.");
        }
        if (submittedAt == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord submittedAt must not be null.");
        }
    }

    private static String normalizeExportHeader(String header) {
        return header.replace(" ", "").toLowerCase(Locale.ROOT);
    }
}
