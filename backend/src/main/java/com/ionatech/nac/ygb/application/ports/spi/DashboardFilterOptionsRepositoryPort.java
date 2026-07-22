package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;

import java.util.List;
import java.util.UUID;

public interface DashboardFilterOptionsRepositoryPort {
    List<FilterLocationOption> findDistricts();

    List<FilterLocationOption> findSubcountiesByDistrict(UUID districtId);

    List<FilterLocationOption> findParishesBySubcounty(UUID subcountyId);

    List<String> findDistinctGenders();

    List<String> findDistinctAgeGroups();

    List<String> findDistinctFinancialYearPeriods();
}
