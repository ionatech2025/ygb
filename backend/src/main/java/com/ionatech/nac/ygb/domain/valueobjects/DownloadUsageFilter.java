package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;

public record DownloadUsageFilter(
        String gender,
        String ageGroup,
        String countryCode,
        String fieldOfOperation,
        PublicDownloadDataset dataset,
        LocalDate dateFrom,
        LocalDate dateTo
) {
    public DownloadUsageFilter {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("dateFrom must not be after dateTo");
        }
        gender = normalizeEnum(gender, Gender.class, "gender");
        ageGroup = normalizeEnum(ageGroup, AgeGroup.class, "age group");
        fieldOfOperation = normalizeEnum(fieldOfOperation, FieldOfOperation.class, "field of operation");
        if (countryCode != null && !countryCode.isBlank()) {
            countryCode = countryCode.trim().toUpperCase();
        } else {
            countryCode = null;
        }
    }

    public static DownloadUsageFilter empty() {
        return new DownloadUsageFilter(null, null, null, null, null, null, null);
    }

    public static DownloadUsageFilter of(String gender, String ageGroup) {
        return new DownloadUsageFilter(gender, ageGroup, null, null, null, null, null);
    }

    private static <E extends Enum<E>> String normalizeEnum(String raw, Class<E> type, String label) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        try {
            Enum.valueOf(type, trimmed);
            return trimmed;
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown " + label + ": " + raw);
        }
    }
}
