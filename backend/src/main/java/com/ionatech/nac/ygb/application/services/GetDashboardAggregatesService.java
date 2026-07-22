package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetDashboardAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

/**
 * Pure Java application service — wired programmatically in UseCaseConfig.
 */
public class GetDashboardAggregatesService implements GetDashboardAggregatesQuery {

    private final DashboardAggregationRepositoryPort repositoryPort;

    public GetDashboardAggregatesService(DashboardAggregationRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public DashboardAggregates getAggregates(DashboardFilter filter, TimeSeriesGranularity granularity) {
        DashboardFilter effectiveFilter = filter != null ? filter : DashboardFilter.empty();
        TimeSeriesGranularity effectiveGranularity =
                granularity != null ? granularity : TimeSeriesGranularity.DAY;

        return new DashboardAggregates(
                repositoryPort.countTotal(effectiveFilter),
                repositoryPort.countByDistrict(effectiveFilter),
                repositoryPort.countByGender(effectiveFilter),
                repositoryPort.countOverTime(effectiveFilter, effectiveGranularity),
                repositoryPort.countByFormType(effectiveFilter),
                repositoryPort.countByFinancialYearPeriod(effectiveFilter)
        );
    }
}
