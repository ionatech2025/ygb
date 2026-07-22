package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record DashboardFilterOptions(
        List<FilterLocationOption> districts,
        List<FilterLocationOption> subcounties,
        List<FilterLocationOption> parishes,
        List<String> formTypes,
        List<String> genders,
        List<String> ageGroups,
        List<FilterCollectorOption> collectors,
        List<String> financialYearPeriods
) {
    public DashboardFilterOptions {
        districts = List.copyOf(districts);
        subcounties = List.copyOf(subcounties);
        parishes = List.copyOf(parishes);
        formTypes = List.copyOf(formTypes);
        genders = List.copyOf(genders);
        ageGroups = List.copyOf(ageGroups);
        collectors = List.copyOf(collectors);
        financialYearPeriods = List.copyOf(financialYearPeriods);
    }
}
