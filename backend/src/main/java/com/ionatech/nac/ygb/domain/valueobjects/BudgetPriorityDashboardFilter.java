package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;

import java.time.LocalDate;
import java.util.UUID;

/** Public budget-priority dashboard filter (US-BP-02). AND semantics; optional section = all sectors. */
public record BudgetPriorityDashboardFilter(
        BudgetPrioritySection section,
        UUID districtId,
        UUID subcountyId,
        UUID parishId,
        LocalDate dateFrom,
        LocalDate dateTo,
        String gender,
        String ageGroup,
        String financialYearPeriod
) {
    public BudgetPriorityDashboardFilter {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("BudgetPriorityDashboardFilter dateFrom must not be after dateTo.");
        }
    }

    public static BudgetPriorityDashboardFilter empty() {
        return new BudgetPriorityDashboardFilter(null, null, null, null, null, null, null, null, null);
    }

    public boolean hasActiveCriteria() {
        return section != null
                || districtId != null
                || subcountyId != null
                || parishId != null
                || dateFrom != null
                || dateTo != null
                || gender != null
                || ageGroup != null
                || financialYearPeriod != null;
    }
}
