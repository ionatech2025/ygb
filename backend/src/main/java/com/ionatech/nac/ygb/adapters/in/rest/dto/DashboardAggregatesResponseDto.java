package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record DashboardAggregatesResponseDto(
        long totalSubmissions,
        List<DistrictCountDto> byDistrict,
        List<GenderCountDto> byGender,
        List<TimeSeriesPointDto> overTime,
        List<FormTypeCountDto> byFormType,
        List<FinancialYearPeriodCountDto> byFinancialYearPeriod
) {}
