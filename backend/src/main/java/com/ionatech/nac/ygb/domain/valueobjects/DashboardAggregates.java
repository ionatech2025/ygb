package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record DashboardAggregates(
        long totalSubmissions,
        List<DistrictCount> byDistrict,
        List<GenderCount> byGender,
        List<TimeSeriesPoint> overTime,
        List<FormTypeCount> byFormType,
        List<FinancialYearPeriodCount> byFinancialYearPeriod
) {
    public DashboardAggregates {
        if (totalSubmissions < 0) {
            throw new IllegalArgumentException("DashboardAggregates totalSubmissions must not be negative.");
        }
        byDistrict = List.copyOf(byDistrict);
        byGender = List.copyOf(byGender);
        overTime = List.copyOf(overTime);
        byFormType = List.copyOf(byFormType);
        byFinancialYearPeriod = List.copyOf(byFinancialYearPeriod);
    }
}
