package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;

public interface LgoBudgetAllocationReadRepositoryPort {

    long countTotal(LgoBudgetAllocationDashboardFilter filter);

    List<LgoBudgetAllocationDistrictCount> countByDistrict(LgoBudgetAllocationDashboardFilter filter);

    List<LgoBudgetAllocationSectorCount> countTopSectors(LgoBudgetAllocationDashboardFilter filter, int limit);

    List<LgoBudgetAllocationSectorCount> countBySector(LgoBudgetAllocationDashboardFilter filter);

    List<TimeSeriesPoint> countOverTime(LgoBudgetAllocationDashboardFilter filter, TimeSeriesGranularity granularity);

    List<FilterLocationOption> findDistinctDistricts();

    List<String> findDistinctGenders();

    List<String> findDistinctAgeGroups();

    List<String> findDistinctFinancialYearPeriods();
}
