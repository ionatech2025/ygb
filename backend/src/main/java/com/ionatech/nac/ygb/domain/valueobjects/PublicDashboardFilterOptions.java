package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

/** Filter dropdown options for the public dashboard — never includes collector fields. */
public record PublicDashboardFilterOptions(
        List<FilterLocationOption> districts,
        List<FilterLocationOption> subcounties,
        List<FilterLocationOption> parishes,
        List<String> formTypes,
        List<String> genders,
        List<String> ageGroups,
        List<String> financialYearPeriods
) {
    public PublicDashboardFilterOptions {
        districts = List.copyOf(districts);
        subcounties = List.copyOf(subcounties);
        parishes = List.copyOf(parishes);
        formTypes = List.copyOf(formTypes);
        genders = List.copyOf(genders);
        ageGroups = List.copyOf(ageGroups);
        financialYearPeriods = List.copyOf(financialYearPeriods);
    }
}
