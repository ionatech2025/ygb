package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorBreakdownQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.UUID;

public class GetCollectorBreakdownService implements GetCollectorBreakdownQuery {

    private final UserRepositoryPort userRepositoryPort;
    private final DashboardAggregationRepositoryPort aggregationRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;

    public GetCollectorBreakdownService(
            UserRepositoryPort userRepositoryPort,
            DashboardAggregationRepositoryPort aggregationRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator
    ) {
        this.userRepositoryPort = userRepositoryPort;
        this.aggregationRepositoryPort = aggregationRepositoryPort;
        this.filterValidator = filterValidator;
    }

    @Override
    public CollectorBreakdown getBreakdown(UUID collectorId, DashboardFilter filter) {
        var user = userRepositoryPort.findById(collectorId)
                .orElseThrow(() -> new UserNotFoundException(collectorId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Breakdown is only available for data collector accounts.");
        }

        DashboardFilter scopedFilter = scopeToCollector(filter, collectorId);
        filterValidator.validate(scopedFilter);

        return new CollectorBreakdown(
                aggregationRepositoryPort.countByFormType(scopedFilter),
                aggregationRepositoryPort.countByDistrict(scopedFilter)
        );
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
