package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ListSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;

public class ListSubmissionsService implements ListSubmissionsQuery {

    private final SubmissionRepositoryPort submissionRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;

    public ListSubmissionsService(
            SubmissionRepositoryPort submissionRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator
    ) {
        this.submissionRepositoryPort = submissionRepositoryPort;
        this.filterValidator = filterValidator;
    }

    @Override
    public SubmissionPage list(DashboardFilter filter, PageRequest pageRequest) {
        DashboardFilter effectiveFilter = filter != null ? filter : DashboardFilter.empty();
        filterValidator.validate(effectiveFilter);
        PageRequest effectivePageRequest = pageRequest != null ? pageRequest : PageRequest.of(0, 0);
        return submissionRepositoryPort.findSummariesByFilter(effectiveFilter, effectivePageRequest);
    }
}
