package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationFilterOptions;

import java.util.UUID;

public interface GetLgoBudgetAllocationFilterOptionsQuery {

    LgoBudgetAllocationFilterOptions getOptions(UUID districtId, UUID subcountyId);
}
