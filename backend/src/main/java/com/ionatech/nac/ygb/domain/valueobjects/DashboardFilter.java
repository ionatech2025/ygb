package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Optional dashboard filter criteria combined with AND semantics.
 * Null fields impose no restriction on that dimension.
 */
public record DashboardFilter(
        UUID districtId,
        UUID subcountyId,
        UUID parishId,
        FormType formType,
        LocalDate dateFrom,
        LocalDate dateTo,
        String gender,
        String ageGroup,
        UUID collectorId,
        String financialYearPeriod
) {
    public DashboardFilter {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("DashboardFilter dateFrom must not be after dateTo.");
        }
    }

    public static DashboardFilter empty() {
        return new DashboardFilter(null, null, null, null, null, null, null, null, null, null);
    }

    public boolean hasActiveCriteria() {
        return districtId != null
                || subcountyId != null
                || parishId != null
                || formType != null
                || dateFrom != null
                || dateTo != null
                || gender != null
                || ageGroup != null
                || collectorId != null
                || financialYearPeriod != null;
    }
}
