package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GetDashboardAggregatesServiceTest {

    private DashboardAggregationRepositoryPort repositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private GetDashboardAggregatesService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(DashboardAggregationRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new GetDashboardAggregatesService(repositoryPort, filterValidator);
    }

    @Test
    void shouldAssembleAllAggregateDatasets() {
        DashboardFilter filter = new DashboardFilter(
                null, null, null, FormType.BYP, null, null, "FEMALE", null, null, null
        );
        UUID districtId = UUID.randomUUID();

        when(repositoryPort.countTotal(filter)).thenReturn(3L);
        when(repositoryPort.countByDistrict(filter)).thenReturn(List.of(new DistrictCount("Arua", districtId, 3L)));
        when(repositoryPort.countByGender(filter)).thenReturn(List.of(new GenderCount("FEMALE", 3L)));
        when(repositoryPort.countOverTime(filter, TimeSeriesGranularity.DAY))
                .thenReturn(List.of(new TimeSeriesPoint(LocalDate.of(2026, 3, 1), 3L)));
        when(repositoryPort.countByFormType(filter)).thenReturn(List.of(new FormTypeCount(FormType.BYP, 3L)));
        when(repositoryPort.countByFinancialYearPeriod(filter))
                .thenReturn(List.of(new FinancialYearPeriodCount("JAN_JUN_2026", 3L)));

        DashboardAggregates aggregates = service.getAggregates(filter, TimeSeriesGranularity.DAY);

        assertThat(aggregates.totalSubmissions()).isEqualTo(3L);
        verify(filterValidator).validate(filter);
        assertThat(aggregates.byDistrict()).hasSize(1);
        assertThat(aggregates.byGender()).containsExactly(new GenderCount("FEMALE", 3L));
        assertThat(aggregates.overTime()).hasSize(1);
        assertThat(aggregates.byFormType()).containsExactly(new FormTypeCount(FormType.BYP, 3L));
        assertThat(aggregates.byFinancialYearPeriod()).containsExactly(new FinancialYearPeriodCount("JAN_JUN_2026", 3L));

        verify(repositoryPort).countTotal(filter);
        verify(repositoryPort).countByDistrict(filter);
        verify(repositoryPort).countByGender(filter);
        verify(repositoryPort).countOverTime(filter, TimeSeriesGranularity.DAY);
        verify(repositoryPort).countByFormType(filter);
        verify(repositoryPort).countByFinancialYearPeriod(filter);
    }

    @Test
    void shouldDefaultToEmptyFilterAndDayGranularityWhenNull() {
        when(repositoryPort.countTotal(DashboardFilter.empty())).thenReturn(0L);
        when(repositoryPort.countByDistrict(DashboardFilter.empty())).thenReturn(List.of());
        when(repositoryPort.countByGender(DashboardFilter.empty())).thenReturn(List.of());
        when(repositoryPort.countOverTime(DashboardFilter.empty(), TimeSeriesGranularity.DAY)).thenReturn(List.of());
        when(repositoryPort.countByFormType(DashboardFilter.empty())).thenReturn(List.of());
        when(repositoryPort.countByFinancialYearPeriod(DashboardFilter.empty())).thenReturn(List.of());

        DashboardAggregates aggregates = service.getAggregates(null, null);

        assertThat(aggregates.totalSubmissions()).isZero();
    }
}
