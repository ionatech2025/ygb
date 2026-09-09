package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorLeaderboardQuery;
import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;

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
    public CollectorLeaderboardPage getLeaderboard(
            DashboardFilter filter,
            PageRequest pageRequest,
            LeaderboardSort sort
    ) {
        DashboardFilter effectiveFilter = withoutCollector(filter != null ? filter : DashboardFilter.empty());
        filterValidator.validate(effectiveFilter);
        PageRequest effectivePage = pageRequest != null ? pageRequest : PageRequest.of(0, 25);
        LeaderboardSort effectiveSort = sort != null ? sort : LeaderboardSort.defaultSort();
        return collectorTrackerRepositoryPort.findLeaderboard(effectiveFilter, effectivePage, effectiveSort);
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
