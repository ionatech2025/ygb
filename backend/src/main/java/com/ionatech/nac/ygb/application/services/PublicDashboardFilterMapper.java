package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;

/** Maps public filter criteria to internal dashboard queries (collector excluded). */
public final class PublicDashboardFilterMapper {

    private PublicDashboardFilterMapper() {}

    public static DashboardFilter toDashboardFilter(PublicDashboardFilter filter) {
        if (filter == null) {
            return DashboardFilter.empty();
        }
        return new DashboardFilter(
                filter.districtId(),
                filter.subcountyId(),
                filter.parishId(),
                filter.formType(),
                filter.dateFrom(),
                filter.dateTo(),
                filter.gender(),
                filter.ageGroup(),
                null,
                filter.financialYearPeriod()
        );
    }
}
