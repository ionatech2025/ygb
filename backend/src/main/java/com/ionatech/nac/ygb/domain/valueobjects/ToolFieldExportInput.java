package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Intermediate field-data export source: common header inputs + ordered answer columns.
 * Must not carry blocked PII keys in {@code answers}.
 */
public record ToolFieldExportInput(
        ToolDownloadDataset dataset,
        String districtName,
        String subcountyName,
        String parishName,
        String gender,
        String ageGroup,
        String financialYearPeriod,
        LocalDateTime formCompletedAt,
        Map<String, String> answers
) {
    public ToolFieldExportInput {
        Objects.requireNonNull(dataset, "dataset must not be null");
        answers = answers == null
                ? Map.of()
                : Collections.unmodifiableMap(new LinkedHashMap<>(answers));
    }

    public static ToolFieldExportInput of(
            ToolDownloadDataset dataset,
            String districtName,
            String subcountyName,
            String parishName,
            String gender,
            String ageGroup,
            String financialYearPeriod,
            LocalDateTime formCompletedAt,
            LinkedHashMap<String, String> answers
    ) {
        return new ToolFieldExportInput(
                dataset,
                districtName,
                subcountyName,
                parishName,
                gender,
                ageGroup,
                financialYearPeriod,
                formCompletedAt,
                answers
        );
    }
}
