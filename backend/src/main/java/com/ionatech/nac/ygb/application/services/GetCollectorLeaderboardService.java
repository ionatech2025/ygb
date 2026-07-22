package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorLeaderboardQuery;
import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.List;

public class GetCollectorLeaderboardService implements GetCollectorLeaderboardQuery {

    private final CollectorTrackerRepositoryPort collectorTrackerRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;

    public GetCollectorLeaderboardService(
            CollectorTrackerRepositoryPort collectorTrackerRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator
    ) {
        this.collectorTrackerRepositoryPort = collectorTrackerRepositoryPort;
        this.filterValidator = filterValidator;
    }

    @Override
    public List<CollectorLeaderboardEntry> getLeaderboard(DashboardFilter filter) {
        DashboardFilter effectiveFilter = withoutCollector(filter != null ? filter : DashboardFilter.empty());
        filterValidator.validate(effectiveFilter);
        return collectorTrackerRepositoryPort.findLeaderboard(effectiveFilter);
    }

    private DashboardFilter withoutCollector(DashboardFilter filter) {
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
