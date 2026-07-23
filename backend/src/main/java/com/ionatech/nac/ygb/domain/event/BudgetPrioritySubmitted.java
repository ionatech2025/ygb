package com.ionatech.nac.ygb.domain.event;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;

import java.util.UUID;

public record BudgetPrioritySubmitted(
        UUID bpId,
        BudgetPrioritySection section,
        String financialYearPeriod
) {
}
