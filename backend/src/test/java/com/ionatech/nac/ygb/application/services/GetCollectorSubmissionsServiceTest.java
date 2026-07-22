package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ListSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GetCollectorSubmissionsServiceTest {

    private UserRepositoryPort userRepositoryPort;
    private ListSubmissionsQuery listSubmissionsQuery;
    private GetCollectorSubmissionsService service;

    @BeforeEach
    void setUp() {
        userRepositoryPort = mock(UserRepositoryPort.class);
        listSubmissionsQuery = mock(ListSubmissionsQuery.class);
        service = new GetCollectorSubmissionsService(userRepositoryPort, listSubmissionsQuery);
    }

    @Test
    void shouldScopeListQueryToCollectorId() {
        UUID collectorId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                null, null, null, FormType.BYP, null, null, null, null, null, null
        );
        DashboardFilter expectedFilter = new DashboardFilter(
                null, null, null, FormType.BYP, null, null, null, null, collectorId, null
        );
        SubmissionPage expectedPage = new SubmissionPage(List.of(), 0L, 0, 25);

        when(userRepositoryPort.findById(collectorId)).thenReturn(Optional.of(collector(collectorId)));
        when(listSubmissionsQuery.list(expectedFilter, PageRequest.of(0, 25))).thenReturn(expectedPage);

        SubmissionPage result = service.getSubmissions(collectorId, filter, PageRequest.of(0, 25));

        assertThat(result).isEqualTo(expectedPage);
        verify(listSubmissionsQuery).list(eq(expectedFilter), eq(PageRequest.of(0, 25)));
    }

    @Test
    void shouldRejectNonCollectorProfileLookup() {
        UUID adminId = UUID.randomUUID();
        when(userRepositoryPort.findById(adminId)).thenReturn(Optional.of(new User(
                adminId,
                "Admin",
                "0770000000",
                "hash",
                Role.ADMIN,
                true,
                LocalDateTime.now()
        )));

        assertThatThrownBy(() -> service.getSubmissions(adminId, DashboardFilter.empty(), PageRequest.of(0, 25)))
                .isInstanceOf(InvalidUserOperationException.class);
    }

    private User collector(UUID id) {
        return new User(id, "Jane Doe", "0771111111", "hash", Role.DATA_COLLECTOR, true, LocalDateTime.now());
    }
}
