package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;

import java.util.Map;

public record SubmitBudgetPriorityCommand(
        BudgetPrioritySection section,
        Map<String, Object> demographics,
        Map<String, Object> priorityAreas
) {
}
