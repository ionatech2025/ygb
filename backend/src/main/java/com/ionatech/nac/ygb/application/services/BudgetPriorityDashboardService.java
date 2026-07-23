package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityChartsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPrioritySummaryQuery;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class BudgetPriorityDashboardService implements
        GetBudgetPrioritySummaryQuery,
        GetBudgetPriorityChartsQuery,
        GetBudgetPriorityFilterOptionsQuery {

    private static final int TOP_PRIORITY_AREAS_LIMIT = 10;

    private final BudgetPriorityDashboardReadPort readPort;
    private final DashboardFilterOptionsRepositoryPort locationOptionsPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final AnonymisationProjector anonymisationProjector;

    public BudgetPriorityDashboardService(
            BudgetPriorityDashboardReadPort readPort,
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
    public BudgetPrioritySummary getSummary(BudgetPriorityDashboardFilter filter) {
        BudgetPriorityDashboardFilter effectiveFilter = resolveFilter(filter);
        BudgetPrioritySummary summary = new BudgetPrioritySummary(
                readPort.countTotal(effectiveFilter),
                readPort.countBySection(effectiveFilter),
                readPort.countTopPriorityAreas(effectiveFilter, TOP_PRIORITY_AREAS_LIMIT)
        );
        return anonymisationProjector.assertAnonymisedBudgetPrioritySummary(summary);
    }

    @Override
    public BudgetPriorityChartSeries getChart(
            BudgetPriorityDashboardFilter filter,
            BudgetPriorityChartType chartType,
            TimeSeriesGranularity granularity
    ) {
        BudgetPriorityDashboardFilter effectiveFilter = resolveFilter(filter);
        TimeSeriesGranularity effectiveGranularity =
                granularity != null ? granularity : TimeSeriesGranularity.DAY;

        List<BudgetPriorityChartDataPoint> data = switch (chartType) {
            case BY_PRIORITY_AREA -> readPort.countByPriorityArea(effectiveFilter).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(row.priorityArea(), null, row.count()))
                    .toList();
            case BY_SECTOR -> readPort.countBySection(effectiveFilter).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(row.section(), null, row.count()))
                    .toList();
            case OVER_TIME -> readPort.countOverTime(effectiveFilter, effectiveGranularity).stream()
                    .map(row -> new BudgetPriorityChartDataPoint(
                            row.bucketStart().toString(), row.bucketStart(), row.count()))
                    .toList();
        };

        BudgetPriorityChartSeries series = new BudgetPriorityChartSeries(chartType, data);
        return anonymisationProjector.assertAnonymisedBudgetPriorityChartSeries(series);
    }

    @Override
    public BudgetPriorityFilterOptions getOptions(UUID districtId, UUID subcountyId) {
        List<FilterLocationOption> subcounties = districtId == null
                ? List.of()
                : locationOptionsPort.findSubcountiesByDistrict(districtId);
        List<FilterLocationOption> parishes = subcountyId == null
                ? List.of()
                : locationOptionsPort.findParishesBySubcounty(subcountyId);

        List<String> sections = Arrays.stream(BudgetPrioritySection.values())
                .map(BudgetPrioritySection::toApiSegment)
                .toList();

        return new BudgetPriorityFilterOptions(
                sections,
                readPort.findDistinctDistricts(),
                subcounties,
                parishes,
                readPort.findDistinctGenders(),
                readPort.findDistinctAgeGroups(),
                readPort.findDistinctFinancialYearPeriods()
        );
    }

    private BudgetPriorityDashboardFilter resolveFilter(BudgetPriorityDashboardFilter filter) {
        BudgetPriorityDashboardFilter effectiveFilter =
                filter != null ? filter : BudgetPriorityDashboardFilter.empty();
        filterValidator.validate(BudgetPriorityDashboardFilterMapper.toLocationHierarchyFilter(effectiveFilter));
        return effectiveFilter;
    }
}
