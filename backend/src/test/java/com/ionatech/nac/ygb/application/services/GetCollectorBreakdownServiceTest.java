package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GetCollectorBreakdownServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private DashboardAggregationRepositoryPort aggregationRepositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private GetCollectorBreakdownService service;

    private final UUID collectorId = UUID.randomUUID();
    private final UUID districtId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        aggregationRepositoryPort = mock(DashboardAggregationRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new GetCollectorBreakdownService(
                userRepositoryPort,
                aggregationRepositoryPort,
                filterValidator
        );
    }

    @Test
    void shouldReturnFormTypeAndDistrictBreakdownForCollector() {
        User collector = new User(
                collectorId,
                "Collector One",
                "0771111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
        DashboardFilter requestFilter = new DashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, null, "JAN_JUN_2026"
        );
        DashboardFilter scopedFilter = new DashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, collectorId, "JAN_JUN_2026"
        );

        when(userRepositoryPort.findById(collectorId)).thenReturn(Optional.of(collector));
        when(aggregationRepositoryPort.countByFormType(scopedFilter))
                .thenReturn(List.of(new FormTypeCount(FormType.BYP, 2L)));
        when(aggregationRepositoryPort.countByDistrict(scopedFilter))
                .thenReturn(List.of(new DistrictCount("Arua", districtId, 2L)));

        CollectorBreakdown breakdown = service.getBreakdown(collectorId, requestFilter);

        verify(filterValidator).validate(scopedFilter);
        assertThat(breakdown.byFormType()).containsExactly(new FormTypeCount(FormType.BYP, 2L));
        assertThat(breakdown.byDistrict()).containsExactly(new DistrictCount("Arua", districtId, 2L));
    }

    @Test
    void shouldScopeEmptyFilterToCollector() {
        User collector = new User(
                collectorId,
                "Collector One",
                "0771111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );
        DashboardFilter scopedFilter = new DashboardFilter(
                null, null, null, null, null, null, null, null, collectorId, null
        );

        when(userRepositoryPort.findById(collectorId)).thenReturn(Optional.of(collector));
        when(aggregationRepositoryPort.countByFormType(any())).thenReturn(List.of());
        when(aggregationRepositoryPort.countByDistrict(any())).thenReturn(List.of());

        service.getBreakdown(collectorId, null);

        verify(filterValidator).validate(scopedFilter);
        verify(aggregationRepositoryPort).countByFormType(scopedFilter);
        verify(aggregationRepositoryPort).countByDistrict(scopedFilter);
    }
}
