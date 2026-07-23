package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPrioritySummary;

public interface GetBudgetPrioritySummaryQuery {
    BudgetPrioritySummary getSummary(BudgetPriorityDashboardFilter filter);
}
