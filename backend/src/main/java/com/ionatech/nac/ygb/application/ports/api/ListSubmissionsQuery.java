package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;

public interface ListSubmissionsQuery {
    SubmissionPage list(DashboardFilter filter, PageRequest pageRequest);
}
