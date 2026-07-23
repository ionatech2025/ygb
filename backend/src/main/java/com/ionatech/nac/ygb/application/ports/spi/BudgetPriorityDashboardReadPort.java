package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;

public interface BudgetPriorityDashboardReadPort {
    long countTotal(BudgetPriorityDashboardFilter filter);

    List<BudgetPrioritySectionCount> countBySection(BudgetPriorityDashboardFilter filter);

    List<BudgetPriorityAreaCount> countTopPriorityAreas(BudgetPriorityDashboardFilter filter, int limit);

    List<BudgetPriorityAreaCount> countByPriorityArea(BudgetPriorityDashboardFilter filter);

    List<TimeSeriesPoint> countOverTime(BudgetPriorityDashboardFilter filter, TimeSeriesGranularity granularity);

    List<FilterLocationOption> findDistinctDistricts();

    List<String> findDistinctGenders();

    List<String> findDistinctAgeGroups();

    List<String> findDistinctFinancialYearPeriods();
}
