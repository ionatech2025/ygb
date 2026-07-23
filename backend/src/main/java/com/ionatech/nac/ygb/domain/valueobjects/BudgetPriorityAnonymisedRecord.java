package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/** Read model for budget-priority public export — whitelisted non-PII columns only. */
public record BudgetPriorityAnonymisedRecord(
        UUID id,
        String section,
        String financialYearPeriod,
        UUID districtId,
        String districtName,
        String gender,
        String ageGroup,
        String priorityAreas,
        LocalDateTime submittedAt
) {
    public static final String[] EXPORT_HEADERS = {
            "ID",
            "Section",
            "Financial Year Period",
            "District ID",
            "District",
            "Gender",
            "Age Group",
            "Priority Areas",
            "Submitted At"
    };

    public static List<String> exportHeaderKeys() {
        return Arrays.stream(EXPORT_HEADERS)
                .map(BudgetPriorityAnonymisedRecord::normalizeExportHeader)
                .toList();
    }

    public BudgetPriorityAnonymisedRecord {
        if (id == null) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord id must not be null.");
        }
        if (section == null || section.isBlank()) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord section must not be blank.");
        }
        if (financialYearPeriod == null || financialYearPeriod.isBlank()) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord financialYearPeriod must not be blank.");
        }
        if (districtId == null || districtName == null) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord district must not be null.");
        }
        if (submittedAt == null) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord submittedAt must not be null.");
        }
    }

    private static String normalizeExportHeader(String header) {
        return header.replace(" ", "").toLowerCase(Locale.ROOT);
    }
}
