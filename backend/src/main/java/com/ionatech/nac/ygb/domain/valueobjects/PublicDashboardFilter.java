package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDate;
import java.util.UUID;

/** Public dashboard filter criteria (US-PUB-02). AND semantics; no collector dimension. */
public record PublicDashboardFilter(
        UUID districtId,
        UUID subcountyId,
        UUID parishId,
        FormType formType,
        LocalDate dateFrom,
        LocalDate dateTo,
        String gender,
        String ageGroup,
        String financialYearPeriod
) {
    public PublicDashboardFilter {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("PublicDashboardFilter dateFrom must not be after dateTo.");
        }
    }

    public static PublicDashboardFilter empty() {
        return new PublicDashboardFilter(null, null, null, null, null, null, null, null, null);
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
                || financialYearPeriod != null;
    }
}
