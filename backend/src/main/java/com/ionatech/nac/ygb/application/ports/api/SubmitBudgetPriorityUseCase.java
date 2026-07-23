package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;

public interface SubmitBudgetPriorityUseCase {
    BudgetPrioritySubmission submit(SubmitBudgetPriorityCommand command);
}
