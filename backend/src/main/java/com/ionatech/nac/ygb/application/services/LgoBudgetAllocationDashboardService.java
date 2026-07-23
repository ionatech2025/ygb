package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationChartDataQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationDashboardSummaryQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationReadRepositoryPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.UUID;

public class LgoBudgetAllocationDashboardService implements
        GetLgoBudgetAllocationDashboardSummaryQuery,
        GetLgoBudgetAllocationChartDataQuery,
        GetLgoBudgetAllocationFilterOptionsQuery {

    private static final int TOP_SECTORS_LIMIT = 10;

    private final LgoBudgetAllocationReadRepositoryPort readPort;
    private final DashboardFilterOptionsRepositoryPort locationOptionsPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final AnonymisationProjector anonymisationProjector;

    public LgoBudgetAllocationDashboardService(
            LgoBudgetAllocationReadRepositoryPort readPort,
            DashboardFilterOptionsRepositoryPort locationOptionsPort,
            DashboardFilterHierarchyValidator filterValidator,
            AnonymisationProjector anonymisationProjector
    ) {
        this.readPort = readPort;
        this.locationOptionsPort = locationOptionsPort;
        this.filterValidator = filterValidator;
        this.anonymisationProjector = anonymisationProjector;
    }

    @Override
    public LgoBudgetAllocationSummary getSummary(LgoBudgetAllocationDashboardFilter filter) {
        LgoBudgetAllocationDashboardFilter effectiveFilter = resolveFilter(filter);
        LgoBudgetAllocationSummary summary = new LgoBudgetAllocationSummary(
                readPort.countTotal(effectiveFilter),
                readPort.countByDistrict(effectiveFilter),
                readPort.countTopSectors(effectiveFilter, TOP_SECTORS_LIMIT)
        );
        return anonymisationProjector.assertAnonymisedLgoBudgetAllocationSummary(summary);
    }

    @Override
    public LgoBudgetAllocationChartSeries getChart(
            LgoBudgetAllocationDashboardFilter filter,
            LgoBudgetAllocationChartType chartType,
            TimeSeriesGranularity granularity
    ) {
        LgoBudgetAllocationDashboardFilter effectiveFilter = resolveFilter(filter);
        TimeSeriesGranularity effectiveGranularity =
                granularity != null ? granularity : TimeSeriesGranularity.DAY;

        List<BudgetPriorityChartDataPoint> data = switch (chartType) {
            case BY_DISTRICT -> readPort.countByDistrict(effectiveFilter).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(row.districtLabel(), null, row.count()))
                    .toList();
            case BY_SECTOR -> readPort.countBySector(effectiveFilter).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(row.sector(), null, row.count()))
                    .toList();
            case OVER_TIME -> readPort.countOverTime(effectiveFilter, effectiveGranularity).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(
                            row.bucketStart().toString(), row.bucketStart(), row.count()))
                    .toList();
        };

        LgoBudgetAllocationChartSeries series = new LgoBudgetAllocationChartSeries(chartType, data);
        return anonymisationProjector.assertAnonymisedLgoBudgetAllocationChartSeries(series);
    }

    @Override
    public LgoBudgetAllocationFilterOptions getOptions(UUID districtId, UUID subcountyId) {
        List<FilterLocationOption> subcounties = districtId == null
                ? List.of()
                : locationOptionsPort.findSubcountiesByDistrict(districtId);
        List<FilterLocationOption> parishes = subcountyId == null
                ? List.of()
                : locationOptionsPort.findParishesBySubcounty(subcountyId);

        return new LgoBudgetAllocationFilterOptions(
                readPort.findDistinctDistricts(),
                subcounties,
                parishes,
                readPort.findDistinctGenders(),
                readPort.findDistinctAgeGroups(),
                readPort.findDistinctFinancialYearPeriods()
        );
    }

    private LgoBudgetAllocationDashboardFilter resolveFilter(LgoBudgetAllocationDashboardFilter filter) {
        LgoBudgetAllocationDashboardFilter effectiveFilter =
                filter != null ? filter : LgoBudgetAllocationDashboardFilter.empty();
        filterValidator.validate(
                LgoBudgetAllocationDashboardFilterMapper.toLocationHierarchyFilter(effectiveFilter));
        return effectiveFilter;
    }
}
