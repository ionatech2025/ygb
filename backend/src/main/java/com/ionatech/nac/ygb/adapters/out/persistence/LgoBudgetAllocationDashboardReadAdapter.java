package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationReadRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LgoBudgetAllocationDashboardReadAdapter implements LgoBudgetAllocationReadRepositoryPort {

    private final LgoBudgetAllocationDashboardJpaRepository jpaRepository;

    public LgoBudgetAllocationDashboardReadAdapter(LgoBudgetAllocationDashboardJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public long countTotal(LgoBudgetAllocationDashboardFilter filter) {
        return jpaRepository.countTotal(filter);
    }

    @Override
    public List<LgoBudgetAllocationDistrictCount> countByDistrict(LgoBudgetAllocationDashboardFilter filter) {
        return jpaRepository.countByDistrict(filter);
    }

    @Override
    public List<LgoBudgetAllocationSectorCount> countTopSectors(LgoBudgetAllocationDashboardFilter filter, int limit) {
        return jpaRepository.countTopSectors(filter, limit);
    }

    @Override
    public List<LgoBudgetAllocationSectorCount> countBySector(LgoBudgetAllocationDashboardFilter filter) {
        return jpaRepository.countBySector(filter);
    }

    @Override
    public List<TimeSeriesPoint> countOverTime(
            LgoBudgetAllocationDashboardFilter filter,
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
}
