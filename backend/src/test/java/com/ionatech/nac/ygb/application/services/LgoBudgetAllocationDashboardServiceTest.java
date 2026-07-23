package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationReadRepositoryPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
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

class LgoBudgetAllocationDashboardServiceTest {

    private LgoBudgetAllocationReadRepositoryPort readPort;
    private DashboardFilterOptionsRepositoryPort locationOptionsPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private LgoBudgetAllocationDashboardService service;

    @BeforeEach
    void setUp() {
        readPort = mock(LgoBudgetAllocationReadRepositoryPort.class);
        locationOptionsPort = mock(DashboardFilterOptionsRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new LgoBudgetAllocationDashboardService(
                readPort,
                locationOptionsPort,
                filterValidator,
                new AnonymisationProjector()
        );
    }

    @Test
    void shouldAssembleSummaryFromReadPort() {
        UUID kampalaId = TestLocationFixtures.KAMPALA_DISTRICT_ID;
        LgoBudgetAllocationDashboardFilter filter = new LgoBudgetAllocationDashboardFilter(
                kampalaId, null, null, null, null, null, null, null
        );

        when(readPort.countTotal(filter)).thenReturn(2L);
        when(readPort.countByDistrict(filter)).thenReturn(List.of(
                new LgoBudgetAllocationDistrictCount(kampalaId, "Kampala", 2L)
        ));
        when(readPort.countTopSectors(filter, 10)).thenReturn(List.of(
                new LgoBudgetAllocationSectorCount("health", 2L)
        ));

        LgoBudgetAllocationSummary summary = service.getSummary(filter);

        assertThat(summary.totalSubmissions()).isEqualTo(2L);
        assertThat(summary.byDistrict()).hasSize(1);
        assertThat(summary.topSectors()).containsExactly(new LgoBudgetAllocationSectorCount("health", 2L));
        verify(filterValidator).validate(LgoBudgetAllocationDashboardFilterMapper.toLocationHierarchyFilter(filter));
    }

    @Test
    void shouldMapChartTypesToAggregationQueries() {
        LgoBudgetAllocationDashboardFilter filter = LgoBudgetAllocationDashboardFilter.empty();
        UUID kampalaId = TestLocationFixtures.KAMPALA_DISTRICT_ID;

        when(readPort.countByDistrict(filter)).thenReturn(List.of(
                new LgoBudgetAllocationDistrictCount(kampalaId, "Kampala", 2L)
        ));
        when(readPort.countBySector(filter)).thenReturn(List.of(
                new LgoBudgetAllocationSectorCount("health", 2L)
        ));
        when(readPort.countOverTime(filter, TimeSeriesGranularity.DAY))
                .thenReturn(List.of(new TimeSeriesPoint(LocalDate.of(2026, 3, 15), 2L)));

        LgoBudgetAllocationChartSeries byDistrict = service.getChart(
                filter, LgoBudgetAllocationChartType.BY_DISTRICT, null);
        LgoBudgetAllocationChartSeries bySector = service.getChart(
                filter, LgoBudgetAllocationChartType.BY_SECTOR, null);
        LgoBudgetAllocationChartSeries overTime = service.getChart(
                filter, LgoBudgetAllocationChartType.OVER_TIME, TimeSeriesGranularity.DAY);

        assertThat(byDistrict.chartType()).isEqualTo(LgoBudgetAllocationChartType.BY_DISTRICT);
        assertThat(byDistrict.data().getFirst().label()).isEqualTo("Kampala");
        assertThat(bySector.data().getFirst().label()).isEqualTo("health");
        assertThat(overTime.data().getFirst().date()).isEqualTo(LocalDate.of(2026, 3, 15));
        verify(filterValidator, times(3)).validate(any());
    }

    @Test
    void shouldReturnFilterOptionsWithoutPii() {
        UUID districtId = TestLocationFixtures.KAMPALA_DISTRICT_ID;
        when(readPort.findDistinctDistricts())
                .thenReturn(List.of(new FilterLocationOption(districtId, "Kampala")));
        when(locationOptionsPort.findSubcountiesByDistrict(districtId))
                .thenReturn(List.of(new FilterLocationOption(UUID.randomUUID(), "Central")));
        when(readPort.findDistinctGenders()).thenReturn(List.of("FEMALE"));
        when(readPort.findDistinctAgeGroups()).thenReturn(List.of("AGE_30_AND_ABOVE"));
        when(readPort.findDistinctFinancialYearPeriods()).thenReturn(List.of("JAN_JUN_2026"));

        LgoBudgetAllocationFilterOptions options = service.getOptions(districtId, null);

        assertThat(options.districts()).containsExactly(new FilterLocationOption(districtId, "Kampala"));
        assertThat(options.subcounties()).hasSize(1);
        assertThat(options.genders()).containsExactly("FEMALE");
    }
}
