package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;

public final class LgoBudgetAllocationDashboardFilterMapper {

    private LgoBudgetAllocationDashboardFilterMapper() {
    }

    public static DashboardFilter toLocationHierarchyFilter(LgoBudgetAllocationDashboardFilter filter) {
        if (filter == null) {
            return DashboardFilter.empty();
        }
        return new DashboardFilter(
                filter.districtId(),
                filter.subcountyId(),
                filter.parishId(),
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}
