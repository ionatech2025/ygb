package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetPublicDashboardFilterOptionsServiceTest {

    private DashboardFilterOptionsRepositoryPort optionsRepositoryPort;
    private GetPublicDashboardFilterOptionsService service;

    @BeforeEach
    void setUp() {
        optionsRepositoryPort = mock(DashboardFilterOptionsRepositoryPort.class);
        service = new GetPublicDashboardFilterOptionsService(optionsRepositoryPort);
    }

    @Test
    void shouldReturnFilterOptionsWithoutCollectorFields() {
        UUID districtId = UUID.randomUUID();
        when(optionsRepositoryPort.findDistricts()).thenReturn(List.of(new FilterLocationOption(districtId, "Kampala")));
        when(optionsRepositoryPort.findSubcountiesByDistrict(districtId))
                .thenReturn(List.of(new FilterLocationOption(UUID.randomUUID(), "Central")));
        when(optionsRepositoryPort.findDistinctGenders()).thenReturn(List.of("FEMALE", "MALE"));
        when(optionsRepositoryPort.findDistinctAgeGroups()).thenReturn(List.of("AGE_20_24"));
        when(optionsRepositoryPort.findDistinctFinancialYearPeriods()).thenReturn(List.of("JAN_JUN_2026"));

        PublicDashboardFilterOptions options = service.getOptions(districtId, null);

        assertThat(options.districts()).hasSize(1);
        assertThat(options.subcounties()).hasSize(1);
        assertThat(options.formTypes()).contains("BYP", "IYP", "LGO", "PC");
        assertThat(options.genders()).containsExactly("FEMALE", "MALE");
        assertThat(PublicDashboardFilterOptions.class.getRecordComponents())
                .noneMatch(component -> component.getName().equals("collectors"));
    }

    @Test
    void toDashboardFilterShouldNeverIncludeCollectorId() {
        assertThat(PublicDashboardFilterMapper.toDashboardFilter(PublicDashboardFilter.empty()).collectorId()).isNull();
    }
}
