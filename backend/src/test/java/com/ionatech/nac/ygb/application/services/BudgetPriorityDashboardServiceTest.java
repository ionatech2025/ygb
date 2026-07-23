package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BudgetPriorityDashboardServiceTest {

    private BudgetPriorityDashboardReadPort readPort;
    private DashboardFilterOptionsRepositoryPort locationOptionsPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private BudgetPriorityDashboardService service;

    @BeforeEach
    void setUp() {
        readPort = mock(BudgetPriorityDashboardReadPort.class);
        locationOptionsPort = mock(DashboardFilterOptionsRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new BudgetPriorityDashboardService(
                readPort,
                locationOptionsPort,
                filterValidator,
                new AnonymisationProjector()
        );
    }

    @Test
    void shouldAssembleSummaryFromFilter() {
        BudgetPriorityDashboardFilter filter = new BudgetPriorityDashboardFilter(
                BudgetPrioritySection.HEALTH,
                null, null, null, null, null, "FEMALE", null, null
        );

        when(readPort.countTotal(filter)).thenReturn(3L);
        when(readPort.countBySection(filter)).thenReturn(List.of(new BudgetPrioritySectionCount("health", 3L)));
        when(readPort.countTopPriorityAreas(filter, 10))
                .thenReturn(List.of(new BudgetPriorityAreaCount("PRIMARY_HEALTH_CARE", 3L)));

        BudgetPrioritySummary summary = service.getSummary(filter);

        assertThat(summary.totalSubmissions()).isEqualTo(3L);
        assertThat(summary.bySection()).containsExactly(new BudgetPrioritySectionCount("health", 3L));
        verify(filterValidator).validate(BudgetPriorityDashboardFilterMapper.toLocationHierarchyFilter(filter));
    }

    @Test
    void shouldMapChartTypesToAggregationQueries() {
        BudgetPriorityDashboardFilter filter = BudgetPriorityDashboardFilter.empty();

        when(readPort.countByPriorityArea(filter))
                .thenReturn(List.of(new BudgetPriorityAreaCount("PRIMARY_HEALTH_CARE", 2L)));
        when(readPort.countBySection(filter))
                .thenReturn(List.of(new BudgetPrioritySectionCount("health", 2L)));
        when(readPort.countOverTime(filter, TimeSeriesGranularity.DAY))
                .thenReturn(List.of(new TimeSeriesPoint(LocalDate.of(2026, 3, 15), 2L)));

        BudgetPriorityChartSeries byArea = service.getChart(
                filter, BudgetPriorityChartType.BY_PRIORITY_AREA, null);
        BudgetPriorityChartSeries bySector = service.getChart(
                filter, BudgetPriorityChartType.BY_SECTOR, null);
        BudgetPriorityChartSeries overTime = service.getChart(
                filter, BudgetPriorityChartType.OVER_TIME, TimeSeriesGranularity.DAY);

        assertThat(byArea.chartType()).isEqualTo(BudgetPriorityChartType.BY_PRIORITY_AREA);
        assertThat(byArea.data().getFirst().label()).isEqualTo("PRIMARY_HEALTH_CARE");
        assertThat(bySector.data().getFirst().label()).isEqualTo("health");
        assertThat(overTime.data().getFirst().date()).isEqualTo(LocalDate.of(2026, 3, 15));
        verify(filterValidator, times(3)).validate(any());
    }

    @Test
    void shouldReturnFilterOptionsWithoutPii() {
        UUID districtId = UUID.randomUUID();
        when(readPort.findDistinctDistricts())
                .thenReturn(List.of(new FilterLocationOption(districtId, "Kampala")));
        when(locationOptionsPort.findSubcountiesByDistrict(districtId))
                .thenReturn(List.of(new FilterLocationOption(UUID.randomUUID(), "Central")));
        when(readPort.findDistinctGenders()).thenReturn(List.of("FEMALE"));
        when(readPort.findDistinctAgeGroups()).thenReturn(List.of("AGE_20_24"));
        when(readPort.findDistinctFinancialYearPeriods()).thenReturn(List.of("JAN_JUN_2026"));

        BudgetPriorityFilterOptions options = service.getOptions(districtId, null);

        assertThat(options.sections()).containsExactly("health", "agriculture", "education", "climate");
        assertThat(options.districts()).containsExactly(new FilterLocationOption(districtId, "Kampala"));
        assertThat(options.subcounties()).hasSize(1);
        assertThat(options.genders()).containsExactly("FEMALE");
    }
}
