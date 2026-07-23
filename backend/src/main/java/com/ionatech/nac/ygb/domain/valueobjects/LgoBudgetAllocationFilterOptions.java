package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record LgoBudgetAllocationFilterOptions(
        List<FilterLocationOption> districts,
        List<FilterLocationOption> subcounties,
        List<FilterLocationOption> parishes,
        List<String> genders,
        List<String> ageGroups,
        List<String> financialYearPeriods
) {
    public LgoBudgetAllocationFilterOptions {
        districts = List.copyOf(districts);
        subcounties = List.copyOf(subcounties);
        parishes = List.copyOf(parishes);
        genders = List.copyOf(genders);
        ageGroups = List.copyOf(ageGroups);
        financialYearPeriods = List.copyOf(financialYearPeriods);
    }
}
