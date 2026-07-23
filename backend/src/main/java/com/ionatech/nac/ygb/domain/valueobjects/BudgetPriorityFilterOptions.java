package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

/** Filter dropdown options for the budget-priority public dashboard — no PII. */
public record BudgetPriorityFilterOptions(
        List<String> sections,
        List<FilterLocationOption> districts,
        List<FilterLocationOption> subcounties,
        List<FilterLocationOption> parishes,
        List<String> genders,
        List<String> ageGroups,
        List<String> financialYearPeriods
) {
    public BudgetPriorityFilterOptions {
        sections = List.copyOf(sections);
        districts = List.copyOf(districts);
        subcounties = List.copyOf(subcounties);
        parishes = List.copyOf(parishes);
        genders = List.copyOf(genders);
        ageGroups = List.copyOf(ageGroups);
        financialYearPeriods = List.copyOf(financialYearPeriods);
    }
}
