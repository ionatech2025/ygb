package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PublicDashboardServiceTest {

    private DashboardAggregationRepositoryPort repositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private PublicDashboardService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(DashboardAggregationRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new PublicDashboardService(repositoryPort, filterValidator, new AnonymisationProjector());
    }

    @Test
    void shouldAssembleSummaryFromPublicFilter() {
        PublicDashboardFilter publicFilter = new PublicDashboardFilter(
                null, null, null, FormType.BYP, null, null, "FEMALE", null, null, null
        );
        DashboardFilter dashboardFilter = PublicDashboardFilterMapper.toDashboardFilter(publicFilter);

        when(repositoryPort.countTotal(dashboardFilter)).thenReturn(3L);
        when(repositoryPort.countByFormType(dashboardFilter)).thenReturn(List.of(new FormTypeCount(FormType.BYP, 3L)));
        when(repositoryPort.countByGender(dashboardFilter)).thenReturn(List.of(new GenderCount("FEMALE", 3L)));
        when(repositoryPort.countByFinancialYearPeriod(dashboardFilter))
                .thenReturn(List.of(new FinancialYearPeriodCount("JAN_JUN_2026", 3L)));

        PublicDashboardSummary summary = service.getSummary(publicFilter);

        assertThat(summary.totalSubmissions()).isEqualTo(3L);
        assertThat(summary.byFormType()).containsExactly(new FormTypeCount(FormType.BYP, 3L));
        assertThat(summary.byGender()).containsExactly(new GenderCount("FEMALE", 3L));
        verify(filterValidator).validate(dashboardFilter);
    }

    @Test
    void shouldMapChartTypesToAggregationQueries() {
        PublicDashboardFilter publicFilter = PublicDashboardFilter.empty();
        DashboardFilter dashboardFilter = DashboardFilter.empty();
        UUID districtId = UUID.randomUUID();

        when(repositoryPort.countByDistrict(dashboardFilter))
                .thenReturn(List.of(new DistrictCount("Kampala", districtId, 2L)));
        when(repositoryPort.countByGender(dashboardFilter))
                .thenReturn(List.of(new GenderCount("FEMALE", 2L)));
        when(repositoryPort.countByAgeGroup(dashboardFilter))
                .thenReturn(List.of(new AgeGroupCount("AGE_20_24", 2L)));
        when(repositoryPort.countOverTime(dashboardFilter, TimeSeriesGranularity.DAY))
                .thenReturn(List.of(new TimeSeriesPoint(LocalDate.of(2026, 3, 1), 2L)));

        PublicChartSeries byDistrict = service.getChart(publicFilter, PublicChartType.BY_DISTRICT, null);
        PublicChartSeries byGender = service.getChart(publicFilter, PublicChartType.BY_GENDER, null);
        PublicChartSeries byAgeGroup = service.getChart(publicFilter, PublicChartType.BY_AGE_GROUP, null);
        PublicChartSeries trend = service.getChart(publicFilter, PublicChartType.TREND, TimeSeriesGranularity.DAY);

        assertThat(byDistrict.chartType()).isEqualTo(PublicChartType.BY_DISTRICT);
        assertThat(byDistrict.data()).hasSize(1);
        assertThat(byDistrict.data().getFirst().locationId()).isEqualTo(districtId);
        assertThat(byGender.data().getFirst().label()).isEqualTo("FEMALE");
        assertThat(byAgeGroup.data().getFirst().label()).isEqualTo("AGE_20_24");
        assertThat(trend.data().getFirst().date()).isEqualTo(LocalDate.of(2026, 3, 1));
        verify(filterValidator, times(4)).validate(dashboardFilter);
    }

    @Test
    void shouldReturnHeatmapEntriesWithoutCollectorDimension() {
        PublicDashboardFilter publicFilter = PublicDashboardFilter.empty();
        DashboardFilter dashboardFilter = DashboardFilter.empty();
        UUID districtId = UUID.randomUUID();

        when(repositoryPort.countHeatmap(dashboardFilter))
                .thenReturn(List.of(new HeatmapEntry(districtId, null, "Kampala", 4L)));

        PublicHeatmap heatmap = service.getHeatmap(publicFilter);

        assertThat(heatmap.entries()).containsExactly(new HeatmapEntry(districtId, null, "Kampala", 4L));
        verify(filterValidator).validate(any(DashboardFilter.class));
    }
}
