package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;

import java.util.UUID;

public class GetCollectorSubmissionsService implements GetCollectorSubmissionsQuery {
    private final UserRepositoryPort userRepositoryPort;
    private final ListSubmissionsQuery listSubmissionsQuery;

    public GetCollectorSubmissionsService(
            UserRepositoryPort userRepositoryPort,
            ListSubmissionsQuery listSubmissionsQuery
    ) {
        this.userRepositoryPort = userRepositoryPort;
        this.listSubmissionsQuery = listSubmissionsQuery;
    }

    @Override
    public SubmissionPage getSubmissions(UUID collectorId, DashboardFilter filter, PageRequest pageRequest) {
        var user = userRepositoryPort.findById(collectorId)
                .orElseThrow(() -> new UserNotFoundException(collectorId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Submissions are only available for data collector accounts.");
        }

        DashboardFilter scopedFilter = scopeToCollector(filter, collectorId);
        return listSubmissionsQuery.list(scopedFilter, pageRequest);
    }

    private DashboardFilter scopeToCollector(DashboardFilter filter, UUID collectorId) {
        DashboardFilter base = filter != null ? filter : DashboardFilter.empty();
        return new DashboardFilter(
                base.districtId(),
                base.subcountyId(),
                base.parishId(),
                base.formType(),
                base.dateFrom(),
                base.dateTo(),
                base.gender(),
                base.ageGroup(),
                collectorId,
                base.financialYearPeriod()
        );
    }
}
