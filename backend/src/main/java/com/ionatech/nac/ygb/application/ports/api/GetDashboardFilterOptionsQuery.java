package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilterOptions;

import java.util.UUID;

public interface GetDashboardFilterOptionsQuery {
    DashboardFilterOptions getOptions(UUID districtId, UUID subcountyId);
}
