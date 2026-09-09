package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GetCollectorLeaderboardServiceTest {

    private CollectorTrackerRepositoryPort repositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private GetCollectorLeaderboardService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(CollectorTrackerRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new GetCollectorLeaderboardService(repositoryPort, filterValidator);
    }

    @Test
    void shouldStripCollectorFilterAndPassPageAndSort() {
        UUID districtId = UUID.randomUUID();
        UUID collectorId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                districtId, null, null, null, null, null, null, null, collectorId, null
        );
        PageRequest pageRequest = PageRequest.of(1, 10);
        LeaderboardSort sort = LeaderboardSort.of("fullName", "asc");
        CollectorLeaderboardPage page = new CollectorLeaderboardPage(
                List.of(new CollectorLeaderboardEntry(UUID.randomUUID(), "Ada", 3L)),
                12L,
                1,
                10
        );

        when(repositoryPort.findLeaderboard(
                eq(new DashboardFilter(districtId, null, null, null, null, null, null, null, null, null)),
                eq(pageRequest),
                eq(sort)
        )).thenReturn(page);

        CollectorLeaderboardPage result = service.getLeaderboard(filter, pageRequest, sort);

        assertThat(result.items()).hasSize(1);
        assertThat(result.totalElements()).isEqualTo(12L);
        verify(filterValidator).validate(
                new DashboardFilter(districtId, null, null, null, null, null, null, null, null, null)
        );
    }
}
