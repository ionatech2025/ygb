package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ListSubmissionsServiceTest {

    private SubmissionRepositoryPort submissionRepositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private ListSubmissionsService service;

    @BeforeEach
    void setUp() {
        submissionRepositoryPort = mock(SubmissionRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        service = new ListSubmissionsService(submissionRepositoryPort, filterValidator);
    }

    @Test
    void shouldDelegateListQueryWithFilterAndPageRequest() {
        UUID districtId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, null, null
        );
        PageRequest pageRequest = PageRequest.of(1, 10);
        SubmissionPage expectedPage = new SubmissionPage(
                List.of(sampleSummary()),
                1L,
                1,
                10
        );

        when(submissionRepositoryPort.findSummariesByFilter(filter, pageRequest)).thenReturn(expectedPage);

        SubmissionPage result = service.list(filter, pageRequest);

        assertThat(result).isEqualTo(expectedPage);
        verify(filterValidator).validate(filter);
        verify(submissionRepositoryPort).findSummariesByFilter(filter, pageRequest);
    }

    @Test
    void shouldDefaultFilterAndPaginationWhenNull() {
        SubmissionPage emptyPage = new SubmissionPage(List.of(), 0L, 0, 25);

        when(submissionRepositoryPort.findSummariesByFilter(DashboardFilter.empty(), PageRequest.of(0, 0)))
                .thenReturn(emptyPage);

        SubmissionPage result = service.list(null, null);

        assertThat(result.totalElements()).isZero();
        verify(filterValidator).validate(DashboardFilter.empty());
        verify(submissionRepositoryPort).findSummariesByFilter(DashboardFilter.empty(), PageRequest.of(0, 0));
    }

    private SubmissionSummary sampleSummary() {
        return new SubmissionSummary(
                UUID.randomUUID(),
                FormType.BYP,
                "Jane Doe",
                UUID.randomUUID(),
                "Arua",
                UUID.randomUUID(),
                "Default Collector",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                LocalDateTime.of(2026, 3, 15, 10, 5),
                "SYNCED",
                "JAN_JUN_2026"
        );
    }
}
