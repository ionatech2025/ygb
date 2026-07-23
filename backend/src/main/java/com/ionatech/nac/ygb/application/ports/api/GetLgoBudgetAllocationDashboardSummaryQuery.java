package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationSummary;

public interface GetLgoBudgetAllocationDashboardSummaryQuery {

    LgoBudgetAllocationSummary getSummary(LgoBudgetAllocationDashboardFilter filter);
}
