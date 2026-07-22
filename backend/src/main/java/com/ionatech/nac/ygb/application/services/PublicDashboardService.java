package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardChartQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardHeatmapQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardSummaryQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;

public class PublicDashboardService implements
        GetPublicDashboardSummaryQuery,
        GetPublicDashboardChartQuery,
        GetPublicDashboardHeatmapQuery {

    private final DashboardAggregationRepositoryPort repositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final AnonymisationProjector anonymisationProjector;

    public PublicDashboardService(
            DashboardAggregationRepositoryPort repositoryPort,
            DashboardFilterHierarchyValidator filterValidator,
            AnonymisationProjector anonymisationProjector
    ) {
        this.repositoryPort = repositoryPort;
        this.filterValidator = filterValidator;
        this.anonymisationProjector = anonymisationProjector;
    }

    @Override
    public PublicDashboardSummary getSummary(PublicDashboardFilter filter) {
        DashboardFilter dashboardFilter = resolveFilter(filter);
        PublicDashboardSummary summary = new PublicDashboardSummary(
                repositoryPort.countTotal(dashboardFilter),
                repositoryPort.countByFormType(dashboardFilter),
                repositoryPort.countByGender(dashboardFilter),
                repositoryPort.countByFinancialYearPeriod(dashboardFilter)
        );
        return anonymisationProjector.assertAnonymisedSummary(summary);
    }

    @Override
    public PublicChartSeries getChart(
            PublicDashboardFilter filter,
            PublicChartType chartType,
            TimeSeriesGranularity granularity
    ) {
        DashboardFilter dashboardFilter = resolveFilter(filter);
        TimeSeriesGranularity effectiveGranularity =
                granularity != null ? granularity : TimeSeriesGranularity.DAY;

        List<PublicChartDataPoint> data = switch (chartType) {
            case BY_DISTRICT -> repositoryPort.countByDistrict(dashboardFilter).stream()
                    .map(row -> new PublicChartDataPoint(row.districtName(), row.districtId(), null, row.count()))
                    .toList();
            case BY_GENDER -> repositoryPort.countByGender(dashboardFilter).stream()
                    .map(row -> new PublicChartDataPoint(row.gender(), null, null, row.count()))
                    .toList();
            case BY_AGE_GROUP -> repositoryPort.countByAgeGroup(dashboardFilter).stream()
                    .map(row -> new PublicChartDataPoint(row.ageGroup(), null, null, row.count()))
                    .toList();
            case TREND -> repositoryPort.countOverTime(dashboardFilter, effectiveGranularity).stream()
                    .map(row -> new PublicChartDataPoint(
                            row.bucketStart().toString(), null, row.bucketStart(), row.count()))
                    .toList();
        };

        PublicChartSeries series = new PublicChartSeries(chartType, data);
        return anonymisationProjector.assertAnonymisedChartSeries(series);
    }

    @Override
    public PublicHeatmap getHeatmap(PublicDashboardFilter filter) {
        DashboardFilter dashboardFilter = resolveFilter(filter);
        PublicHeatmap heatmap = new PublicHeatmap(repositoryPort.countHeatmap(dashboardFilter));
        return anonymisationProjector.assertAnonymisedHeatmap(heatmap);
    }

    private DashboardFilter resolveFilter(PublicDashboardFilter filter) {
        PublicDashboardFilter effectiveFilter = filter != null ? filter : PublicDashboardFilter.empty();
        DashboardFilter dashboardFilter = PublicDashboardFilterMapper.toDashboardFilter(effectiveFilter);
        filterValidator.validate(dashboardFilter);
        return dashboardFilter;
    }
}
