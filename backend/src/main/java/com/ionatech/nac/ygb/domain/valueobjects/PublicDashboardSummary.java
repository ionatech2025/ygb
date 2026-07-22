package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record PublicDashboardSummary(
        long totalSubmissions,
        List<FormTypeCount> byFormType,
        List<GenderCount> byGender,
        List<FinancialYearPeriodCount> byFinancialYearPeriod
) {
    public PublicDashboardSummary {
        if (totalSubmissions < 0) {
            throw new IllegalArgumentException("PublicDashboardSummary totalSubmissions must not be negative.");
        }
        byFormType = List.copyOf(byFormType);
        byGender = List.copyOf(byGender);
        byFinancialYearPeriod = List.copyOf(byFinancialYearPeriod);
    }
}
