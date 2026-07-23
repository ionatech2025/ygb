package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

public final class BudgetPriorityDashboardFilterMapper {

    private BudgetPriorityDashboardFilterMapper() {
    }

    /** Maps location hierarchy fields for cascading validation only. */
    public static DashboardFilter toLocationHierarchyFilter(BudgetPriorityDashboardFilter filter) {
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
