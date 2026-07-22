package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;

import java.util.UUID;

public interface GetPublicDashboardFilterOptionsQuery {
    PublicDashboardFilterOptions getOptions(UUID districtId, UUID subcountyId);
}
