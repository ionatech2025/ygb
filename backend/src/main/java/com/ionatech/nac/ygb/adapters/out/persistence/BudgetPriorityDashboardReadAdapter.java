package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BudgetPriorityDashboardReadAdapter implements BudgetPriorityDashboardReadPort {

    private final BudgetPriorityDashboardJpaRepository jpaRepository;

    public BudgetPriorityDashboardReadAdapter(BudgetPriorityDashboardJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public long countTotal(BudgetPriorityDashboardFilter filter) {
        return jpaRepository.countTotal(filter);
    }

    @Override
    public List<BudgetPrioritySectionCount> countBySection(BudgetPriorityDashboardFilter filter) {
        return jpaRepository.countBySection(filter);
    }

    @Override
    public List<BudgetPriorityAreaCount> countTopPriorityAreas(BudgetPriorityDashboardFilter filter, int limit) {
        return jpaRepository.countTopPriorityAreas(filter, limit);
    }

    @Override
    public List<BudgetPriorityAreaCount> countByPriorityArea(BudgetPriorityDashboardFilter filter) {
        return jpaRepository.countByPriorityArea(filter);
    }

    @Override
    public List<TimeSeriesPoint> countOverTime(
            BudgetPriorityDashboardFilter filter,
            TimeSeriesGranularity granularity
    ) {
        return jpaRepository.countOverTime(filter, granularity);
    }

    @Override
    public List<FilterLocationOption> findDistinctDistricts() {
        return jpaRepository.findDistinctDistricts();
    }

    @Override
    public List<String> findDistinctGenders() {
        return jpaRepository.findDistinctGenders();
    }

    @Override
    public List<String> findDistinctAgeGroups() {
        return jpaRepository.findDistinctAgeGroups();
    }

    @Override
    public List<String> findDistinctFinancialYearPeriods() {
        return jpaRepository.findDistinctFinancialYearPeriods();
    }

    @Override
    public BudgetPriorityAnonymisedRecordPage findExportRecordsByFilter(
            BudgetPriorityDashboardFilter filter,
            PageRequest pageRequest
    ) {
        return jpaRepository.findExportRecords(filter, pageRequest);
    }
}
