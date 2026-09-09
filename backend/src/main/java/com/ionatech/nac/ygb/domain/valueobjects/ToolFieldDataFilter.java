package com.ionatech.nac.ygb.domain.valueobjects;

/**
 * Optional AND filters for tool field-data hub downloads.
 * Null fields impose no restriction.
 */
public record ToolFieldDataFilter(
        java.util.UUID districtId,
        java.util.UUID subcountyId,
        java.util.UUID parishId,
        String gender,
        String ageGroup,
        String financialYearPeriod
) {
    public static ToolFieldDataFilter empty() {
        return new ToolFieldDataFilter(null, null, null, null, null, null);
    }

    public boolean hasActiveCriteria() {
        return districtId != null
                || subcountyId != null
                || parishId != null
                || gender != null
                || ageGroup != null
                || financialYearPeriod != null;
    }
}
