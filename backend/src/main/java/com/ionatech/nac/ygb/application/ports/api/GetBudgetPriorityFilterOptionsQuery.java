package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityFilterOptions;

import java.util.UUID;

public interface GetBudgetPriorityFilterOptionsQuery {
    BudgetPriorityFilterOptions getOptions(UUID districtId, UUID subcountyId);
}
