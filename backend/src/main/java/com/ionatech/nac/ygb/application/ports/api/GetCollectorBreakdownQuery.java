package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.UUID;

public interface GetCollectorBreakdownQuery {
    CollectorBreakdown getBreakdown(UUID collectorId, DashboardFilter filter);
}
