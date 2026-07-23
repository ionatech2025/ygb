package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;
import java.util.UUID;

/** Public LGO budget allocation dashboard filter — AND semantics across location and demographics. */
public record LgoBudgetAllocationDashboardFilter(
        UUID districtId,
        UUID subcountyId,
        UUID parishId,
        LocalDate dateFrom,
        LocalDate dateTo,
        String gender,
        String ageGroup,
        String financialYearPeriod
) {
    public LgoBudgetAllocationDashboardFilter {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("LgoBudgetAllocationDashboardFilter dateFrom must not be after dateTo.");
        }
    }

    public static LgoBudgetAllocationDashboardFilter empty() {
        return new LgoBudgetAllocationDashboardFilter(null, null, null, null, null, null, null, null);
    }
}
