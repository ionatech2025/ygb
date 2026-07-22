package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardSummary;

public interface GetPublicDashboardSummaryQuery {
    PublicDashboardSummary getSummary(PublicDashboardFilter filter);
}
