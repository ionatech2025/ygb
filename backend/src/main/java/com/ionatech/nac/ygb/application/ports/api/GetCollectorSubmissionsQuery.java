package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;

import java.util.UUID;

public interface GetCollectorSubmissionsQuery {
    SubmissionPage getSubmissions(UUID collectorId, DashboardFilter filter, PageRequest pageRequest);
}
